from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from models.user import ProfileUpdateRequest, PasswordChangeRequest, MFAToggleRequest
from database import supabase_admin
from middleware.auth_middleware import get_current_user
import uuid

router = APIRouter()


@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get the authenticated user's profile."""
    try:
        result = supabase_admin.table("profiles").select("*").eq("id", current_user["user_id"]).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")


@router.put("/profile")
async def update_profile(data: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    """Update the authenticated user's profile."""
    try:
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        result = supabase_admin.table("profiles").update(update_data).eq("id", current_user["user_id"]).execute()
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


@router.post("/change-password")
async def change_password(data: PasswordChangeRequest, current_user: dict = Depends(get_current_user)):
    """Change the authenticated user's password."""
    try:
        # Verify current password by attempting sign-in
        profile = supabase_admin.table("profiles").select("email").eq("id", current_user["user_id"]).single().execute()
        email = profile.data["email"]

        verify = supabase_admin.auth.sign_in_with_password({"email": email, "password": data.current_password})
        if not verify.user:
            raise HTTPException(status_code=400, detail="Current password is incorrect")

        # Update password
        supabase_admin.auth.admin.update_user_by_id(
            current_user["user_id"],
            {"password": data.new_password}
        )
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to change password: {str(e)}")


@router.post("/toggle-mfa")
async def toggle_mfa(data: MFAToggleRequest, current_user: dict = Depends(get_current_user)):
    """Enable or disable MFA for the authenticated user."""
    try:
        # Verify current password
        profile = supabase_admin.table("profiles").select("email, role").eq("id", current_user["user_id"]).single().execute()
        email = profile.data["email"]
        role = profile.data["role"]

        # Admins cannot disable MFA
        if role == "admin" and not data.enable:
            raise HTTPException(status_code=403, detail="Admin accounts must have MFA enabled")

        verify = supabase_admin.auth.sign_in_with_password({"email": email, "password": data.current_password})
        if not verify.user:
            raise HTTPException(status_code=400, detail="Password verification failed")

        supabase_admin.table("profiles").update({"mfa_enabled": data.enable}).eq("id", current_user["user_id"]).execute()

        action = "enabled" if data.enable else "disabled"
        return {"message": f"MFA {action} successfully", "mfa_enabled": data.enable}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle MFA: {str(e)}")


@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a profile avatar image."""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        file_path = f"{current_user['user_id']}/avatar.{file_ext}"
        file_content = await file.read()

        # Upload to Supabase Storage
        supabase_admin.storage.from_("avatars").upload(
            file_path,
            file_content,
            {"content-type": file.content_type, "upsert": "true"},
        )

        # Get public URL
        public_url = supabase_admin.storage.from_("avatars").get_public_url(file_path)

        # Update profile
        supabase_admin.table("profiles").update({"avatar_url": public_url}).eq("id", current_user["user_id"]).execute()

        return {"avatar_url": public_url, "message": "Avatar uploaded successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")

from fastapi import APIRouter, HTTPException, Request, Depends
from models.auth import (
    RegisterRequest, LoginRequest, OTPVerifyRequest,
    ForgotPasswordRequest, ResetPasswordRequest, TokenResponse, RefreshTokenRequest
)
from database import supabase_admin
from config import settings
from middleware.auth_middleware import get_current_user
from utils.auth_helpers import check_rate_limit, record_failed_attempt, clear_attempts, get_client_ip
from utils.email_helpers import send_otp_email, verify_otp
import httpx

router = APIRouter()

# Direct Supabase Auth REST API base URL
_AUTH_URL = f"{settings.supabase_url}/auth/v1"
_HEADERS = {
    "apikey": settings.supabase_key,
    "Content-Type": "application/json",
}


@router.post("/register")
async def register(data: RegisterRequest):
    """Register a new customer account."""
    try:
        # Create user in Supabase Auth
        response = supabase_admin.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": data.full_name,
                "phone": data.phone,
                "role": "customer",
            },
        })

        if not response.user:
            raise HTTPException(status_code=400, detail="Registration failed")

        # Update profile with phone if provided
        if data.phone:
            supabase_admin.table("profiles").update({"phone": data.phone}).eq("id", response.user.id).execute()

        return {
            "message": "Registration successful. Please check your email to verify your account.",
            "user_id": response.user.id,
        }
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower() or "already been registered" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Email address is already registered")
        raise HTTPException(status_code=400, detail=f"Registration failed: {error_msg}")


@router.post("/login")
async def login(data: LoginRequest, request: Request):
    """Login with email and password — stateless, no shared client session."""
    client_ip = get_client_ip(request)
    check_rate_limit(client_ip)

    try:
        # Use direct HTTP call to Supabase Auth REST API instead of shared client
        # This is completely stateless — no session stored on the server
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{_AUTH_URL}/token?grant_type=password",
                headers=_HEADERS,
                json={
                    "email": data.email,
                    "password": data.password,
                },
                timeout=15.0,
            )

        if resp.status_code != 200:
            record_failed_attempt(client_ip)
            # Extract Supabase's actual error message for debugging
            error_detail = "Invalid email or password"
            try:
                err_body = resp.json()
                if "error_description" in err_body:
                    error_detail = err_body["error_description"]
                elif "msg" in err_body:
                    error_detail = err_body["msg"]
            except Exception:
                pass
            raise HTTPException(status_code=401, detail=error_detail)

        auth_data = resp.json()
        user_id = auth_data.get("user", {}).get("id")
        access_token = auth_data.get("access_token")
        refresh_token = auth_data.get("refresh_token")

        if not user_id or not access_token:
            record_failed_attempt(client_ip)
            raise HTTPException(status_code=401, detail="Invalid email or password")

        clear_attempts(client_ip)

        # Fetch user profile for role
        profile_result = supabase_admin.table("profiles").select("*").eq("id", user_id).single().execute()
        profile = profile_result.data

        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        if not profile.get("is_active", True):
            raise HTTPException(status_code=403, detail="Account has been disabled")

        mfa_required = profile.get("mfa_enabled", False)

        if mfa_required:
            # Send OTP email and return mfa_required flag
            # Don't return the token yet — user must verify OTP first
            send_otp_email(data.email)
            return {
                "mfa_required": True,
                "email": data.email,
                "message": "OTP sent to your email. Please enter the 6-digit code to complete login.",
            }

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "mfa_required": False,
            "user": {
                "id": profile["id"],
                "email": profile["email"],
                "full_name": profile["full_name"],
                "role": profile["role"],
                "avatar_url": profile.get("avatar_url"),
                "mfa_enabled": profile.get("mfa_enabled", False),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        record_failed_attempt(client_ip)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")


@router.post("/verify-otp")
async def verify_otp_endpoint(data: OTPVerifyRequest):
    """Verify OTP for MFA login."""
    try:
        result = verify_otp(data.email, data.token, data.type)

        # Fetch profile
        profile_result = supabase_admin.table("profiles").select("*").eq("email", data.email).single().execute()
        profile = profile_result.data

        return {
            "access_token": result["access_token"],
            "refresh_token": result.get("refresh_token"),
            "token_type": "bearer",
            "mfa_required": False,
            "user": {
                "id": profile["id"],
                "email": profile["email"],
                "full_name": profile["full_name"],
                "role": profile["role"],
                "avatar_url": profile.get("avatar_url"),
                "mfa_enabled": profile.get("mfa_enabled", False),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OTP verification failed: {str(e)}")


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout — stateless, just return success.

    The frontend discards the token on its side. The token is a short-lived JWT
    that will expire on its own. No need to call supabase.auth.sign_out() on a
    shared server-side client (that was the bug causing login failures).
    """
    return {"message": "Logged out successfully"}


@router.post("/refresh")
async def refresh_token(data: RefreshTokenRequest):
    """Refresh access token using refresh token — stateless via direct HTTP."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{_AUTH_URL}/token?grant_type=refresh_token",
                headers=_HEADERS,
                json={
                    "refresh_token": data.refresh_token,
                },
                timeout=15.0,
            )

        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        auth_data = resp.json()
        return {
            "access_token": auth_data.get("access_token"),
            "refresh_token": auth_data.get("refresh_token"),
            "token_type": "bearer",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token refresh failed")


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    """Send password reset email."""
    try:
        supabase_admin.auth.reset_password_email(data.email)
        return {"message": "If an account exists with this email, a password reset link has been sent."}
    except Exception:
        # Always return success to prevent email enumeration
        return {"message": "If an account exists with this email, a password reset link has been sent."}


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    """Reset password using token from email."""
    try:
        response = supabase_admin.auth.admin.update_user_by_id(
            data.access_token,
            {"password": data.new_password}
        )
        return {"message": "Password reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Password reset failed")


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user profile."""
    try:
        result = supabase_admin.table("profiles").select("*").eq("id", current_user["user_id"]).single().execute()
        profile = result.data
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch profile")

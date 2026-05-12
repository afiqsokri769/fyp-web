from fastapi import APIRouter, HTTPException, Depends
from models.inquiry import InquiryCreate, InquiryResponse
from database import supabase_admin
from middleware.auth_middleware import get_current_user, get_optional_user
from typing import Optional

router = APIRouter()


@router.post("")
async def submit_inquiry(
    data: InquiryCreate,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Submit a new inquiry (public — no auth required)."""
    try:
        inquiry_data = {
            "sender_name": data.sender_name,
            "sender_email": data.sender_email,
            "sender_phone": data.sender_phone,
            "subject": data.subject,
            "message": data.message,
            "status": "pending",
        }

        # Link to customer profile if authenticated
        if current_user:
            inquiry_data["customer_id"] = current_user["user_id"]

        result = supabase_admin.table("inquiries").insert(inquiry_data).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit inquiry: {str(e)}")


@router.get("")
async def get_inquiries(current_user: dict = Depends(get_current_user)):
    """Get inquiries for the authenticated customer."""
    try:
        result = supabase_admin.table("inquiries").select("*").eq(
            "customer_id", current_user["user_id"]
        ).order("created_at", desc=True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch inquiries: {str(e)}")


@router.get("/{inquiry_id}")
async def get_inquiry(inquiry_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single inquiry by ID."""
    try:
        result = supabase_admin.table("inquiries").select("*").eq("id", inquiry_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Inquiry not found")

        inquiry = result.data
        # Customers can only see their own inquiries
        if current_user["role"] != "admin" and inquiry.get("customer_id") != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")

        return inquiry
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch inquiry: {str(e)}")

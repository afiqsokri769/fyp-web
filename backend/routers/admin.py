from fastapi import APIRouter, HTTPException, Depends, Query
from models.inquiry import InquiryReplyRequest, InquiryStatusUpdate
from models.booking import BookingStatusUpdate
from database import supabase_admin
from middleware.auth_middleware import require_admin
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()


@router.get("/stats")
async def get_admin_stats(current_user: dict = Depends(require_admin)):
    """Get dashboard statistics for admin."""
    try:
        # Total customers
        customers = supabase_admin.table("profiles").select("id", count="exact").eq("role", "customer").execute()
        total_customers = customers.count

        # Total bookings today
        today = datetime.now().date()
        bookings_today = supabase_admin.table("bookings").select("id", count="exact").eq("booking_date", str(today)).execute()

        # Pending bookings
        pending = supabase_admin.table("bookings").select("id", count="exact").eq("status", "pending").execute()

        # Open inquiries
        open_inquiries = supabase_admin.table("inquiries").select("id", count="exact").eq("status", "pending").execute()

        # Revenue this month (estimated from completed bookings)
        first_day = today.replace(day=1)
        completed = supabase_admin.table("bookings").select("total_estimated_price").eq("status", "completed").gte("created_at", str(first_day)).execute()
        revenue = sum(float(b.get("total_estimated_price", 0) or 0) for b in completed.data)

        return {
            "total_customers": total_customers,
            "bookings_today": bookings_today.count,
            "pending_bookings": pending.count,
            "open_inquiries": open_inquiries.count,
            "revenue_this_month": round(revenue, 2),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")


@router.get("/customers")
async def get_all_customers(
    current_user: dict = Depends(require_admin),
    search: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    """Get all customers with search and filter."""
    try:
        query = supabase_admin.table("profiles").select("*", count="exact").eq("role", "customer")

        if status == "active":
            query = query.eq("is_active", True)
        elif status == "disabled":
            query = query.eq("is_active", False)

        if search:
            query = query.or_(f"full_name.ilike.%{search}%,email.ilike.%{search}%,phone.ilike.%{search}%")

        result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()

        return {
            "data": result.data,
            "total": result.count,
            "limit": limit,
            "offset": offset,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch customers: {str(e)}")


@router.put("/customers/{customer_id}/status")
async def update_customer_status(
    customer_id: str,
    is_active: bool,
    current_user: dict = Depends(require_admin),
):
    """Enable or disable a customer account."""
    try:
        result = supabase_admin.table("profiles").update({"is_active": is_active}).eq("id", customer_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Customer not found")
        action = "enabled" if is_active else "disabled"
        return {"message": f"Customer account {action} successfully", "data": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update customer status: {str(e)}")


@router.get("/bookings")
async def get_all_bookings(
    current_user: dict = Depends(require_admin),
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    """Get all bookings with filters."""
    try:
        query = supabase_admin.table("bookings").select(
            "*, profiles!customer_id(full_name, email), booking_services(*, services(name_en, category))",
            count="exact"
        )

        if status and status != "all":
            query = query.eq("status", status)
        if date_from:
            query = query.gte("booking_date", date_from)
        if date_to:
            query = query.lte("booking_date", date_to)

        result = query.order("booking_date", desc=True).range(offset, offset + limit - 1).execute()

        return {
            "data": result.data,
            "total": result.count,
            "limit": limit,
            "offset": offset,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch bookings: {str(e)}")


@router.put("/bookings/{booking_id}/status")
async def update_booking_status_admin(
    booking_id: str,
    data: BookingStatusUpdate,
    current_user: dict = Depends(require_admin),
):
    """Update booking status (admin)."""
    try:
        update_data = {"status": data.status}
        if data.admin_notes:
            update_data["admin_notes"] = data.admin_notes

        result = supabase_admin.table("bookings").update(update_data).eq("id", booking_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update booking: {str(e)}")


@router.get("/inquiries")
async def get_all_inquiries(
    current_user: dict = Depends(require_admin),
    status: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get all inquiries with filter."""
    try:
        query = supabase_admin.table("inquiries").select("*", count="exact")

        if status and status != "all":
            query = query.eq("status", status)

        result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()

        return {
            "data": result.data,
            "total": result.count,
            "limit": limit,
            "offset": offset,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch inquiries: {str(e)}")


@router.put("/inquiries/{inquiry_id}/reply")
async def reply_to_inquiry(
    inquiry_id: str,
    data: InquiryReplyRequest,
    current_user: dict = Depends(require_admin),
):
    """Reply to an inquiry (admin)."""
    try:
        update_data = {
            "admin_reply": data.admin_reply,
            "status": data.status,
            "replied_at": datetime.utcnow().isoformat(),
            "replied_by": current_user["user_id"],
        }

        result = supabase_admin.table("inquiries").update(update_data).eq("id", inquiry_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reply to inquiry: {str(e)}")


@router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(
    inquiry_id: str,
    data: InquiryStatusUpdate,
    current_user: dict = Depends(require_admin),
):
    """Update inquiry status (admin)."""
    try:
        result = supabase_admin.table("inquiries").update({"status": data.status}).eq("id", inquiry_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update inquiry status: {str(e)}")

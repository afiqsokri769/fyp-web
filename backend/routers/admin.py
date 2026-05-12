from fastapi import APIRouter, HTTPException, Depends, Query
from models.inquiry import InquiryReplyRequest, InquiryStatusUpdate
from models.booking import BookingStatusUpdate
from database import supabase_admin
from middleware.auth_middleware import require_admin
from datetime import datetime
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()

# Thread pool for running sync Supabase calls concurrently
_executor = ThreadPoolExecutor(max_workers=10)


def run_query(fn):
    """Run a synchronous Supabase query in a thread."""
    return fn()


@router.get("/stats")
async def get_admin_stats(current_user: dict = Depends(require_admin)):
    """Get dashboard statistics for admin — all queries run in parallel."""
    try:
        today = datetime.now().date()
        first_day = today.replace(day=1)
        loop = asyncio.get_event_loop()

        # Run all 5 queries concurrently
        results = await asyncio.gather(
            loop.run_in_executor(_executor, lambda: supabase_admin.table("profiles").select("id", count="exact").eq("role", "customer").execute()),
            loop.run_in_executor(_executor, lambda: supabase_admin.table("bookings").select("id", count="exact").eq("booking_date", str(today)).execute()),
            loop.run_in_executor(_executor, lambda: supabase_admin.table("bookings").select("id", count="exact").eq("status", "pending").execute()),
            loop.run_in_executor(_executor, lambda: supabase_admin.table("inquiries").select("id", count="exact").eq("status", "pending").execute()),
            loop.run_in_executor(_executor, lambda: supabase_admin.table("bookings").select("total_estimated_price").eq("status", "completed").gte("created_at", str(first_day)).execute()),
        )

        customers_res, bookings_today_res, pending_res, inquiries_res, completed_res = results
        revenue = sum(float(b.get("total_estimated_price", 0) or 0) for b in completed_res.data)

        return {
            "total_customers": customers_res.count or 0,
            "bookings_today": bookings_today_res.count or 0,
            "pending_bookings": pending_res.count or 0,
            "open_inquiries": inquiries_res.count or 0,
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
            "data": result.data or [],
            "total": result.count or 0,
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


@router.delete("/customers/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_user: dict = Depends(require_admin),
):
    """Delete a customer account."""
    try:
        supabase_admin.auth.admin.delete_user(customer_id)
        return {"message": "Customer deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete customer: {str(e)}")


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
            "data": result.data or [],
            "total": result.count or 0,
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
            "data": result.data or [],
            "total": result.count or 0,
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

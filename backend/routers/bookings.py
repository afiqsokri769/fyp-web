from fastapi import APIRouter, HTTPException, Depends, Query
from models.booking import BookingCreate, BookingStatusUpdate, BookingResponse
from database import supabase_admin
from middleware.auth_middleware import get_current_user
from datetime import date as date_type
from typing import Optional

router = APIRouter()


@router.get("/available-slots")
async def get_available_slots(
    booking_date: str = Query(..., description="Date in YYYY-MM-DD format"),
    current_user: dict = Depends(get_current_user),
):
    """Get available time slots for a given date."""
    try:
        # Check if date is blocked
        blocked = supabase_admin.table("blocked_dates").select("id").eq("blocked_date", booking_date).execute()
        if blocked.data:
            return []

        # Get all active time slots
        slots_result = supabase_admin.table("time_slots").select("*").eq("is_active", True).order("slot_time").execute()
        all_slots = slots_result.data

        # Count existing bookings per slot for this date
        bookings_result = supabase_admin.table("bookings").select("booking_time").eq("booking_date", booking_date).not_.eq("status", "cancelled").execute()
        booked_times = [b["booking_time"] for b in bookings_result.data]

        available = []
        for slot in all_slots:
            slot_time_str = str(slot["slot_time"])[:5]  # HH:MM
            booked_count = booked_times.count(slot["slot_time"])
            remaining = slot["max_bookings"] - booked_count
            available.append({
                "slot_time": slot_time_str,
                "available": remaining > 0,
                "remaining_capacity": max(0, remaining),
            })

        return available
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch available slots: {str(e)}")


@router.get("")
async def get_bookings(current_user: dict = Depends(get_current_user)):
    """Get all bookings for the authenticated customer."""
    try:
        result = supabase_admin.table("bookings").select(
            "*, booking_services(*, services(name_en, category))"
        ).eq("customer_id", current_user["user_id"]).order("booking_date", desc=True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch bookings: {str(e)}")


@router.post("")
async def create_booking(data: BookingCreate, current_user: dict = Depends(get_current_user)):
    """Create a new booking."""
    try:
        booking_date_str = str(data.booking_date)
        booking_time_str = str(data.booking_time)

        # Verify slot is still available
        blocked = supabase_admin.table("blocked_dates").select("id").eq("blocked_date", booking_date_str).execute()
        if blocked.data:
            raise HTTPException(status_code=400, detail="Selected date is not available for bookings")

        slots_result = supabase_admin.table("time_slots").select("max_bookings").eq("slot_time", booking_time_str).single().execute()
        if not slots_result.data:
            raise HTTPException(status_code=400, detail="Invalid time slot")

        max_bookings = slots_result.data["max_bookings"]
        existing = supabase_admin.table("bookings").select("id").eq("booking_date", booking_date_str).eq("booking_time", booking_time_str).not_.eq("status", "cancelled").execute()

        if len(existing.data) >= max_bookings:
            raise HTTPException(status_code=400, detail="Selected time slot is no longer available")

        # Create booking
        booking_data = {
            "customer_id": current_user["user_id"],
            "booking_date": booking_date_str,
            "booking_time": booking_time_str,
            "motorcycle_model": data.motorcycle_model,
            "motorcycle_year": data.motorcycle_year,
            "license_plate": data.license_plate,
            "mileage": data.mileage,
            "special_notes": data.special_notes,
            "total_estimated_price": float(data.total_estimated_price) if data.total_estimated_price else None,
            "status": "pending",
        }

        booking_result = supabase_admin.table("bookings").insert(booking_data).execute()
        booking = booking_result.data[0]

        # Insert booking services
        for service_item in data.services:
            supabase_admin.table("booking_services").insert({
                "booking_id": booking["id"],
                "service_id": service_item.service_id,
                "quantity": service_item.quantity,
                "price_at_booking": float(service_item.price_at_booking) if service_item.price_at_booking else None,
            }).execute()

        # Return full booking with services
        full_booking = supabase_admin.table("bookings").select(
            "*, booking_services(*, services(name_en, category))"
        ).eq("id", booking["id"]).single().execute()

        return full_booking.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")


@router.get("/{booking_id}")
async def get_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single booking by ID."""
    try:
        result = supabase_admin.table("bookings").select(
            "*, booking_services(*, services(name_en, category))"
        ).eq("id", booking_id).single().execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Booking not found")

        # Customers can only see their own bookings
        if current_user["role"] != "admin" and result.data["customer_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="Access denied")

        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch booking: {str(e)}")


@router.put("/{booking_id}")
async def update_booking(booking_id: str, data: BookingStatusUpdate, current_user: dict = Depends(get_current_user)):
    """Update booking status. Customers can only cancel their own pending bookings."""
    try:
        existing = supabase_admin.table("bookings").select("*").eq("id", booking_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Booking not found")

        booking = existing.data

        # Customers can only cancel their own bookings
        if current_user["role"] != "admin":
            if booking["customer_id"] != current_user["user_id"]:
                raise HTTPException(status_code=403, detail="Access denied")
            if data.status != "cancelled":
                raise HTTPException(status_code=403, detail="Customers can only cancel bookings")
            if booking["status"] not in ["pending", "confirmed"]:
                raise HTTPException(status_code=400, detail="Only pending or confirmed bookings can be cancelled")

        update_data = {"status": data.status}
        if data.admin_notes:
            update_data["admin_notes"] = data.admin_notes

        result = supabase_admin.table("bookings").update(update_data).eq("id", booking_id).execute()
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update booking: {str(e)}")

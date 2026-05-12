from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time, datetime
from decimal import Decimal


class BookingServiceItem(BaseModel):
    service_id: str
    quantity: int = 1
    price_at_booking: Optional[Decimal] = None


class BookingCreate(BaseModel):
    booking_date: date
    booking_time: time
    services: List[BookingServiceItem]
    motorcycle_model: Optional[str] = None
    motorcycle_year: Optional[int] = None
    license_plate: Optional[str] = None
    mileage: Optional[int] = None
    special_notes: Optional[str] = None
    total_estimated_price: Optional[Decimal] = None


class BookingStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None


class BookingResponse(BaseModel):
    id: str
    booking_reference: str
    customer_id: str
    booking_date: date
    booking_time: time
    status: str
    motorcycle_model: Optional[str] = None
    motorcycle_year: Optional[int] = None
    license_plate: Optional[str] = None
    mileage: Optional[int] = None
    special_notes: Optional[str] = None
    total_estimated_price: Optional[Decimal] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class AvailableSlotResponse(BaseModel):
    slot_time: str
    available: bool
    remaining_capacity: int

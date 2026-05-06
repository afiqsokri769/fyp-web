from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class ServiceCreate(BaseModel):
    name_en: str
    name_bm: Optional[str] = None
    category: str
    description: Optional[str] = None
    price_min: Optional[Decimal] = None
    price_max: Optional[Decimal] = None
    duration_minutes: int = 60
    image_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class ServiceUpdate(BaseModel):
    name_en: Optional[str] = None
    name_bm: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price_min: Optional[Decimal] = None
    price_max: Optional[Decimal] = None
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ServiceResponse(BaseModel):
    id: str
    name_en: str
    name_bm: Optional[str] = None
    category: str
    description: Optional[str] = None
    price_min: Optional[Decimal] = None
    price_max: Optional[Decimal] = None
    duration_minutes: int
    image_url: Optional[str] = None
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime


class ServiceReorderRequest(BaseModel):
    service_ids: list[str]  # ordered list of IDs

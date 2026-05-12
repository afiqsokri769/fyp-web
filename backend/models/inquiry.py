from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class InquiryCreate(BaseModel):
    sender_name: str
    sender_email: EmailStr
    sender_phone: Optional[str] = None
    subject: str
    message: str
    customer_id: Optional[str] = None


class InquiryReplyRequest(BaseModel):
    admin_reply: str
    status: str = "replied"


class InquiryStatusUpdate(BaseModel):
    status: str


class InquiryResponse(BaseModel):
    id: str
    customer_id: Optional[str] = None
    sender_name: str
    sender_email: str
    sender_phone: Optional[str] = None
    subject: str
    message: str
    status: str
    admin_reply: Optional[str] = None
    replied_at: Optional[datetime] = None
    replied_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

from fastapi import APIRouter, HTTPException
from database import supabase_admin

router = APIRouter()


@router.get("")
async def get_faqs(category: str = None):
    """Get all active FAQs (public)."""
    try:
        query = supabase_admin.table("faqs").select("*").eq("is_active", True).order("sort_order")
        if category and category != "all":
            query = query.eq("category", category)
        result = query.execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch FAQs: {str(e)}")

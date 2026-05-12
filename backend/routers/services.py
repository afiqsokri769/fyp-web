from fastapi import APIRouter, HTTPException, Depends
from models.service import ServiceCreate, ServiceUpdate, ServiceResponse, ServiceReorderRequest
from database import supabase, supabase_admin
from middleware.auth_middleware import get_current_user, require_admin

router = APIRouter()


@router.get("")
async def list_services(category: str = None, include_inactive: bool = False):
    """List all active services (public). Admins can include inactive."""
    try:
        query = supabase_admin.table("services").select("*").order("sort_order")
        if not include_inactive:
            query = query.eq("is_active", True)
        if category and category != "all":
            query = query.eq("category", category)
        result = query.execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch services: {str(e)}")


@router.get("/{service_id}")
async def get_service(service_id: str):
    """Get a single service by ID (public)."""
    try:
        result = supabase_admin.table("services").select("*").eq("id", service_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Service not found")
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch service: {str(e)}")


@router.post("")
async def create_service(data: ServiceCreate, current_user: dict = Depends(require_admin)):
    """Create a new service (admin only)."""
    try:
        result = supabase_admin.table("services").insert(data.model_dump()).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create service: {str(e)}")


@router.put("/{service_id}")
async def update_service(service_id: str, data: ServiceUpdate, current_user: dict = Depends(require_admin)):
    """Update a service (admin only)."""
    try:
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        result = supabase_admin.table("services").update(update_data).eq("id", service_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Service not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update service: {str(e)}")


@router.delete("/{service_id}")
async def delete_service(service_id: str, current_user: dict = Depends(require_admin)):
    """Delete a service (admin only)."""
    try:
        supabase_admin.table("services").delete().eq("id", service_id).execute()
        return {"message": "Service deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete service: {str(e)}")


@router.post("/reorder")
async def reorder_services(data: ServiceReorderRequest, current_user: dict = Depends(require_admin)):
    """Reorder services by updating sort_order (admin only)."""
    try:
        for index, service_id in enumerate(data.service_ids):
            supabase_admin.table("services").update({"sort_order": index}).eq("id", service_id).execute()
        return {"message": "Services reordered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reorder services: {str(e)}")

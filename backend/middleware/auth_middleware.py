from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import supabase_admin
from config import settings
from typing import Optional
import time
import httpx

security = HTTPBearer(auto_error=False)

# Simple in-memory token cache — avoids hitting Supabase on every request
_token_cache: dict = {}
_CACHE_TTL = 300  # 5 minutes


def _get_cached_user(token: str) -> Optional[dict]:
    entry = _token_cache.get(token)
    if entry and time.time() < entry[1]:
        return entry[0]
    if token in _token_cache:
        del _token_cache[token]
    return None


def _cache_user(token: str, user: dict):
    if len(_token_cache) > 1000:
        oldest = sorted(_token_cache.items(), key=lambda x: x[1][1])[:100]
        for k, _ in oldest:
            del _token_cache[k]
    _token_cache[token] = (user, time.time() + _CACHE_TTL)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    """
    Verify the Supabase JWT using Supabase's own get_user API.
    This avoids JWT secret mismatch issues.
    Uses in-memory cache to avoid repeated DB lookups.
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = credentials.credentials

    # Check cache first
    cached = _get_cached_user(token)
    if cached:
        return cached

    # Verify token with Supabase directly — stateless HTTP call
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "apikey": settings.supabase_service_key,
                    "Authorization": f"Bearer {token}"
                },
                timeout=10.0
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
            
        user_data_resp = resp.json()
        user_id = user_data_resp.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Fetch role from profiles table
    try:
        result = supabase_admin.table("profiles").select(
            "id, role, is_active, full_name, email"
        ).eq("id", user_id).single().execute()
        profile = result.data
    except Exception:
        raise HTTPException(status_code=401, detail="User profile not found")

    if not profile:
        raise HTTPException(status_code=401, detail="User profile not found")

    if not profile.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account has been disabled")

    user_data = {
        "user_id": user_id,
        "role": profile.get("role", "customer"),
        "full_name": profile.get("full_name"),
        "email": profile.get("email"),
        "is_active": profile.get("is_active", True),
    }

    # Cache the result
    _cache_user(token, user_data)
    return user_data


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency that requires admin role."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[dict]:
    """Optional auth — returns None if no token provided."""
    if not credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

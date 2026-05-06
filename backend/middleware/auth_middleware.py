from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from database import supabase_admin
from config import settings
from typing import Optional
import time

security = HTTPBearer(auto_error=False)


def _get_user_id_from_jwt(token: str) -> Optional[str]:
    try:
        # Decode JWT — Supabase uses HS256 with the JWT secret
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
            options={"verify_aud": False},
        )
    except JWTError:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    # Check expiry
    exp = payload.get("exp")
    if exp and time.time() > exp:
        raise HTTPException(status_code=401, detail="Token has expired")

    return user_id


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    """
    Verify the Supabase JWT and return user data with role.
    Attaches user_id and role to the request context.
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = credentials.credentials

    user_id = _get_user_id_from_jwt(token)
    if not user_id:
        try:
            auth_response = supabase_admin.auth.get_user(token)
            user = auth_response.user
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        if not user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user_id = user.id

    # Fetch role from profiles table
    try:
        result = supabase_admin.table("profiles").select("id, role, is_active, full_name, email").eq("id", user_id).single().execute()
        profile = result.data
    except Exception:
        raise HTTPException(status_code=401, detail="User profile not found")

    if not profile:
        raise HTTPException(status_code=401, detail="User profile not found")

    if not profile.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account has been disabled")

    return {
        "user_id": user_id,
        "role": profile.get("role", "customer"),
        "full_name": profile.get("full_name"),
        "email": profile.get("email"),
        "is_active": profile.get("is_active", True),
    }


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

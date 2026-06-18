from config import settings
from fastapi import HTTPException
import httpx

# Direct Supabase Auth REST API — avoids shared client session corruption
_AUTH_URL = f"{settings.supabase_url}/auth/v1"
_HEADERS = {
    "apikey": settings.supabase_service_key,
    "Content-Type": "application/json",
}


def send_otp_email(email: str) -> dict:
    """
    Send a 6-digit OTP to user email via Supabase Auth REST API.
    Uses the /otp endpoint with should_create_user=False so it only
    works for existing accounts.
    """
    try:
        # Use synchronous httpx since this function is called from sync context
        with httpx.Client() as client:
            resp = client.post(
                f"{_AUTH_URL}/otp",
                headers=_HEADERS,
                json={
                    "email": email,
                    "create_user": False,
                },
                timeout=15.0,
            )
        if resp.status_code not in (200, 201):
            raise Exception(f"Supabase OTP request failed: {resp.text}")
        return {"message": "OTP sent successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send OTP: {str(e)}"
        )


def verify_otp(email: str, token: str, otp_type: str = "email") -> dict:
    """
    Verify a 6-digit OTP token via Supabase Auth REST API.
    Returns session data on success.
    """
    try:
        with httpx.Client() as client:
            resp = client.post(
                f"{_AUTH_URL}/verify",
                headers=_HEADERS,
                json={
                    "email": email,
                    "token": token,
                    "type": otp_type,
                },
                timeout=15.0,
            )

        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="OTP verification failed")

        data = resp.json()
        access_token = data.get("access_token")
        refresh_token = data.get("refresh_token")

        if access_token:
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": data.get("user"),
            }

        raise HTTPException(status_code=400, detail="OTP verification failed")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or expired OTP: {str(e)}"
        )

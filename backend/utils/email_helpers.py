from database import supabase_admin
from fastapi import HTTPException


def send_otp_email(email: str) -> dict:
    """
    Send OTP to user email via Supabase Auth.
    Uses Supabase's built-in OTP/magic link flow.
    """
    try:
        response = supabase_admin.auth.sign_in_with_otp({"email": email})
        return {"message": "OTP sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")


def verify_otp(email: str, token: str, otp_type: str = "email") -> dict:
    """
    Verify OTP token via Supabase Auth.
    Returns session data on success.
    """
    try:
        response = supabase_admin.auth.verify_otp({
            "email": email,
            "token": token,
            "type": otp_type,
        })
        if response.session:
            return {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "user": response.user,
            }
        raise HTTPException(status_code=400, detail="OTP verification failed")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid or expired OTP: {str(e)}")

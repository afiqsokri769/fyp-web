import time
from collections import defaultdict
from threading import Lock
from fastapi import HTTPException, Request

# In-memory rate limiter (use Redis in production)
_login_attempts: dict = defaultdict(list)
_lock = Lock()

MAX_ATTEMPTS = 5
WINDOW_SECONDS = 15 * 60  # 15 minutes


def check_rate_limit(identifier: str) -> None:
    """
    Check if the identifier (IP or email) has exceeded login attempt limits.
    Raises HTTP 429 if limit exceeded.
    """
    now = time.time()
    with _lock:
        # Remove attempts outside the window
        _login_attempts[identifier] = [
            t for t in _login_attempts[identifier] if now - t < WINDOW_SECONDS
        ]
        if len(_login_attempts[identifier]) >= MAX_ATTEMPTS:
            remaining = int(WINDOW_SECONDS - (now - _login_attempts[identifier][0]))
            raise HTTPException(
                status_code=429,
                detail=f"Too many login attempts. Please try again in {remaining // 60} minutes.",
            )


def record_failed_attempt(identifier: str) -> None:
    """Record a failed login attempt."""
    with _lock:
        _login_attempts[identifier].append(time.time())


def clear_attempts(identifier: str) -> None:
    """Clear attempts after successful login."""
    with _lock:
        _login_attempts.pop(identifier, None)


def get_client_ip(request: Request) -> str:
    """Extract client IP from request."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

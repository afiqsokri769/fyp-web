from supabase import create_client, Client
from config import settings

# Service role client — for admin operations (bypasses RLS)
# Used only for stateless table queries and admin auth API calls.
# NEVER use this for user-scoped sign_in / sign_out — those are handled
# via direct HTTP calls in routers/auth.py to avoid shared session corruption.
supabase_admin: Client = create_client(settings.supabase_url, settings.supabase_service_key)

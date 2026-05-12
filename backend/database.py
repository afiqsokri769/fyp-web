from supabase import create_client, Client
from config import settings

# Anon client — for user-scoped operations (respects RLS)
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

# Service role client — for admin operations (bypasses RLS)
supabase_admin: Client = create_client(settings.supabase_url, settings.supabase_service_key)

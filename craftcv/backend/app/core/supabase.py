from functools import lru_cache
from supabase import create_client, Client

from app.core.config import settings


@lru_cache(maxsize=1)
def get_supabase_admin() -> Client:
    return create_client(
        settings.supabase_url,
        settings.supabase_service_key,
    )


@lru_cache(maxsize=1)
def get_supabase_anon() -> Client:
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key,
    )

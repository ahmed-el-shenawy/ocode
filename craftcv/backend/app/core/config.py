from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_key: str = ""
    supabase_anon_key: str = ""
    database_url: str = ""
    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    gemini_api_key: str = ""
    redis_url: str = ""
    storage_bucket: str = ""
    pdf_storage_path: str = ""

    model_config = {"env_file": ".env"}


settings = Settings()

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CraftCV"
    debug: bool = False
    supabase_url: str = ""
    supabase_service_key: str = ""
    supabase_anon_key: str = ""
    database_url: str = ""
    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"
    openai_api_key: str = ""
    anthropic_api_key: str | None = None
    gemini_api_key: str | None = None
    ollama_api_base: str | None = None
    redis_url: str = ""
    groq_api_key: str = ""
    storage_bucket: str = ""
    pdf_storage_path: str = ""

    model_config = {"env_file": ".env"}


settings = Settings()

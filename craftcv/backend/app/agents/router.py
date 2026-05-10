from litellm import Router
from app.core.config import settings

model_list = [
    {
        "model_name": "gpt-4o",
        "litellm_params": {"model": "gpt-4o", "api_key": settings.openai_api_key},
    },
    {
        "model_name": "claude-sonnet",
        "litellm_params": {"model": "claude-3-sonnet-20240229", "api_key": settings.anthropic_api_key},
    },
    {
        "model_name": "gemini-pro",
        "litellm_params": {"model": "gemini/gemini-pro", "api_key": settings.gemini_api_key},
    },
    {
        "model_name": "ollama",
        "litellm_params": {"model": "ollama/llama3", "api_key": "ollama"},
    },
]

router = Router(model_list=model_list)

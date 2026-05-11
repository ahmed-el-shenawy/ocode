import logging
from functools import lru_cache

from litellm import Router

from app.core.config import settings

logger = logging.getLogger("craftcv.router")

_MODEL_PRIORITY = ["gpt-4o", "claude-sonnet", "gemini-pro", "groq-llama", "ollama"]


@lru_cache(maxsize=1)
def get_router() -> Router:
    return Router(model_list=[
        {
            "model_name": "groq-llama",
            "litellm_params": {"model": "groq/llama-3.3-70b-versatile", "api_key": settings.groq_api_key},
        },
        {
            "model_name": "gpt-4o",
            "litellm_params": {"model": "gpt-4o", "api_key": settings.openai_api_key},
        },
        {
            "model_name": "claude-sonnet",
            "litellm_params": {"model": "anthropic/claude-3-sonnet-20240229", "api_key": settings.anthropic_api_key},
        },
        {
            "model_name": "gemini-pro",
            "litellm_params": {"model": "gemini/gemini-pro", "api_key": settings.gemini_api_key},
        },
        {
            "model_name": "ollama",
            "litellm_params": {"model": "ollama/llama3", "api_key": "ollama"},
        },
    ])


async def generate(
    messages: list[dict],
    model: str | None = None,
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> str:
    router = get_router()
    candidates = [model] if model else _MODEL_PRIORITY
    last_error: Exception | None = None
    for candidate in candidates:
        try:
            response = await router.acompletion(
                model=candidate,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content
            if content:
                return content
        except Exception as e:
            logger.warning("Model %s failed: %s", candidate, e)
            last_error = e
            continue
    raise last_error or RuntimeError("All models exhausted")

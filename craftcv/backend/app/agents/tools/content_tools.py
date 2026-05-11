from app.agents.router import generate


async def humanize_text(text: str) -> str:
    prompt = (
        "Rewrite the following resume text to sound more natural, professional, and human. "
        "Keep all factual information intact. Return only the rewritten text.\n\n"
        f"{text}"
    )
    return await generate([{"role": "user", "content": prompt}], temperature=0.5, max_tokens=1024)


async def suggest_improvements(text: str) -> list[str]:
    prompt = (
        "Analyze the following resume text and suggest 3-5 specific improvements. "
        "Focus on action verbs, quantifiable achievements, and ATS optimization. "
        "Return each suggestion as a separate line prefixed with '- '.\n\n"
        f"{text}"
    )
    raw = await generate([{"role": "user", "content": prompt}], temperature=0.6, max_tokens=1024)
    return [line.strip("- ").strip() for line in raw.split("\n") if line.strip().startswith("- ")]

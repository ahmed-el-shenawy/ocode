import logging
from pathlib import Path

from litellm import Router

from app.agents.prompts.sections import SECTION_PROMPTS
from app.agents.router import generate

logger = logging.getLogger("craftcv.agent")


class CvAgent:
    def __init__(self, router: Router):
        self.router = router
        self._system_prompt = (Path(__file__).parent / "prompts" / "system.md").read_text()

    async def process(
        self,
        user_input: str,
        resume: dict | None = None,
        conversation: dict | None = None,
        messages: list[dict] | None = None,
    ) -> dict:
        context = await self._build_context(resume, conversation)
        intent = await self._detect_intent(user_input)
        if intent == "guided_answer":
            reply = await self._handle_guided_answer(user_input, context)
        elif intent == "tool_request":
            reply = await self._handle_tool_request(user_input, context)
        else:
            reply = await self._handle_free_form(user_input, context, messages)
        progress = self._compute_progress(context, reply)
        return {"reply": reply, "progress": progress, "intent": intent}

    async def _build_context(self, resume: dict | None, conversation: dict | None) -> dict:
        context = {"sections": {}, "mode": "free", "completed_sections": []}
        if resume:
            content = resume.get("content", {})
            sections = content.get("sections", []) if isinstance(content, dict) else []
            context["sections"] = {s.get("id", ""): s for s in sections}
            context["template"] = resume.get("template_version", {}).get("definition", {})
        if conversation:
            context["mode"] = conversation.get("mode", "free")
            context["completed_sections"] = conversation.get("progress", {}).get("completed", [])
        return context

    async def _detect_intent(self, message: str) -> str:
        msg = message.strip().lower()
        if msg.startswith("/tool"):
            return "tool_request"
        guided_keywords = ["help me", "guide", "what should", "how do", "walk me"]
        if any(kw in msg for kw in guided_keywords):
            return "guided_answer"
        return "free_form"

    async def _handle_guided_answer(self, message: str, context: dict) -> str:
        section_id = self._guess_section(message)
        prompt = SECTION_PROMPTS.get(section_id, "Ask relevant questions to help the user improve their resume.")
        if context.get("sections", {}).get(section_id):
            prompt += "\nThe user already has content for this section. Ask if they want to improve it."
        system = f"{self._system_prompt}\n\nCurrent mode: guided\nSection focus: {section_id}\n\n{prompt}"
        reply = await generate([{"role": "system", "content": system}, {"role": "user", "content": message}])
        return reply

    @staticmethod
    def _guess_section(message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["summary", "about", "profile", "objective"]):
            return "summary"
        if any(w in msg for w in ["experience", "work", "job", "employment", "position"]):
            return "experience"
        if any(w in msg for w in ["education", "school", "university", "degree", "college"]):
            return "education"
        if any(w in msg for w in ["skill", "technology", "tool", "programming"]):
            return "skills"
        if any(w in msg for w in ["project", "portfolio"]):
            return "projects"
        if any(w in msg for w in ["certification", "certificate", "license"]):
            return "certifications"
        if any(w in msg for w in ["language"]):
            return "languages"
        return "header"

    async def _handle_free_form(self, message: str, context: dict, messages: list[dict] | None = None) -> str:
        system = self._system_prompt + "\n\nCurrent mode: free-form"
        conversation = messages or []
        reply = await generate(
            [{"role": "system", "content": system}] + conversation + [{"role": "user", "content": message}]
        )
        return reply

    async def _handle_tool_request(self, message: str, context: dict) -> str:
        from app.agents.tools.web_search import web_search
        query = message.replace("/tool", "").strip()
        if not query:
            return "Please provide a search query after /tool, e.g. `/tool best resume practices`"
        results = await web_search(query)
        formatted = "\n\n".join(f"- {r.get('title', '')}: {r.get('body', '')}" for r in results[:3])
        return f"Here are some web search results:\n\n{formatted}"

    @staticmethod
    def _compute_progress(context: dict, reply: str) -> dict:
        completed = context.get("completed_sections", [])
        return {"completed": completed, "last_reply_length": len(reply)}

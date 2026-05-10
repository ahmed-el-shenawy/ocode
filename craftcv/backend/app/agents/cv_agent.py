from litellm import Router


class CvAgent:
    def __init__(self, router: Router):
        self.router = router

    async def process(self, message: str, context: dict | None = None):
        pass

    async def _build_resume_context(self, resume_id: str):
        pass

    async def _detect_intent(self, message: str):
        pass

    async def _handle_guided_answer(self, message: str, context: dict):
        pass

    async def _handle_free_form(self, message: str, context: dict):
        pass

    async def _handle_tool_request(self, message: str):
        pass

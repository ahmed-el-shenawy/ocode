.PHONY: install dev backend frontend supabase test clean

BACKEND_DIR := ./backend
FRONTEND_DIR := ./frontend
VENV := $(BACKEND_DIR)/.venv

install:
	cd $(BACKEND_DIR) && pip install -e ".[dev]"
	cd $(FRONTEND_DIR) && npm install

supabase:
	supabase start

backend: $(VENV)/bin/activate
	cd $(BACKEND_DIR) && \
		source $(VENV)/bin/activate && \
		uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

frontend:
	cd $(FRONTEND_DIR) && npm run dev

dev: supabase
	@echo "Supabase started. Run 'make backend' and 'make frontend' in separate terminals."
	@echo "Or start them manually:"
	@echo "  source $(BACKEND_DIR)/.venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
	@echo "  cd $(FRONTEND_DIR) && npm run dev"

test:
	cd $(BACKEND_DIR) && source $(VENV)/bin/activate && pytest
	cd $(FRONTEND_DIR) && npm run test

clean:
	rm -rf $(BACKEND_DIR)/__pycache__ $(BACKEND_DIR)/.venv
	rm -rf $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/.next

migrate:
	cd $(BACKEND_DIR) && source $(VENV)/bin/activate && alembic upgrade head

migrate-schema:
	cd $(BACKEND_DIR) && source $(VENV)/bin/activate && \
		python -c "import asyncio; import asyncpg; import pathlib; \
		async def run(): \
			conn = await asyncpg.connect('postgresql://postgres:postgres@127.0.0.1:54322/postgres'); \
			sql = pathlib.Path('supabase/migrations/00001_initial_schema.sql').read_text(); \
			await conn.execute(sql); \
			await conn.close(); \
		asyncio.run(run())"

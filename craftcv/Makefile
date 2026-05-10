.PHONY: install dev test build clean

install:
	cd backend && pip install -e ".[dev]"
	cd frontend && npm install

dev:
	docker-compose up

test:
	@echo "No tests defined yet"

build:
	@echo "Build not configured yet"

clean:
	rm -rf __pycache__ .venv node_modules

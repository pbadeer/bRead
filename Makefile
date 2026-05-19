run:
	source .venv/bin/activate && python app.py

install:
	uv sync

test-db:
	uv run python test_db.py

.PHONY: run install test-db
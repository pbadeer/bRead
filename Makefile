run:
	source .venv/bin/activate && python app.py

install:
	uv sync
	uv run playwright install chromium

test:
	uv run pytest tests/test_ui.py -v --headed

test-headless:
	uv run pytest tests/test_ui.py -v

.PHONY: run install test test-headless
# Python logger

Appends usage events (JSON Lines) to:

- `%APPDATA%\\ApiUsageTopbar\\usage.jsonl`

## Install (editable)

```bash
cd loggers/python
pip install -e .
```

## Usage

```py
from api_usage_topbar_logger import log_usage_event

log_usage_event(
    provider="anthropic",
    model="claude-3-5-sonnet",
    input_tokens=123,
    output_tokens=456,
    cost_usd=0.034,
    app="my-python-app",
)
```

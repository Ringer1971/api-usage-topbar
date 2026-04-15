import json
import os
import time
from pathlib import Path
from typing import Any, Dict, Optional


def usage_path() -> Path:
    appdata = os.environ.get("APPDATA")
    if not appdata:
        # fallback for non-windows
        appdata = str(Path.home() / "AppData" / "Roaming")
    return Path(appdata) / "ApiUsageTopbar" / "usage.jsonl"


def log_usage_event(
    *,
    provider: str,
    model: str,
    input_tokens: int = 0,
    output_tokens: int = 0,
    cost_usd: Optional[float] = None,
    request_id: Optional[str] = None,
    app: Optional[str] = None,
    meta: Optional[Dict[str, Any]] = None,
) -> Path:
    evt: Dict[str, Any] = {
        "ts": int(time.time() * 1000),
        "provider": provider,
        "model": model,
        "inputTokens": int(input_tokens or 0),
        "outputTokens": int(output_tokens or 0),
    }
    if cost_usd is not None:
        evt["costUsd"] = float(cost_usd)
    if request_id:
        evt["requestId"] = request_id
    if app:
        evt["app"] = app
    if meta:
        evt["meta"] = meta

    p = usage_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("a", encoding="utf-8") as f:
        f.write(json.dumps(evt) + "\n")
    return p

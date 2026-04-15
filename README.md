# api-usage-topbar

A small **Windows** top-of-screen overlay that shows your **API usage** (e.g., **session** + **weekly** budgets) and updates in near real-time.

It’s designed to be **reliable** by tracking usage from *your own apps* (Python/Node) rather than trying to scrape provider billing dashboards.

## What’s in this repo

- `overlay/` – Electron overlay app (always-on-top bar at top of screen)
- `loggers/node/` – Node helper to log OpenAI/Anthropic usage events
- `loggers/python/` – Python helper to log OpenAI/Anthropic usage events
- `schema/usage-event.schema.json` – shared event format

## How it works (high level)

Your apps write usage events to a local file:

- **Windows path:** `%APPDATA%\\ApiUsageTopbar\\usage.jsonl`

The overlay reads that file, aggregates totals, and renders:

- **Session:** since last “session reset” (or since midnight if you prefer)
- **Weekly:** since Monday 00:00 local time

## Status

This is an MVP scaffold. Next steps:

- Wire OpenAI + Anthropic SDK wrappers to capture token usage
- Add per-model pricing tables (or let you provide pricing overrides)
- Add settings UI (weekly cap, session cap, reset rules)

## Dev (overlay)

```bash
cd overlay
npm install
npm run dev
```

## Build (overlay)

```bash
cd overlay
npm run build
```

## Logging events

You can log events from Node or Python. See:

- `loggers/node/README.md`
- `loggers/python/README.md`

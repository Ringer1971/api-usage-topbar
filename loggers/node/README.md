# Node logger

This helper appends usage events (JSON Lines) to:

- `%APPDATA%\\ApiUsageTopbar\\usage.jsonl`

## Install (local dev)

```bash
cd loggers/node
npm install
```

## Usage

```js
const { logUsageEvent } = require('./src');

await logUsageEvent({
  provider: 'openai',
  model: 'gpt-4.1-mini',
  inputTokens: 123,
  outputTokens: 456,
  costUsd: 0.012,
  app: 'my-node-app'
});
```

If you don’t know cost, omit `costUsd` and just log tokens. (Later we can add pricing tables.)

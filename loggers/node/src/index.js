const fs = require('fs');
const os = require('os');
const path = require('path');

function usagePath() {
  const appdata = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  return path.join(appdata, 'ApiUsageTopbar', 'usage.jsonl');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function logUsageEvent(evt) {
  const e = {
    ts: Date.now(),
    provider: evt.provider,
    model: evt.model,
    inputTokens: evt.inputTokens ?? 0,
    outputTokens: evt.outputTokens ?? 0,
    costUsd: typeof evt.costUsd === 'number' ? evt.costUsd : undefined,
    requestId: evt.requestId,
    app: evt.app,
    meta: evt.meta
  };

  const p = usagePath();
  ensureDir(p);
  fs.appendFileSync(p, JSON.stringify(e) + os.EOL, 'utf8');
  return p;
}

module.exports = { logUsageEvent, usagePath };

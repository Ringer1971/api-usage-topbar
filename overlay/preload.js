const { contextBridge } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

function getUsagePath() {
  // Windows: %APPDATA%/ApiUsageTopbar/usage.jsonl
  const appdata = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  return path.join(appdata, 'ApiUsageTopbar', 'usage.jsonl');
}

function safeReadLines(filePath, maxBytes = 2_000_000) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const st = fs.statSync(filePath);
    const start = Math.max(0, st.size - maxBytes);
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(st.size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    fs.closeSync(fd);
    const txt = buf.toString('utf8');
    return txt.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

function parseEvents(lines) {
  const events = [];
  for (const line of lines) {
    try { events.push(JSON.parse(line)); } catch { /* ignore */ }
  }
  return events;
}

function startOfWeekLocal(tsMs) {
  const d = new Date(tsMs);
  // Monday 00:00 local
  const day = (d.getDay() + 6) % 7; // Mon=0
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(d.getDate() - day);
  return monday.getTime();
}

function aggregate(events, nowMs, sessionStartMs) {
  const weekStartMs = startOfWeekLocal(nowMs);

  const sum = (fromMs) => {
    let costUsd = 0;
    let inputTokens = 0;
    let outputTokens = 0;

    for (const e of events) {
      if (!e || typeof e.ts !== 'number') continue;
      if (e.ts < fromMs) continue;
      if (typeof e.costUsd === 'number') costUsd += e.costUsd;
      if (typeof e.inputTokens === 'number') inputTokens += e.inputTokens;
      if (typeof e.outputTokens === 'number') outputTokens += e.outputTokens;
    }

    return { costUsd, inputTokens, outputTokens };
  };

  return {
    session: sum(sessionStartMs),
    weekly: sum(weekStartMs),
    weekStartMs
  };
}

contextBridge.exposeInMainWorld('apiUsageTopbar', {
  getUsagePath,
  readAggregate: (sessionStartMs) => {
    const nowMs = Date.now();
    const lines = safeReadLines(getUsagePath());
    const events = parseEvents(lines);
    return aggregate(events, nowMs, sessionStartMs);
  }
});

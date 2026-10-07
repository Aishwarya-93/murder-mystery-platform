import { db } from './db.js';
import { EventRow, EventState } from './types.js';
import { loadEventConfig } from './config.js';
import { broadcastEventUpdate } from './sse.js';

export function getEventRow(): EventRow {
  return db.prepare('SELECT * FROM event WHERE id = 1').get() as EventRow;
}

export function getEventClock() {
  const row = getEventRow();
  const cfg = loadEventConfig();
  const totalDurationMinutes = cfg.event?.duration_minutes || 210;
  const totalDurationSeconds = totalDurationMinutes * 60;

  let elapsedSeconds = 0;
  const now = Date.now();

  if (row.state === 'RUNNING' && row.started_at) {
    const started = new Date(row.started_at).getTime();
    elapsedSeconds = Math.max(0, Math.floor((now - started - row.paused_total_ms) / 1000));
  } else if (row.state === 'PAUSED' && row.started_at && row.pause_started_at) {
    const started = new Date(row.started_at).getTime();
    const pausedAt = new Date(row.pause_started_at).getTime();
    elapsedSeconds = Math.max(0, Math.floor((pausedAt - started - row.paused_total_ms) / 1000));
  } else if (row.state === 'ENDED' && row.started_at && row.ended_at) {
    const started = new Date(row.started_at).getTime();
    const ended = new Date(row.ended_at).getTime();
    elapsedSeconds = Math.max(0, Math.floor((ended - started - row.paused_total_ms) / 1000));
  }

  const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);

  return {
    state: row.state,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    pausedTotalMs: row.paused_total_ms,
    banner: row.banner,
    totalDurationSeconds,
    elapsedSeconds,
    remainingSeconds,
    canSubmit: row.state === 'RUNNING'
  };
}

export function startEvent(): void {
  const row = getEventRow();
  if (row.state !== 'NOT_STARTED') {
    throw new Error(`Cannot start event in state: ${row.state}`);
  }
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE event
    SET state = 'RUNNING', started_at = ?, paused_total_ms = 0, pause_started_at = NULL, ended_at = NULL
    WHERE id = 1
  `).run(now);

  broadcastEventUpdate();
}

export function pauseEvent(): void {
  const row = getEventRow();
  if (row.state !== 'RUNNING') {
    throw new Error(`Cannot pause event in state: ${row.state}`);
  }
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE event
    SET state = 'PAUSED', pause_started_at = ?
    WHERE id = 1
  `).run(now);

  broadcastEventUpdate();
}

export function resumeEvent(): void {
  const row = getEventRow();
  if (row.state !== 'PAUSED') {
    throw new Error(`Cannot resume event in state: ${row.state}`);
  }
  const now = Date.now();
  const pauseStarted = row.pause_started_at ? new Date(row.pause_started_at).getTime() : now;
  const pauseDuration = Math.max(0, now - pauseStarted);
  const newPausedTotal = row.paused_total_ms + pauseDuration;

  db.prepare(`
    UPDATE event
    SET state = 'RUNNING', paused_total_ms = ?, pause_started_at = NULL
    WHERE id = 1
  `).run(newPausedTotal);

  broadcastEventUpdate();
}

export function endEvent(): void {
  const row = getEventRow();
  if (row.state === 'ENDED') return;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE event
    SET state = 'ENDED', ended_at = ?
    WHERE id = 1
  `).run(now);

  broadcastEventUpdate();
}

export function setEventBanner(banner: string | null): void {
  db.prepare('UPDATE event SET banner = ? WHERE id = 1').run(banner);
  broadcastEventUpdate();
}

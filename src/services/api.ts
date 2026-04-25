/**
 * Low-level helpers for simulated network I/O.
 * Swap implementations here when moving to real HTTP.
 */

const DEFAULT_MIN_MS = 300;
const DEFAULT_MAX_MS = 800;

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Random delay in [min, max] — mimics variable latency.
 */
export function randomDelay(
  minMs: number = DEFAULT_MIN_MS,
  maxMs: number = DEFAULT_MAX_MS,
): Promise<void> {
  const span = Math.max(0, maxMs - minMs);
  const ms = minMs + Math.floor(Math.random() * (span + 1));
  return delay(ms);
}

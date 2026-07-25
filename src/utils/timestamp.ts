// src/utils/timestamp.ts
/**
 * Converts SRT/VTT timestamp into seconds.
 *
 * Examples:
 * 00:01:30,500 -> 90.5
 * 00:01:30.500 -> 90.5
 */

export function timestampToSeconds(timestamp: string): number {
  const normalized = timestamp.replace(",", ".");

  const parts = normalized.split(":");

  if (parts.length !== 3) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }

  const [hours, minutes, seconds] = parts;

  return (
    Number(hours) * 3600 +
    Number(minutes) * 60 +
    Number(seconds)
  );
}

/**
 * Converts seconds into HH:MM:SS.mmm
 *
 * Example:
 * 90.5 -> 00:01:30.500
 */
export function secondsToTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const secs = (seconds % 60).toFixed(3);

  const [wholeSeconds, milliseconds] = secs.split(".");

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    wholeSeconds.padStart(2, "0") +
    "." +
    milliseconds
  );
}
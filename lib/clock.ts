// Single source of "now" for the whole app. Nothing outside this file may call Date.now().
// Lets the demo time-travel to chart preparation without touching every callsite.
let offsetMs = 0;

export function now(): number {
  return Date.now() + offsetMs;
}

export function setOffset(ms: number): void {
  offsetMs = ms;
}

export function resetOffset(): void {
  offsetMs = 0;
}

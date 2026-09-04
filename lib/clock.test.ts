import { describe, it, expect, afterEach } from "vitest";
import { now, setOffset, resetOffset, offsetTo } from "./clock";

describe("clock", () => {
  afterEach(() => resetOffset());

  it("applies and resets offsets", () => {
    const base = now();
    setOffset(60_000);
    expect(now()).toBeGreaterThanOrEqual(base + 60_000);
    resetOffset();
    expect(now() - base).toBeLessThan(1_000);
  });

  it("offsetTo lands on the target instant", () => {
    const target = Date.UTC(2026, 7, 30, 18, 0, 0);
    offsetTo(target);
    expect(Math.abs(now() - target)).toBeLessThan(50);
  });
});

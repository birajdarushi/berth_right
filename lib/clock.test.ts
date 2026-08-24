import { describe, it, expect, afterEach } from "vitest";
import { now, setOffset, resetOffset } from "./clock";

describe("clock", () => {
  afterEach(() => resetOffset());

  it("applies and resets offsets", () => {
    const base = now();
    setOffset(60_000);
    expect(now()).toBeGreaterThanOrEqual(base + 60_000);
    resetOffset();
    expect(now() - base).toBeLessThan(1_000);
  });
});

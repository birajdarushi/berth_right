/**
 * Playwright script for recording the Berth Right demo video.
 *
 * Usage:  npx tsx record-video.ts
 *
 * Desktop viewport (1280×720). Auto-records to ./recordings/
 * as .webm, then converts to .mp4 if ffmpeg is available.
 */

import { chromium } from "playwright";
import { execSync } from "child_process";
import { mkdirSync } from "fs";

const BASE = "https://berth-right.birajdar.in";
const TRAIN_ID = "900001";
const RECORD_DIR = "./recordings";

function pause(ms: number, label: string) {
  console.log(`⏸  ${label} — ${(ms / 1000).toFixed(1)}s`);
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  mkdirSync(RECORD_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: RECORD_DIR,
      size: { width: 1280, height: 720 },
    },
  });
  const page = await ctx.newPage();

  // ═══════════════════════════════════════════════
  // 0:00–0:12  COLD OPEN
  // ═══════════════════════════════════════════════
  console.log("\n🎬  0:00–0:12  Cold open");
  console.log("    → 'You're a woman travelling alone overnight…'");
  await page.goto(BASE, { waitUntil: "networkidle" });
  await pause(12_000, "Cold open");

  // ═══════════════════════════════════════════════
  // 0:12–0:22  SCALE
  // ═══════════════════════════════════════════════
  console.log("\n🎬  0:12–0:22  Scale");
  console.log("    → '3.39 crore tickets…'");
  await pause(10_000, "Scale");

  // ═══════════════════════════════════════════════
  // 0:22–1:00  SCREEN RECORDING
  // ═══════════════════════════════════════════════
  console.log("\n🎬  0:22–1:00  Screen recording\n");

  // — Preference (0:22–0:30) —
  console.log("  → /preference — state your preference before you pay");
  await page.goto(`${BASE}/preference?trainId=${TRAIN_ID}`, { waitUntil: "networkidle" });
  await pause(8_000, "Preference — trade-off disclosure");

  // — Fare (0:30–0:38) —
  console.log("  → /fare — full fare for half a berth");
  await page.goto(`${BASE}/fare?trainId=${TRAIN_ID}`, { waitUntil: "networkidle" });
  await pause(8_000, "Fare breakdown");

  // — Tracking (0:38–0:48) —
  console.log("  → /tracking — co-passenger gender + stations only");
  await page.goto(`${BASE}/tracking`, { waitUntil: "networkidle" });
  await pause(10_000, "Tracking — privacy floor");

  // — Chart outcome (0:48–0:55) —
  console.log("  → /chart-outcome — the outcome arrives");
  await page.goto(`${BASE}/demo`, { waitUntil: "networkidle" });
  await page.evaluate(async (trainId) => {
    const raw = sessionStorage.getItem("berth-right-demo-state");
    const state = raw ? JSON.parse(raw) : {};
    if (!state.booking) {
      state.booking = {
        pnr: "DEMO-900001-001",
        train: {
          number: trainId,
          name: "Nilgiri Express",
          from: "NDLS",
          to: "BCT",
          departure: "2026-08-30T22:51:00.000Z",
          arrival: "2026-08-31T11:51:00.000Z",
          isOvernight: true,
          classes: ["SL", "3A"],
        },
        passengers: [
          { id: "p1", displayName: "Priya S.", gender: "female", age: 28, isMinor: false, travellingAlone: true },
        ],
        status: "RAC",
        racPosition: 3,
        fare: { baseFare: 485, gst: 0, clerkage: 0, totalFare: 485, refundablePortion: 243 },
        createdAt: "2026-08-28T10:00:00.000Z",
      };
    }
    const res = await fetch("/api/chart/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking: state.booking, seed: "rac_unmet" }),
    });
    const outcome = await res.json();
    state.chartOutcome = outcome;
    state.booking.status = outcome.status;
    sessionStorage.setItem("berth-right-demo-state", JSON.stringify(state));
  }, TRAIN_ID);
  await page.goto(`${BASE}/chart-outcome`, { waitUntil: "networkidle" });
  await pause(7_000, "Chart outcome — 'You don't go looking for it'");

  // — Entitlement (0:55–1:00) —
  console.log("  → /entitlement — ₹350, no fee, direct to bank");
  await page.goto(`${BASE}/entitlement`, { waitUntil: "networkidle" });
  await pause(5_000, "Entitlement");

  // ═══════════════════════════════════════════════
  // 1:00–1:50  HOW AND WHY
  // ═══════════════════════════════════════════════
  console.log("\n🎬  1:00–1:50  How and why (stay on entitlement)");
  console.log("    → 1. Nobody built this — CRIS owns allocation");
  console.log("    → 2. Solver, not model");
  console.log("    → 3. Rules as data");
  console.log("    → 4. What's mocked");
  await pause(50_000, "How and why narration");

  // ═══════════════════════════════════════════════
  // 1:50–1:55  CLOSE
  // ═══════════════════════════════════════════════
  console.log("\n🎬  1:50–1:55  Close");
  console.log("    → 'Berth Right. One rule the reservation system doesn't have yet.'");
  await pause(5_000, "Close");

  // ═══════════════════════════════════════════════
  // Save video
  // ═══════════════════════════════════════════════
  const video = page.video();
  const videoPath = video ? await video.path() : "";
  console.log(`\n📹  Video saved: ${videoPath}`);

  // Close browser to finalize the video file
  await ctx.close();
  await browser.close();

  // Try converting to mp4
  if (videoPath) {
    const mp4Path = videoPath.replace(".webm", ".mp4");
    try {
      console.log("🔄  Converting to mp4...");
      execSync(`ffmpeg -y -i "${videoPath}" -c:v libx264 -crf 23 -preset fast "${mp4Path}"`, {
        stdio: "inherit",
      });
      console.log(`✅  MP4 saved: ${mp4Path}`);
    } catch {
      console.log("⚠️  ffmpeg not available or conversion failed. WebM file is your recording.");
    }
  }

  console.log("\n✅  Done — ~2:00 recording complete.");
})();

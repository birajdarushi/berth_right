"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pairNaive, pairRacQueue } from "@/lib/pairing";
import type { BerthId, Gender, RacEntry } from "@/lib/types";
import ExplainBlock from "@/components/ExplainBlock";
import { useI18n } from "@/lib/i18n/context";

const GENDER_COLOR: Record<Gender, string> = {
  female: "#db2777", // pink-600
  male: "#2563eb", // blue-600
  transgender: "#7c3aed", // violet-600
};
const GENDER_LETTER: Record<Gender, string> = { female: "F", male: "M", transgender: "T" };

const TOP_PAD = 36;
const ROW_H = 32;
const CHIP_R = 10;
const LEFT_X = 24;

const RIGHT_X = 224;
const BERTH_W = 102;
const BERTH_H = 34;
const BERTH_GAP = 8;
const BERTH_ROW_H = BERTH_H + BERTH_GAP;

type Mode = "naive" | "solver";

interface Row {
  entry: RacEntry;
  isSelf: boolean;
  y: number;
}

interface TargetSlot {
  x: number;
  y: number;
  berthIndex: number | null;
  slotIndex: number;
  isMixed: boolean;
  isUnpaired: boolean;
}

export default function QueueVisualization({
  queue,
  berthIds,
  selfPassengerId,
}: {
  queue: RacEntry[];
  berthIds: BerthId[];
  selfPassengerId: string;
}) {
  const [mode, setMode] = useState<Mode>("naive");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { lang } = useI18n();

  // Storm mode: a scripted, deterministic staged reveal of the same seed queue — not
  // live concurrency. Chips arrive in queue-position order at a fixed interval, giving
  // a "booking rush" feel without simulating real network traffic (SPEC.md §3: no live
  // system contact, deterministic solver only).
  const [revealCount, setRevealCount] = useState(Infinity);
  const [storming, setStorming] = useState(false);
  const stormTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (stormTimer.current) clearTimeout(stormTimer.current);
  }, []);

  const naive = useMemo(() => pairNaive(queue, berthIds), [queue, berthIds]);
  const solver = useMemo(() => pairRacQueue(queue, berthIds), [queue, berthIds]);

  // Fixed left-column rows in sorted queue order
  const rows: Row[] = useMemo(() => {
    return [...queue]
      .sort((a, b) => a.position - b.position)
      .map((entry, index) => ({
        entry,
        isSelf: entry.passenger.id === selfPassengerId,
        y: TOP_PAD + index * ROW_H + ROW_H / 2,
      }));
  }, [queue, selfPassengerId]);

  const revealedIds = useMemo(
    () => new Set(rows.slice(0, revealCount).map((r) => r.entry.passenger.id)),
    [rows, revealCount]
  );
  const isRevealed = (id: string) => revealedIds.has(id);

  // Passenger id -> partner's id, for the active mode's pairings — used to withhold the
  // "mixed" curve colour until both occupants of a berth have visually arrived.
  const partnerOf = useMemo(() => {
    const activeResultForPartners = mode === "naive" ? naive : solver;
    const map = new Map<string, string | undefined>();
    activeResultForPartners.pairings.forEach((p) => {
      const [a, b] = p.occupants;
      if (a) map.set(a.passenger.id, b?.passenger.id);
      if (b) map.set(b.passenger.id, a.passenger.id);
    });
    return map;
  }, [mode, naive, solver]);

  const runStorm = () => {
    if (stormTimer.current) clearTimeout(stormTimer.current);
    setMode("naive");
    setRevealCount(0);
    setStorming(true);
    let i = 0;
    const tick = () => {
      i += 1;
      setRevealCount(i);
      if (i < rows.length) {
        stormTimer.current = setTimeout(tick, 70);
      } else {
        setStorming(false);
      }
    };
    stormTimer.current = setTimeout(tick, 70);
  };

  // Compute exact target coordinates for each passenger in both modes
  const targets = useMemo(() => {
    const computeFor = (result: ReturnType<typeof pairRacQueue>) => {
      const map = new Map<string, TargetSlot>();

      result.pairings.forEach((p, bIdx) => {
        const yBerth = TOP_PAD + bIdx * BERTH_ROW_H + BERTH_H / 2;
        const [a, b] = p.occupants;
        const isMixed = Boolean(a && b && a.passenger.gender !== b.passenger.gender);

        if (a) {
          map.set(a.passenger.id, {
            x: RIGHT_X + 26,
            y: yBerth,
            berthIndex: bIdx,
            slotIndex: 0,
            isMixed,
            isUnpaired: false,
          });
        }
        if (b) {
          map.set(b.passenger.id, {
            x: RIGHT_X + 76,
            y: yBerth,
            berthIndex: bIdx,
            slotIndex: 1,
            isMixed,
            isUnpaired: false,
          });
        }
      });

      const unpairedHeaderY = TOP_PAD + result.pairings.length * BERTH_ROW_H + 24;
      const unpairedStartY = unpairedHeaderY + 16;
      result.unpaired.forEach((u, uIdx) => {
        const yUnpaired = unpairedStartY + uIdx * (BERTH_H + 6) + BERTH_H / 2;
        map.set(u.passenger.id, {
          x: RIGHT_X + BERTH_W / 2,
          y: yUnpaired,
          berthIndex: null,
          slotIndex: 0,
          isMixed: false,
          isUnpaired: true,
        });
      });

      return { map, unpairedHeaderY };
    };

    return {
      naive: computeFor(naive),
      solver: computeFor(solver),
    };
  }, [naive, solver]);

  const activeResult = mode === "naive" ? naive : solver;
  const activeTargets = targets[mode].map;
  const activeUnpairedHeaderY = targets[mode].unpairedHeaderY;

  // Calculate SVG total height ensuring NO clipping of left or right elements
  const leftTotalH = TOP_PAD + rows.length * ROW_H + 24;
  const rightTotalH =
    TOP_PAD +
    activeResult.pairings.length * BERTH_ROW_H +
    (activeResult.unpaired.length > 0 ? 36 + activeResult.unpaired.length * (BERTH_H + 6) : 0) +
    24;
  const svgHeight = Math.max(leftTotalH, rightTotalH, 320);

  const mixedPairingsCount = activeResult.pairings.filter((p) => {
    const [a, b] = p.occupants;
    return a && b && a.passenger.gender !== b.passenger.gender;
  }).length;

  // Hard same_gender_only constraint is never broken by the solver, but a mixed pairing
  // can still occur for no_preference / unmatched prefer_same_gender entries (SPEC.md
  // §6.1-6.2) — so this can be >0. Track it separately from "hard constraint violated".
  const solverMixedCount = solver.pairings.filter((p) => {
    const [a, b] = p.occupants;
    return a && b && a.passenger.gender !== b.passenger.gender;
  }).length;
  const solverHardViolations = solver.pairings.filter((p) => {
    const [a, b] = p.occupants;
    return a && b && a.preference === "same_gender_only" && a.passenger.gender !== b.passenger.gender;
  }).length;

  const self = queue.find((e) => e.passenger.id === selfPassengerId);
  const selfSolverTarget = targets.solver.map.get(selfPassengerId);
  const selfNaiveTarget = targets.naive.map.get(selfPassengerId);
  const queuePositionsMoved = Math.max(
    0,
    (selfSolverTarget ? Math.round((selfSolverTarget.y - TOP_PAD) / ROW_H) : 0) -
      (selfNaiveTarget ? Math.round((selfNaiveTarget.y - TOP_PAD) / ROW_H) : 0)
  );
  const unmetCount = solver.unpaired.length;

  const isSelfMixedNaive = useMemo(() => {
    const p = naive.pairings.find((p) => p.occupants.some((o) => o?.passenger.id === selfPassengerId));
    if (!p) return false;
    const [a, b] = p.occupants;
    return Boolean(a && b && a.passenger.gender !== b.passenger.gender);
  }, [naive.pairings, selfPassengerId]);

  return (
    <div className="flex flex-col gap-3">
      {/* Storm mode trigger */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={runStorm}
          disabled={storming}
          className="min-h-9 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/10 disabled:opacity-60"
        >
          {storming
            ? lang === "hi"
              ? "बुकिंग आ रही हैं…"
              : lang === "mr"
              ? "बुकिंग येत आहेत…"
              : "Bookings arriving…"
            : lang === "hi"
            ? "▶ बुकिंग की भीड़ अनुकरण करें"
            : lang === "mr"
            ? "▶ बुकिंग गर्दीचे अनुकरण करा"
            : "▶ Simulate a booking rush"}
        </button>
        <p className="text-[10px] text-muted-foreground">
          {lang === "hi"
            ? "अनुकरणित बुकिंग मात्रा, वास्तविक ट्रैफ़िक नहीं — यह भार के तहत पेयरिंग लॉजिक दिखाता है, इन्फ्रास्ट्रक्चर नहीं।"
            : lang === "mr"
            ? "अनुकरणित बुकिंग प्रमाण, प्रत्यक्ष रहदारी नाही — हे भाराखाली पेअरिंग लॉजिक दाखवते, इन्फ्रास्ट्रक्चर नाही."
            : "Simulated booking volume, not live traffic — demonstrates the pairing logic under load, not the infrastructure."}
        </p>
      </div>

      {/* Mode Selection Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("naive")}
          disabled={storming}
          className={`min-h-10 flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-2xs disabled:opacity-60 ${
            mode === "naive"
              ? "border-rose-500 bg-rose-50/90 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-700 font-semibold"
              : "border-border bg-card/60 text-muted-foreground hover:bg-accent/40"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span>{lang === "hi" ? "वर्तमान प्रणाली" : lang === "mr" ? "सध्याची पद्धत" : "Today's system"}</span>
            <span className="rounded-full bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-700 dark:text-rose-300 font-mono font-medium">
              {naive.pairings.filter((p) => p.occupants[0] && p.occupants[1] && p.occupants[0].passenger.gender !== p.occupants[1].passenger.gender).length}{" "}
              {lang === "hi" ? "मिश्रित" : lang === "mr" ? "मिश्र" : "mixed"}
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMode("solver")}
          disabled={storming}
          className={`min-h-10 flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-2xs disabled:opacity-60 ${
            mode === "solver"
              ? "border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-semibold"
              : "border-border bg-card/60 text-muted-foreground hover:bg-accent/40"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span>{lang === "hi" ? "बर्थ राइट सॉल्वर" : lang === "mr" ? "बर्थ राइट सॉल्व्हर" : "Berth Right"}</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-mono font-medium">
              {solverMixedCount} {lang === "hi" ? "मिश्रित" : lang === "mr" ? "मिश्र" : "mixed"}
            </span>
          </div>
        </button>
      </div>

      {/* SVG Canvas Container */}
      {/* max-w keeps the diagram at its designed (mobile) scale instead of stretching
          to the full container width on desktop, which used to blow up its height by
          the same ratio and force an internal scrollbar mid-animation. */}
      <div className="mx-auto w-full max-w-[440px] overflow-x-auto rounded-xl border border-border/80 bg-card/50 p-2.5 shadow-2xs backdrop-blur-xs max-h-[640px] overflow-y-auto">
        <svg
          viewBox={`0 0 350 ${svgHeight}`}
          width="100%"
          style={{ height: "auto", minHeight: Math.min(svgHeight, 380) }}
          role="img"
          aria-label="RAC queue pairing diagram"
          className="select-none"
        >
          {/* Column Headers */}
          <text x={LEFT_X} y={18} fontSize={10} fontWeight={600} className="fill-muted-foreground uppercase tracking-wider">
            {lang === "hi" ? "आरएसी कतार" : lang === "mr" ? "आरएसी रांग" : "RAC Queue"}
          </text>
          <text x={RIGHT_X + BERTH_W / 2} y={18} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-muted-foreground uppercase tracking-wider">
            {lang === "hi" ? "साइड-लोअर बर्थ" : lang === "mr" ? "साइड-लोअर बर्थ" : "Side-Lower Berths"}
          </text>

          {/* Connecting Curves (Bézier paths) */}
          {rows.map(({ entry, y: yLeft }) => {
            const target = activeTargets.get(entry.passenger.id);
            if (!target || !isRevealed(entry.passenger.id)) return null;

            const isSelf = entry.passenger.id === selfPassengerId;
            const isHovered = hoveredId === entry.passenger.id;
            const x1 = LEFT_X + 46; // start cleanly to the right of `#12` / `You`
            const y1 = yLeft;
            const x2 = target.x - (target.isUnpaired ? 12 : 11);
            const y2 = target.y;

            const dx = x2 - x1;
            const cx1 = x1 + dx * 0.45;
            const cx2 = x1 + dx * 0.55;
            const pathData = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;

            let stroke = "#94a3b8";
            let strokeWidth = 1.4;
            let opacity = 0.45;
            let strokeDasharray = undefined;

            const partnerId = partnerOf.get(entry.passenger.id);
            const showMixed = target.isMixed && (!partnerId || isRevealed(partnerId));

            if (showMixed) {
              stroke = "#f43f5e"; // rose-500
              strokeWidth = isSelf ? 2.8 : 2;
              opacity = isSelf ? 1 : 0.85;
            } else if (target.isUnpaired) {
              stroke = "#8b5cf6"; // purple-500
              strokeWidth = 1.6;
              strokeDasharray = "3 3";
              opacity = 0.75;
            } else if (isSelf) {
              stroke = "#2563eb"; // blue-600
              strokeWidth = 2.8;
              opacity = 1;
            }

            if (isHovered) {
              strokeWidth = Math.max(strokeWidth + 1.2, 3);
              opacity = 1;
            }

            return (
              <path
                key={`curve-${entry.passenger.id}`}
                d={pathData}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                opacity={opacity}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Right Column: Berth Container Boxes */}
          {activeResult.pairings.map((p, bIdx) => {
            const yBerth = TOP_PAD + bIdx * BERTH_ROW_H;
            const [a, b] = p.occupants;
            const isMixed = Boolean(a && b && a.passenger.gender !== b.passenger.gender);
            // During storm mode, don't flag a berth mixed until both occupants have
            // visually arrived — avoids the warning appearing before the chips do.
            const bothRevealed = (!a || isRevealed(a.passenger.id)) && (!b || isRevealed(b.passenger.id));
            const showMixed = isMixed && bothRevealed;

            return (
              <g key={`berth-card-${bIdx}`}>
                {/* Berth outer rounded container */}
                <rect
                  x={RIGHT_X}
                  y={yBerth}
                  width={BERTH_W}
                  height={BERTH_H}
                  rx={6}
                  fill={showMixed ? "rgba(244, 63, 94, 0.08)" : "rgba(255, 255, 255, 0.65)"}
                  stroke={showMixed ? "#f43f5e" : "#cbd5e1"}
                  strokeWidth={showMixed ? 1.4 : 1}
                  className="transition-all duration-300"
                />

                {/* Berth Label */}
                <text
                  x={RIGHT_X + BERTH_W / 2}
                  y={yBerth + 8.5}
                  textAnchor="middle"
                  fontSize={7}
                  fontWeight={700}
                  fill={showMixed ? "#be123c" : "#64748b"}
                  className="tracking-tight uppercase"
                >
                  {showMixed ? "⚠️ MIXED" : `BERTH ${bIdx + 1}`}
                </text>

                {/* Slot 1 Outline / Placeholder */}
                <circle
                  cx={RIGHT_X + 26}
                  cy={yBerth + BERTH_H / 2 + 1}
                  r={CHIP_R - 1}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />

                {/* Slot 2 Outline / Placeholder */}
                <circle
                  cx={RIGHT_X + 76}
                  cy={yBerth + BERTH_H / 2 + 1}
                  r={CHIP_R - 1}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
              </g>
            );
          })}

          {/* Right Column: Unpaired Section (if any) */}
          {activeResult.unpaired.length > 0 && (
            <g>
              <text
                x={RIGHT_X + BERTH_W / 2}
                y={activeUnpairedHeaderY + 8}
                textAnchor="middle"
                fontSize={8.5}
                fontWeight={600}
                fill="#7c3aed"
                className="uppercase tracking-wider"
              >
                {lang === "hi" ? "अविभाजित / अकेला" : lang === "mr" ? "एकटा प्रवासी" : "Unpaired / Solo"}
              </text>
              {activeResult.unpaired.map((u, uIdx) => {
                const yUnpaired = activeUnpairedHeaderY + 16 + uIdx * (BERTH_H + 6);
                return (
                  <rect
                    key={`unpaired-box-${u.passenger.id}`}
                    x={RIGHT_X + 18}
                    y={yUnpaired}
                    width={BERTH_W - 36}
                    height={BERTH_H}
                    rx={6}
                    fill="rgba(124, 58, 237, 0.06)"
                    stroke="#a78bfa"
                    strokeWidth={1}
                    strokeDasharray="3 2"
                  />
                );
              })}
            </g>
          )}

          {/* Left Column: Queue Passenger Nodes */}
          {rows.map(({ entry, isSelf, y }) => {
            if (!isRevealed(entry.passenger.id)) return null;
            const isHovered = hoveredId === entry.passenger.id;
            return (
              <g
                key={`left-node-${entry.passenger.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(entry.passenger.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Highlight ring if Self or Hovered */}
                {(isSelf || isHovered) && (
                  <circle
                    cx={LEFT_X}
                    cy={y}
                    r={CHIP_R + 3}
                    fill="none"
                    stroke={isSelf ? "#2563eb" : "#0f172a"}
                    strokeWidth={1.8}
                    opacity={0.8}
                  />
                )}

                {/* Main gender avatar circle */}
                <circle
                  cx={LEFT_X}
                  cy={y}
                  r={CHIP_R}
                  fill={GENDER_COLOR[entry.passenger.gender]}
                />
                <text
                  x={LEFT_X}
                  y={y + 3.2}
                  textAnchor="middle"
                  fontSize={9}
                  fill="white"
                  fontWeight={700}
                >
                  {GENDER_LETTER[entry.passenger.gender]}
                </text>

                {/* Passenger Position / Self Label */}
                <text
                  x={LEFT_X + CHIP_R + 5}
                  y={y + 3.2}
                  fontSize={9}
                  fontWeight={isSelf ? 700 : 500}
                  className={isSelf ? "fill-primary font-bold" : "fill-foreground"}
                >
                  {isSelf ? (lang === "hi" ? "आप" : lang === "mr" ? "तुम्ही" : "You") : `#${entry.position}`}
                </text>
              </g>
            );
          })}

          {/* Right Column: Occupant Chips in Berth / Solo Slots */}
          {rows.map(({ entry, isSelf }) => {
            const target = activeTargets.get(entry.passenger.id);
            if (!target || !isRevealed(entry.passenger.id)) return null;

            const isHovered = hoveredId === entry.passenger.id;
            const slotY = target.isUnpaired ? target.y : target.y + 1;

            return (
              <g
                key={`right-slot-${entry.passenger.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(entry.passenger.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Highlight ring for slot if Self or Hovered */}
                {(isSelf || isHovered) && (
                  <circle
                    cx={target.x}
                    cy={slotY}
                    r={CHIP_R + 2.5}
                    fill="none"
                    stroke={isSelf ? "#2563eb" : "#0f172a"}
                    strokeWidth={1.6}
                    opacity={0.8}
                  />
                )}

                {/* Occupant Circle */}
                <circle
                  cx={target.x}
                  cy={slotY}
                  r={CHIP_R - 1.5}
                  fill={GENDER_COLOR[entry.passenger.gender]}
                  className="transition-all duration-300"
                />

                {/* Gender letter inside occupant chip */}
                <text
                  x={target.x}
                  y={slotY + 3}
                  textAnchor="middle"
                  fontSize={8}
                  fill="white"
                  fontWeight={700}
                >
                  {GENDER_LETTER[entry.passenger.gender]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Analysis text */}
      <div className="rounded-lg bg-muted/40 p-3 text-xs sm:text-sm leading-relaxed border border-border/50">
        {mode === "naive" ? (
          <>
            <p className="font-semibold text-rose-700 dark:text-rose-300 mb-1">
              {lang === "hi"
                ? `वर्तमान प्रणाली: ${mixedPairingsCount} मिश्रित-लिंग जोड़ियां बनाई गईं`
                : lang === "mr"
                ? `सध्याची पद्धत: ${mixedPairingsCount} मिश्र-लिंग जोड्या तयार झाल्या`
                : `Today's system: ${mixedPairingsCount} mixed-gender pairings created`}
            </p>
            <p className="text-foreground/80">
              {lang === "hi"
                ? "यात्रियों को बिना लिंग पूछे केवल कतार क्रम में जोड़ा जाता है। अकेले यात्रा करने वाली महिला को अनजान पुरुष के साथ बर्थ साझा करनी पड़ती है।"
                : lang === "mr"
                ? "प्रवाशांना लिंग न विचारता फक्त रांगेनुसार एकत्र केले जाते. एकट्या प्रवास करणाऱ्या महिलेला अनोळखी पुरुषासोबत बर्थ शेअर करावी लागते."
                : "Passengers are paired strictly by booking queue order without considering gender, forcing solo female travellers to share berths with male strangers."}
              {isSelfMixedNaive && self && (
                <span className="mt-1.5 block font-semibold text-rose-600 dark:text-rose-400">
                  {lang === "hi"
                    ? "⚠️ इस आवंटन में आपको एक विपरीत-लिंग के अजनबी के साथ रखा जाएगा।"
                    : lang === "mr"
                    ? "⚠️ या वाटपात आपल्याला एका विरुद्ध-लिंगी अनोळखी व्यक्तीसोबत बसवले जाईल."
                    : "⚠️ Under this system, you are paired with an opposite-gender stranger."}
                </span>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              {lang === "hi"
                ? `बर्थ राइट: ${solverHardViolations} समान-लिंग-केवल उल्लंघन — यह कठोर शर्त कभी नहीं टूटती`
                : lang === "mr"
                ? `बर्थ राइट: ${solverHardViolations} समान-लिंग-फक्त उल्लंघन — ही कठोर अट कधीही मोडली जात नाही`
                : `Berth Right: ${solverHardViolations} same-gender-only violations — that hard constraint is never broken`}
            </p>
            <p className="text-foreground/80">
              {lang === "hi"
                ? `केवल जिन्होंने समान-लिंग-केवल चुना, उनके लिए यह कभी नहीं टूटता। ${solverMixedCount} मिश्रित जोड़ी अब भी बनती हैं जहां किसी ने वरीयता नहीं मांगी — यह छुपाया नहीं गया। लागत: आप ${queuePositionsMoved} स्थान आगे-पीछे हुए, और ${unmetCount} यात्री अकेले सुरक्षित यात्रा करते हैं।`
                : lang === "mr"
                ? `ज्यांनी समान-लिंग-फक्त निवडले त्यांच्यासाठी ही अट कधीही मोडली जात नाही. ${solverMixedCount} मिश्र जोड्या अजूनही तयार होतात जिथे कोणी पसंती मागितली नव्हती — हे लपवलेले नाही. किंमत: आपण ${queuePositionsMoved} जागा हललात, आणि ${unmetCount} प्रवासी सुरक्षितपणे एकटे प्रवास करतात.`
                : `Never broken for anyone who asked for it. ${solverMixedCount} mixed pairing(s) still occur where no preference was requested — shown, not hidden. Cost: you shifted ${queuePositionsMoved} position(s), and ${unmetCount} passenger(s) travel solo/unpaired awaiting full berth.`}
            </p>
          </>
        )}
      </div>

      <ExplainBlock
        topic="pairing"
        context={
          mode === "naive"
            ? "Today's system pairs RAC passengers strictly by queue order with no gender input, so mixed-gender pairings happen routinely."
            : `Berth Right's deterministic solver never breaks a same-gender-only preference. In this run: ${queuePositionsMoved} queue positions of cost, ${unmetCount} passengers left unpaired.`
        }
      />
    </div>
  );
}

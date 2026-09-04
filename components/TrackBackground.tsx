// Decorative railway-track motif behind the whole app: a few gently curved
// "routes", each a rail pair with a dashed centerline standing in for
// sleepers. Fixed to the viewport, very low opacity, purely decorative.
// ponytail: rails are hand-tuned parallel-ish bezier pairs, not a true offset
// curve — precise path-offset math isn't worth it for a background flourish.
export default function TrackBackground() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full text-border"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55">
        <path d="M-100,120 C 300,60 600,220 1000,140 S 1500,40 1600,90" />
        <path d="M-100,132 C 300,72 600,232 1000,152 S 1500,52 1600,102" />
        <path
          d="M-100,126 C 300,66 600,226 1000,146 S 1500,46 1600,96"
          strokeDasharray="3 14"
          opacity="0.7"
        />

        <path d="M-100,520 C 250,600 650,420 1050,540 S 1500,640 1600,580" />
        <path d="M-100,534 C 250,614 650,434 1050,554 S 1500,654 1600,594" />
        <path
          d="M-100,527 C 250,607 650,427 1050,547 S 1500,647 1600,587"
          strokeDasharray="3 14"
          opacity="0.7"
        />

        <path d="M-100,830 C 350,760 700,900 1150,800 S 1500,760 1600,800" />
        <path d="M-100,844 C 350,774 700,914 1150,814 S 1500,774 1600,814" />
        <path
          d="M-100,837 C 350,767 700,907 1150,807 S 1500,767 1600,807"
          strokeDasharray="3 14"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

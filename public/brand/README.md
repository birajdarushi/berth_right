# Brand assets for Claude (drop-in)

Files live at `/public/brand/`. Use as `/brand/<file>` in Next.js.

Matched to the `Berth_Right_All_UI_Screens` mockups: navy rounded-square mark, two seated figures, royal-blue UI, sleeper-coach illustration.

## Files

| File | Use |
|---|---|
| `logo-mark-tight.png` | **Use this in the header** (32px). Navy tile fills the frame. Typeset "Berth Right" in CSS next to it. |
| `logo-mark.png` | Same mark with extra padding. Prefer the tight file in the nav. |
| `wordmark.png` | Optional export. Text reads **B-e-r-t-h R-i-g-h-t**. Prefer CSS type in the live header. |
| `app-icon-512.png` / `app-icon-192.png` / `favicon-32.png` | PWA / favicon. Replace `app/favicon.ico`. |
| `illustration-sleeper-day.png` | RAC Explained — “Sharing a side-lower berth” (day / sitting). |
| `illustration-sleeper-night.png` | Same coach, night / sleeping. Pair with the Day / Night chips. |
| `illustration-train-card.png` | **Use this** on the search card (compact train, fills the slot). |
| `illustration-train.png` | Wider train + hills. Prefer `-card` in the search form. |
| `og-sleeper.png` | 1200×630 Open Graph. |
| `avatar-female.png` / `avatar-male.png` / `avatar-neutral.png` | Gender-only silhouettes, **no faces, no names**. |

## How to wire

```tsx
import Image from "next/image";

// Header
<Image src="/brand/logo-mark.png" alt="" width={32} height={32} />
<span>Berth Right</span>

// RAC Explained
<Image src="/brand/illustration-sleeper-day.png" alt="Two passengers sharing a side-lower berth by day" />
<Image src="/brand/illustration-sleeper-night.png" alt="Two passengers sharing a side-lower berth at night" />

// Search card
<Image src="/brand/illustration-train.png" alt="" />
```

Metadata:

```ts
icons: { icon: "/brand/favicon-32.png", apple: "/brand/app-icon-192.png" },
openGraph: { images: ["/brand/og-sleeper.png"] },
```

## Spec reminders while dropping these in

- Co-passenger card: **gender + boarding/alighting only**. Do not show name, age, or a portrait. Use the silhouette avatars.
- Train numbers in seed are `900001+`, not real numbers like 12124.
- No government logos. This mark is civic, not official.

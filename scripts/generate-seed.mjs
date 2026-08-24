// Deterministic seed data generator for /lib/seed. Run: node scripts/generate-seed.mjs
// Kept in the repo so the synthetic data is auditable and reproducible, not hand-edited.
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "lib", "seed");

// mulberry32 seeded PRNG — deterministic across runs.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(42);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const weightedPick = (weights) => {
  const r = rng();
  let acc = 0;
  for (const [value, w] of weights) {
    acc += w;
    if (r <= acc) return value;
  }
  return weights[weights.length - 1][0];
};
const randInt = (min, max) => min + Math.floor(rng() * (max - min + 1));

// §5: three fixed routes only.
const ROUTES = [
  { from: "NDLS", to: "BCT", fromName: "New Delhi", toName: "Mumbai Central" },
  { from: "HWH", to: "MAS", fromName: "Howrah", toName: "Chennai Central" },
  { from: "SBC", to: "PUNE", fromName: "Bengaluru", toName: "Pune" },
];

const TRAIN_ADJECTIVES = ["Sahyadri", "Godavari", "Konkan", "Deccan", "Malwa", "Nilgiri", "Vindhya", "Saurashtra"];

// Gender draw at ~32% female / 66% male / 2% transgender — deliberately skewed per spec §5.
const drawGender = () =>
  weightedPick([
    ["female", 0.32],
    ["male", 0.66],
    ["transgender", 0.02],
  ]);

// Preference weighted toward same_gender_only for female entries, per spec §5.
const PREFERENCE_WEIGHTS = {
  female: [
    ["same_gender_only", 0.5],
    ["prefer_same_gender", 0.3],
    ["no_preference", 0.15],
    ["companion", 0.05],
  ],
  male: [
    ["no_preference", 0.6],
    ["companion", 0.2],
    ["prefer_same_gender", 0.15],
    ["same_gender_only", 0.05],
  ],
  transgender: [
    ["same_gender_only", 0.4],
    ["prefer_same_gender", 0.3],
    ["no_preference", 0.2],
    ["companion", 0.1],
  ],
};
const drawPreference = (gender) => weightedPick(PREFERENCE_WEIGHTS[gender]);

const trains = [];
const coachesByTrain = {};
const racQueuesByTrain = {};

for (let i = 0; i < 8; i++) {
  const route = ROUTES[i % ROUTES.length];
  const number = String(900001 + i); // 6 digits: visibly synthetic, no collision with real 5-digit numbers
  const isOvernight = i < 5; // first 5 trains overnight, satisfies "5+ overnight"
  const departureHour = isOvernight ? randInt(19, 23) : randInt(6, 11);
  const durationHours = isOvernight ? randInt(10, 16) : randInt(4, 9);
  const departure = new Date(Date.UTC(2026, 7, 30, departureHour, randInt(0, 59)));
  const arrival = new Date(departure.getTime() + durationHours * 3600_000);

  const train = {
    number,
    name: `${pick(TRAIN_ADJECTIVES)} Express`,
    from: route.from,
    to: route.to,
    departure: departure.toISOString(),
    arrival: arrival.toISOString(),
    isOvernight,
    classes: ["SL", "3A"],
  };
  trains.push(train);

  const coaches = [1, 2, 3].map((n) => ({
    id: `${number}-S${n}`,
    class: "SL",
    sideLowerBerths: Array.from({ length: 9 }, (_, b) => `${number}-S${n}-SL${b + 1}`),
    fullBerths: Array.from({ length: 63 }, (_, b) => `${number}-S${n}-B${b + 1}`),
  }));
  coachesByTrain[number] = coaches;

  const queueSize = randInt(12, 30);
  const racQueue = Array.from({ length: queueSize }, (_, idx) => {
    const gender = drawGender();
    const age = weightedPick([
      [randInt(4, 17), 0.08],
      [randInt(18, 70), 0.92],
    ]);
    const isMinor = age < 18;
    const passenger = {
      id: `${number}-P${idx + 1}`,
      displayName: `Demo Traveller ${gender[0].toUpperCase()}${idx + 1}`,
      gender,
      age,
      isMinor,
      travellingAlone: isMinor ? rng() < 0.1 : rng() < 0.55,
    };
    return {
      position: idx + 1,
      passenger,
      preference: drawPreference(gender),
      boardingStation: route.from,
      alightingStation: route.to,
      bookedAt: new Date(departure.getTime() - randInt(1, 20) * 86_400_000).toISOString(),
    };
  });
  racQueuesByTrain[number] = racQueue;
}

writeFileSync(join(OUT, "stations.json"), JSON.stringify(ROUTES, null, 2) + "\n");
writeFileSync(join(OUT, "trains.json"), JSON.stringify(trains, null, 2) + "\n");
writeFileSync(join(OUT, "coaches.json"), JSON.stringify(coachesByTrain, null, 2) + "\n");
writeFileSync(join(OUT, "rac-queues.json"), JSON.stringify(racQueuesByTrain, null, 2) + "\n");

console.log(`Wrote seed data for ${trains.length} trains to ${OUT}`);

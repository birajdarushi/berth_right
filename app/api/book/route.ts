import { NextRequest, NextResponse } from "next/server";
import { SEED_TRAINS, SEED_RAC_QUEUES } from "@/lib/seed";
import { BASE_FARE_BY_CLASS, RAC_ENTITLEMENT_REFUND_RATIO } from "@/lib/fare-rules";
import { now } from "@/lib/clock";
import type { Booking, Passenger, SharingPreference } from "@/lib/types";

function syntheticPnr(): string {
  const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
  return `BR-${digits}`;
}

// POST /book { trainId, passengers, preference } -> Booking with synthetic PNR
// All demo bookings land in RAC — that's the journey this prototype demonstrates.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    trainId: string;
    passengers: Passenger[];
    preference: SharingPreference;
  };

  const train = SEED_TRAINS.find((t) => t.number === body.trainId);
  if (!train) {
    return NextResponse.json({ error: "Unknown train" }, { status: 404 });
  }

  const queue = SEED_RAC_QUEUES[body.trainId] ?? [];
  const racPosition = queue.length + body.passengers.length;
  const baseFare = BASE_FARE_BY_CLASS[train.classes[0]] ?? 700;
  const totalFare = baseFare * body.passengers.length;

  const booking: Booking = {
    pnr: syntheticPnr(),
    train,
    passengers: body.passengers,
    status: "RAC",
    racPosition,
    fare: {
      totalFare,
      refundablePortion: Math.round(totalFare * RAC_ENTITLEMENT_REFUND_RATIO),
      currency: "INR",
    },
    createdAt: new Date(now()).toISOString(),
  };

  return NextResponse.json(booking);
}

import type { Coach, RacEntry, Train } from "../types";
import stations from "./stations.json";
import trains from "./trains.json";
import coaches from "./coaches.json";
import racQueues from "./rac-queues.json";

export const SEED_STATIONS = stations as { from: string; to: string; fromName: string; toName: string }[];
export const SEED_TRAINS = trains as Train[];
export const SEED_COACHES = coaches as Record<string, Coach[]>;
export const SEED_RAC_QUEUES = racQueues as Record<string, RacEntry[]>;

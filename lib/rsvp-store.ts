import { promises as fs } from "fs";
import path from "path";
import { getRedis } from "./redis";
import type { RSVPRecord } from "./rsvp-schema";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "rsvps.json");
const REDIS_KEY = "rsvps";

function sortByNewest(records: RSVPRecord[]) {
  return records.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function saveRSVP(record: RSVPRecord) {
  const redis = getRedis();
  if (redis) {
    await redis.hset(REDIS_KEY, { [record.id]: JSON.stringify(record) });
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  const records = await getRSVPs();
  records.unshift(record);
  await fs.writeFile(dataFile, JSON.stringify(records, null, 2), "utf8");
}

export async function deleteRSVP(id: string): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    const deleted = await redis.hdel(REDIS_KEY, id);
    return deleted > 0;
  }

  await fs.mkdir(dataDir, { recursive: true });
  const records = await getRSVPs();
  const nextRecords = records.filter((record) => record.id !== id);
  await fs.writeFile(dataFile, JSON.stringify(nextRecords, null, 2), "utf8");
  return nextRecords.length !== records.length;
}

export async function updateRSVP(
  id: string,
  patch: Partial<Omit<RSVPRecord, "id" | "createdAt">>
): Promise<RSVPRecord | null> {
  const redis = getRedis();
  if (redis) {
    const all = await getRSVPs();
    const record = all.find((entry) => entry.id === id);
    if (!record) return null;
    const updated = { ...record, ...patch };
    await redis.hset(REDIS_KEY, { [id]: JSON.stringify(updated) });
    return updated;
  }

  await fs.mkdir(dataDir, { recursive: true });
  const records = await getRSVPs();
  const index = records.findIndex((entry) => entry.id === id);
  if (index === -1) return null;
  const updated = { ...records[index], ...patch };
  records[index] = updated;
  await fs.writeFile(dataFile, JSON.stringify(records, null, 2), "utf8");
  return updated;
}

export async function getRSVPs(): Promise<RSVPRecord[]> {
  const redis = getRedis();
  if (redis) {
    const all = await redis.hgetall<Record<string, string | RSVPRecord>>(REDIS_KEY);
    if (!all) return [];
    const records = Object.values(all).map((value) =>
      typeof value === "string" ? (JSON.parse(value) as RSVPRecord) : value
    );
    return sortByNewest(records);
  }

  try {
    const file = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
}

import { promises as fs } from "fs";
import path from "path";
import type { RSVPRecord } from "./rsvp-schema";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "rsvps.json");

export async function saveRSVP(record: RSVPRecord) {
  await fs.mkdir(dataDir, { recursive: true });
  const records = await getRSVPs();
  records.unshift(record);
  await fs.writeFile(dataFile, JSON.stringify(records, null, 2), "utf8");
}

export async function deleteRSVP(id: string): Promise<boolean> {
  await fs.mkdir(dataDir, { recursive: true });
  const records = await getRSVPs();
  const nextRecords = records.filter((record) => record.id !== id);
  await fs.writeFile(dataFile, JSON.stringify(nextRecords, null, 2), "utf8");
  return nextRecords.length !== records.length;
}

export async function getRSVPs(): Promise<RSVPRecord[]> {
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

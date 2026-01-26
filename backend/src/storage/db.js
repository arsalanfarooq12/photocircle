import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../../data/db.json");

// Write queue prevents concurrent writes corrupting JSON
let writeQueue = Promise.resolve();

export async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    // Return empty DB if file missing/corrupted
    return { users: [], tasks: [] };
  }
}

export async function writeDB(data) {
  // Chain writes so only one happens at a time
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  });
  return writeQueue;
}

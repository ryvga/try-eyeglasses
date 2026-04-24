import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "fs";
import { basename, join } from "path";
import { env } from "@/lib/config";
import * as schema from "@/db/schema";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqlite: Database.Database | null = null;

function databasePath() {
  const url = env().DATABASE_URL;

  if (!url.startsWith("file:")) {
    throw new Error("DATABASE_URL must use file: for SQLite");
  }

  return join(process.cwd(), "data", basename(url.replace("file:", "")));
}

export function getDb() {
  if (!db) {
    const path = databasePath();
    mkdirSync(join(process.cwd(), "data"), { recursive: true });
    sqlite = new Database(path);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    db = drizzle(sqlite, { schema });
  }

  return db;
}

export function closeDb() {
  sqlite?.close();
  sqlite = null;
  db = null;
}

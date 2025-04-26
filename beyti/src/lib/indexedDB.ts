import { openDB } from "idb";

const DB_NAME = "beyti-cache";
const DB_VERSION = 2; // 🆕 bump version to force upgrade and create missing stores

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("booking")) {
        db.createObjectStore("booking");
      }
      if (!db.objectStoreNames.contains("landlord")) {
        db.createObjectStore("landlord");
      }
      if (!db.objectStoreNames.contains("wallet")) {
        db.createObjectStore("wallet");
      }
      if (!db.objectStoreNames.contains("payments")) {
        db.createObjectStore("payments");
      }
    },
  });
}

export async function saveToDB(storeName: string, key: string, value: unknown) {
  const db = await getDB();
  await db.put(storeName, value, key);
}

export async function getFromDB(storeName: string, key: string) {
  const db = await getDB();
  return db.get(storeName, key);
}

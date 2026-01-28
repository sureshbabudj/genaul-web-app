import type { GenaulData, ProviderName } from "@/types";
import { openDB, type IDBPDatabase } from "idb";
import type { VaultProvider } from "./types";

export class IndexedDBProvider implements VaultProvider {
  public readonly name: ProviderName = "indexeddb";
  private dbPromise: Promise<IDBPDatabase>;

  constructor(
    private dbName = "genaul_vault",
    private storeName = "kv",
    private key = "vault",
  ) {
    this.dbPromise = openDB(this.dbName, 1, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains(this.storeName))
          db.createObjectStore(this.storeName);
      },
    });
  }

  async save(data: GenaulData): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.put(this.storeName, data, this.key);
    } catch (e) {
      console.error("IndexedDB Save Failed", e);
    }
  }

  async load(): Promise<GenaulData | null> {
    const db = await this.dbPromise;
    return (await db.get(this.storeName, this.key)) || null;
  }
}

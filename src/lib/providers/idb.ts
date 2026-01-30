import type {
  GenaulData,
  ProviderName,
  VaultAccountInfo,
  VaultSession,
} from "@/types";
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

  async updateEcho(id: string, front: string, back: string): Promise<void> {
    const db = await this.dbPromise;
    const echoes = (await db.get(this.storeName, this.key)) || [];
    const updatedEchoes = echoes.map(
      (e: { id: string; front: string; back: string; updatedAt?: string }) =>
        e.id === id
          ? { ...e, front, back, updatedAt: new Date().toISOString() }
          : e,
    );
    await db.put(this.storeName, updatedEchoes, this.key);
  }

  async deleteEcho(id: string): Promise<void> {
    const db = await this.dbPromise;
    const echoes = (await db.get(this.storeName, this.key)) || [];
    const filteredEchoes = echoes.filter((e: { id: string }) => e.id !== id);
    await db.put(this.storeName, filteredEchoes, this.key);
  }

  async updateHall(id: string, name: string): Promise<void> {
    const db = await this.dbPromise;
    const halls = (await db.get(this.storeName, this.key)) || [];
    const updatedHalls = halls.map(
      (h: { id: string; name: string; updatedAt?: string }) =>
        h.id === id ? { ...h, name, updatedAt: new Date().toISOString() } : h,
    );
    await db.put(this.storeName, updatedHalls, this.key);
  }

  async deleteHall(id: string): Promise<void> {
    const db = await this.dbPromise;

    // Fetch all data
    const data = (await db.get(this.storeName, this.key)) || {
      halls: [],
      echoes: [],
    };

    // Filter out the Hall and associated Echoes
    const updatedHalls = data.halls.filter((h: { id: string }) => h.id !== id);
    const updatedEchoes = data.echoes.filter(
      (e: { hallId: string }) => e.hallId !== id,
    );

    // Save updated data
    await db.put(
      this.storeName,
      { halls: updatedHalls, echoes: updatedEchoes },
      this.key,
    );
  }

  async login(_silent?: boolean): Promise<VaultSession> {
    // No-op for IndexedDB
    return Promise.resolve({
      access_token: "",
      expires_at: 0,
      scope: "",
    });
  }

  async logout(): Promise<void> {
    // No-op for IndexedDB
    return Promise.resolve();
  }

  async getAccountInfo(): Promise<VaultAccountInfo> {
    // No-op for IndexedDB
    return Promise.resolve({ email: "", name: "" });
  }

  async getStorageMetadata(): Promise<{ used: string }> {
    // No-op for IndexedDB
    return Promise.resolve({ used: "0" });
  }
}

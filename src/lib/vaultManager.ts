import type {
  GenaulData,
  Hall,
  Echo,
  Reminder,
  Streak,
  ISODateTime,
  Stats,
} from "@/types";
import type { VaultProvider } from "./providers";

/* ------------------------------ Utils ------------------------------ */
function nowIso(): ISODateTime {
  return new Date().toISOString();
}

function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

function mergeListById<T extends { id: string; updatedAt: string }>(
  a: T[],
  b: T[],
): T[] {
  const map = new Map<string, T>();
  for (const item of a) map.set(item.id, item);
  for (const item of b) {
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
    } else {
      map.set(
        item.id,
        new Date(item.updatedAt) >= new Date(existing.updatedAt)
          ? item
          : existing,
      );
    }
  }
  return Array.from(map.values());
}

/* ---------------------------- Vault Manager ---------------------------- */

export interface VaultManagerOptions {
  provider: VaultProvider;
  /** If true, constructor runs `initialize()` to fetch+merge remote. */
  autoInitialize?: boolean;
  /** Optional seed for first launch / testing */
  initial?: Partial<GenaulData>;
}

export class VaultManager {
  private provider: VaultProvider;
  private state: GenaulData;
  private initialized = false;

  // Simple mutex to serialize writes
  private mutex: Promise<void> = Promise.resolve();
  private resolveMutex: (() => void) | null = null;

  // Subscribers to state changes
  private listeners: Array<(state: GenaulData) => void> = [];

  constructor(opts: VaultManagerOptions) {
    this.provider = opts.provider;

    // Minimal valid starting state
    const base: GenaulData = {
      halls: [],
      echoes: [],
      stats: { lastUpdated: nowIso() },
      reminders: [],
      streak: { current: 0, longest: 0, updatedAt: nowIso() },
    };

    this.state = { ...base, ...deepClone(opts.initial ?? {}) } as GenaulData;

    if (opts.autoInitialize) {
      // Load/merge without blocking constructor
      this.initialize().catch(console.error);
    }
  }

  /* ---------------------------- Lifecycle ---------------------------- */

  /** Pull remote, merge with local, and persist merged result. */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const remote = await this.provider.load();
    if (remote) {
      this.state.halls = mergeListById(this.state.halls, remote.halls);
      this.state.echoes = mergeListById(this.state.echoes, remote.echoes);
      this.state.reminders = mergeListById(
        this.state.reminders,
        remote.reminders,
      );

      // Singular records by timestamp
      if (
        new Date(remote.stats?.lastUpdated ?? 0) >=
        new Date(this.state.stats?.lastUpdated ?? 0)
      ) {
        this.state.stats = remote.stats;
      }
      if (
        new Date(remote.streak?.updatedAt ?? 0) >=
        new Date(this.state.streak?.updatedAt ?? 0)
      ) {
        this.state.streak = remote.streak;
      }
    }

    await this.provider.save(this.state);
    this.initialized = true;
    this.emit();
  }

  /** Subscribe to state changes; returns unsubscribe fn. */
  subscribe(cb: (state: GenaulData) => void): () => void {
    this.listeners.push(cb);
    // push current snapshot immediately
    cb(this.getState());
    return () => {
      this.listeners = this.listeners.filter((x) => x !== cb);
    };
  }

  private emit() {
    const snapshot = this.getState();
    for (const cb of this.listeners) cb(snapshot);
  }

  getState(): GenaulData {
    return deepClone(this.state);
  }

  /** Ensure only one mutation is in-flight. */
  private async runAtomic<T>(op: () => Promise<T>): Promise<T> {
    const wait = this.mutex;
    let localResolve: () => void;
    this.mutex = new Promise<void>((resolve) => (localResolve = resolve));
    this.resolveMutex = localResolve!;
    await wait;
    try {
      const result = await op();
      return result;
    } finally {
      this.resolveMutex?.();
      this.resolveMutex = null;
    }
  }

  /* ------------------------------ CRUD ------------------------------ */

  /**
   * Upsert a hall; latest `updatedAt` wins for conflicts.
   * Updates local state then persists via provider.save().
   */
  async upsertHall(
    hall: Omit<Hall, "updatedAt"> & Partial<Pick<Hall, "updatedAt">>,
  ): Promise<void> {
    await this.runAtomic(async () => {
      const h: Hall = {
        ...hall,
        updatedAt: hall.updatedAt ?? nowIso(),
      } as Hall;
      const idx = this.state.halls.findIndex((x) => x.id === h.id);
      if (idx >= 0) {
        if (
          new Date(h.updatedAt) >= new Date(this.state.halls[idx].updatedAt)
        ) {
          this.state.halls[idx] = h;
        }
      } else {
        this.state.halls.push(h);
      }
      await this.provider.save(this.state);
      this.emit();
    });
  }

  /**
   * Upsert an echo; latest `updatedAt` wins for conflicts.
   */
  async upsertEcho(
    echo: Omit<Echo, "updatedAt"> & Partial<Pick<Echo, "updatedAt">>,
  ): Promise<void> {
    await this.runAtomic(async () => {
      const e: Echo = {
        ...echo,
        updatedAt: echo.updatedAt ?? nowIso(),
      } as Echo;
      const idx = this.state.echoes.findIndex((x) => x.id === e.id);
      if (idx >= 0) {
        if (
          new Date(e.updatedAt) >= new Date(this.state.echoes[idx].updatedAt)
        ) {
          this.state.echoes[idx] = e;
        }
      } else {
        this.state.echoes.push(e);
      }
      await this.provider.save(this.state);
      this.emit();
    });
  }

  /**
   * Create or update a reminder; latest `updatedAt` wins.
   */
  async setReminder(
    reminder: Omit<Reminder, "updatedAt"> &
      Partial<Pick<Reminder, "updatedAt">>,
  ): Promise<void> {
    await this.runAtomic(async () => {
      const r: Reminder = {
        ...reminder,
        updatedAt: reminder.updatedAt ?? nowIso(),
      } as Reminder;
      const idx = this.state.reminders.findIndex((x) => x.id === r.id);
      if (idx >= 0) {
        if (
          new Date(r.updatedAt) >= new Date(this.state.reminders[idx].updatedAt)
        ) {
          this.state.reminders[idx] = r;
        }
      } else {
        this.state.reminders.push(r);
      }
      await this.provider.save(this.state);
      this.emit();
    });
  }

  /**
   * Merge into streak and refresh `updatedAt`.
   */
  async updateStreak(next: Partial<Streak>): Promise<void> {
    await this.runAtomic(async () => {
      this.state.streak = {
        ...this.state.streak,
        ...next,
        updatedAt: nowIso(),
      };
      await this.provider.save(this.state);
      this.emit();
    });
  }

  /**
   * Optional: update stats in one shot and bump lastUpdated.
   */
  async updateStats(patch: Partial<Stats>): Promise<void> {
    await this.runAtomic(async () => {
      this.state.stats = {
        ...this.state.stats,
        ...patch,
        lastUpdated: nowIso(),
      };
      await this.provider.save(this.state);
      this.emit();
    });
  }

  /* --------------------------- Sync / Conflicts --------------------------- */

  /**
   * Explicit sync: fetch remote state, merge per-entity by updatedAt, and persist the merged result.
   * Handles cross-device "sync conflicts" safely (LWW).
   */
  async sync(): Promise<void> {
    await this.runAtomic(async () => {
      const remote = await this.provider.load();
      if (!remote) return;

      this.state.halls = mergeListById(this.state.halls, remote.halls);
      this.state.echoes = mergeListById(this.state.echoes, remote.echoes);
      this.state.reminders = mergeListById(
        this.state.reminders,
        remote.reminders,
      );

      if (
        new Date(remote.stats.lastUpdated) >=
        new Date(this.state.stats.lastUpdated)
      ) {
        this.state.stats = remote.stats;
      }
      if (
        new Date(remote.streak.updatedAt) >=
        new Date(this.state.streak.updatedAt)
      ) {
        this.state.streak = remote.streak;
      }

      await this.provider.save(this.state);
      this.emit();
    });
  }

  /**
   * Swap backing provider at runtime.
   * strategy:
   *  - 'push': overwrite remote with current local state.
   *  - 'pull': replace local with remote state (if exists).
   *  - 'merge' (default): pull, merge, then save merged result.
   */
  async switchProvider(
    next: VaultProvider,
    strategy: "push" | "pull" | "merge" = "merge",
  ): Promise<void> {
    await this.runAtomic(async () => {
      this.provider = next;
      if (strategy === "push") {
        await this.provider.save(this.state);
      } else if (strategy === "pull") {
        const remote = await this.provider.load();
        if (remote) this.state = remote;
      } else {
        await this.sync();
      }
      this.emit();
    });
  }
}

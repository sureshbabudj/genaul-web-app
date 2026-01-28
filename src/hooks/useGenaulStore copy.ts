import { create } from "zustand";
import type { Echo, Hall, Grade, GenaulData } from "@/types";
import { IndexedDBProvider, VaultManager, calculateNextReview } from "@/lib";

type GenaulState = GenaulData & {
  lastActiveHallId: string | null;
  vault: VaultManager;

  // Actions
  initialize: () => Promise<void>;
  createHall: (name: string) => Promise<string>;
  addEcho: (hallId: string, front: string, back: string) => Promise<void>;
  recallEcho: (echoId: string, grade: Grade) => Promise<void>;
  setLastActiveHallId: (id: string | null) => void;
};

export const useGenaulStore = create<GenaulState>((set, get) => ({
  halls: [],
  echoes: [],
  stats: { lastUpdated: new Date().toISOString() },
  reminders: [],
  streak: { current: 0, longest: 0, updatedAt: new Date().toISOString() },
  lastActiveHallId: null,
  vault: new VaultManager({ provider: new IndexedDBProvider() }),

  initialize: async () => {
    const data = await get().vault.initialize();
    set({ ...data });
  },

  createHall: async (name: string) => {
    const newHall: Hall = {
      id: crypto.randomUUID(),
      name,
      echoIds: [],
      updatedAt: new Date().toISOString(),
    };
    const halls = [...get().halls, newHall];
    set({ halls });
    await get().vault.updateHalls(halls);
    return newHall.id;
  },

  addEcho: async (hallId: string, front: string, back: string) => {
    const echoId = crypto.randomUUID();
    const newEcho: Echo = {
      id: echoId,
      hallId,
      front,
      back,
      stability: 0,
      difficulty: 5,
      reps: 0,
      lastReview: Date.now(),
      nextReview: Date.now(),
      updatedAt: new Date().toISOString(),
    };

    const echoes = [...get().echoes, newEcho];
    const halls = get().halls.map((h) =>
      h.id === hallId
        ? {
            ...h,
            echoIds: [...h.echoIds, echoId],
            updatedAt: new Date().toISOString(),
          }
        : h,
    );

    set({ echoes, halls });
    await get().vault.updateEchoes(echoes);
    await get().vault.updateHalls(halls);
  },

  recallEcho: async (echoId: string, grade: Grade) => {
    const echoes = get().echoes.map((echo) => {
      if (echo.id === echoId) {
        // Apply FSRS logic from fsrsEngine.ts
        const updates = calculateNextReview(echo, grade);
        return {
          ...echo,
          ...updates,
          reps: echo.reps + 1,
          lastReview: Date.now(),
          updatedAt: new Date().toISOString(),
        };
      }
      return echo;
    });

    set({ echoes });
    await get().vault.updateEchoes(echoes);

    // Update global review stats
    const stats = {
      ...get().stats,
      lastUpdated: new Date().toISOString(),
      cardsReviewed: (get().stats.cardsReviewed || 0) + 1,
    };
    set({ stats });
    await get().vault.updateStats(stats);
  },

  setLastActiveHallId: (id) => set({ lastActiveHallId: id }),
}));

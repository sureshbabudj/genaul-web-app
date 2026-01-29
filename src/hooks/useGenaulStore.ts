import { create } from "zustand";
import type {
  Echo,
  Hall,
  Grade,
  GenaulData,
  Stats,
  ProviderName,
} from "@/types";
import { calculateNextReview } from "@/lib/fsrsEngine";
import { createJSONStorage, persist } from "zustand/middleware";

type GenaulState = GenaulData & {
  vaultProvider: ProviderName | "";
  setVaultProvider: (provider: ProviderName | "") => void;

  vaultToken: string | null; // Add this
  setVaultToken: (token: string | null) => void; // Add this

  lastActiveHallId: string | null;
  isHydrated: boolean;

  // Lifecycle & Sync
  initialize: () => Promise<void>; // Managed by the Bridge now
  setAllData: (data: GenaulData) => void;

  // Core Methods
  getLastActiveHallId: () => string | null;
  getDueEchoes: (hallId: string) => Echo[];
  setLastActiveHallId: (id: string | null) => Promise<void>;
  createHall: (name: string) => Promise<string>;
  addEcho: (hallId: string, front: string, back: string) => Promise<void>;
  recallEcho: (echoId: string, grade: Grade) => Promise<void>;
  checkAndIncrementStreak: () => Promise<void>;
  updateStats: (patch: Partial<Stats>) => Promise<void>;
  toggleReminder: (reminderId: string) => Promise<void>;
  logout: () => void;
};

export const useGenaulStore = create<GenaulState>()(
  persist(
    (set, get) => ({
      vaultProvider: "",
      vaultToken: null,
      halls: [],
      echoes: [],
      reminders: [],
      streak: { current: 0, longest: 0, updatedAt: new Date().toISOString() },
      stats: { lastUpdated: new Date().toISOString(), cardsReviewed: 0 },
      activeHallId: null,
      lastActiveHallId: null,
      isHydrated: false,

      setAllData: (data) =>
        set({ ...data, lastActiveHallId: data.activeHallId, isHydrated: true }),

      initialize: async () => {
        // Note: The actual loading is handled by the useSyncBridge hook
        // which calls store.setAllData. This method can remain for API compatibility.
      },

      setVaultProvider: (provider) => set({ vaultProvider: provider }),

      setVaultToken: (token) => set({ vaultToken: token }),

      getLastActiveHallId: () => get().lastActiveHallId,

      getDueEchoes: (hallId) => {
        const now = Date.now();
        return get().echoes.filter(
          (e) => e.hallId === hallId && e.nextReview <= now,
        );
      },

      setLastActiveHallId: async (id) => {
        set({ lastActiveHallId: id, activeHallId: id });
      },

      logout: () => set({ vaultToken: null, isHydrated: false }),

      createHall: async (name) => {
        const id = crypto.randomUUID();
        const newHall: Hall = {
          id,
          name,
          echoIds: [],
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ halls: [...state.halls, newHall] }));
        return id;
      },

      addEcho: async (hallId, front, back) => {
        const echoId = crypto.randomUUID();
        const now = new Date().toISOString();
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
          updatedAt: now,
        };
        set((state) => ({
          echoes: [...state.echoes, newEcho],
          halls: state.halls.map((h) =>
            h.id === hallId
              ? { ...h, echoIds: [...h.echoIds, echoId], updatedAt: now }
              : h,
          ),
        }));
      },

      recallEcho: async (echoId, grade) => {
        const echo = get().echoes.find((e) => e.id === echoId);
        if (!echo) return;
        const updates = calculateNextReview(echo, grade);
        const updatedEcho = {
          ...echo,
          ...updates,
          reps: echo.reps + 1,
          lastReview: Date.now(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          echoes: state.echoes.map((e) => (e.id === echoId ? updatedEcho : e)),
          stats: {
            ...state.stats,
            cardsReviewed: (state.stats.cardsReviewed || 0) + 1,
            lastUpdated: new Date().toISOString(),
          },
        }));
      },

      checkAndIncrementStreak: async () => {
        const { streak } = get();
        const now = new Date();
        const lastUpdate = new Date(streak.updatedAt);
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        ).getTime();
        const lastDay = new Date(
          lastUpdate.getFullYear(),
          lastUpdate.getMonth(),
          lastUpdate.getDate(),
        ).getTime();

        const oneDayInMs = 86400000;
        const diff = today - lastDay;
        const newStreak = { ...streak };

        if (diff === oneDayInMs) {
          newStreak.current += 1;
          if (newStreak.current > newStreak.longest)
            newStreak.longest = newStreak.current;
        } else if (diff > oneDayInMs) {
          newStreak.current = 1;
        }
        newStreak.updatedAt = now.toISOString();
        set({ streak: newStreak });
      },

      updateStats: async (patch) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...patch,
            lastUpdated: new Date().toISOString(),
          },
        }));
      },

      toggleReminder: async (reminderId) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === reminderId
              ? {
                  ...r,
                  enabled: !r.enabled,
                  updatedAt: new Date().toISOString(),
                }
              : r,
          ),
        }));
      },
    }),
    {
      name: "genaul-settings", // Name in localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist the provider choice and lastActiveHallId
      // The actual vault data (halls/echoes) is managed by IndexedDB/Cloud
      partialize: (state: GenaulState) => ({
        vaultProvider: state.vaultProvider,
        lastActiveHallId: state.lastActiveHallId,
        vaultToken: state.vaultToken,
      }),
    },
  ),
);

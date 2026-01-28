import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Echo, Hall, Grade } from "@/types";
import { calculateNextReview } from "@/lib/fsrsEngine";

type GenaulState = {
  halls: Hall[];
  echoes: Echo[];
  lastActiveHallId: string | null;
  createHall: (name: string) => string;
  addEcho: (hallId: string, front: string, back: string) => void;
  recallEcho: (echoId: string, grade: Grade) => void;
  getDueEchoes: (hallId: string) => Echo[];
  getLastActiveHallId: () => string | null;
  setLastActiveHallId: (hallId: string | null) => void;
};

export const useGenaulStore = create<GenaulState>()(
  persist(
    (set, get) => ({
      halls: [],
      echoes: [],
      lastActiveHallId: null,
      createHall: (name: string) => {
        const newHall: Hall = {
          id: crypto.randomUUID(),
          name,
          echoIds: [],
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ halls: [...state.halls, newHall] }));
        return newHall.id;
      },
      addEcho: (hallId: string, front: string, back: string) => {
        const echoId = crypto.randomUUID();
        const newEcho: Echo = {
          id: echoId,
          hallId,
          front,
          back,
          stability: 0,
          difficulty: 5,
          lastReview: Date.now(),
          nextReview: Date.now(),
          reps: 0,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          echoes: [...state.echoes, newEcho],
          halls: state.halls.map((h) =>
            h.id === hallId ? { ...h, echoIds: [...h.echoIds, echoId] } : h,
          ),
        }));
      },
      recallEcho: (echoId: string, grade: Grade) => {
        set((state) => ({
          echoes: state.echoes.map((echo) => {
            if (echo.id === echoId) {
              const updates = calculateNextReview(echo, grade);
              return { ...echo, ...updates };
            }
            return echo;
          }),
        }));
      },
      getDueEchoes: (hallId: string) => {
        const now = Date.now();
        return get().echoes.filter(
          (e) => e.hallId === hallId && e.nextReview <= now,
        );
      },
      getLastActiveHallId: () => get().lastActiveHallId,
      setLastActiveHallId: (hallId: string | null) =>
        set({ lastActiveHallId: hallId }),
    }),
    {
      name: "genaul-store",
      partialize: (state) => ({
        halls: state.halls,
        echoes: state.echoes,
        lastActiveHallId: state.lastActiveHallId,
      }),
    },
  ),
);

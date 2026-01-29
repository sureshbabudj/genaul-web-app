/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { useVault } from "@/hooks/useVault";
import type { VaultProvider } from "@/lib";

export function useSyncBridge(
  provider: VaultProvider,
  isAuthenticated: boolean = true,
) {
  const store = useGenaulStore();
  const isInitialLoad = useRef(true);

  const {
    data: vaultData,
    save,
    isLoading,
  } = useVault(provider, isAuthenticated);

  // 1. HYDRATE: From Cloud to Local Store
  useEffect(() => {
    if (!isLoading && isInitialLoad.current) {
      if (vaultData) {
        console.log(`[Bridge] Hydrating store from ${provider.name}`);
        store.setAllData(vaultData);
      } else {
        console.log(`[Bridge] No remote data found, starting fresh`);
        store.setAllData({
          halls: [],
          echoes: [],
          reminders: [],
          streak: store.streak,
          stats: store.stats,
          activeHallId: null,
        });
      }
      isInitialLoad.current = false;
    }
  }, [vaultData, isLoading]);

  // 2. SYNC: From Local Store to Cloud (Debounced)
  useEffect(() => {
    // Only save if hydration is finished and we aren't currently loading
    if (!store.isHydrated || isInitialLoad.current || isLoading) return;

    const debounceTimer = setTimeout(() => {
      const { halls, echoes, reminders, streak, stats, activeHallId } = store;

      const dataToSave = {
        halls,
        echoes,
        reminders,
        streak,
        stats,
        activeHallId,
      };

      console.log(`[Bridge] Triggering save to ${provider.name}`);
      save(dataToSave);
    }, 2000); // 2s debounce for safety

    return () => clearTimeout(debounceTimer);
  }, [
    store.halls,
    store.echoes,
    store.stats,
    store.streak,
    store.activeHallId,
    provider.name,
  ]);

  return { isLoading };
}

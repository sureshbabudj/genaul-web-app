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

  // 1. Connect to the Vault via TanStack Query
  const {
    data: vaultData,
    save,
    isLoading,
  } = useVault(provider, isAuthenticated);
  const isInitialLoad = useRef(true);

  // 2. LOAD: When Provider data arrives, hydrate the Zustand Store
  useEffect(() => {
    if (vaultData && isInitialLoad.current) {
      console.log(`[Bridge] Hydrating store from ${provider.name}`);
      store.setAllData(vaultData);
      isInitialLoad.current = false;
    } else if (!vaultData && !isLoading && isInitialLoad.current) {
      // If provider is empty (first time user), mark as hydrated to allow saves
      store.setAllData({
        halls: [],
        echoes: [],
        reminders: [],
        streak: store.streak,
        stats: store.stats,
        activeHallId: null,
      });
      isInitialLoad.current = false;
    }
  }, [vaultData, isLoading]);

  // 3. SAVE: When Zustand Store changes, push to the Provider (Debounced)
  useEffect(() => {
    // DO NOT save if we haven't loaded the data yet (prevents wiping remote data)
    if (!store.isHydrated || isInitialLoad.current) return;

    const currentProviderName = provider.name;

    const debounceTimer = setTimeout(() => {
      if (provider.name !== currentProviderName) return;
      // Extract only the GenaulData fields, exclude methods/UI state
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
    }, 1500); // 1.5s debounce to group multiple rapid edits

    return () => clearTimeout(debounceTimer);
  }, [
    store.halls,
    store.echoes,
    store.stats,
    store.streak,
    store.activeHallId,
    provider.name, // Re-trigger if the provider changes
  ]);

  return { isLoading };
}

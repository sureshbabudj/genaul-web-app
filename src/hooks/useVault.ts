// hooks/useVault.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenaulData } from "@/types";
import type { VaultProvider } from "@/lib";

export function useVault(provider: VaultProvider, enabled: boolean = true) {
  const queryClient = useQueryClient();
  const queryKey = ["vault-data", provider.name];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      console.log(`[Vault] Loading from ${provider.name}...`);
      return await provider.load();
    },
    enabled: enabled, // Only run if we have permission/SSO
    staleTime: Infinity,
    retry: provider.name === "indexeddb" ? false : 2, // Retry cloud, but not local
  });

  const mutation = useMutation({
    mutationFn: (nextState: GenaulData) => provider.save(nextState),
    onSuccess: () => {
      console.log(`[Vault] Successfully saved to ${provider.name}`);
    },
    onError: (err) => {
      console.error(`[Vault] Error saving to ${provider.name}:`, err);
    },
  });

  return {
    data: query.data,
    save: mutation.mutate,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
  };
}

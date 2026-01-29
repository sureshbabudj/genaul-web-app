// hooks/useVault.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenaulData } from "@/types";
import type { VaultProvider } from "@/lib";

const VAULT_KEY = ["vault-data"];

export function useVault(provider: VaultProvider, enabled: boolean = true) {
  const queryClient = useQueryClient();
  const queryKey = [...VAULT_KEY, provider.name];

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
    onMutate: async (nextState) => {
      const specificKey = [...VAULT_KEY, provider.name];

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: specificKey });

      // Snapshot the previous value
      const previousState = queryClient.getQueryData<GenaulData>(specificKey);

      // Optimistically update to the new value
      queryClient.setQueryData(specificKey, nextState);

      // Return a context object with the snapshotted value
      return { previousState };
    },
    // If the mutation fails, use the context we returned above to roll back
    onError: (_err, _nextState, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(
          [...VAULT_KEY, provider.name],
          context.previousState,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...VAULT_KEY, provider.name],
      });
    },
    onSuccess: () => {
      console.log(`[Vault] Successfully saved to ${provider.name}`);
    },
  });

  return {
    data: query.data,
    save: mutation.mutate,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
  };
}

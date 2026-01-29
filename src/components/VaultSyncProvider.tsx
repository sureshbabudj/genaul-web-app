import { useSyncBridge } from "@/hooks/useSyncBridge";
import type { VaultProvider } from "@/lib";

/**
 * The Internal Bridge Component (The one that was missing)
 * This exists solely to hold the TanStack-related hooks so they
 * can be unmounted/remounted easily by the parent via the 'key' prop.
 */
export function SyncBridge({
  provider,
  enabled,
}: {
  provider: VaultProvider;
  enabled: boolean;
}) {
  // This hook calls useVault internally
  useSyncBridge(provider, enabled);
  return null;
}

import { useSyncBridge } from "@/hooks/useSyncBridge";
import type { VaultProvider } from "@/lib";
import { LoadingScreen } from "./LoadingScreen";

/**
 * The Internal Bridge Component (The one that was missing)
 * This exists solely to hold the TanStack-related hooks so they
 * can be unmounted/remounted easily by the parent via the 'key' prop.
 */
export function SyncBridge({
  provider,
  enabled,
  children,
}: {
  provider: VaultProvider;
  enabled: boolean;
  children: React.ReactNode;
}) {
  // This hook calls useVault internally
  const { isLoading } = useSyncBridge(provider, enabled);
  if (isLoading) {
    console.log("[Bridge] Loading vault data...");
  }
  return <>{children}</>;
}

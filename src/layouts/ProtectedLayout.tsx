import { useSyncBridge } from "@/hooks/useSyncBridge";
import {
  CloudKitProvider,
  GoogleDriveProvider,
  IndexedDBProvider,
} from "@/lib";
import { useMemo } from "react";
import { Outlet } from "react-router";

export default function ProtectedLayout() {
  // Put shared UI or context providers here (header/sidebar, etc.)

  const userSetting = "indexeddb"; // This would come from your Auth logic/Settings
  const isLoggedIntoCloud = true; // Based on SSO status

  const activeProvider = useMemo(() => {
    if (userSetting === "google") return new GoogleDriveProvider();
    if (userSetting === "cloudkit") return new CloudKitProvider();
    return new IndexedDBProvider();
  }, [userSetting]);

  // The Bridge handles all the "Heavy Lifting" reactively
  useSyncBridge(
    activeProvider,
    isLoggedIntoCloud || activeProvider.name === "indexeddb",
  );

  return (
    <div className="app-shell min-w-sm min-h-dvh">
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

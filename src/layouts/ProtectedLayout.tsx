/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { VaultOnboarding } from "@/components/VaultOnboarding";
import {
  IndexedDBProvider,
  GoogleDriveProvider,
  CloudKitProvider,
} from "@/lib/providers";
import { initSdks } from "@/lib/sdkLoader";
import { SyncBridge } from "@/components/VaultSyncProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ProviderName } from "@/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function ProtectedLayout() {
  const providerType = useGenaulStore((s) => s.vaultProvider);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const token = useGenaulStore((s) => s.vaultToken);
  const setToken = useGenaulStore((s) => s.setVaultToken);

  useEffect(() => {
    initSdks().then(() => setIsSdkReady(true));
  }, []);

  const isCloud =
    providerType === "google-drive" || providerType === "cloudkit";
  const isOffline = providerType === "indexeddb";
  const isNewUser = !isCloud && !isOffline;
  const hasPermission = isOffline || (isCloud && !!token);

  const activeProvider = useMemo(() => {
    let provider;
    switch (providerType) {
      case "google-drive":
        provider = new GoogleDriveProvider();
        break;
      case "cloudkit":
        provider = new CloudKitProvider();
        break;
      case "indexeddb":
        provider = new IndexedDBProvider();
        break;
      default:
        return null;
    }

    if (provider && token && "setToken" in provider) {
      (provider as any).setToken(token);
    }
    return provider;
  }, [providerType, token]);

  const handleAuth = async (pType: ProviderName): Promise<"success"> => {
    if (pType === "google-drive") {
      const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      return new Promise((resolve, reject) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientID,
          scope: "https://www.googleapis.com/auth/drive.appdata",
          callback: (res: any) => {
            if (res.access_token) {
              setToken(res.access_token);
              resolve("success");
            } else {
              reject(new Error(res.error_description || "Auth failed"));
            }
          },
        });
        client.requestAccessToken({ prompt: "consent" });
      });
    }

    if (pType === "cloudkit") {
      const container = window.CloudKit.getDefaultContainer();
      const userIdentity = await container.fetchCurrentUserIdentity();
      if (userIdentity?.userRecordName) {
        setToken(userIdentity.userRecordName);
        return "success";
      }
      throw new Error("CloudKit auth failed");
    }

    throw new Error("Unsupported provider");
  };

  if (!isSdkReady) return null;

  if (isNewUser || !hasPermission) {
    return <VaultOnboarding onAuthenticate={handleAuth} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        {activeProvider && (
          <SyncBridge
            key={`${activeProvider.name}-${token}`}
            provider={activeProvider}
            enabled={hasPermission}
          />
        )}
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}

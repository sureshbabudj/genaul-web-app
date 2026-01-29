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
import type { ProviderName, VaultSession } from "@/types";
import { LoadingScreen } from "@/components/LoadingScreen";

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
  const session = useGenaulStore((s) => s.vaultSession);
  const setSession = useGenaulStore((s) => s.setVaultSession);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    initSdks().then(() => setIsSdkReady(true));
  }, []);

  useEffect(() => {
    const validate = async () => {
      if (!isSdkReady) return;

      if (providerType === "google-drive" && session) {
        // Check if current time is past the absolute expiry (with 1 min buffer)
        const isExpired = Date.now() > session.expires_at - 60000;

        if (isExpired) {
          try {
            await handleAuth("google-drive", true); // Silent refresh
          } catch {
            setSession(null); // Silent failed, force manual login
          }
        }
      }
      setIsValidating(false);
    };
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSdkReady]);

  const isCloud =
    providerType === "google-drive" || providerType === "cloudkit";
  const isOffline = providerType === "indexeddb";
  const isNewUser = !isCloud && !isOffline;
  const hasPermission = isOffline || (isCloud && !!session);

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

    // Fix: Pass the token directly from the session object to the provider instance
    if (provider && session?.access_token && "setToken" in provider) {
      (provider as any).setToken(session.access_token);
    }
    return provider;
  }, [providerType, session]);

  useEffect(() => {
    const validate = async () => {
      if (!isSdkReady) return;

      if (providerType === "google-drive" && session) {
        // Check if current time is past the absolute expiry (with 1 min buffer)
        const isExpired = Date.now() > session.expires_at - 60000;

        if (isExpired) {
          try {
            await handleAuth("google-drive", true); // Silent refresh
          } catch {
            setSession(null); // Silent failed, force manual login
          }
        }
      }
      setIsValidating(false);
    };
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSdkReady]);

  const handleAuth = async (
    pType: ProviderName,
    silent = false,
  ): Promise<"success"> => {
    if (pType === "google-drive") {
      const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      return new Promise((resolve, reject) => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientID,
          scope: "https://www.googleapis.com/auth/drive.appdata",
          prompt: silent ? "none" : "",
          callback: (res: any) => {
            if (res.access_token) {
              const newSession: VaultSession = {
                access_token: res.access_token,
                scope: res.scope,
                expires_at: Date.now() + res.expires_in * 1000,
              };
              setSession(newSession);
              resolve("success");
            } else {
              reject(new Error(res.error_description || "Auth failed"));
            }
          },
          error_callback: (err: any) => {
            reject(err);
          },
        });

        // Remove hardcoded prompt: "consent" so it respects the silent parameter
        client.requestAccessToken(silent ? { prompt: "none" } : {});
      });
    }

    if (pType === "cloudkit") {
      const container = window.CloudKit.getDefaultContainer();
      const userIdentity = await container.fetchCurrentUserIdentity();
      if (userIdentity?.userRecordName) {
        setSession({
          access_token: userIdentity.userRecordName,
          scope: "",
          expires_at: Date.now() + 3600 * 1000, // Assuming 1 hour expiry for CloudKit
        });
        return "success";
      }
      throw new Error("CloudKit auth failed");
    }

    throw new Error("Unsupported provider");
  };

  if (!isSdkReady || isValidating) return <LoadingScreen />;

  if (isNewUser || !hasPermission) {
    return <VaultOnboarding onAuthenticate={handleAuth} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        {activeProvider && (
          <SyncBridge
            key={activeProvider?.name} // Use the provider name for stability
            provider={activeProvider}
            enabled={hasPermission}
          >
            <Outlet />
          </SyncBridge>
        )}
      </div>
    </QueryClientProvider>
  );
}

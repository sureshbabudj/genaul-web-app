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
      // This ensures data doesn't refetch too aggressively
      // unless we explicitly tell it to
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function ProtectedLayout() {
  const providerType = useGenaulStore((s) => s.vaultProvider);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    initSdks().then(() => setIsSdkReady(true));
  }, []);

  // Define the states clearly

  const isCloud =
    providerType === "google-drive" || providerType === "cloudkit";
  const isOffline = providerType === "indexeddb";
  const isNewUser = !isCloud && !isOffline;

  // Permission logic:
  // - New users: No permission (must choose)
  // - Offline users: Always have permission
  // - Cloud users: Need a token
  const hasPermission = isOffline || (isCloud && !!token);

  const activeProvider = useMemo(() => {
    switch (providerType) {
      case "google-drive":
        return new GoogleDriveProvider();
      case "cloudkit":
        return new CloudKitProvider();
      case "indexeddb":
        return new IndexedDBProvider();
      default:
        return null;
    }
  }, [providerType]);

  const handleAuth = async (providerType: ProviderName): Promise<"success"> => {
    console.log(`[Auth] Starting flow for: ${providerType}`);

    // 1. Google Drive Logic
    if (providerType === "google-drive") {
      if (!window.google?.accounts?.oauth2) {
        throw new Error("Google Identity Services not loaded.");
      }

      const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientID) throw new Error("Google Client ID is missing.");

      return new Promise<"success">((resolve, reject) => {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientID,
            scope: "https://www.googleapis.com/auth/drive.appdata",
            callback: (res: {
              error?: string;
              error_description?: string;
              access_token?: string;
            }) => {
              if (res.error) {
                reject(new Error(res.error_description || res.error));
                return;
              }
              if (res.access_token) {
                setToken(res.access_token);
                window.gapi.client.setToken(res);
                resolve("success");
              } else {
                reject(new Error("No access token returned."));
              }
            },
            error_callback: (err: unknown) =>
              reject(new Error((err as Error).message || "OAuth Client Error")),
          });

          // CRITICAL: requestAccessToken must be in the same tick as the click
          client.requestAccessToken({ prompt: "consent" });
        } catch (err: unknown) {
          reject(new Error((err as Error).message || "Google Init Failed"));
        }
      });
    }

    // 2. CloudKit Logic
    if (providerType === "cloudkit") {
      if (!window.CloudKit) throw new Error("CloudKit SDK not loaded.");

      try {
        // 1. Get the container
        const container = window.CloudKit.getDefaultContainer();

        // 2. Fetch the user identity.
        // In v2, this returns a Promise. If the user isn't logged in,
        // it will throw an error or return null depending on your setup.
        const userIdentity = await container.fetchCurrentUserIdentity();

        if (userIdentity && userIdentity.userRecordName) {
          console.log("[Auth] CloudKit Success:", userIdentity.userRecordName);
          setToken(userIdentity.userRecordName);
          return "success";
        } else {
          // If no identity, we may need to trigger the Sign-In button flow.
          // CloudKit usually handles this via a listener, but we can force a check.
          throw new Error("Please sign in to iCloud to continue.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("[Auth] CloudKit Error:", err);

        // Check for "authentication required"
        if (
          err.ckErrorCode === "AUTHENTICATION_REQUIRED" ||
          err.ckErrorCode === "AUTH_PERSIST_ERROR"
        ) {
          throw new Error(
            "CloudKit requires you to be signed into iCloud in this browser.",
          );
        }

        throw new Error(err.message || "Failed to connect to CloudKit.");
      }
    }

    throw new Error("Unsupported provider");
  };

  if (!isSdkReady) return null; // Or a simple skeleton

  // If user chose Cloud but hasn't authorized yet, show the onboarding
  if (isNewUser || !hasPermission) {
    return <VaultOnboarding onAuthenticate={handleAuth} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        {/* The Bridge always runs. 
        If offline, it uses IndexedDB instantly.
        If cloud, it only fires once 'token' exists (via the key).
      */}
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

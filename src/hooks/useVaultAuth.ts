import { useState, useCallback } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore"; // Assuming your settings are here

export function useVaultAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Get provider from your store
  const providerType = useGenaulStore((s) => s.vaultProvider);

  const login = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      if (providerType === "google-drive") {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/drive.appdata",
          callback: (res: { access_token: string }) => {
            setToken(res.access_token);
            window.gapi.client.setToken(res);
          },
        });
        client.requestAccessToken();
      }

      if (providerType === "cloudkit") {
        const container = window.CloudKit.getDefaultContainer();
        const userIdentity = await container.setUpUser();
        setToken(userIdentity.userRecordName); // CloudKit uses session-based auth
      }
    } catch (err) {
      console.error("Auth failed", err);
    } finally {
      setIsAuthenticating(false);
    }
  }, [providerType]);

  return {
    isAuthenticated: providerType === "indexeddb" || !!token,
    token,
    login,
    isAuthenticating,
  };
}

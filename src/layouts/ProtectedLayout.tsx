/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { VaultOnboarding } from "@/components/VaultOnboarding";
import { createProviderInstance } from "@/lib/providers";
import { initSdks } from "@/lib/sdkLoader";
import { SyncBridge } from "@/components/SyncBridge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

      if (session && activeProvider) {
        // Check if current time is past the absolute expiry (with 1 min buffer)
        const isExpired = Date.now() > session.expires_at - 60000;

        if (isExpired) {
          try {
            const newSession = await activeProvider.login(true);
            setSession(newSession);
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
    if (!isSdkReady) return null;
    const provider = createProviderInstance(providerType);
    if (provider && session?.access_token && "setToken" in provider) {
      provider.setToken(session.access_token);
    }
    return provider;
  }, [providerType, session?.access_token, isSdkReady]);

  useEffect(() => {
    const validate = async () => {
      if (!activeProvider || !session) {
        setIsValidating(false);
        return;
      }

      const isExpired = Date.now() > session.expires_at - 60000;

      if (isExpired) {
        try {
          const newSession = await activeProvider.login(true); // Provider handles details
          setSession(newSession);
        } catch {
          setSession(null);
        }
      }
      setIsValidating(false);
    };
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProvider]);

  const handleOnboardingAuth = async () => {
    if (!activeProvider) return;
    const newSession = await activeProvider.login(false);
    setSession(newSession);
  };

  if (!isSdkReady || isValidating) {
    return <LoadingScreen />;
  }

  if (isNewUser || !hasPermission) {
    return <VaultOnboarding onAuthenticate={handleOnboardingAuth} />;
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

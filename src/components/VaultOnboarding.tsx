import { useGenaulStore } from "@/hooks/useGenaulStore";
import type { ProviderName } from "@/types";
import { useState } from "react";

export function VaultOnboarding({
  onAuthenticate,
}: {
  onAuthenticate: (pr: ProviderName) => Promise<void>;
}) {
  const [modal, setModal] = useState<{
    show: boolean;
    title: string;
    msg: string;
  }>({
    show: false,
    title: "",
    msg: "",
  });
  const setProvider = useGenaulStore((s) => s.setVaultProvider);
  const providerType = useGenaulStore((s) => s.vaultProvider);

  const isReturningUser = providerType !== "" && providerType !== "indexeddb";

  const handleChoice = async (type: ProviderName) => {
    setProvider(type);
    if (type !== "indexeddb") {
      await handleAuth(type);
    }
  };

  const handleAuth = async (type: ProviderName) => {
    if (type === "google-drive" || type === "cloudkit") {
      try {
        await onAuthenticate(type);
        setModal({
          show: true,
          title: "Success",
          msg: "Your vault is now connected and syncing.",
        });
      } catch (error) {
        setModal({
          show: true,
          title: "Authentication Error",
          msg: (error as Error).message,
        });
      }
    }
  };

  return (
    <>
      {modal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-4">{modal.title}</h3>
            <p className="mb-6 text-slate-600">{modal.msg}</p>
            <button
              onClick={() => setModal({ show: false, title: "", msg: "" })}
              className="w-full py-4 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Left Side: Branding */}
        <div className="hidden bg-indigo-500 text-white lg:flex flex-1 items-center justify-center p-12">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <img src="./icon.svg" className="w-6 h-6" alt="Genaul Icon" />
              </div>
              <span className="text-4xl font-black tracking-tighter">
                GENAUL.
              </span>
            </div>
            <p className="text-xl opacity-90">
              Capture your thoughts. Master your memory. Choose where your vault
              lives.
            </p>
          </div>
        </div>

        {/* Right Side: Choices or Login */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 space-y-8">
          {!providerType ? (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Setup your Vault</h2>
                <p className="text-muted-foreground">
                  Select a storage method to begin.
                </p>
              </div>
              <div className="grid gap-4">
                <button
                  onClick={() => handleChoice("indexeddb")}
                  className="flex items-center p-4 border border-slate-200 shadow-sm rounded-xl hover:bg-indigo-50 transition-colors text-left group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-2xl">
                    💾
                  </div>
                  <div>
                    <div className="font-bold">Offline Mode</div>
                    <div className="text-sm opacity-70">
                      Stored locally in your browser.
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleChoice("google-drive")}
                  className="flex items-center p-4 border border-slate-200 shadow-sm rounded-xl hover:bg-indigo-50 transition-colors text-left group"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 text-2xl">
                    ☁️
                  </div>
                  <div>
                    <div className="font-bold">Google Drive</div>
                    <div className="text-sm opacity-70">
                      Private sync via your Google App Data folder.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleChoice("cloudkit")}
                  className="flex items-center p-4 border border-slate-200 shadow-lg rounded-xl hover:bg-indigo-100 transition-colors text-left group"
                >
                  <div className="w-12 h-12 bg-indigo-200 text-white rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    🍎
                  </div>
                  <div>
                    <div className="font-bold">iCloud</div>
                    <div className="text-sm opacity-70">
                      Native Apple sync across all your devices.
                    </div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <div className="mx-auto text-center max-w-md space-y-6">
              <div className="text-5xl">
                {providerType === "google-drive" ? "☁️" : "🍎"}
              </div>
              <h2 className="text-2xl font-bold">
                {isReturningUser ? "Welcome Back" : "Permission Required"}
              </h2>
              <p className="text-muted-foreground">
                {isReturningUser
                  ? `Your session has expired. Please sign in to sync your data with ${providerType}.`
                  : `Genaul needs permission to create a private folder in your ${providerType}.`}
              </p>
              <button
                onClick={() => handleAuth(providerType)}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all"
              >
                {isReturningUser
                  ? `Login with ${providerType === "google-drive" ? "Google" : "iCloud"}`
                  : "Grant Permission"}
              </button>
              <button
                onClick={() => setProvider("")}
                className="text-sm text-slate-400 underline hover:text-slate-600"
              >
                Change storage method
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

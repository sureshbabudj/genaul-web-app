import { useGenaulStore } from "@/hooks/useGenaulStore";
import type { ProviderName } from "@/types";
import { useState } from "react";

export function VaultOnboarding({
  onAuthenticate,
}: {
  onAuthenticate: (pr: ProviderName) => Promise<"success">;
}) {
  const [modal, setModal] = useState<{
    show: boolean;
    title: string;
    msg: string;
  }>({ show: false, title: "", msg: "" });
  const setProvider = useGenaulStore((s) => s.setVaultProvider);
  const providerType = useGenaulStore((s) => s.vaultProvider);

  const handleChoice = async (type: ProviderName) => {
    setProvider(type);
    await handleAuth(type);
  };

  const handleAuth = async (type: ProviderName) => {
    if (type === "google-drive" || type === "cloudkit") {
      try {
        await onAuthenticate(type); // Pass the type explicitly to be safe
        setModal({
          show: true,
          title: "Success",
          msg: "Permission granted! You can now start syncing.",
        });
      } catch (error) {
        setModal({ show: true, title: "Error", msg: (error as Error).message });
        console.error("[Onboarding] Authentication error:", error);
      }
    }
  };

  return (
    <>
      {modal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6">{modal.title}</h3>
            <p className="mb-6">{modal.msg}</p>
            <button
              onClick={() => setModal({ show: false, title: "", msg: "" })}
              className="flex-1 py-4 font-bold text-slate-800 bg-slate-300 rounded-xl justify-end self-end px-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Left Side: Branding */}
        <div className="hidden bg-indigo-500 text-white lg:flex flex-1 bg-primary items-center justify-center p-12 text-primary-foreground">
          <div className="max-w-md space-y-4">
            <div className="flex items-center justify-left gap-2 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg flex items-center justify-center shadow-inner">
                <img
                  src="./icon.svg"
                  className="text-white w-6 h-6 color-white"
                />
              </div>
              <span className="text-4xl font-black text-white tracking-tighter">
                GENAUL.
              </span>
            </div>
            <p className="text-xl opacity-90">
              Capture your thoughts. Master your memory. Choose where your vault
              lives.
            </p>
          </div>
        </div>

        {/* Right Side: Choices */}

        {providerType === "" ? (
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Setup your Vault</h2>
              <p className="text-muted-foreground">
                Select a storage method to begin syncing.
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleChoice("indexeddb")}
                className="flex items-center p-4 border border-slate-200 shadow-lg rounded-xl hover:bg-indigo-100 transition-colors text-left group"
              >
                <div className="w-12 h-12 bg-blue-200 text-white rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
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
                className="flex items-center p-4 border border-slate-200 shadow-lg rounded-xl hover:bg-indigo-100 transition-colors text-left group"
              >
                <div className="w-12 h-12 bg-indigo-400 text-white rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
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
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 space-y-8">
            <div className="space-y-2 mx-auto text-center max-w-md">
              <div className="text-4xl">🔑</div>
              <h2 className="text-2xl font-bold">Permission Required</h2>
              <p className="text-muted-foreground">
                To sync with <strong>{providerType}</strong>, Genaul needs your
                permission to create a private folder in your storage.
              </p>
              <button
                onClick={() => handleAuth(providerType)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
              >
                Grant Permission
              </button>
              <button
                onClick={() => setProvider("")}
                className="text-sm text-slate-500 underline"
              >
                Change Storage Method
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

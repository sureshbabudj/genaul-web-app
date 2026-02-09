import { QueryClient, useQuery } from "@tanstack/react-query";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { createProviderInstance } from "@/lib/providers";
import { LogOut, Download, ArrowLeft, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useNavigate } from "react-router";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function Settings() {
  const navigate = useNavigate();
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const providerType = useGenaulStore((s) => s.vaultProvider);
  const setVaultProvider = useGenaulStore((s) => s.setVaultProvider);
  const session = useGenaulStore((s) => s.vaultSession);
  const setSession = useGenaulStore((s) => s.setVaultSession);

  // Initialize the provider for metadata fetching
  const provider = useMemo(() => {
    const p = createProviderInstance(providerType);
    if (p && "setToken" in p && session?.access_token) {
      p.setToken(session.access_token);
    }
    return p;
  }, [providerType, session]);

  // Fetch Account Info (Email, Name, Avatar)
  const { data: account } = useQuery({
    queryKey: ["vault-account", providerType],
    queryFn: () => provider?.getAccountInfo?.(),
    enabled: !!provider && !!session,
  });

  // Fetch Storage Metadata
  const { data: storage } = useQuery({
    queryKey: ["vault-storage", providerType],
    queryFn: () => provider?.getStorageMetadata?.(),
    enabled: !!provider,
  });

  const handleLogout = async () => {
    if (provider) await provider.logout();
    setSession(null); // Triggers ProtectedLayout to redirect
    const queryClient = new QueryClient();
    await queryClient.clear();
    setVaultProvider(""); // Reset to onboarding state
  };

  const onRevoke = async () => {
    if (!provider) return;
    await provider.revokeAndReset();
    setSession(null);
    const queryClient = new QueryClient();
    await queryClient.clear();
    setVaultProvider(""); // Reset to onboarding state
  };

  const handleExportExcel = () => {
    const { halls, echoes } = useGenaulStore.getState();
    const headers = ["Type", "ID", "Name/Front", "Back", "HallID"];
    const hallRows = halls.map((h) => ["Hall", h.id, h.name, "", ""]);
    const echoRows = echoes.map((e) => [
      "Echo",
      e.id,
      e.front,
      e.back,
      e.hallId,
    ]);
    const csvContent = [headers, ...hallRows, ...echoRows]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `genaul_export_${new Date().toISOString()}.csv`,
    );
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFF] p-4 font-sans">
      <DashboardHeader />
      <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
        <div className="flex gap-4 items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 font-bold border border-slate-100 bg-slate-100 hover:bg-indigo-100 p-2 rounded-xl flex items-center gap-2"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Vault Settings</h1>
        </div>

        {/* Account Profile Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-indigo-50 border border-slate-100 flex items-center justify-center overflow-hidden">
              {account?.avatarUrl ? (
                <img
                  src={account.avatarUrl}
                  alt={account.name || "User Avatar"}
                  width="56"
                  height="56"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-indigo-600 font-bold text-xl uppercase">
                  {account?.name?.[0] || "U"}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {account?.name || "Vault User"}
              </h3>
              <p className="text-sm text-slate-500">
                {account?.email || "Local Session"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Provider
              </span>
              <span className="font-medium flex items-center gap-1 capitalize">
                {providerType?.replace("-", " ")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Usage
              </span>
              <span className="font-medium">
                {storage?.used || "Checking..."}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleExportExcel}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Export Vault as Excel</span>
            </div>
          </button>

          {providerType !== "indexeddb" && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors text-red-600"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </div>
            </button>
          )}

          <button
            onClick={() => setShowRevokeModal(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <Trash2Icon className="w-5 h-5" />
              <span className="font-medium">
                {providerType !== "indexeddb"
                  ? "Delete Cloud Data & Revoke Access"
                  : "Delete Local Data"}
              </span>
            </div>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Genaul v1.0.0 — Secured with {providerType}
      </p>

      {/* modal */}
      {showRevokeModal && (
        <ConfirmationModal
          isOpen={!!setShowRevokeModal}
          title={
            providerType !== "indexeddb"
              ? "Delete Cloud Data & Revoke Access"
              : "Delete Local Data"
          }
          message="Are you sure you want to delete this Hall? All associated Echoes will also be deleted."
          onCancel={() => setShowRevokeModal(false)}
          onConfirm={onRevoke}
        />
      )}
    </div>
  );
}

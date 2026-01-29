import { useGenaulStore } from "@/hooks/useGenaulStore";
import type { Hall } from "@/types";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";
import ActionMenu from "./ActionMenu";

export function EchoesList({ activeHall }: { activeHall: Hall }) {
  const { echoes, deleteEcho } = useGenaulStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEchoId, setSelectedEchoId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSelectedEchoId(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEchoId) {
      deleteEcho(selectedEchoId);
    }
    setModalOpen(false);
    setSelectedEchoId(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setSelectedEchoId(null);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 mb-4">Stored Echoes</h3>
      {echoes.filter((e) => e.hallId === activeHall.id).length === 0 ? (
        <p className="text-slate-700 italic">
          This hall is silent. Add an Echo to start learning.
        </p>
      ) : (
        echoes
          .filter((e) => e.hallId === activeHall.id)
          .map((echo) => (
            <div
              key={echo.id}
              className="group flex justify-between items-center p-4 rounded-xl border border-slate-50 hover:border-indigo-100 transition gap-4"
            >
              <div className="overflow-hidden">
                <p className="font-bold text-slate-800">{echo.front}</p>
                <p className="text-sm text-slate-600 truncate">{echo.back}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-600 uppercase">
                  Next: {new Date(echo.nextReview).toLocaleDateString()}
                </span>
                <ActionMenu
                  actions={[
                    {
                      label: "Delete",
                      onClick: () => handleDelete(echo.id),
                      isDestructive: true,
                    },
                  ]}
                />
              </div>
            </div>
          ))
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Echo"
        message="Are you sure you want to delete this Echo?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

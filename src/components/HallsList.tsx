import { useGenaulStore } from "@/hooks/useGenaulStore";
import { ArrowRight, Plus, Warehouse } from "lucide-react";
import { useState } from "react";
import ActionMenu from "./ActionMenu";
import ConfirmationModal from "./ConfirmationModal";
import InlineEdit from "@/components/InlineEdit";

export function HallsList() {
  const {
    halls,
    createHall,
    deleteHall,
    getDueEchoes,
    getLastActiveHallId,
    setLastActiveHallId,
    updateHall, // Ensure updateHall is destructured
  } = useGenaulStore();

  const [activeHallId, setActiveHallId] = useState<string | null>(() => {
    return getLastActiveHallId();
  });
  const [showCreateHall, setShowCreateHall] = useState(false);
  const [newHallName, setNewHallName] = useState("");
  const [hallToDelete, setHallToDelete] = useState<string | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);

  const handleSetActiveHall = async (hallId: string) => {
    setActiveHallId(hallId);
    await setLastActiveHallId(hallId);
  };

  const handleDeleteHall = async () => {
    if (hallToDelete) {
      await deleteHall(hallToDelete);
      setHallToDelete(null);
    }
  };

  const handleEditHall = async (hallId: string, newName: string) => {
    if (newName) {
      await updateHall(hallId, newName);
    }
  };

  return (
    <>
      <section className="lg:col-span-4 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          Your Halls
        </h2>
        {halls.length === 0 ? (
          <div className="flex flex-col gap-8 rounded-3xl border-2 border-dashed border-indigo-100 bg-indigo-50/30 text-center py-8">
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Warehouse size={64} className="mb-4 text-slate-300" />
              <p className="text-xl font-medium">
                Create a Hall to begin your study session
              </p>
            </div>
            <button
              onClick={() => setShowCreateHall(true)}
              className="bg-indigo-500 text-sm font-bold text-white rounded-full py-2 px-5 flex items-center gap-2 mx-auto"
            >
              Build your first Hall <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {halls.map((hall) => {
              const dueCount = getDueEchoes(hall.id).length;
              return (
                <div key={hall.id} className="relative">
                  <div
                    onClick={() => handleSetActiveHall(hall.id)}
                    className={`relative w-full text-left p-5 rounded-2xl transition-all cursor-pointer ${
                      activeHallId === hall.id
                        ? "bg-white border-indigo-600 shadow-xl shadow-indigo-100/50 border-l-4"
                        : "bg-white/50 border-transparent hover:bg-white border"
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    {dueCount > 0 && (
                      <span className="absolute top-0 right-0 min-w-12 max-w-14 truncate text-center bg-amber-100 text-amber-700 text-[10px] font-black px-1 py-0.5 rounded-tr-md uppercase">
                        {dueCount} Due
                      </span>
                    )}
                    <div className="flex justify-between items-stretch">
                      <div className="flex flex-col items-start gap-1">
                        <InlineEdit
                          value={hall.name}
                          onChange={(newValue) => handleEditHall(hall.id, newValue as string)}
                          onSave={() => {}}
                          className={`font-bold ${
                            activeHallId === hall.id ? "text-indigo-600" : "text-slate-700"
                          }`}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          {hall.echoIds.length} Echoes
                        </p>
                      </div>

                      <ActionMenu
                        actions={[
                          {
                            label: "Delete",
                            onClick: () => {
                              setSelectedHall(hall.id);
                              setHallToDelete(hall.id);
                            },
                            isDestructive: true,
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => setShowCreateHall(true)}
              className="w-full flex text-center px-4 py-3 items-center justify-center gap-2 font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              <Plus size={24} /> New Hall
            </button>
          </>
        )}
      </section>

      {/* Create Hall Modal */}
      {showCreateHall && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Build a New Hall</h3>
            <input
              autoFocus
              className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 mb-6 focus:ring-2 ring-indigo-500 outline-none font-medium"
              placeholder="e.g. Ancient Philosophy"
              value={newHallName}
              onChange={(e) => setNewHallName(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateHall(false)}
                className="flex-1 py-4 font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (newHallName) {
                    const hallId = await createHall(newHallName);
                    setLastActiveHallId(hallId);
                    setNewHallName("");
                    setShowCreateHall(false);
                  }
                }}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Hall Confirmation Modal */}
      {hallToDelete && (
        <ConfirmationModal
          isOpen={!!hallToDelete}
          title="Delete Hall"
          message="Are you sure you want to delete this Hall? All associated Echoes will also be deleted."
          onCancel={() => setHallToDelete(null)}
          onConfirm={handleDeleteHall}
        />
      )}

      {/* Bottom Sheet for Mobile */}
      {showBottomSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white relative rounded-t-xl p-6 shadow-2xl">
            <div
              className="absolute inset-0 top-0 flex flex-col justify-between items-center p-2 cursor-pointer w-15 h-6 mx-auto"
              onClick={() => setShowBottomSheet(false)}
            >
              <div className="w-full h-full border-t border-slate-300" />
              <div className="w-full h-full border-t border-slate-300" />
            </div>
            <h3 className="text-lg font-bold mb-4">Actions</h3>
            <button
              onClick={() => {
                setHallToDelete(selectedHall);
                setShowBottomSheet(false);
              }}
              className="w-full py-3 text-red-600 font-bold hover:bg-red-100 rounded-lg"
            >
              Delete
            </button>
            <div className="border-t border-slate-200 my-2" />
            <button
              onClick={() => setShowBottomSheet(false)}
              className="w-full py-3 font-bold hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

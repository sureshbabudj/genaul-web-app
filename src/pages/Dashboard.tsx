import React, { useState, useEffect } from "react";
import { Plus, Layers, X } from "lucide-react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { useNavigate } from "react-router";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EchoesList } from "@/components/EchoesList";
import { HallsList } from "@/components/HallsList";
import InlineEdit from "@/components/InlineEdit";

const Dashboard: React.FC = () => {
  const {
    halls,
    addEcho,
    getDueEchoes,
    getLastActiveHallId,
    setLastActiveHallId,
    updateHall, // Ensure updateHall is destructured
  } = useGenaulStore();

  // UI State
  const activeHallId = getLastActiveHallId();
  const [showAddEcho, setShowAddEcho] = useState(false);

  // Persist activeHallId to store/localStorage whenever it changes
  useEffect(() => {
    setLastActiveHallId(activeHallId);
  }, [activeHallId, setLastActiveHallId]);

  const activeHall = halls.find((h) => h.id === activeHallId);
  const totalDue = halls.reduce((acc, h) => acc + getDueEchoes(h.id).length, 0);

  // Inside your component:
  const navigate = useNavigate();

  const startRecall = () => {
    if (!activeHallId) return;
    navigate(`/recall?hallId=${activeHallId}`);
  };

  const handleEditHall = async (newName: string) => {
    if (activeHallId && newName) {
      await updateHall(activeHallId, newName);
    }
  };

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  return (
    <div className="min-h-screen bg-[#FAFAFF] p-4 font-sans">
      <DashboardHeader startRecall={startRecall} totalDue={totalDue} />

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Halls List */}
        <HallsList />

        {/* Main Content: Active Hall Details */}
        <section className="lg:col-span-8">
          {activeHall ? (
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <InlineEdit
                  value={activeHall.name}
                  onChange={(newValue) => handleEditHall(newValue as string)}
                  onSave={() => {}}
                  className="text-xl md:text-3xl font-black tracking-tighter text-slate-900"
                />
                <button
                  onClick={() => setShowAddEcho(true)}
                  className="flex text-sm md:text-md items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition"
                >
                  <Plus size={18} />{" "}
                  <span className="hidden md:block">Add Echo</span>
                </button>
              </div>

              {/* Echoes List */}
              <EchoesList activeHall={activeHall} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Layers size={64} className="mb-4 text-slate-300" />
              <p className="text-xl font-medium">
                Select a Hall to begin your study session
              </p>
            </div>
          )}
        </section>
      </main>

      {/* --- Modals --- */}

      {/* Add Echo Echo */}
      {showAddEcho && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="text-2xl font-black">New Echo</h3>
              <button onClick={() => setShowAddEcho(false)}>
                <X />
              </button>
            </div>
            <div className=" space-y-4 mb-8">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                  Front (Prompt)
                </label>
                <textarea
                  className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 ring-indigo-500 outline-none"
                  rows={2}
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                  Back (Answer)
                </label>
                <textarea
                  className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 ring-indigo-500 outline-none"
                  rows={3}
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (activeHallId && front && back) {
                  addEcho(activeHallId, front, back);
                  setFront("");
                  setBack("");
                  setShowAddEcho(false);
                }
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100"
            >
              Store Echo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

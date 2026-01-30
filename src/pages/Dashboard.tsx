import React, { useState, useEffect } from "react";
import { Plus, Layers } from "lucide-react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { useNavigate } from "react-router";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EchoesList } from "@/components/EchoesList";
import { HallsList } from "@/components/HallsList";
import InlineEdit from "@/components/InlineEdit";
import { EchoForm } from "@/components/EchoForm";

const Dashboard: React.FC = () => {
  const { halls, getLastActiveHallId, setLastActiveHallId, updateHall } =
    useGenaulStore();

  // UI State
  const activeHallId = getLastActiveHallId();
  const [showAddEcho, setShowAddEcho] = useState(false);

  // Persist activeHallId to store/localStorage whenever it changes
  useEffect(() => {
    setLastActiveHallId(activeHallId);
  }, [activeHallId, setLastActiveHallId]);

  const activeHall = halls.find((h) => h.id === activeHallId);

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

  return (
    <div className="min-h-screen bg-[#FAFAFF] p-4 font-sans">
      <DashboardHeader startRecall={startRecall} />

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
        <EchoForm
          closeModal={() => setShowAddEcho(false)}
          hallId={activeHallId!}
        />
      )}
    </div>
  );
};

export default Dashboard;

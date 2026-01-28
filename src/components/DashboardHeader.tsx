import { useGenaulStore } from "@/hooks/useGenaulStore";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export function DashboardHeader({
  startRecall,
  totalDue,
}: {
  startRecall: () => void;
  totalDue: number;
}) {
  const { getLastActiveHallId } = useGenaulStore();
  const [activeHallId] = useState<string | null>(getLastActiveHallId());
  return (
    <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 py-2">
      <Link to="/" className="flex items-center gap-2">
        <div className="border-indigo-600 p-1.5 rounded-lg shadow-inner">
          <img src="./icon.svg" className="text-white w-6 h-6 color-white" />
        </div>

        <span className="text-2xl font-black text-slate-900 tracking-tighter">
          GENAUL.
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={startRecall}
          disabled={!activeHallId}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Recall Now
        </button>

        <div className="relative p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <Bell size={20} className="text-slate-400" />
          {totalDue > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {totalDue}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

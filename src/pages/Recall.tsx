import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Zap,
  FastForward,
} from "lucide-react";
import type { Grade, Echo } from "@/types";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import RichTextEditor from "@/components/RichTextEditor";

const RecallPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get("hallId");

  const {
    getDueEchoes,
    recallEcho,
    halls,
    echoes: allEchoes,
  } = useGenaulStore();

  const [dueEchoes, setDueEchoes] = useState<Echo[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Function to initialize the session
  const initSession = useCallback(
    (forceAll = false) => {
      if (!hallId) return;

      let echoesToStudy: Echo[] = [];
      if (forceAll) {
        // "Revise Anyway" logic: ignore the FSRS timers
        echoesToStudy = allEchoes.filter((e) => e.hallId === hallId);
      } else {
        // Standard SRS logic
        echoesToStudy = getDueEchoes(hallId);
      }

      setDueEchoes(echoesToStudy);
      setCurrentIndex(0);
      setSessionFinished(false);
      setIsLoading(false);
    },
    [hallId, allEchoes, getDueEchoes],
  );

  useEffect(() => {
    initSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hallId]);

  const activeHall = halls.find((h) => h.id === hallId);
  const currentEcho = dueEchoes[currentIndex];
  const totalItems = dueEchoes.length;
  const progress = totalItems > 0 ? (currentIndex / totalItems) * 100 : 0;

  const handleGrade = (grade: Grade) => {
    if (!currentEcho) return;

    recallEcho(currentEcho.id, grade);

    if (grade === 1) {
      setDueEchoes((prev) => [...prev, currentEcho]);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
    } else {
      if (currentIndex < totalItems - 1) {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
      } else {
        setSessionFinished(true);
      }
    }
  };

  if (isLoading) return null;

  // --- Success State ---
  if (sessionFinished) {
    return (
      <div className="min-h-dvh bg-indigo-600 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-white/20 text-white rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12 shadow-2xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
          Hall Cleared.
        </h2>
        <p className="text-indigo-100 mb-10 text-lg max-w-xs opacity-90">
          Your echoes are reinforced.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-indigo-600 py-4 rounded-2xl font-black shadow-xl"
          >
            Finish Session
          </button>
          <button
            onClick={() => initSession(true)}
            className="text-white/60 hover:text-white font-bold text-sm transition-colors"
          >
            Revise Again Anyway
          </button>
        </div>
      </div>
    );
  }

  // --- Initial Empty State (With Revise Again Option) ---
  if (!hallId || dueEchoes.length === 0 || !currentEcho) {
    return (
      <div className="min-h-dvh bg-[#FAFAFF] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-white border border-slate-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
          <Zap size={32} fill="currentColor" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Chamber is Silent
        </h2>
        <p className="text-slate-500 mb-10 max-w-xs">
          No Echoes are due for recall right now.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Main option to bypass SRS */}
          <button
            onClick={() => initSession(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
          >
            <RotateCcw size={18} /> Revise All Echoes
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="py-4 text-slate-400 font-bold hover:text-slate-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Active Session ---
  return (
    <div className="bg-[#FAFAFF] h-dvh flex flex-col items-center">
      <nav className="w-full max-w-4xl flex justify-between items-center p-6 md:p-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-3 bg-white border border-slate-100 rounded-2xl hover:text-indigo-600 transition shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 block mb-1">
            {activeHall?.name}
          </span>
          <div className="h-1 w-24 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="w-12 text-right text-xs font-bold text-slate-400">
          {currentIndex + 1}/{totalItems}
        </div>
      </nav>

      <div className="flex-1 w-full pb-8 overflow-hidden max-w-xl px-6 flex flex-col items-center justify-center">
        <div
          className="relative w-full h-full aspect-4/5 perspective-distant"
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          <div
            className={`relative w-full h-full transition-all duration-700 transform-3d ${isFlipped ? "transform-[rotateY(180deg)]" : ""}`}
          >
            <div className="absolute inset-0 rounded-[3.5rem] bg-indigo-600 shadow-xl shadow-indigo-100/10 flex flex-col items-center justify-center p-10 backface-hidden">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white  text-center  tracking-tight leading-tight">
                {currentEcho.front}
              </h2>
            </div>
            <div className="absolute inset-0 bg-white border border-slate-100  rounded-[3.5rem] shadow-xl flex flex-col items-center justify-center p-10 backface-hidden transform-[rotateY(180deg)]">
              <div className="flex flex-col min-h-0">
                <RichTextEditor
                  viewMode={true}
                  content={currentEcho.back}
                  onUpdate={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-2xl p-8 mb-4">
        {!isFlipped ? (
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-6 bg-slate-900 text-white rounded-4xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all"
          >
            Reveal Echo
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-3 animate-in slide-in-from-bottom-4">
            <GradeButton
              label="Again"
              color="bg-rose-50 text-rose-600"
              icon={<RotateCcw size={18} />}
              onClick={() => handleGrade(1)}
            />
            <GradeButton
              label="Hard"
              color="bg-orange-50 text-orange-600"
              icon={<AlertCircle size={18} />}
              onClick={() => handleGrade(2)}
            />
            <GradeButton
              label="Good"
              color="bg-emerald-50 text-emerald-600"
              icon={<CheckCircle2 size={18} />}
              onClick={() => handleGrade(3)}
            />
            <GradeButton
              label="Easy"
              color="bg-indigo-50 text-indigo-600"
              icon={<FastForward size={18} />}
              onClick={() => handleGrade(4)}
            />
          </div>
        )}
      </footer>
    </div>
  );
};

const GradeButton = ({
  label,
  color,
  icon,
  onClick,
}: {
  label: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`${color} flex flex-col items-center justify-center py-5 rounded-3xl transition-all active:scale-90 border border-transparent hover:border-current`}
  >
    {icon}
    <span className="text-[9px] font-black uppercase mt-2 tracking-widest">
      {label}
    </span>
  </button>
);

export default RecallPage;

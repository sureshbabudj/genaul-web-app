import React, { useEffect, useState } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { SidebarTree } from "@/components/SidebarTree";
import { EditorPane } from "@/components/EditorPane";
import { SEO } from "@/components/SEO";
import { Menu } from "lucide-react";

const Dashboard: React.FC = () => {
  const { getLastActiveHallId, setLastActiveHallId } = useGenaulStore();
  const activeHallId = getLastActiveHallId();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLastActiveHallId(activeHallId);
  }, [activeHallId, setLastActiveHallId]);

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFF] font-sans overflow-hidden">
      <SEO title="Dashboard" noindex={true} />

      {/* Mobile Header (Hidden on Desktop) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0 shadow-sm z-10">
        <h1 className="font-bold text-lg text-slate-800">Genaul</h1>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden w-full relative">
        {/* Desktop Sidebar (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:block lg:w-72 xl:w-80 2xl:w-96 shrink-0 h-full border-r border-slate-200 bg-slate-50">
          <SidebarTree />
        </div>

        {/* Mobile/Tablet Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Sidebar Content */}
            <div className="relative w-4/5 max-w-sm h-full bg-slate-50 shadow-2xl flex flex-col">
              <div className="flex-1 overflow-hidden">
                <SidebarTree onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Editor Pane */}
        <div className="flex-1 h-full min-w-0 bg-white">
          <EditorPane />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

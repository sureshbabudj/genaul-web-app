import React, { useEffect } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import { SidebarTree } from "@/components/SidebarTree";
import { EditorPane } from "@/components/EditorPane";
import { SEO } from "@/components/SEO";

const Dashboard: React.FC = () => {
  const { getLastActiveHallId, setLastActiveHallId } = useGenaulStore();
  const activeHallId = getLastActiveHallId();

  useEffect(() => {
    setLastActiveHallId(activeHallId);
  }, [activeHallId, setLastActiveHallId]);

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFF] font-sans overflow-hidden">
      <SEO title="Dashboard" noindex={true} />
      
      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden w-full">
        {/* Left Sidebar */}
        <div className="w-64 md:w-72 shrink-0 h-full border-r border-slate-200 bg-slate-50">
          <SidebarTree />
        </div>

        {/* Main Editor Pane */}
        <div className="flex-1 h-full min-w-0 bg-white">
          <EditorPane />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

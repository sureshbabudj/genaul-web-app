import { LandingFooter } from "@/components/LandingFooter";
import { LandingHeader } from "@/components/LandingHeader";
import { Outlet } from "react-router";

export function PublicLayout() {
  return (
    <div className="min-h-screen text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <LandingHeader />
      <div className="flex-1 min-h-full">
        <Outlet />
      </div>
      <LandingFooter />
    </div>
  );
}

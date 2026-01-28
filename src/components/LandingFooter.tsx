import { NavLink } from "./LandingHeader";

export function LandingFooter() {
  return (
    <footer className="py-20 text-center border-t border-indigo-50 bg-white">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="border-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
          <img src="./icon.svg" className="text-white w-6 h-6 color-white" />
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tighter">
          GENAUL.
        </span>
      </div>
      <p className="text-slate-400 font-medium">Capture. Learn. Master.</p>
      <nav className="mt-6 flex items-center justify-center gap-8">
        <NavLink href="/privacy-policy">Privacy Policy</NavLink>
        <NavLink href="/terms-and-conditions">Terms & Conditions</NavLink>
      </nav>
      <p className="text-slate-300 mt-6 text-sm">
        &copy; {new Date().getFullYear()} Genaul. All rights reserved.
      </p>
    </footer>
  );
}

import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a
    href={href}
    className="text-slate-600 hover:text-indigo-600 transition font-medium"
  >
    {children}
  </a>
);

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header>
      {/* Navigation */}
      <nav className="w-full backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="border-indigo-600 p-1.5 rounded-lg shadow-inner">
                <img
                  src="./icon.svg"
                  className="text-white w-6 h-6 color-white"
                />
              </div>

              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                GENAUL.
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#algorithm">FSRS Alpha</NavLink>
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200/50">
                Get Started
              </button>
            </div>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

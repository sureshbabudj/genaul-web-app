import React from "react";
import {
  Sparkles,
  BrainCircuit,
  Timer,
  Target,
  Layers,
  Zap,
  ArrowRight,
} from "lucide-react";
import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { Link } from "react-router";

// --- Interfaces ---
interface FeatureProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  gradient: string;
}

interface GlassButtonProps {
  children: React.ReactNode;
  primary?: boolean;
}

// --- Components ---
const GlassButton: React.FC<GlassButtonProps> = ({ children, primary }) => (
  <button
    className={`
    px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3
    ${
      primary
        ? "bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1"
        : "bg-white text-indigo-900 border border-indigo-100 hover:bg-indigo-50"
    }
  `}
  >
    {children}
  </button>
);

const FeatureSection: React.FC<FeatureProps> = ({
  icon,
  label,
  title,
  description,
  gradient,
}) => (
  <div className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] overflow-hidden">
    <div
      className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full ${gradient}`}
    />
    <div className="relative z-10">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br ${gradient} text-white shadow-lg`}
      >
        {icon}
      </div>
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3 block">
        {label}
      </span>
      <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 leading-relaxed text-lg">{description}</p>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen container mx-auto text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <LandingHeader />
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Abstract Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 blur-[100px] rounded-full" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-indigo-50 shadow-sm mb-10">
            <Sparkles size={16} className="text-indigo-500" />
            <span className="text-sm font-bold text-indigo-950 tracking-wide">
              The Future of Memory
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
            The Hall of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500">
              Perfect Recall.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12">
            Genaul is a{" "}
            <span className="text-indigo-600">sanctuary for your thoughts</span>
            . We use predictive intelligence to ensure you never forget what
            truly matters.
          </p>

          <Link
            to="/dashboard"
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <GlassButton primary>
              Enter the Hall <ArrowRight size={20} />
            </GlassButton>
            <GlassButton>Explore Features</GlassButton>
          </Link>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureSection
            icon={<BrainCircuit size={28} />}
            label="Intelligence"
            title="Predictive Retention"
            description="Our FSRS algorithm maps your unique forgetting curve, showing you cards at the exact moment your brain is ready to let go."
            gradient="from-indigo-600 to-indigo-400"
          />

          <FeatureSection
            icon={<Layers size={28} />}
            label="Structure"
            title="Rich Media Canvas"
            description="From complex mathematical proofs to language phonetics. Study with native support for LaTeX, code, and high-fidelity audio."
            gradient="from-blue-600 to-indigo-500"
          />

          <FeatureSection
            icon={<Target size={28} />}
            label="Focus"
            title="Deep Work Mode"
            description="A distraction-free environment with integrated Pomodoro cycles to keep your sessions intense and effective."
            gradient="from-blue-500 to-blue-600"
          />

          <FeatureSection
            icon={<Zap size={28} />}
            label="Speed"
            title="Instant Ingestion"
            description="Capture knowledge in seconds. Your 'Aula' synchronizes instantly across every device you own."
            gradient="from-blue-500 to-blue-400"
          />

          <FeatureSection
            icon={<Timer size={28} />}
            label="Consistency"
            title="Visual Mastery"
            description="Track your cognitive growth through beautiful heatmaps and habit-forming streaks that reward your progress."
            gradient="from-blue-900 to-blue-700"
          />

          <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200">
            <h3 className="text-3xl font-bold leading-tight">
              Ready to <br />
              Transform your <br />
              Mind?
            </h3>
            <button className="mt-8 flex items-center gap-2 font-bold hover:gap-4 transition-all">
              Join the waitlist <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;

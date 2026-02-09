import React, { useState } from "react";
import {
  Sparkles,
  BrainCircuit,
  Timer,
  Target,
  Layers,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";

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

interface FAQProps {
  question: string;
  answer: string;
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

const FAQItem: React.FC<FAQProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-indigo-600 transition-colors"
      >
        <span className="text-lg font-bold text-slate-800">{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="pb-6 text-slate-500 leading-relaxed text-md animate-in fade-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <>
      <SEO />
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/dashboard">
              <GlassButton primary>
                Enter the Hall <ArrowRight size={20} />
              </GlassButton>
            </Link>
            <a href="#features">
              <GlassButton>Explore Features</GlassButton>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="features">
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
            <Link
              to="/dashboard"
              className="mt-8 flex items-center gap-2 font-bold hover:gap-4 transition-all"
            >
              Get Started <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Visual Side: The Brand Mark Study */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-indigo-50 rounded-[3rem] -rotate-3 scale-105" />
              <div className="relative bg-white border border-indigo-100 p-12 rounded-[3rem] shadow-2xl">
                <div className="flex flex-col gap-12">
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-black text-indigo-600">
                        Gen
                      </span>
                      <span className="text-slate-300 text-3xl font-light">
                        / gnōsis /
                      </span>
                    </div>
                    <p className="text-xl text-slate-600 font-medium">
                      The Greek pursuit of{" "}
                      <span className="text-indigo-600">Knowledge</span>. Not
                      just information, but the deep, intuitive insight that
                      comes from total mastery.
                    </p>
                  </div>

                  <div className="w-full h-px bg-slate-100 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                      <ShieldCheck className="text-indigo-200 w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-black text-blue-600">
                        Aul
                      </span>
                      <span className="text-slate-300 text-3xl font-light">
                        / aula /
                      </span>
                    </div>
                    <p className="text-xl text-slate-600 font-medium">
                      The Latin concept of the{" "}
                      <span className="text-blue-600">Hall</span>. A sacred,
                      architectural space dedicated to focus, ceremony, and the
                      preservation of truth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Side: The Manifesto */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="inline-block px-4 py-1 rounded-md bg-indigo-50 text-indigo-600 font-bold text-sm uppercase tracking-widest">
                The Philosophy
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">
                Architecting the <br />
                Digital Mind.
              </h2>
              <div className="space-y-6 text-lg text-slate-500 leading-relaxed">
                <p>
                  The modern student is drowning in a sea of fragmented data.
                  Information is easy to find, but hard to{" "}
                  <span className="text-slate-900 font-semibold italic text-indigo-600/80">
                    keep
                  </span>
                  .
                </p>
                <p>
                  <span className="text-slate-900 font-bold">Genaul</span> was
                  born from a simple question: What if we treated our memory
                  with the same architectural rigor as a cathedral?
                </p>
                <p>
                  By combining the ancient discipline of the "Memory Palace"
                  with state-of-the-art predictive algorithms, we’ve built more
                  than a flashcard app. We’ve built a{" "}
                  <span className="text-slate-900 font-semibold">
                    sanctuary for insight
                  </span>
                  .
                </p>
              </div>

              <div className="pt-6 flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">
                    100%
                  </span>
                  <span className="text-sm text-slate-400 font-medium">
                    Sovereign Data
                  </span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">0ms</span>
                  <span className="text-sm text-slate-400 font-medium">
                    Latency Sync
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 text-center tracking-tight">
          Common Questions
        </h2>
        <div className="space-y-2">
          <FAQItem
            question="Where is my data actually stored?"
            answer="Genaul is a privacy-first application. Your 'Halls' and 'Echoes' are stored directly in your own personal cloud—either Google Drive's appDataFolder, Apple iCloud (CloudKit), or locally in your browser's IndexedDB. We never see your data."
          />
          <FAQItem
            question="Can I use it offline?"
            answer="Yes. Genaul uses an Offline-First architecture. If you choose the IndexedDB provider, your data stays strictly in your browser. If using Cloud providers, the app will sync your changes as soon as you reconnect."
          />
          <FAQItem
            question="What happens if I want to switch cloud providers?"
            answer="You can use the 'Export' feature in your Account settings to download your entire vault as an Excel/CSV file. You can then revoke permissions from your old provider and start fresh with a new one."
          />
          <FAQItem
            question="Is the 'Silent Refresh' for Google Drive secure?"
            answer="Absolutely. We use Google's official Identity Services. By using silent refreshes, we ensure your session stays active without storing long-lived 'Refresh Tokens' in your browser, keeping your account highly secure."
          />
          <FAQItem
            question="How do I permanently delete my data?"
            answer="Genaul gives you full control. Under settings, the 'Revoke & Reset' option will not only sign you out but will physically send a command to Google or Apple to delete your vault.json file from their servers."
          />
        </div>
      </section>
    </>
  );
};

export default LandingPage;

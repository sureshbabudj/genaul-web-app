import { Scale, AlertTriangle } from "lucide-react";
import { SEO } from "../components/SEO";
import { PageFooter } from "@/components/PageFooter";

const TermsAndConditions = () => {
  return (
    <div className="bg-slate-50 py-16 px-6">
      <SEO
        title="Terms and Conditions"
        description="Terms and Conditions for Genaul. Please read carefully."
      />
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-100 shadow-sm">
        <header className="mb-12">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <Scale size={28} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
            Terms of Use
          </h1>
          <p className="text-slate-500 font-medium font-sans">
            Effective immediately.
          </p>
        </header>

        <div className="space-y-10 text-slate-600 leading-relaxed">
          <section className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
            <div className="flex gap-4">
              <AlertTriangle className="text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> Genaul is a tool for memory
                reinforcement. We provide the logic, but you provide the
                storage. We are not responsible for lost Echoes due to device
                failure or cleared caches.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              1. Acceptable Use
            </h2>
            <p>
              You agree to use Genaul for personal educational purposes. You are
              solely responsible for the content of the Echoes you create.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              2. Service Availability
            </h2>
            <p>
              Genaul is provided "as is." While we strive for 100% uptime,
              availability depends on your browser environment and third-party
              cloud providers (Google/Apple).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              3. Intellectual Property
            </h2>
            <p>
              The FSRS algorithm implementation and UI design are the property
              of Genaul. Your Echoes remain your intellectual property.
            </p>
          </section>
        </div>

        <PageFooter />
      </div>
    </div>
  );
};

export default TermsAndConditions;

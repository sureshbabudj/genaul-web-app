import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { SEO } from "../components/SEO";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-slate-50 py-16 px-6">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Genaul. Learn how we handle your data."
      />
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-100 shadow-sm">
        <header className="mb-12">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 font-medium">
            Last updated: January 2026
          </p>
        </header>

        <div className="space-y-10 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              1. The Genaul Philosophy
            </h2>
            <p>
              Genaul is built on a "Local-First" principle. By default, your
              Echoes and Halls are stored locally in your browser's database. We
              do not own, see, or sell your knowledge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              2. Cloud Synchronization
            </h2>
            <p>
              If you opt-in to Google Drive or Apple iCloud sync, your data is
              transmitted directly from your device to your personal cloud
              storage provider.
            </p>
            <ul className="list-disc ml-5 mt-4 space-y-2">
              <li>
                <strong>Google:</strong> We use the{" "}
                <code className="text-indigo-600 bg-indigo-50 px-1 rounded font-bold">
                  appDataFolder
                </code>{" "}
                scope, meaning we cannot see your other Drive files.
              </li>
              <li>
                <strong>Apple:</strong> Data is stored in your private iCloud
                container, inaccessible to us.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              3. Data Retention
            </h2>
            <p>
              Since we do not maintain a central database for your Echoes, your
              data is only as persistent as your local browser storage or your
              chosen cloud vault. Deleting your browser cache without cloud sync
              will result in permanent loss of your data.
            </p>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 font-bold hover:underline"
          >
            Go Back
          </button>
          <span className="text-slate-300 font-black tracking-widest text-xs uppercase">
            Genaul.
          </span>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

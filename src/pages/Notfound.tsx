import { useNavigate } from "react-router";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { SEO } from "../components/SEO";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 h-full bg-[#FAFAFF] flex flex-col items-center justify-between py-20 px-6 text-center">
      <SEO title="404 - Page Not Found" noindex={true} />
      <div className="relative mb-8">
        <div className="text-[12rem] font-black text-slate-100 leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 flex items-center justify-center rotate-12">
            <SearchX size={48} className="text-indigo-600" />
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
        This Hall is Empty.
      </h1>
      <p className="text-slate-500 mb-10 max-w-sm font-medium leading-relaxed">
        The chamber you are looking for doesn't exist or has been moved to
        another dimension.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-white hover:shadow-sm transition"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          <Home size={18} /> Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;

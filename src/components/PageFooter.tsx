import { useNavigate } from "react-router";

export function PageFooter() {
  const navigate = useNavigate();
  return (
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
  );
}

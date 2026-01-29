import { Loader } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-dvh bg-indigo-600 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="text-white flex items-center justify-center p-4">
        <Loader className="animate-spin" size={32} />
      </div>
      <h2 className="text-2xl text-white mb-4">Loading...</h2>
    </div>
  );
}

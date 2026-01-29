interface SyncLoaderProps {
  show: boolean;
  height?: string; // e.g., "3px"
  color?: string; // Indigo hex or Tailwind color
}

export function SyncLoader({ show, height = "3px" }: SyncLoaderProps) {
  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 w-full overflow-hidden"
      style={{ zIndex: 100, height }}
    >
      {/* The Track (Background) */}
      <div className="absolute inset-0 bg-indigo-300" />

      {/* The Moving Bar */}
      <div
        className="absolute h-full bg-indigo-600 animate-infinite-scroll"
        style={{
          width: "40%", // The width of the "slug" moving across
          boxShadow: "0 0 10px rgba(79, 70, 229, 0.8)", // Glowing Indigo shadow
          background:
            "linear-gradient(90deg, transparent, #4f46e5, transparent)",
        }}
      />
    </div>
  );
}

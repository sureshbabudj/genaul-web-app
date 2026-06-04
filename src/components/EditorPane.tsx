import React, { useEffect, useState } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import RichTextEditor from "./RichTextEditor";
import { FileText } from "lucide-react";

export function EditorPane() {
  const { echoes, lastActiveEchoId, updateEcho } = useGenaulStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const activeEcho = echoes.find((e) => e.id === lastActiveEchoId);

  // Sync state when activeEcho changes
  useEffect(() => {
    if (activeEcho) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(activeEcho.front);
      setContent(activeEcho.back);
    }
  }, [activeEcho]);

  if (!activeEcho) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <FileText size={64} className="mb-4 text-slate-300 opacity-50" />
        <p className="text-xl font-medium">No file is open</p>
        <p className="text-sm mt-2">
          Select a file from the sidebar to view or edit
        </p>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateEcho(activeEcho.id, newTitle, content);
  };

  const handleContentUpdate = (newContent: string) => {
    setContent(newContent);
    updateEcho(activeEcho.id, title, newContent);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header / Title area */}
      <div className="px-8 py-3 shrink-0 border-b border-transparent group focus-within:border-slate-100 transition-colors">
        <input
          type="text"
          className="w-full text-3xl font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Note"
        />
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-hidden">
        {/* We reuse RichTextEditor but strip its border/padding to fit the pane */}
        <div className="h-full [&>div]:h-full [&>div]:border-none [&>div]:bg-white [&>div]:rounded-none [&>div]:ring-0 [&>div>div:first-child]:border-t [&>div>div:first-child]:border-slate-100">
          <RichTextEditor content={content} onUpdate={handleContentUpdate} />
        </div>
      </div>
    </div>
  );
}

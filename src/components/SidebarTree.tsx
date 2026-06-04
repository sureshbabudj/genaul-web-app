import React, { useState, useEffect } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  MoreVertical,
  UserCircle2Icon,
  LogOut,
} from "lucide-react";
import ActionMenu from "./ActionMenu";
import { Link } from "react-router";

export function SidebarTree() {
  const {
    halls,
    echoes,
    createHall,
    addEcho,
    deleteHall,
    deleteEcho,
    lastActiveHallId,
    setLastActiveHallId,
    lastActiveEchoId,
    setLastActiveEchoId,
    logout,
  } = useGenaulStore();

  const [expandedHalls, setExpandedHalls] = useState<Set<string>>(new Set());
  const [showCreateHall, setShowCreateHall] = useState(false);
  const [newHallName, setNewHallName] = useState("");

  // Auto-expand the active hall on mount if needed
  useEffect(() => {
    if (lastActiveHallId) {
      setExpandedHalls((prev) => {
        const next = new Set(prev);
        next.add(lastActiveHallId);
        return next;
      });
    }
  }, [lastActiveHallId]);

  const toggleHall = (hallId: string) => {
    setExpandedHalls((prev) => {
      const next = new Set(prev);
      if (next.has(hallId)) {
        next.delete(hallId);
      } else {
        next.add(hallId);
      }
      return next;
    });
  };

  const handleCreateNote = async (hallId: string) => {
    // Create an empty echo and select it
    await addEcho(hallId, "Untitled Note", "");
    // Note: addEcho doesn't return the ID right now, we need to find the newest echo for this hall
    // Let's modify addEcho or just fetch it here.
    // Since addEcho modifies the state immediately, we can use a slight delay or get the store state.
    setTimeout(() => {
      const stateEchoes = useGenaulStore.getState().echoes;
      const hallEchoes = stateEchoes.filter((e) => e.hallId === hallId);
      const newest = hallEchoes[hallEchoes.length - 1];
      if (newest) {
        setLastActiveEchoId(newest.id);
        setLastActiveHallId(hallId);
        if (!expandedHalls.has(hallId)) toggleHall(hallId);
      }
    }, 50);
  };

  return (
    <aside className="w-full h-full flex flex-col bg-slate-50/50 border-r border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="border-indigo-600 p-1 rounded-lg shadow-inner bg-indigo-600">
            <img
              src="./icon.svg"
              alt="Genaul Logo"
              width="16"
              height="16"
              className="text-white w-4 h-4 color-white invert"
            />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter">
            GENAUL.
          </span>
        </Link>
        <button
          onClick={() => setShowCreateHall(true)}
          className="text-slate-400 hover:text-indigo-600 transition p-1"
          title="New Folder"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {halls.map((hall) => {
          const isExpanded = expandedHalls.has(hall.id);
          const hallEchoes = echoes.filter((e) => e.hallId === hall.id);

          return (
            <div key={hall.id} className="mb-1">
              {/* Folder Row */}
              <div
                className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors ${
                  lastActiveHallId === hall.id && !lastActiveEchoId
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => {
                  toggleHall(hall.id);
                  setLastActiveHallId(hall.id);
                }}
              >
                <div className="flex items-center gap-1 overflow-hidden">
                  <span className="text-slate-400 shrink-0">
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isExpanded ? <FolderOpen size={14} /> : <Folder size={14} />}
                  </span>
                  <span className="truncate">{hall.name}</span>
                </div>

                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateNote(hall.id);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600"
                    title="New Note"
                  >
                    <Plus size={14} />
                  </button>
                  <ActionMenu
                    trigger={
                      <div className="p-1 text-slate-400 hover:text-slate-800">
                        <MoreVertical size={14} />
                      </div>
                    }
                    actions={[
                      {
                        label: "Delete Folder",
                        onClick: () => deleteHall(hall.id),
                        isDestructive: true,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Files / Echoes List */}
              {isExpanded && (
                <div className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-2">
                  {hallEchoes.length === 0 ? (
                    <div className="px-2 py-1 text-xs text-slate-400 italic">
                      Empty folder
                    </div>
                  ) : (
                    hallEchoes.map((echo) => (
                      <div
                        key={echo.id}
                        onClick={() => {
                          setLastActiveEchoId(echo.id);
                          setLastActiveHallId(hall.id);
                        }}
                        className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
                          lastActiveEchoId === echo.id
                            ? "bg-indigo-100 text-indigo-800 font-medium"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <FileText size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate">
                            {echo.front || "Untitled"}
                          </span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <ActionMenu
                            trigger={
                              <div className="p-1 text-slate-400 hover:text-slate-800">
                                <MoreVertical size={12} />
                              </div>
                            }
                            actions={[
                              {
                                label: "Delete Note",
                                onClick: () => deleteEcho(echo.id),
                                isDestructive: true,
                              },
                            ]}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {halls.length === 0 && (
          <div className="text-center p-4 text-sm text-slate-500">
            <Folder size={32} className="mx-auto mb-2 text-slate-300" />
            <p>Your vault is empty.</p>
            <button
              onClick={() => setShowCreateHall(true)}
              className="mt-2 text-indigo-600 font-medium hover:underline"
            >
              Create a folder
            </button>
          </div>
        )}
      </div>

      {showCreateHall && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <input
            autoFocus
            className="w-full p-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
            placeholder="Folder name..."
            value={newHallName}
            onChange={(e) => setNewHallName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && newHallName.trim()) {
                await createHall(newHallName.trim());
                setNewHallName("");
                setShowCreateHall(false);
              } else if (e.key === "Escape") {
                setShowCreateHall(false);
              }
            }}
          />
          <div className="flex gap-2 text-xs">
            <button
              className="flex-1 bg-indigo-600 text-white rounded py-1.5 font-medium hover:bg-indigo-700 transition"
              onClick={async () => {
                if (newHallName.trim()) {
                  await createHall(newHallName.trim());
                  setNewHallName("");
                  setShowCreateHall(false);
                }
              }}
            >
              Create
            </button>
            <button
              className="flex-1 bg-slate-200 text-slate-700 rounded py-1.5 font-medium hover:bg-slate-300 transition"
              onClick={() => setShowCreateHall(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* User Footer */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between">
        <Link
          to="/settings"
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition font-medium text-sm"
        >
          <UserCircle2Icon size={18} />
          Settings
        </Link>
        <button
          onClick={() => logout()}
          className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-md hover:bg-red-50"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

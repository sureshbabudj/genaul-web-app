import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useGenaulStore } from "@/hooks/useGenaulStore";
import type { Echo } from "@/types";
import RichTextEditor from "./RichTextEditor";
import { X } from "lucide-react";

export function EchoForm({
  editingEcho,
  hallId,
  closeModal,
  onChange,
}: {
  editingEcho?: Echo;
  hallId?: string;
  closeModal: () => void;
  onChange?: (updatedEcho: Echo) => void;
}) {
  const updateEcho = useGenaulStore((s) => s.updateEcho);
  const addEcho = useGenaulStore((s) => s.addEcho);

  const [front, setFront] = useState(editingEcho ? editingEcho.front : "");
  const [back, setBack] = useState(editingEcho ? editingEcho.back : "");

  const saveEdit = () => {
    if (!editingEcho) {
      if (!hallId) return;
      addEcho(hallId, front, back);
    } else {
      updateEcho(editingEcho.id, front, back);
    }
    closeModal();
  };

  const handleChange = (field: "front" | "back", value: string) => {
    if (field === "front") {
      setFront(value);
    } else {
      setBack(value);
    }
    if (editingEcho) {
      const update = field === "front" ? { front: value } : { back: value };
      onChange?.({ ...editingEcho, ...update });
    }
  };

  return (
    <Transition appear as={Fragment} show={true}>
      <Dialog
        as="div"
        className="relative z-10"
        open={true}
        onClose={() => closeModal()}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10 bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`
                  w-full transform bg-white text-left align-middle shadow-xl transition-all p-6 fixed inset-0 overflow-hidden space-y-3 flex flex-col
                 lg:relative lg:inset-auto lg:h-auto lg:max-h-[80dvh] lg:max-w-[80%] lg:rounded-4xl lg:p-10 lg:my-8`}
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900">
                    Edit Echo
                  </h3>
                  <button
                    onClick={() => closeModal()}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Front (Prompt) Section */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Front (Prompt)
                  </label>
                  <input
                    value={front}
                    onChange={(e) => handleChange("front", e.target.value)}
                    className="w-full p-4 lg:p-6 text-lg rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 ring-indigo-500 outline-none transition-all"
                    placeholder="Enter prompt..."
                  />
                </div>

                {/* Back (Answer) Section */}
                <span className="flex flex-col min-h-0">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Back (Answer)
                  </label>
                  <RichTextEditor
                    content={back}
                    onUpdate={(content) => handleChange("back", content)}
                  />
                </span>

                {/* Footer Button - Fixed at bottom on mobile, relative on desktop */}
                <div className="mt-8 pt-4 border-t border-slate-50 lg:border-none">
                  <button
                    onClick={saveEdit}
                    className="w-full py-4 lg:py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

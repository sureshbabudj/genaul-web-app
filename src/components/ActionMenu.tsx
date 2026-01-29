import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { MoreVertical } from "lucide-react";

interface ActionMenuProps {
  actions: { label: string; onClick: () => void; isDestructive?: boolean }[];
  triggerClassName?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  actions,
  triggerClassName,
}) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  return (
    <div className="flex flex-row flex-0 align-items-end items-center gap-2">
      {/* Dropdown for large screens */}
      <Menu as="div" className="relative  text-left hidden lg:inline-block">
        <MenuButton
          className={`inline-flex justify-center w-full rounded-md border border-slate-100 shadow-xs p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none ${
            triggerClassName || ""
          }`}
        >
          <MoreVertical size={16} />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border-none ring-1 ring-slate-100 ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {actions.map((action, index) => (
                <MenuItem key={index}>
                  {({ active }: { active: boolean }) => (
                    <button
                      onClick={action.onClick}
                      className={`${
                        active
                          ? action.isDestructive
                            ? "bg-red-100 text-red-900"
                            : "bg-gray-100 text-gray-900"
                          : action.isDestructive
                            ? "text-red-700"
                            : "text-gray-700"
                      } group flex items-center px-4 py-2 text-sm w-full`}
                    >
                      {action.label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>

      {/* Bottom sheet trigger for small screens */}
      <button
        onClick={() => setShowBottomSheet(true)}
        className="lg:hidden inline-flex justify-center w-full rounded-md border border-slate-100 shadow-xs p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <MoreVertical size={16} />
      </button>

      {/* Bottom Sheet for Mobile */}
      {showBottomSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Actions</h3>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  setShowBottomSheet(false);
                }}
                className={`w-full py-4 font-bold rounded-xl mb-4 ${
                  action.isDestructive
                    ? "text-red-600 bg-red-100"
                    : "text-gray-700 bg-gray-100"
                }`}
              >
                {action.label}
              </button>
            ))}
            <button
              onClick={() => setShowBottomSheet(false)}
              className="w-full py-4 font-bold bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;

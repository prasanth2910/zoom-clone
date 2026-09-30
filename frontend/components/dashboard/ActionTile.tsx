"use client";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  onClick: () => void;
  iconBg?: string;
  disabled?: boolean;
}

export default function ActionTile({
  icon: Icon,
  label,
  sublabel,
  onClick,
  iconBg = "bg-[#0B5CFF]",
  disabled = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 sm:p-6 w-full shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:translate-y-0"
    >
      <div
        className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}
      >
        <Icon size={26} className="text-white" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
        {sublabel && (
          <p className="text-xs text-gray-500 mt-0.5 leading-tight">{sublabel}</p>
        )}
      </div>
    </button>
  );
}

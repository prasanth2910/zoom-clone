"use client";
import { X, MicOff, Shield } from "lucide-react";
import type { Participant } from "@/types/meeting";
import { getInitials } from "@/lib/utils";

interface Props {
  participants: Participant[];
  isHost: boolean;
  onClose: () => void;
  onMuteAll: () => void;
  onRemove: (p: Participant) => void;
}

export default function ParticipantPanel({
  participants,
  isHost,
  onClose,
  onMuteAll,
  onRemove,
}: Props) {
  return (
    <div className="w-72 bg-[#242424] border-l border-white/10 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-white text-sm font-medium">
          Participants ({participants.length})
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Host controls */}
      {isHost && (
        <div className="px-4 py-2 border-b border-white/10">
          <button
            onClick={onMuteAll}
            className="w-full text-xs border border-white/20 text-gray-300 py-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <MicOff size={12} />
            Mute All
          </button>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-4 py-2 hover:bg-white/5 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {getInitials(p.display_name)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {p.display_name}
                </p>
                <p className="text-gray-500 text-[10px] capitalize">{p.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {p.is_muted && (
                <MicOff size={12} className="text-red-400" />
              )}
              {p.role === "host" && (
                <Shield size={12} className="text-[#0B5CFF]" />
              )}
              {isHost && p.role !== "host" && (
                <button
                  onClick={() => onRemove(p)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
                  title="Remove participant"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

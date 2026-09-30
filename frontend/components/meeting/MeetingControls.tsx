"use client";
import {
  Mic, MicOff, Video, VideoOff, Users, MessageSquare,
  Monitor, PhoneOff, MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

interface Props {
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
  isHost: boolean;
}

function CtrlBtn({
  onClick,
  active = false,
  danger = false,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl transition-colors min-w-[48px] sm:min-w-[56px]
        ${
          danger
            ? "bg-red-500 hover:bg-red-600 text-white"
            : active
            ? "bg-white/20 text-white hover:bg-white/30"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
    >
      {children}
      <span className="text-[10px] font-medium hidden sm:block">{label}</span>
    </button>
  );
}

export default function MeetingControls({
  isMuted,
  isVideoOn,
  onToggleMute,
  onToggleVideo,
  onToggleParticipants,
  onToggleChat,
  onLeave,
  isHost,
}: Props) {
  const [shareActive, setShareActive] = useState(false);

  return (
    <div className="h-16 bg-[#1C1C1C] border-t border-white/5 flex items-center justify-center gap-1 px-4 shrink-0">
      <CtrlBtn
        onClick={onToggleMute}
        active={isMuted}
        label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </CtrlBtn>

      <CtrlBtn
        onClick={onToggleVideo}
        active={!isVideoOn}
        label={isVideoOn ? "Stop Video" : "Start Video"}
      >
        {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
      </CtrlBtn>

      <div className="w-px h-8 bg-white/10 mx-1" />

      <CtrlBtn
        onClick={() => setShareActive((s) => !s)}
        active={shareActive}
        label="Share Screen"
      >
        <Monitor size={20} />
      </CtrlBtn>

      <CtrlBtn onClick={onToggleParticipants} label="Participants">
        <Users size={20} />
      </CtrlBtn>

      <CtrlBtn onClick={onToggleChat} label="Chat">
        <MessageSquare size={20} />
      </CtrlBtn>

      <CtrlBtn onClick={() => {}} label="More">
        <MoreHorizontal size={20} />
      </CtrlBtn>

      <div className="w-px h-8 bg-white/10 mx-1" />

      <CtrlBtn onClick={onLeave} danger label={isHost ? "End" : "Leave"}>
        <PhoneOff size={20} />
      </CtrlBtn>
    </div>
  );
}

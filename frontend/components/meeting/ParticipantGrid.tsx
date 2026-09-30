"use client";
import { MicOff } from "lucide-react";
import { useRef, useEffect } from "react";
import type { Participant } from "@/types/meeting";
import { getInitials } from "@/lib/utils";

interface Props {
  participants: Participant[];
  displayName: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
}

function ParticleTile({
  name,
  isMuted,
  isLocal,
  videoRef,
  isVideoOn,
}: {
  name: string;
  isMuted: boolean;
  isLocal?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  isVideoOn?: boolean;
}) {
  return (
    <div className="relative bg-[#2D2D2D] rounded-xl overflow-hidden flex items-center justify-center aspect-video">
      {isLocal && isVideoOn && videoRef ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B5CFF] flex items-center justify-center text-white text-xl sm:text-2xl font-semibold select-none">
          {getInitials(name)}
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-lg max-w-[80%]">
        {isMuted && <MicOff size={10} className="text-red-400 shrink-0" />}
        <span className="text-white text-xs truncate">{name}</span>
      </div>
    </div>
  );
}

export default function ParticipantGrid({
  participants,
  displayName,
  isHost,
  isMuted,
  isVideoOn,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isVideoOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {});
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [isVideoOn]);

  const remotes = participants.filter((p) => !(p.role === "host" && isHost));
  const total = 1 + remotes.length;

  const gridClass =
    total === 1
      ? "grid-cols-1 max-w-2xl mx-auto"
      : total === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : total <= 4
      ? "grid-cols-2"
      : total <= 6
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-3";

  return (
    <div className={`grid gap-3 w-full h-full ${gridClass}`}>
      <ParticleTile
        name={`${displayName}${isHost ? " (Host)" : ""}`}
        isMuted={isMuted}
        isLocal
        videoRef={videoRef}
        isVideoOn={isVideoOn}
      />
      {remotes.slice(0, 8).map((p) => (
        <ParticleTile
          key={p.id}
          name={p.display_name}
          isMuted={p.is_muted}
        />
      ))}
    </div>
  );
}

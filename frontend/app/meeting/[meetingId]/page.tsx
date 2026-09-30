"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import MeetingHeader from "@/components/meeting/MeetingHeader";
import ParticipantGrid from "@/components/meeting/ParticipantGrid";
import ParticipantPanel from "@/components/meeting/ParticipantPanel";
import MeetingControls from "@/components/meeting/MeetingControls";
import { api } from "@/lib/api";
import type { Meeting, Participant } from "@/types/meeting";

function ChatPanel({
  messages,
  input,
  onInput,
  onSend,
  onClose,
}: {
  messages: { name: string; text: string }[];
  input: string;
  onInput: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
}) {
  return (
    <div className="w-72 bg-[#242424] border-l border-white/10 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-white text-sm font-medium">Chat</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-xs text-center mt-8">No messages yet</p>
        )}
        {messages.map((msg, i) => (
          <div key={i}>
            <p className="text-[#0B5CFF] text-xs font-medium">{msg.name}</p>
            <p className="text-gray-300 text-sm break-words">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type a message…"
          className="flex-1 bg-white/10 text-white text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B5CFF] placeholder-gray-500"
        />
        <button
          onClick={onSend}
          disabled={!input.trim()}
          className="bg-[#0B5CFF] text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function MeetingRoom() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const params = useSearchParams();
  const router = useRouter();

  const isHost = params.get("host") === "true";
  const displayName = params.get("name") ?? "You";

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ name: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  const loadMeeting = useCallback(async () => {
    try {
      const [m, p] = await Promise.all([
        api.getMeeting(meetingId),
        api.getParticipants(meetingId),
      ]);
      setMeeting(m);
      setParticipants(p);
    } catch (err: any) {
      setError(err.message ?? "Meeting not found.");
    }
  }, [meetingId]);

  useEffect(() => {
    loadMeeting();
    const poll = setInterval(
      () => api.getParticipants(meetingId).then(setParticipants).catch(() => {}),
      5000
    );
    return () => clearInterval(poll);
  }, [meetingId, loadMeeting]);

  const handleLeave = async () => {
    if (isHost) await api.endMeeting(meetingId).catch(() => {});
    router.push("/");
  };

  const handleMuteAll = async () => {
    await api.muteAll(meetingId);
    setParticipants((prev) =>
      prev.map((p) => (p.role === "attendee" ? { ...p, is_muted: true } : p))
    );
  };

  const handleRemove = async (p: Participant) => {
    await api.removeParticipant(meetingId, p.id);
    setParticipants((prev) => prev.filter((x) => x.id !== p.id));
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { name: displayName, text: chatInput.trim() }]);
    setChatInput("");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
          <p className="text-gray-800 font-semibold mb-2">Unable to join</p>
          <p className="text-gray-500 text-sm mb-5">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#0B5CFF] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Connecting…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1C1C1C] flex flex-col overflow-hidden">
      <MeetingHeader meeting={meeting} />

      <div className="flex flex-1 overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <ParticipantGrid
            participants={participants}
            displayName={displayName}
            isHost={isHost}
            isMuted={isMuted}
            isVideoOn={isVideoOn}
          />
        </div>

        {showParticipants && (
          <ParticipantPanel
            participants={participants}
            isHost={isHost}
            onClose={() => setShowParticipants(false)}
            onMuteAll={handleMuteAll}
            onRemove={handleRemove}
          />
        )}

        {showChat && (
          <ChatPanel
            messages={chatMessages}
            input={chatInput}
            onInput={setChatInput}
            onSend={sendChat}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>

      <MeetingControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onToggleMute={() => setIsMuted((m) => !m)}
        onToggleVideo={() => setIsVideoOn((v) => !v)}
        onToggleParticipants={() => { setShowParticipants((s) => !s); setShowChat(false); }}
        onToggleChat={() => { setShowChat((s) => !s); setShowParticipants(false); }}
        onLeave={handleLeave}
        isHost={isHost}
      />
    </div>
  );
}

export default function MeetingPage() {
  return (
    <Suspense>
      <MeetingRoom />
    </Suspense>
  );
}

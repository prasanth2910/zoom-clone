"use client";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { formatMeetingCode } from "@/lib/utils";
import type { Meeting } from "@/types/meeting";

interface Props {
  meeting: Meeting;
}

export default function MeetingHeader({ meeting }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(meeting.invite_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-12 bg-[#242424] flex items-center justify-between px-4 shrink-0 border-b border-white/5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span className="text-white text-sm font-medium truncate">{meeting.title}</span>
        <span className="text-gray-400 text-xs font-mono hidden sm:block shrink-0">
          {formatMeetingCode(meeting.meeting_code)}
        </span>
      </div>
      <button
        onClick={copy}
        className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-3"
      >
        {copied ? (
          <Check size={12} className="text-green-400" />
        ) : (
          <Copy size={12} />
        )}
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Invite"}</span>
      </button>
    </div>
  );
}

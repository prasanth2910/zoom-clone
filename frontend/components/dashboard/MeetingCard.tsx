"use client";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Meeting } from "@/types/meeting";
import { formatMeetingCode } from "@/lib/utils";

interface Props {
  meeting: Meeting;
  variant?: "upcoming" | "recent";
}

export default function MeetingCard({ meeting, variant = "upcoming" }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(meeting.invite_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dateStr =
    meeting.scheduled_at ?? meeting.started_at ?? meeting.created_at;
  const date = parseISO(dateStr);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all hover:border-gray-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {meeting.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-mono tracking-wide">
            {formatMeetingCode(meeting.meeting_code)}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
            variant === "upcoming"
              ? "bg-blue-50 text-[#0B5CFF]"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {variant === "upcoming" ? "Upcoming" : "Ended"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mt-2.5 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {format(date, "MMM d, yyyy")}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {format(date, "h:mm a")}
        </span>
        {meeting.duration_minutes && (
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {meeting.duration_minutes} min
          </span>
        )}
      </div>

      {variant === "upcoming" && (
        <div className="flex gap-2 mt-3">
          <Link
            href={`/meeting/${meeting.meeting_code}?host=true`}
            className="flex-1 text-center text-xs bg-[#0B5CFF] text-white py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            <ExternalLink size={11} />
            Start
          </Link>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <Check size={11} className="text-green-500" />
            ) : (
              <Copy size={11} />
            )}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      )}

      {variant === "recent" && (
        <div className="mt-3">
          <p className="text-xs text-gray-400">
            Host: {meeting.host.name}
          </p>
        </div>
      )}
    </div>
  );
}

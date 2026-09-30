"use client";
import type { Meeting } from "@/types/meeting";
import MeetingCard from "./MeetingCard";
import { CalendarClock } from "lucide-react";

interface Props {
  meetings: Meeting[];
  loading: boolean;
  error: string;
}

export default function UpcomingMeetings({ meetings, loading, error }: Props) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">
        Upcoming Meetings
      </h2>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && meetings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <CalendarClock size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">No upcoming meetings</p>
          <p className="text-xs text-gray-400 mt-1">Schedule one to get started</p>
        </div>
      )}

      {!loading && !error && meetings.length > 0 && (
        <div className="space-y-3">
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} variant="upcoming" />
          ))}
        </div>
      )}
    </section>
  );
}

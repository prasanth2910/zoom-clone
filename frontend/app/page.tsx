"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Video, Link2, CalendarPlus, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/dashboard/HeroSection";
import ActionTile from "@/components/dashboard/ActionTile";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import RecentMeetings from "@/components/dashboard/RecentMeetings";
import ScheduleMeetingForm from "@/components/schedule/ScheduleMeetingForm";
import { api, extractMeetingCode } from "@/lib/api";
import type { Meeting, User } from "@/types/meeting";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [recent, setRecent] = useState<Meeting[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState("");
  const [recentError, setRecentError] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [newMeetingLoading, setNewMeetingLoading] = useState(false);
  const [newMeetingError, setNewMeetingError] = useState("");

  const loadData = useCallback(async () => {
    // Load user
    api.getMe().then(setUser).catch(() => {});

    // Load upcoming
    setUpcomingLoading(true);
    setUpcomingError("");
    api
      .getUpcoming()
      .then(setUpcoming)
      .catch(() => setUpcomingError("Failed to load upcoming meetings."))
      .finally(() => setUpcomingLoading(false));

    // Load recent
    setRecentLoading(true);
    setRecentError("");
    api
      .getRecent()
      .then(setRecent)
      .catch(() => setRecentError("Failed to load recent meetings."))
      .finally(() => setRecentLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNewMeeting = async () => {
    setNewMeetingError("");
    setNewMeetingLoading(true);
    try {
      const meeting = await api.createInstantMeeting();
      router.push(`/meeting/${meeting.meeting_code}?host=true`);
    } catch (err: any) {
      setNewMeetingError(err.message ?? "Failed to start meeting.");
      setNewMeetingLoading(false);
    }
  };

  const handleJoin = () => {
    setJoinError("");
    const code = extractMeetingCode(joinInput);
    if (!code) {
      setJoinError("Enter a valid Meeting ID or invite link.");
      return;
    }
    router.push(`/join?meetingId=${code}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <HeroSection user={user} />

        {/* Action tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <ActionTile
            icon={Video}
            label="New Meeting"
            sublabel="Start instantly"
            onClick={handleNewMeeting}
            iconBg="bg-[#FF6B35]"
            disabled={newMeetingLoading}
          />
          <ActionTile
            icon={Link2}
            label="Join"
            sublabel="Enter a meeting"
            onClick={() => { setShowJoin((s) => !s); setJoinError(""); }}
            iconBg="bg-[#0B5CFF]"
          />
          <ActionTile
            icon={CalendarPlus}
            label="Schedule"
            sublabel="Plan ahead"
            onClick={() => setShowSchedule(true)}
            iconBg="bg-[#00C4B4]"
          />
          <ActionTile
            icon={Clock}
            label="My Meetings"
            sublabel="View history"
            onClick={() => {}}
            iconBg="bg-[#7B61FF]"
          />
        </div>

        {/* New meeting error */}
        {newMeetingError && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            {newMeetingError}
          </div>
        )}

        {/* Inline join panel */}
        {showJoin && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">
              Join a Meeting
            </h3>
            <div className="flex gap-2">
              <input
                value={joinInput}
                onChange={(e) => { setJoinInput(e.target.value); setJoinError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="Meeting ID or invite link"
                autoFocus
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
              />
              <button
                onClick={handleJoin}
                disabled={!joinInput.trim()}
                className="bg-[#0B5CFF] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Join
              </button>
            </div>
            {joinError && (
              <p className="text-xs text-red-500 mt-2">{joinError}</p>
            )}
          </div>
        )}

        {/* Meetings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpcomingMeetings
            meetings={upcoming}
            loading={upcomingLoading}
            error={upcomingError}
          />
          <RecentMeetings
            meetings={recent}
            loading={recentLoading}
            error={recentError}
          />
        </div>
      </main>

      {showSchedule && (
        <ScheduleMeetingForm
          onClose={() => setShowSchedule(false)}
          onScheduled={(meeting) => {
            setUpcoming((prev) =>
              [...prev, meeting].sort(
                (a, b) =>
                  new Date(a.scheduled_at!).getTime() -
                  new Date(b.scheduled_at!).getTime()
              )
            );
            setShowSchedule(false);
          }}
        />
      )}

      {/* Starting meeting overlay */}
      {newMeetingLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#0B5CFF] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700">
              Starting meeting…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

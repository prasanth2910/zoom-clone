"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Video, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api, extractMeetingCode, formatMeetingCode } from "@/lib/api";
import type { Meeting } from "@/types/meeting";

function JoinContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [meetingId, setMeetingId] = useState(params.get("meetingId") ?? "");
  const [displayName, setDisplayName] = useState("");
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  // Auto-validate when meetingId arrives from URL
  useEffect(() => {
    const code = params.get("meetingId");
    if (code) validateMeeting(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateMeeting = async (code: string) => {
    setValidating(true);
    setError("");
    setMeeting(null);
    try {
      const m = await api.getMeeting(code);
      setMeeting(m);
    } catch (err: any) {
      if (err.status === 410) setError("This meeting has ended.");
      else if (err.status === 404) setError("Meeting not found. Check the ID and try again.");
      else setError("Could not reach the server. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  const handleLookup = () => {
    const code = extractMeetingCode(meetingId);
    if (!code) {
      setError("Enter a valid Meeting ID (e.g. 812 3456 7890) or invite link.");
      return;
    }
    setMeetingId(code);
    validateMeeting(code);
  };

  const handleJoin = async () => {
    if (!meeting || !displayName.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.joinMeeting(meeting.meeting_code, displayName.trim());
      router.push(
        `/meeting/${meeting.meeting_code}?name=${encodeURIComponent(displayName.trim())}`
      );
    } catch (err: any) {
      setError(err.message ?? "Failed to join. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-[#0B5CFF] rounded-xl flex items-center justify-center">
            <Video size={18} className="text-white" />
          </div>
          <span className="text-[#0B5CFF] font-bold text-xl">Zoom</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {!meeting ? (
            <>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                Join a Meeting
              </h1>
              <p className="text-sm text-gray-500 mb-5">
                Enter a Meeting ID or invite link
              </p>

              <div className="space-y-3">
                <input
                  value={meetingId}
                  onChange={(e) => { setMeetingId(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  placeholder="812 3456 7890 or invite link"
                  autoFocus
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
                />

                {error && (
                  <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                    <AlertCircle size={13} className="shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleLookup}
                  disabled={!meetingId.trim() || validating}
                  className="w-full bg-[#0B5CFF] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {validating && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {validating ? "Checking…" : "Continue"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-gray-900 mb-4">
                Enter your name
              </h1>

              {/* Meeting info card */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 mb-0.5">Joining</p>
                <p className="font-semibold text-gray-900 text-sm">{meeting.title}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {formatMeetingCode(meeting.meeting_code)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Host: {meeting.host.name}
                </p>
              </div>

              <div className="space-y-3">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && displayName.trim() && handleJoin()
                  }
                  placeholder="Your display name"
                  autoFocus
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
                />

                {error && (
                  <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                    <AlertCircle size={13} className="shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleJoin}
                  disabled={!displayName.trim() || loading}
                  className="w-full bg-[#0B5CFF] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? "Joining…" : "Join Meeting"}
                </button>

                <button
                  onClick={() => { setMeeting(null); setError(""); }}
                  className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors py-1"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}

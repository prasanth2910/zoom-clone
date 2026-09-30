import type { Meeting } from "@/types/meeting";

export function isUpcoming(meeting: Meeting): boolean {
  return (
    meeting.status === "scheduled" &&
    !!meeting.scheduled_at &&
    new Date(meeting.scheduled_at) >= new Date()
  );
}

export function isRecent(meeting: Meeting): boolean {
  return meeting.status === "ended";
}

export function getMeetingDateLabel(meeting: Meeting): string {
  const raw =
    meeting.scheduled_at ?? meeting.started_at ?? meeting.created_at;
  return raw;
}

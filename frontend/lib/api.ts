import type { Meeting, Participant, SchedulePayload, User } from "@/types/meeting";
export { formatMeetingCode, extractMeetingCode } from "@/lib/utils";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw { status: res.status, message: err.detail ?? "Request failed" };
  }
  return res.json();
}

export const api = {
  getMe: () => request<User>("/api/me"),

  createInstantMeeting: () =>
    request<Meeting>("/api/meetings/instant", { method: "POST" }),

  scheduleMeeting: (payload: SchedulePayload) =>
    request<Meeting>("/api/meetings/schedule", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getUpcoming: () => request<Meeting[]>("/api/meetings?type=upcoming"),
  getRecent: () => request<Meeting[]>("/api/meetings?type=recent"),

  getMeeting: (code: string) => request<Meeting>(`/api/meetings/${code}`),

  joinMeeting: (code: string, display_name: string) =>
    request<Participant>(`/api/meetings/${code}/join`, {
      method: "POST",
      body: JSON.stringify({ display_name }),
    }),

  leaveMeeting: (code: string, participantId: number) =>
    request(`/api/meetings/${code}/leave?participant_id=${participantId}`, {
      method: "POST",
    }),

  endMeeting: (code: string) =>
    request(`/api/meetings/${code}/end`, { method: "POST" }),

  getParticipants: (code: string) =>
    request<Participant[]>(`/api/meetings/${code}/participants`),

  muteAll: (code: string) =>
    request(`/api/meetings/${code}/mute-all`, { method: "POST" }),

  removeParticipant: (code: string, participantId: number) =>
    request(`/api/meetings/${code}/participants/${participantId}`, {
      method: "DELETE",
    }),
};

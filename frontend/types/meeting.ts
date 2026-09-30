export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Participant {
  id: number;
  display_name: string;
  role: "host" | "attendee";
  is_muted: boolean;
  joined_at: string;
  left_at?: string;
}

export interface Meeting {
  id: number;
  meeting_code: string;
  title: string;
  description?: string;
  meeting_type: "instant" | "scheduled";
  scheduled_at?: string;
  duration_minutes?: number;
  status: "scheduled" | "live" | "ended";
  started_at?: string;
  ended_at?: string;
  created_at: string;
  host: User;
  invite_link: string;
}

export interface SchedulePayload {
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
}

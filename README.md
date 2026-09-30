# Zoom Clone

## Live Demo
_Add deployed link here_

## Tech Stack
Next.js 15 (App Router, TypeScript) · FastAPI · SQLite (SQLAlchemy) · Tailwind CSS · lucide-react

## Features
**Core**
- Landing dashboard with live clock, action tiles (New Meeting, Join, Schedule, My Meetings)
- Upcoming and Recent meetings loaded from backend
- Instant meeting creation → unique 11-digit Meeting ID + invite link → redirect to room
- Join flow: accepts Meeting ID or full invite link, display name prompt, server-side validation
- Schedule meeting modal with title, description, date/time, duration picker
- Meeting room: dark theme, video grid with camera preview (getUserMedia), bottom control bar, participants panel, chat panel

**Bonus**
- Host controls: Mute All, Remove Participant
- Responsive layout (mobile/tablet/desktop)
- Copy invite link with clipboard feedback

## Database Schema

```
users          → id, name, email, avatar_url, created_at
meetings       → id, meeting_code (UNIQUE, indexed), title, description, host_id (FK),
                 meeting_type, scheduled_at (indexed), duration_minutes, status,
                 started_at, ended_at, created_at
participants   → id, meeting_id (FK CASCADE), user_id (FK nullable), display_name,
                 role, is_muted, joined_at, left_at
```

**Key decisions:**
- Single `meetings` table with `meeting_type` + nullable `scheduled_at` — avoids duplicating logic across two tables
- `meeting_code` is separate from the PK so the public-facing ID is opaque, collision-safe, and Zoom-style (11 digits)
- Invite links are built at request time from `meeting_code` — no stale URLs if the domain changes
- `status` field drives Upcoming (`scheduled` + future `scheduled_at`) vs Recent (`ended`) queries
- `left_at` on participants enables "active participants" queries without a separate table

## API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/me | Default logged-in user |
| POST | /api/meetings/instant | Create instant meeting |
| POST | /api/meetings/schedule | Schedule a meeting |
| GET | /api/meetings?type=upcoming | Upcoming meetings |
| GET | /api/meetings?type=recent | Recent meetings |
| GET | /api/meetings/{code} | Get meeting (404/410 on bad/ended) |
| POST | /api/meetings/{code}/join | Add participant |
| POST | /api/meetings/{code}/leave | Mark participant left |
| POST | /api/meetings/{code}/end | End meeting (host) |
| GET | /api/meetings/{code}/participants | Active participants |
| POST | /api/meetings/{code}/mute-all | Mute all attendees |
| DELETE | /api/meetings/{code}/participants/{id} | Remove participant |

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m app.seed            # seed the database
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Seeding the database
```bash
cd backend
python -m app.seed
```
Idempotent — safe to run multiple times.

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:8000 | Backend base URL |

## Assumptions
- No authentication required; a single default user (id=1) is the host
- Real WebRTC streaming is out of scope; camera preview uses getUserMedia locally
- Chat is in-memory (per session) — not persisted to the database

## Known Limitations / Future Improvements
- Add real WebRTC peer connections (e.g. via LiveKit or daily.co)
- Persist chat messages to the database
- User authentication (JWT / OAuth)
- Edit / delete scheduled meetings
- WebSocket-based real-time participant updates (currently polled every 5 s)

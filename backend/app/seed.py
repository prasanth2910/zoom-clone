"""
Run once to seed realistic sample data.
Idempotent: running twice won't create duplicates.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app import models
from app.services.meeting_service import generate_meeting_code

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def get_or_create_user(name, email):
    u = db.query(models.User).filter_by(email=email).first()
    if not u:
        u = models.User(name=name, email=email)
        db.add(u)
        db.flush()
    return u


def seed_meeting(host, title, description, meeting_type, status,
                 scheduled_at=None, duration_minutes=None,
                 started_at=None, ended_at=None, participants=None):
    existing = db.query(models.Meeting).filter_by(title=title, host_id=host.id).first()
    if existing:
        return existing
    code = generate_meeting_code(db)
    m = models.Meeting(
        meeting_code=code,
        title=title,
        description=description,
        host_id=host.id,
        meeting_type=meeting_type,
        scheduled_at=scheduled_at,
        duration_minutes=duration_minutes,
        status=status,
        started_at=started_at,
        ended_at=ended_at,
    )
    db.add(m)
    db.flush()
    # host participant
    db.add(models.Participant(meeting_id=m.id, user_id=host.id, display_name=host.name, role="host"))
    for name in (participants or []):
        db.add(models.Participant(meeting_id=m.id, display_name=name, role="attendee",
                                  left_at=ended_at))
    return m


now = datetime.utcnow()

host = get_or_create_user("Alex Johnson", "alex@example.com")

# Upcoming meetings
seed_meeting(host, "Sprint Planning", "Q3 sprint kickoff", "scheduled", "scheduled",
             scheduled_at=now + timedelta(hours=2), duration_minutes=60)
seed_meeting(host, "Design Review", "Review new dashboard mockups", "scheduled", "scheduled",
             scheduled_at=now + timedelta(days=1), duration_minutes=45)
seed_meeting(host, "1:1 with Manager", "Weekly sync", "scheduled", "scheduled",
             scheduled_at=now + timedelta(days=2), duration_minutes=30)
seed_meeting(host, "Product Roadmap Q4", "Quarterly planning session", "scheduled", "scheduled",
             scheduled_at=now + timedelta(days=3), duration_minutes=90)
seed_meeting(host, "Engineering All-Hands", "Monthly team update", "scheduled", "scheduled",
             scheduled_at=now + timedelta(days=5), duration_minutes=60)

# Recent / ended meetings
seed_meeting(host, "Standup - Monday", "Daily standup", "instant", "ended",
             started_at=now - timedelta(hours=5), ended_at=now - timedelta(hours=4, minutes=45),
             participants=["Sarah K.", "Mike T.", "Priya R."])
seed_meeting(host, "Client Demo", "Product demo for Acme Corp", "scheduled", "ended",
             scheduled_at=now - timedelta(days=1), duration_minutes=60,
             started_at=now - timedelta(days=1), ended_at=now - timedelta(days=1) + timedelta(hours=1),
             participants=["John D.", "Lisa M.", "Tom B.", "Anna S."])
seed_meeting(host, "Code Review Session", "PR review for auth module", "instant", "ended",
             started_at=now - timedelta(days=2), ended_at=now - timedelta(days=2) + timedelta(minutes=40),
             participants=["Dev A.", "Dev B."])
seed_meeting(host, "Retrospective", "Sprint 22 retro", "scheduled", "ended",
             scheduled_at=now - timedelta(days=3), duration_minutes=60,
             started_at=now - timedelta(days=3), ended_at=now - timedelta(days=3) + timedelta(hours=1),
             participants=["Sarah K.", "Mike T.", "Priya R.", "Dev A.", "Dev B."])

db.commit()
db.close()
print("Database seeded successfully.")

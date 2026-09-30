import os
import secrets
from datetime import datetime
from sqlalchemy.orm import Session
from app import models

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def generate_meeting_code(db: Session) -> str:
    while True:
        code = str(secrets.randbelow(9 * 10**10) + 10**10)  # always 11 digits
        if not db.query(models.Meeting).filter_by(meeting_code=code).first():
            return code


def build_invite_link(code: str) -> str:
    return f"{FRONTEND_URL}/join?meetingId={code}"


def get_meeting_or_404(code: str, db: Session) -> models.Meeting:
    meeting = db.query(models.Meeting).filter_by(meeting_code=code).first()
    if not meeting:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


def create_instant_meeting(db: Session, host: models.User) -> models.Meeting:
    code = generate_meeting_code(db)
    meeting = models.Meeting(
        meeting_code=code,
        title="Instant Meeting",
        host_id=host.id,
        meeting_type="instant",
        status="live",
        started_at=datetime.utcnow(),
    )
    db.add(meeting)
    db.flush()
    participant = models.Participant(
        meeting_id=meeting.id,
        user_id=host.id,
        display_name=host.name,
        role="host",
    )
    db.add(participant)
    db.commit()
    db.refresh(meeting)
    return meeting


def create_scheduled_meeting(db: Session, host: models.User, data) -> models.Meeting:
    code = generate_meeting_code(db)
    meeting = models.Meeting(
        meeting_code=code,
        title=data.title,
        description=data.description,
        host_id=host.id,
        meeting_type="scheduled",
        scheduled_at=data.scheduled_at,
        duration_minutes=data.duration_minutes,
        status="scheduled",
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


def join_meeting(
    db: Session, meeting: models.Meeting, display_name: str, user_id=None
) -> models.Participant:
    from fastapi import HTTPException
    if meeting.status == "ended":
        raise HTTPException(status_code=410, detail="This meeting has ended")
    participant = models.Participant(
        meeting_id=meeting.id,
        user_id=user_id,
        display_name=display_name,
        role="attendee",
    )
    db.add(participant)
    if meeting.status == "scheduled":
        meeting.status = "live"
        meeting.started_at = datetime.utcnow()
    db.commit()
    db.refresh(participant)
    return participant


def leave_meeting(db: Session, meeting: models.Meeting, participant_id: int):
    from fastapi import HTTPException
    p = db.query(models.Participant).filter_by(
        id=participant_id, meeting_id=meeting.id
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    p.left_at = datetime.utcnow()
    db.commit()


def end_meeting(db: Session, meeting: models.Meeting):
    meeting.status = "ended"
    meeting.ended_at = datetime.utcnow()
    db.query(models.Participant).filter(
        models.Participant.meeting_id == meeting.id,
        models.Participant.left_at == None,
    ).update({"left_at": datetime.utcnow()})
    db.commit()

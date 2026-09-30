from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..services.meeting_service import (
    build_invite_link, create_instant_meeting, create_scheduled_meeting,
    get_meeting_or_404, join_meeting, leave_meeting, end_meeting,
)

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

DEFAULT_USER_ID = 1


def _enrich(meeting: models.Meeting) -> dict:
    d = schemas.MeetingOut.model_validate(meeting).model_dump()
    d["invite_link"] = build_invite_link(meeting.meeting_code)
    return d


@router.post("/instant")
def instant_meeting(db: Session = Depends(get_db)):
    host = db.query(models.User).filter_by(id=DEFAULT_USER_ID).first()
    if not host:
        raise HTTPException(status_code=500, detail="Default user not found. Run seed.py first.")
    meeting = create_instant_meeting(db, host)
    return _enrich(meeting)


@router.post("/schedule")
def schedule_meeting(body: schemas.ScheduleMeetingIn, db: Session = Depends(get_db)):
    host = db.query(models.User).filter_by(id=DEFAULT_USER_ID).first()
    if not host:
        raise HTTPException(status_code=500, detail="Default user not found. Run seed.py first.")
    meeting = create_scheduled_meeting(db, host, body)
    return _enrich(meeting)


@router.get("")
def list_meetings(type: str = Query("upcoming"), db: Session = Depends(get_db)):
    now = datetime.utcnow()
    if type == "upcoming":
        rows = (
            db.query(models.Meeting)
            .filter(
                models.Meeting.status == "scheduled",
                models.Meeting.scheduled_at >= now,
            )
            .order_by(models.Meeting.scheduled_at)
            .all()
        )
    else:  # recent
        rows = (
            db.query(models.Meeting)
            .filter(models.Meeting.status == "ended")
            .order_by(models.Meeting.ended_at.desc())
            .limit(10)
            .all()
        )
    return [_enrich(m) for m in rows]


@router.get("/{code}")
def get_meeting(code: str, db: Session = Depends(get_db)):
    """
    Used by the join flow to validate a meeting before admission.
    Returns 404 if not found, 410 if ended.
    The meeting room itself calls this too — ended meetings return 410
    so the room shows a clear "meeting has ended" error rather than a blank screen.
    """
    meeting = get_meeting_or_404(code, db)
    if meeting.status == "ended":
        raise HTTPException(status_code=410, detail="This meeting has ended")
    return _enrich(meeting)


@router.post("/{code}/join")
def join(code: str, body: schemas.JoinMeetingIn, db: Session = Depends(get_db)):
    meeting = get_meeting_or_404(code, db)
    participant = join_meeting(db, meeting, body.display_name)
    return schemas.ParticipantOut.model_validate(participant)


@router.post("/{code}/leave")
def leave(code: str, participant_id: int, db: Session = Depends(get_db)):
    meeting = get_meeting_or_404(code, db)
    leave_meeting(db, meeting, participant_id)
    return {"ok": True}


@router.post("/{code}/end")
def end(code: str, db: Session = Depends(get_db)):
    meeting = get_meeting_or_404(code, db)
    end_meeting(db, meeting)
    return {"ok": True}


@router.get("/{code}/participants")
def participants(code: str, db: Session = Depends(get_db)):
    # Allow fetching participants even for ended meetings
    # so the room can display who was present before redirecting home
    meeting = get_meeting_or_404(code, db)
    active = [p for p in meeting.participants if p.left_at is None]
    return [schemas.ParticipantOut.model_validate(p) for p in active]


@router.post("/{code}/mute-all")
def mute_all(code: str, db: Session = Depends(get_db)):
    meeting = get_meeting_or_404(code, db)
    db.query(models.Participant).filter(
        models.Participant.meeting_id == meeting.id,
        models.Participant.left_at == None,
        models.Participant.role == "attendee",
    ).update({"is_muted": True})
    db.commit()
    return {"ok": True}


@router.delete("/{code}/participants/{participant_id}")
def remove_participant(code: str, participant_id: int, db: Session = Depends(get_db)):
    meeting = get_meeting_or_404(code, db)
    leave_meeting(db, meeting, participant_id)
    return {"ok": True}

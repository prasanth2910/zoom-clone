from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class ParticipantOut(BaseModel):
    id: int
    display_name: str
    role: str
    is_muted: bool
    joined_at: datetime
    left_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class MeetingOut(BaseModel):
    id: int
    meeting_code: str
    title: str
    description: Optional[str] = None
    meeting_type: str
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    status: str
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime
    host: UserOut
    invite_link: Optional[str] = None

    model_config = {"from_attributes": True}


class ScheduleMeetingIn(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    duration_minutes: int

    @field_validator("duration_minutes")
    @classmethod
    def positive_duration(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("duration_minutes must be > 0")
        return v

    @field_validator("scheduled_at")
    @classmethod
    def future_date(cls, v: datetime) -> datetime:
        if v <= datetime.utcnow():
            raise ValueError("scheduled_at must be in the future")
        return v


class JoinMeetingIn(BaseModel):
    display_name: str

    @field_validator("display_name")
    @classmethod
    def non_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("display_name cannot be empty")
        return v.strip()

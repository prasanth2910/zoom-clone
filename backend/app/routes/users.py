from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api", tags=["users"])

DEFAULT_USER_ID = 1


@router.get("/me", response_model=schemas.UserOut)
def get_me(db: Session = Depends(get_db)):
    return db.query(models.User).filter_by(id=DEFAULT_USER_ID).first()

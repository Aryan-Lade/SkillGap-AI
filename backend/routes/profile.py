from fastapi import APIRouter
try:
    from backend.schemas import StudentProfile
except ImportError:
    from schemas import StudentProfile

router = APIRouter()

_stored_profiles = {}


@router.post("/profile")
def save_profile(profile: StudentProfile):
    student_id = profile.student_id or f"guest_{len(_stored_profiles)}"
    _stored_profiles[student_id] = profile.model_dump()
    return {"student_id": student_id, "status": "saved"}

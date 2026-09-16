from fastapi import APIRouter, HTTPException
try:
    from backend.schemas import StudentProfile, SkillGapResponse, MissingSkill
    from backend.services import prediction_service, recommendation_service
except ImportError:
    from schemas import StudentProfile, SkillGapResponse, MissingSkill
    from services import prediction_service, recommendation_service

try:
    from ml.preprocessing import ROLES
except ImportError:
    from backend.ml.preprocessing import ROLES

router = APIRouter()


@router.post("/skillgap", response_model=SkillGapResponse)
def get_skillgap(profile: StudentProfile):
    if profile.target_role not in ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Choose from: {sorted(ROLES)}")

    valid_exp = ["Beginner", "Intermediate", "Advanced"]
    if profile.experience_level not in valid_exp:
        raise HTTPException(status_code=400, detail=f"Invalid experience level. Choose from: {valid_exp}")

    result = prediction_service.predict(profile.model_dump())
    ranked = recommendation_service.get_ranked_missing_skills(result["missing_skills"], profile.target_role)

    return SkillGapResponse(
        student_id=profile.student_id,
        target_role=profile.target_role,
        match_percentage=result["match_percentage"],
        missing_skills=[MissingSkill(**s) for s in ranked],
        present_skills=result["present_skills"],
    )

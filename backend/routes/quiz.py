from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, List, Optional, Any

try:
    from backend.services import gemini_quiz_service
except ImportError:
    from services import gemini_quiz_service

router = APIRouter()


class QuizSubmitRequest(BaseModel):
    quiz_id: str
    skill: str
    answers: Dict[str, Optional[int]] = {}  # { "1": 0, "2": 2, ... }


@router.get("/quiz/generate")
def get_quiz(
    skill: str = Query(..., description="The skill to test, e.g. Python, React, SQL"),
    role: Optional[str] = Query("Full Stack Developer", description="Target role context"),
    level: Optional[str] = Query("Intermediate", description="Experience level"),
):
    if not skill or not skill.strip():
        raise HTTPException(status_code=400, detail="Skill parameter is required")

    try:
        quiz_data = gemini_quiz_service.generate_quiz(
            skill=skill.strip(),
            target_role=role,
            experience_level=level
        )
        return quiz_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")


@router.post("/quiz/submit")
def submit_quiz(submission: QuizSubmitRequest):
    if not submission.skill:
        raise HTTPException(status_code=400, detail="Skill is required")

    try:
        result = gemini_quiz_service.evaluate_quiz(
            quiz_id=submission.quiz_id,
            skill=submission.skill,
            user_answers=submission.answers
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate quiz: {str(e)}")

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

try:
    from backend.services import jd_analyzer_service
except ImportError:
    from services import jd_analyzer_service

router = APIRouter()


class JDAnalyzeRequest(BaseModel):
    job_title: Optional[str] = "Software Engineer"
    job_description: str
    current_skills: List[str] = []
    experience_level: Optional[str] = "Intermediate"


@router.post("/jd/analyze")
def analyze_jd(request: JDAnalyzeRequest):
    """Analyzes a job description text against candidate skills."""
    if not request.job_description or len(request.job_description.strip()) < 30:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short. Please provide at least 30 characters of text."
        )

    try:
        result = jd_analyzer_service.analyze_job_description(
            job_title=request.job_title or "Software Engineer",
            job_description=request.job_description,
            current_skills=request.current_skills,
            experience_level=request.experience_level or "Intermediate"
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze job description: {str(e)}")

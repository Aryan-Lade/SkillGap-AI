from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from typing import List, Optional

try:
    from backend.services import study_planner_service
except ImportError:
    from services import study_planner_service

router = APIRouter()


class StudyPlanRequest(BaseModel):
    target_role: str = "Full Stack Developer"
    skills_to_learn: List[str] = []
    hours_per_week: int = 10
    start_date: Optional[str] = None


@router.post("/planner/generate")
def create_study_plan(request: StudyPlanRequest):
    """Generates a day-by-day and weekly learning schedule with milestone pacing."""
    try:
        plan = study_planner_service.generate_study_plan(
            target_role=request.target_role,
            skills_to_learn=request.skills_to_learn,
            hours_per_week=request.hours_per_week,
            start_date=request.start_date
        )
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate study plan: {str(e)}")


@router.post("/planner/export-ics")
def export_ics(request: StudyPlanRequest):
    """Generates and returns an importable .ics iCalendar file for Google / Apple / Outlook."""
    try:
        plan = study_planner_service.generate_study_plan(
            target_role=request.target_role,
            skills_to_learn=request.skills_to_learn,
            hours_per_week=request.hours_per_week,
            start_date=request.start_date
        )
        ics_content = study_planner_service.generate_ics_calendar(plan)
        return Response(
            content=ics_content,
            media_type="text/calendar",
            headers={
                "Content-Disposition": "attachment; filename=skillgap-study-plan.ics"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate calendar file: {str(e)}")

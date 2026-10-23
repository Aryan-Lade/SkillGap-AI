from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional

try:
    from backend.services import market_insights_service
except ImportError:
    from services import market_insights_service

router = APIRouter()


class SalaryEstimateRequest(BaseModel):
    role: str = "Full Stack Developer"
    experience_level: str = "Intermediate"
    current_skills: List[str] = []
    missing_skills: List[str] = []


@router.get("/market/overview")
def get_market_overview():
    """Returns top tech roles by salary, demand trends, and skill premiums."""
    return market_insights_service.get_market_overview()


@router.get("/market/role/{role_name}")
def get_role_market(role_name: str):
    """Returns compensation percentiles and hiring indicators for a specific role."""
    return market_insights_service.get_role_market_data(role_name)


@router.post("/market/estimate-salary")
def estimate_salary(request: SalaryEstimateRequest):
    """Calculates potential salary boost from closing roadmap skill gaps."""
    return market_insights_service.estimate_salary_boost(
        role=request.role,
        experience_level=request.experience_level,
        current_skills=request.current_skills,
        missing_skills=request.missing_skills
    )

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

try:
    from backend.services import sandbox_service
except ImportError:
    from services import sandbox_service

router = APIRouter()


class CodeExecutionRequest(BaseModel):
    language: str = "python"
    code: str
    test_code: Optional[str] = None


@router.get("/sandbox/challenges")
def get_challenges(skill: Optional[str] = None):
    """Returns curated hands-on coding challenges filtered by skill."""
    return {"challenges": sandbox_service.get_challenges(skill=skill)}


@router.post("/sandbox/run")
def execute_code(request: CodeExecutionRequest):
    """Executes Python, JavaScript, or SQL code and returns captured output and test results."""
    if not request.code or not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty.")

    try:
        result = sandbox_service.run_code(
            language=request.language,
            code=request.code,
            test_code=request.test_code
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

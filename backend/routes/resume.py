from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional

try:
    from backend.services import resume_parser_service
except ImportError:
    from services import resume_parser_service

router = APIRouter()


class TextResumeRequest(BaseModel):
    text: str
    filename: Optional[str] = "resume.txt"


@router.post("/resume/parse")
async def parse_uploaded_resume(file: UploadFile = File(...)):
    """Accepts uploaded PDF or text file and extracts skills, role match, and experience."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "txt", "md", "doc"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or text file.")

    try:
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

        result = resume_parser_service.parse_resume(content, file.filename)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")


@router.post("/resume/parse-text")
def parse_text_resume(request: TextResumeRequest):
    """Accepts plain text/pasted resume and extracts structured qualifications."""
    if not request.text or len(request.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Resume text is too short. Please provide at least 20 characters.")

    try:
        content_bytes = request.text.encode("utf-8")
        result = resume_parser_service.parse_resume(content_bytes, request.filename or "resume.txt")
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume text: {str(e)}")

import os
import sqlite3
from fastapi import APIRouter
try:
    from backend.schemas import ProgressUpdate, ProgressResponse
except ImportError:
    from schemas import ProgressUpdate, ProgressResponse

router = APIRouter()

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'progress.db')


def _get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            student_id TEXT,
            target_role TEXT,
            completed_skills TEXT,
            PRIMARY KEY (student_id, target_role)
        )
    """)
    conn.commit()
    return conn


def _count_role_skills(role: str) -> int:
    try:
        from backend.routes.roles import _load_taxonomy
    except ImportError:
        from routes.roles import _load_taxonomy
    try:
        taxonomy = _load_taxonomy()
        return len(taxonomy.get(role, {}).get("skills", []))
    except Exception:
        return 1


@router.post("/progress", response_model=ProgressResponse)
def update_progress(update: ProgressUpdate):
    skills_str = "|".join(update.completed_skills)
    conn = _get_connection()
    conn.execute(
        "INSERT OR REPLACE INTO progress (student_id, target_role, completed_skills) VALUES (?, ?, ?)",
        (update.student_id, update.target_role, skills_str)
    )
    conn.commit()
    conn.close()

    total = _count_role_skills(update.target_role)
    pct = round(len(update.completed_skills) / max(total, 1) * 100, 1)

    return ProgressResponse(
        student_id=update.student_id,
        target_role=update.target_role,
        completed_skills=update.completed_skills,
        total_roadmap_skills=total,
        completion_percentage=pct,
    )


@router.get("/progress/{student_id}/{role_name}", response_model=ProgressResponse)
def get_progress(student_id: str, role_name: str):
    conn = _get_connection()
    row = conn.execute(
        "SELECT completed_skills FROM progress WHERE student_id=? AND target_role=?",
        (student_id, role_name.replace("-", " ").title())
    ).fetchone()
    conn.close()

    completed = row[0].split("|") if row and row[0] else []
    total = _count_role_skills(role_name.replace("-", " ").title())
    pct = round(len(completed) / max(total, 1) * 100, 1)

    return ProgressResponse(
        student_id=student_id,
        target_role=role_name,
        completed_skills=completed,
        total_roadmap_skills=total,
        completion_percentage=pct,
    )

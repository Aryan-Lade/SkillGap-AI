import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from ml.recommendation_engine import rank_missing_skills
except ImportError:
    from backend.ml.recommendation_engine import rank_missing_skills


def get_ranked_missing_skills(missing_skills: list, role: str) -> list:
    return rank_missing_skills(missing_skills, role)

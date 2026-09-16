import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from ml.roadmap_sequencer import sequence_roadmap
except ImportError:
    from backend.ml.roadmap_sequencer import sequence_roadmap


def get_roadmap(ranked_missing_skills: list) -> dict:
    return sequence_roadmap(ranked_missing_skills)

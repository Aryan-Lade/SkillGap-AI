import os
import sys
import joblib
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from ml.preprocessing import (
        PROJECT_TO_SKILLS, ROLE_SKILLS, ROLE_WEIGHTS, ALL_SKILLS,
        derive_skills_from_projects, build_unified_skill_list
    )
except ImportError:
    from backend.ml.preprocessing import (
        PROJECT_TO_SKILLS, ROLE_SKILLS, ROLE_WEIGHTS, ALL_SKILLS,
        derive_skills_from_projects, build_unified_skill_list
    )


def _get_artifacts_dir():
    candidates = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'ml', 'model_artifacts'),
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_artifacts'),
        os.path.join(os.path.dirname(__file__), '..', 'ml_artifacts'),
        os.path.join(os.getcwd(), 'ml', 'model_artifacts'),
        os.path.join(os.getcwd(), 'ml_artifacts'),
    ]
    for c in candidates:
        if os.path.exists(os.path.join(c, 'random_forest_model.pkl')):
            return c
    return candidates[0]


ARTIFACTS_DIR = _get_artifacts_dir()

_model = None
_skill_mlb = None
_role_enc = None
_exp_enc = None


def _load_artifacts():
    global _model, _skill_mlb, _role_enc, _exp_enc
    if _model is None:
        _model = joblib.load(os.path.join(ARTIFACTS_DIR, 'random_forest_model.pkl'))
        _skill_mlb = joblib.load(os.path.join(ARTIFACTS_DIR, 'skill_encoder.pkl'))
        _role_enc = joblib.load(os.path.join(ARTIFACTS_DIR, 'role_encoder.pkl'))
        _exp_enc = joblib.load(os.path.join(ARTIFACTS_DIR, 'exp_encoder.pkl'))


def predict(profile: dict) -> dict:
    _load_artifacts()

    current_skills = profile.get("current_skills", [])
    projects = profile.get("projects", [])
    target_role = profile.get("target_role", "")
    experience_level = profile.get("experience_level", "Beginner")

    derived = derive_skills_from_projects(projects)
    unified = build_unified_skill_list(current_skills, derived)

    X_skills = _skill_mlb.transform([unified])

    role_classes = list(_role_enc.classes_)
    if target_role not in role_classes:
        role_enc_val = 0
    else:
        role_enc_val = _role_enc.transform([target_role])[0]

    exp_classes = list(_exp_enc.classes_)
    if experience_level not in exp_classes:
        exp_enc_val = 0
    else:
        exp_enc_val = _exp_enc.transform([experience_level])[0]

    X = np.hstack([X_skills, [[role_enc_val]], [[exp_enc_val]]])
    proba = _model.predict_proba(X)[0]
    match_percentage = round(float(proba[1]) * 100, 1)

    role_skill_weights = ROLE_WEIGHTS.get(target_role, {})
    role_required_skills = set(ROLE_SKILLS.get(target_role, []))
    unified_set = set(unified)

    present_skills = [s for s in unified_set if s in role_required_skills]
    missing = [
        {"name": s, "weight": role_skill_weights.get(s, 0.5), "stage": _get_skill_stage(s, target_role)}
        for s in role_required_skills if s not in unified_set
    ]

    return {
        "match_percentage": match_percentage,
        "missing_skills": missing,
        "present_skills": present_skills,
    }


def _get_skill_stage(skill_name: str, role: str) -> str:
    import json
    taxonomy_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        'data', 'processed', 'role_skill_taxonomy.json'
    )
    try:
        with open(taxonomy_path) as f:
            taxonomy = json.load(f)
        for s in taxonomy.get(role, {}).get("skills", []):
            if s["name"] == skill_name:
                return s["stage"]
    except Exception:
        pass
    return "Foundational"

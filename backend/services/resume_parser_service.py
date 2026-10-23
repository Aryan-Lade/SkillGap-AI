import io
import os
import re
import json
import urllib.request
import urllib.error
from typing import Dict, List, Any, Optional

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None


def _load_env_file():
    candidates = [
        os.path.join(os.path.dirname(__file__), '..', '.env'),
        os.path.join(os.path.dirname(__file__), '..', '..', '.env'),
        os.path.join(os.getcwd(), 'backend', '.env'),
        os.path.join(os.getcwd(), '.env'),
    ]
    for env_path in candidates:
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            k, v = line.split('=', 1)
                            k, v = k.strip(), v.strip().strip('"').strip("'")
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception:
                pass


_load_env_file()


def get_gemini_api_key() -> str:
    _load_env_file()
    return os.environ.get("GEMINI_API_KEY", "").strip()


def _load_taxonomy() -> Dict[str, Any]:
    candidates = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'role_skill_taxonomy.json'),
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'processed', 'role_skill_taxonomy.json'),
        os.path.join(os.getcwd(), 'backend', 'data', 'role_skill_taxonomy.json'),
        os.path.join(os.getcwd(), 'data', 'role_skill_taxonomy.json'),
    ]
    for p in candidates:
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8') as f:
                return json.load(f)
    return {}


def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extracts raw text from PDF or plain text files."""
    name_lower = filename.lower()
    if name_lower.endswith('.pdf'):
        if PdfReader is None:
            raise RuntimeError("pypdf is not installed on server.")
        reader = PdfReader(io.BytesIO(file_bytes))
        pages_text = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                pages_text.append(t)
        return "\n".join(pages_text).strip()
    else:
        # Default text/markdown decode
        try:
            return file_bytes.decode('utf-8')
        except UnicodeDecodeError:
            return file_bytes.decode('latin-1', errors='ignore')


# Common synonyms mapping to canonical taxonomy skill names
SKILL_SYNONYMS = {
    "react.js": "React",
    "reactjs": "React",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "vue.js": "Vue.js",
    "vuejs": "Vue.js",
    "angular.js": "Angular",
    "angularjs": "Angular",
    "html": "HTML/CSS",
    "css": "HTML/CSS",
    "html5": "HTML/CSS",
    "css3": "HTML/CSS",
    "postgres": "PostgreSQL",
    "postgres sql": "PostgreSQL",
    "rest": "REST APIs",
    "restful": "REST APIs",
    "rest api": "REST APIs",
    "restful api": "REST APIs",
    "restful apis": "REST APIs",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "k8s": "Kubernetes",
    "fastapi": "Django/Flask/FastAPI",
    "flask": "Django/Flask/FastAPI",
    "django": "Django/Flask/FastAPI",
    "golang": "Go",
    "aws cloud": "AWS",
    "amazon web services": "AWS",
    "gcp": "GCP",
    "google cloud platform": "GCP",
    "azure cloud": "Azure",
    "microsoft azure": "Azure",
    "ci/cd pipelines": "CI/CD",
    "continuous integration": "CI/CD",
    "git version control": "Git",
    "github": "Git",
    "gitlab": "Git",
    "scikit learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "tf": "TensorFlow",
    "pytorch": "PyTorch",
}


def rule_based_parse(text: str, taxonomy: Dict[str, Any]) -> Dict[str, Any]:
    """Robust regex-based skill and experience extractor fallback."""
    text_lower = text.lower()

    # Collect all canonical taxonomy skills
    all_taxonomy_skills = set()
    for role_data in taxonomy.values():
        for s in role_data.get("skills", []):
            all_taxonomy_skills.add(s["name"])

    detected_skills = set()

    # 1. Check exact canonical taxonomy skills
    for skill in all_taxonomy_skills:
        # Regex boundary check
        escaped = re.escape(skill.lower())
        pattern = rf"(?:\b|(?<=[^a-zA-Z0-9])){escaped}(?:\b|(?=[^a-zA-Z0-9]))"
        if re.search(pattern, text_lower):
            detected_skills.add(skill)

    # 2. Check synonyms
    for syn, canonical in SKILL_SYNONYMS.items():
        escaped = re.escape(syn.lower())
        pattern = rf"(?:\b|(?<=[^a-zA-Z0-9])){escaped}(?:\b|(?=[^a-zA-Z0-9]))"
        if re.search(pattern, text_lower):
            detected_skills.add(canonical)

    # 3. Detect experience years
    exp_matches = re.findall(r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?|yr)\s*(?:of\s*)?(?:experience|exp)?", text_lower)
    max_exp_years = 0.0
    for match in exp_matches:
        try:
            val = float(match)
            if 0.5 <= val <= 35:
                if val > max_exp_years:
                    max_exp_years = val
        except ValueError:
            pass

    # Determine experience level
    if max_exp_years >= 5:
        exp_level = "Advanced"
    elif max_exp_years >= 2:
        exp_level = "Intermediate"
    else:
        exp_level = "Beginner"

    # 4. Score matching roles
    scored_roles = []
    for role_name, role_data in taxonomy.items():
        role_skills = role_data.get("skills", [])
        if not role_skills:
            continue
        total_weight = sum(s.get("weight", 1.0) for s in role_skills)
        matched_weight = sum(
            s.get("weight", 1.0) for s in role_skills if s["name"] in detected_skills
        )
        pct = round((matched_weight / max(total_weight, 0.001)) * 100, 1)
        scored_roles.append({
            "role": role_name,
            "match_percentage": min(pct, 100.0),
            "matched_skills_count": sum(1 for s in role_skills if s["name"] in detected_skills),
            "total_skills_count": len(role_skills)
        })

    scored_roles.sort(key=lambda x: x["match_percentage"], reverse=True)
    top_roles = scored_roles[:4]

    # Candidate Name estimation (first non-empty line or title heuristic)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    candidate_name = lines[0] if lines and len(lines[0]) < 40 and not re.search(r"resume|curriculum|cv|page", lines[0], re.I) else "Candidate"

    skills_list = sorted(list(detected_skills))
    best_role = top_roles[0]["role"] if top_roles else "Full Stack Developer"
    best_match = top_roles[0]["match_percentage"] if top_roles else 0

    return {
        "candidate_name": candidate_name,
        "experience_years": round(max_exp_years, 1),
        "experience_level": exp_level,
        "extracted_skills": skills_list,
        "recommended_roles": top_roles,
        "best_matching_role": best_role,
        "best_match_percentage": best_match,
        "summary": f"Detected {len(skills_list)} technical skills. Strongest alignment with {best_role} ({best_match}% match).",
        "strengths": skills_list[:6],
        "source": "rule_based"
    }


def _call_gemini_parser(text: str, taxonomy: Dict[str, Any], api_key: str) -> Optional[Dict[str, Any]]:
    """Uses Gemini 1.5 Flash to extract high-fidelity structured profile data."""
    roles_list = list(taxonomy.keys())
    # Truncate text if too long to prevent prompt overflow
    sample_text = text[:8000]

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    prompt = f"""
You are an expert technical recruiter and talent assessment AI.
Analyze the following resume text and extract candidate qualifications.

Available Target Roles:
{json.dumps(roles_list)}

Resume Content:
{sample_text}

Task:
1. Extract candidate name (if available, else 'Candidate').
2. Estimate total years of technical experience (float or int).
3. Determine experience level strictly as one of: 'Beginner' (0-2 yrs), 'Intermediate' (2-5 yrs), or 'Advanced' (5+ yrs).
4. Extract all technical skills found in the resume. Normalize them to modern industry names (e.g. Python, React, Docker, SQL, Machine Learning).
5. Recommend the top 3 best matching roles from the Available Target Roles list, with a realistic match percentage (0-100).
6. Write a professional 2-sentence executive summary of the candidate's technical profile.
7. List 3-5 top core technical strengths.

Return ONLY a valid JSON object with this exact structure:
{{
  "candidate_name": "Full Name",
  "experience_years": 3.5,
  "experience_level": "Intermediate",
  "extracted_skills": ["Python", "SQL", "React", "Docker"],
  "recommended_roles": [
    {{"role": "Backend Developer", "match_percentage": 85.0}},
    {{"role": "Full Stack Developer", "match_percentage": 78.0}},
    {{"role": "Data Scientist", "match_percentage": 62.0}}
  ],
  "best_matching_role": "Backend Developer",
  "best_match_percentage": 85.0,
  "summary": "Professional summary here...",
  "strengths": ["Backend Architecture", "REST APIs", "Database Optimization"]
}}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json"
        }
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=14) as response:
        result = json.loads(response.read().decode("utf-8"))
        raw_text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]

        parsed = json.loads(raw_text.strip())
        parsed["source"] = "gemini_ai"
        return parsed


def parse_resume(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Main entry point: parses resume from bytes (PDF or Text),
    running Gemini AI first with rule-based fallback.
    """
    text = extract_text_from_file(file_bytes, filename)
    if not text or len(text.strip()) < 30:
        raise ValueError("The uploaded file does not appear to contain readable text.")

    taxonomy = _load_taxonomy()
    api_key = get_gemini_api_key()

    if api_key and not api_key.startswith("your_"):
        try:
            gemini_result = _call_gemini_parser(text, taxonomy, api_key)
            if gemini_result and "extracted_skills" in gemini_result:
                # Merge with rule-based check to ensure none of taxonomy skills are missed
                rule_res = rule_based_parse(text, taxonomy)
                combined_skills = set(gemini_result.get("extracted_skills", []))
                for s in rule_res["extracted_skills"]:
                    combined_skills.add(s)
                gemini_result["extracted_skills"] = sorted(list(combined_skills))
                return gemini_result
        except Exception as e:
            print(f"[ResumeParser] Gemini API failed: {e}. Falling back to rule-based parser.")

    return rule_based_parse(text, taxonomy)

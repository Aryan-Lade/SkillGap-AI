import os
import re
import json
import urllib.request
import urllib.error
from typing import Dict, List, Any, Optional


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
    "azure": "Azure",
    "ci/cd pipelines": "CI/CD",
    "git": "Git",
    "github": "Git",
    "scikit-learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
}


def rule_based_analyze(
    job_title: str,
    job_description: str,
    current_skills: List[str],
    experience_level: str = "Intermediate"
) -> Dict[str, Any]:
    """Fallback NLP rule-based parser for job descriptions."""
    taxonomy = _load_taxonomy()
    jd_lower = job_description.lower()

    # Collect all canonical skills
    all_taxonomy_skills = set()
    for role_data in taxonomy.values():
        for s in role_data.get("skills", []):
            all_taxonomy_skills.add(s["name"])

    detected_skills = set()
    for skill in all_taxonomy_skills:
        escaped = re.escape(skill.lower())
        pattern = rf"(?:\b|(?<=[^a-zA-Z0-9])){escaped}(?:\b|(?=[^a-zA-Z0-9]))"
        if re.search(pattern, jd_lower):
            detected_skills.add(skill)

    for syn, canonical in SKILL_SYNONYMS.items():
        escaped = re.escape(syn.lower())
        pattern = rf"(?:\b|(?<=[^a-zA-Z0-9])){escaped}(?:\b|(?=[^a-zA-Z0-9]))"
        if re.search(pattern, jd_lower):
            detected_skills.add(canonical)

    if not detected_skills:
        # Default fallback common skills if none detected in text
        detected_skills = {"Python", "SQL", "Git", "REST APIs"}

    jd_skills_list = sorted(list(detected_skills))
    user_skills_set = set(current_skills)

    matching_skills = [s for s in jd_skills_list if s in user_skills_set]
    missing_skills = [s for s in jd_skills_list if s not in user_skills_set]

    total_jd = len(jd_skills_list)
    match_pct = round((len(matching_skills) / max(total_jd, 1)) * 100, 1)

    # Fast-track bridge roadmap (split into 3 milestones)
    milestone_1 = missing_skills[:max(1, len(missing_skills) // 3)]
    milestone_2 = missing_skills[len(milestone_1):len(milestone_1) + max(1, len(missing_skills) // 3)]
    milestone_3 = missing_skills[len(milestone_1) + len(milestone_2):]

    bridge_roadmap = {
        "Phase 1: High-Priority Essentials (Week 1-2)": [
            {"skill": s, "priority": "High", "focus": "Core concepts and hands-on setup"} for s in milestone_1
        ],
        "Phase 2: Technical Competencies (Week 3-4)": [
            {"skill": s, "priority": "Medium", "focus": "Integration, projects, and best practices"} for s in milestone_2
        ],
        "Phase 3: Job-Ready Specialization (Week 5+)": [
            {"skill": s, "priority": "Polish", "focus": "Interview preparation and portfolio demonstration"} for s in milestone_3
        ]
    }

    # Best matched taxonomy role
    best_role = "Software Engineer"
    max_overlap = -1
    for r_name, r_data in taxonomy.items():
        r_skills = set(s["name"] for s in r_data.get("skills", []))
        overlap = len(detected_skills.intersection(r_skills))
        if overlap > max_overlap:
            max_overlap = overlap
            best_role = r_name

    tips = [
        f"Emphasize your hands-on experience with {', '.join(matching_skills[:3]) or 'relevant tools'} in your resume header.",
        f"Build a mini-demo incorporating {missing_skills[0] if missing_skills else 'system design'} before the technical screen.",
        "Highlight measurable outcomes (e.g. performance speedups, uptime, user metrics) rather than just duty lists.",
    ]

    return {
        "job_title": job_title or best_role,
        "closest_taxonomy_role": best_role,
        "match_percentage": match_pct,
        "total_jd_skills_detected": total_jd,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "bridge_roadmap": bridge_roadmap,
        "key_highlights": [
            f"Candidate matches {len(matching_skills)} out of {total_jd} key skills mentioned in the job description.",
            f"Closing {len(missing_skills)} remaining skills will qualify you for strong interview consideration."
        ],
        "resume_tips": tips,
        "source": "rule_based"
    }


def _call_gemini_jd_analyzer(
    job_title: str,
    job_description: str,
    current_skills: List[str],
    experience_level: str,
    api_key: str
) -> Optional[Dict[str, Any]]:
    """Analyzes a job description with Gemini AI."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    prompt = f"""
You are a senior technical hiring manager. Analyze the following Job Description (JD) and evaluate the candidate's fit.

Job Title: {job_title or 'Software Engineer'}
Candidate Experience Level: {experience_level}
Candidate Current Skills: {json.dumps(current_skills)}

Job Description:
{job_description[:7000]}

Instructions:
1. Extract all required core technical skills and preferred/nice-to-have skills mentioned in the JD.
2. Determine which of these skills the candidate currently matches and which are missing.
3. Compute an honest match percentage (0-100).
4. Create a 3-phase fast-track bridge learning plan to get the candidate interview-ready.
5. Provide 3 actionable resume optimization tips for this specific role.

Return ONLY a valid JSON object matching:
{{
  "job_title": "{job_title or 'Target Role'}",
  "match_percentage": 75.0,
  "matching_skills": ["Python", "SQL"],
  "missing_skills": ["Docker", "Kubernetes", "AWS"],
  "bridge_roadmap": {{
    "Phase 1: High-Priority Essentials (Week 1-2)": [
      {{"skill": "Docker", "priority": "High", "focus": "Containerization fundamentals"}}
    ],
    "Phase 2: Technical Competencies (Week 3-4)": [
      {{"skill": "Kubernetes", "priority": "Medium", "focus": "Pod management and services"}}
    ],
    "Phase 3: Job-Ready Specialization (Week 5+)": [
      {{"skill": "AWS", "priority": "Polish", "focus": "ECS, EKS, and cloud deployment"}}
    ]
  }},
  "key_highlights": ["Matches 2 core backend skills", "Cloud skills gap identified"],
  "resume_tips": [
    "Highlight Docker projects in summary",
    "List SQL performance tuning experience"
  ]
}}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.15,
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


def analyze_job_description(
    job_title: str,
    job_description: str,
    current_skills: List[str],
    experience_level: str = "Intermediate"
) -> Dict[str, Any]:
    """Analyzes a job description against candidate skills with AI + fallback."""
    if not job_description or len(job_description.strip()) < 30:
        raise ValueError("Job description is too short. Please provide at least 30 characters.")

    api_key = get_gemini_api_key()
    if api_key and not api_key.startswith("your_"):
        try:
            res = _call_gemini_jd_analyzer(
                job_title=job_title,
                job_description=job_description,
                current_skills=current_skills,
                experience_level=experience_level,
                api_key=api_key
            )
            if res and "match_percentage" in res and "missing_skills" in res:
                return res
        except Exception as e:
            print(f"[JDAnalyzer] Gemini call failed ({e}), using rule-based parser.")

    return rule_based_analyze(
        job_title=job_title,
        job_description=job_description,
        current_skills=current_skills,
        experience_level=experience_level
    )

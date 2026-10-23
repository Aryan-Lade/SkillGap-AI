import datetime
from typing import Dict, List, Any, Optional

# Curated module curriculum breakdown for major skills
SKILL_CURRICULUM_BREAKDOWN = {
    "Python": [
        {"topic": "Data Types, Control Flow & Functions", "minutes": 60, "notes": "Variables, lists, dicts, list comprehensions, and pure functions."},
        {"topic": "Object-Oriented Programming (OOP) & Modules", "minutes": 75, "notes": "Classes, inheritance, dunder methods, and project modularity."},
        {"topic": "Error Handling, File I/O & Generators", "minutes": 60, "notes": "Try/except blocks, context managers (with), and generator expressions."},
        {"topic": "Mini-Project & Unit Testing", "minutes": 90, "notes": "Build a CLI utility and write pytest assertions."},
    ],
    "Docker": [
        {"topic": "Containerization Concepts & Docker CLI", "minutes": 60, "notes": "Images vs containers, docker run, inspect, and logs."},
        {"topic": "Dockerfile Best Practices", "minutes": 75, "notes": "Multi-stage builds, caching layers, and non-root user setup."},
        {"topic": "Docker Compose Multi-Container Orchestration", "minutes": 75, "notes": "Setting up app, Redis, and PostgreSQL with docker-compose.yml."},
        {"topic": "Volumes, Networks & Production Deployment", "minutes": 90, "notes": "Persistent storage, bridge networks, and production security."},
    ],
    "Kubernetes": [
        {"topic": "Kubernetes Architecture & Minikube/K3s", "minutes": 75, "notes": "Control plane, worker nodes, kubelet, and local cluster setup."},
        {"topic": "Pods, Deployments & ReplicaSets", "minutes": 90, "notes": "Writing deployment YAML manifests and rolling updates."},
        {"topic": "Services, Ingress & DNS Networking", "minutes": 75, "notes": "ClusterIP, NodePort, LoadBalancer, and Ingress routing."},
        {"topic": "ConfigMaps, Secrets & Health Checks", "minutes": 90, "notes": "Liveness/readiness probes and environment secret management."},
    ],
    "React": [
        {"topic": "Modern Components, JSX & Props", "minutes": 60, "notes": "Functional components, conditional rendering, and prop destructuring."},
        {"topic": "Hooks Mastery (useState, useEffect, useRef)", "minutes": 75, "notes": "State transitions, lifecycle effects, and dependency arrays."},
        {"topic": "State Management & Custom Hooks", "minutes": 90, "notes": "Context API, useReducer, and reusable custom hook extraction."},
        {"topic": "Performance & Full Feature Project", "minutes": 90, "notes": "React.memo, useMemo, lazy loading, and routing setup."},
    ],
    "SQL": [
        {"topic": "Relational Modeling, SELECT & Filters", "minutes": 60, "notes": "WHERE, LIKE, IN, BETWEEN, and ORDER BY constraints."},
        {"topic": "JOIN Operations (INNER, LEFT, FULL, CROSS)", "minutes": 75, "notes": "Multi-table queries, foreign keys, and alias best practices."},
        {"topic": "Aggregation, GROUP BY & Window Functions", "minutes": 90, "notes": "COUNT, SUM, AVG, HAVING, ROW_NUMBER(), and RANK()."},
        {"topic": "Indexing, Transactions (ACID) & Optimization", "minutes": 90, "notes": "EXPLAIN ANALYZE, B-Tree indexes, and transaction isolation."},
    ],
    "REST APIs": [
        {"topic": "HTTP Protocol, Status Codes & REST Conventions", "minutes": 60, "notes": "GET, POST, PUT, DELETE, PATCH, 2xx, 4xx, 5xx semantics."},
        {"topic": "API Design & Request Validation", "minutes": 75, "notes": "Pydantic/Zod schemas, URL params, and query filters."},
        {"topic": "Authentication & Rate Limiting", "minutes": 90, "notes": "JWT tokens, Bearer headers, CORS, and token expiry refresh."},
        {"topic": "API Documentation & Automated Testing", "minutes": 75, "notes": "OpenAPI / Swagger specs and Postman/Pytest integration tests."},
    ],
    "Machine Learning": [
        {"topic": "Feature Engineering & Data Preprocessing", "minutes": 75, "notes": "Handling missing data, scaling, one-hot encoding, and train-test splits."},
        {"topic": "Supervised Learning Models", "minutes": 90, "notes": "Linear/Logistic Regression, Random Forest, and Gradient Boosting."},
        {"topic": "Evaluation Metrics & Cross Validation", "minutes": 75, "notes": "Precision, Recall, F1-Score, ROC-AUC, and K-Fold CV."},
        {"topic": "Hyperparameter Tuning & Scikit-learn Pipeline", "minutes": 90, "notes": "GridSearchCV, ColumnTransformer, and joblib model persistence."},
    ]
}


def _get_skill_sessions(skill_name: str) -> List[Dict[str, Any]]:
    """Returns curated breakdown or dynamically generates structured modules."""
    for key, sessions in SKILL_CURRICULUM_BREAKDOWN.items():
        if key.lower() in skill_name.lower() or skill_name.lower() in key.lower():
            return sessions

    # Dynamic fallback structured sessions
    return [
        {"topic": f"{skill_name} Core Concepts & Setup", "minutes": 60, "notes": f"Set up development environment and master basic building blocks of {skill_name}."},
        {"topic": f"{skill_name} Intermediate Architecture & Patterns", "minutes": 75, "notes": f"Deep dive into standard patterns, idioms, and data structures in {skill_name}."},
        {"topic": f"Hands-On Implementation & Best Practices", "minutes": 90, "notes": f"Implement a real-world scenario applying {skill_name} with error handling."},
        {"topic": f"Testing, Optimization & Portfolio Review", "minutes": 75, "notes": f"Code review, performance profiling, and adding documentation."}
    ]


def generate_study_plan(
    target_role: str,
    skills_to_learn: List[str],
    hours_per_week: int = 10,
    start_date: Optional[str] = None
) -> Dict[str, Any]:
    """Generates a day-by-day calendar schedule with pacing and milestones."""
    if not skills_to_learn:
        skills_to_learn = ["Python", "SQL", "Docker", "REST APIs"]

    # Parse start date
    try:
        if start_date:
            curr_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
        else:
            curr_date = datetime.date.today()
    except Exception:
        curr_date = datetime.date.today()

    # Determine study days per week based on hours
    # 5 hrs -> 3 days/wk (~1.5h/day)
    # 10 hrs -> 5 days/wk (2h/day)
    # 15-20 hrs -> 6 days/wk (~3h/day)
    if hours_per_week <= 6:
        active_weekdays = [0, 2, 4] # Mon, Wed, Fri
    elif hours_per_week <= 12:
        active_weekdays = [0, 1, 2, 3, 5] # Mon, Tue, Wed, Thu, Sat
    else:
        active_weekdays = [0, 1, 2, 3, 4, 5] # Mon - Sat

    all_sessions = []
    for skill in skills_to_learn:
        sessions = _get_skill_sessions(skill)
        for s in sessions:
            all_sessions.append({
                "skill": skill,
                "topic": s["topic"],
                "duration_minutes": s["minutes"],
                "learning_objectives": s["notes"],
            })

    total_sessions = len(all_sessions)
    total_minutes = sum(s["duration_minutes"] for s in all_sessions)
    total_hours = round(total_minutes / 60, 1)

    scheduled_days = []
    session_idx = 0
    day_offset = 0

    while session_idx < total_sessions:
        target_day = curr_date + datetime.timedelta(days=day_offset)
        day_offset += 1

        # Check if this weekday is active
        if target_day.weekday() in active_weekdays:
            sess = all_sessions[session_idx]
            scheduled_days.append({
                "session_number": session_idx + 1,
                "date": target_day.strftime("%Y-%m-%d"),
                "day_name": target_day.strftime("%A"),
                "formatted_date": target_day.strftime("%b %d, %Y"),
                "skill": sess["skill"],
                "topic": sess["topic"],
                "duration_minutes": sess["duration_minutes"],
                "learning_objectives": sess["learning_objectives"],
                "completed": False
            })
            session_idx += 1

    end_date = scheduled_days[-1]["date"] if scheduled_days else str(curr_date)
    duration_weeks = max(1, round(len(scheduled_days) / len(active_weekdays), 1))

    # Group into weekly milestones
    weekly_modules = []
    days_per_week = len(active_weekdays)
    for i in range(0, len(scheduled_days), days_per_week):
        week_num = (i // days_per_week) + 1
        chunk = scheduled_days[i:i + days_per_week]
        week_skills = list(dict.fromkeys(d["skill"] for d in chunk))
        week_mins = sum(d["duration_minutes"] for d in chunk)

        weekly_modules.append({
            "week_number": week_num,
            "title": f"Week {week_num}: {', '.join(week_skills)}",
            "skills": week_skills,
            "total_hours": round(week_mins / 60, 1),
            "days": chunk
        })

    return {
        "target_role": target_role,
        "hours_per_week": hours_per_week,
        "total_skills": len(skills_to_learn),
        "total_study_sessions": total_sessions,
        "total_study_hours": total_hours,
        "estimated_weeks": duration_weeks,
        "start_date": str(curr_date),
        "target_completion_date": end_date,
        "weekly_modules": weekly_modules,
        "summary": f"Your personalized {duration_weeks}-week study plan covers {len(skills_to_learn)} skills across {total_sessions} focused sessions."
    }


def generate_ics_calendar(plan: Dict[str, Any]) -> str:
    """Generates standard iCalendar (.ics) string for importing into Google/Apple/Outlook."""
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//SkillGap AI//Study Planner//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:SkillGap AI - Career Roadmap Plan",
        "X-WR-TIMEZONE:UTC",
    ]

    now_str = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

    for week in plan.get("weekly_modules", []):
        for day in week.get("days", []):
            date_str = day["date"].replace("-", "")
            duration_mins = day.get("duration_minutes", 60)
            
            # Default study time: 18:00 UTC (6:00 PM)
            dt_start = f"{date_str}T180000Z"
            end_dt = datetime.datetime.strptime(f"{date_str} 18:00:00", "%Y%m%d %H:%M:%S") + datetime.timedelta(minutes=duration_mins)
            dt_end = end_dt.strftime("%Y%m%dT%H%M%SZ")

            uid = f"skillgap-{day['session_number']}-{date_str}@skillgap.ai"
            summary = f"⚡ SkillGap: {day['skill']} - {day['topic']}"
            description = (
                f"Skill: {day['skill']}\\n"
                f"Topic: {day['topic']}\\n"
                f"Duration: {duration_mins} mins\\n"
                f"Objectives: {day['learning_objectives']}\\n"
                f"Platform: SkillGap AI (http://localhost:5173/)"
            )

            lines.extend([
                "BEGIN:VEVENT",
                f"UID:{uid}",
                f"DTSTAMP:{now_str}",
                f"DTSTART:{dt_start}",
                f"DTEND:{dt_end}",
                f"SUMMARY:{summary}",
                f"DESCRIPTION:{description}",
                "STATUS:CONFIRMED",
                "BEGIN:VALARM",
                "TRIGGER:-PT15M",
                "ACTION:DISPLAY",
                f"DESCRIPTION:Reminder: {summary}",
                "END:VALARM",
                "END:VEVENT"
            ])

    lines.append("END:VCALENDAR")
    return "\r\n".join(lines)

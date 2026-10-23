import json
from typing import Dict, List, Any, Optional

# Comprehensive tech compensation benchmarks (USD base annually, with localized conversion rates)
ROLE_MARKET_DATA = {
    "Data Scientist": {
        "demand_level": "Very High",
        "growth_rate_yoy": "+28%",
        "hiring_status": "Aggressive Hiring",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 85000, "inr_lpa": 8.5, "eur": 65000},
            "Mid-Level (2-5 yrs)": {"usd": 125000, "inr_lpa": 16.0, "eur": 85000},
            "Senior (5-8 yrs)": {"usd": 165000, "inr_lpa": 28.0, "eur": 115000},
            "Staff / Lead (8+ yrs)": {"usd": 210000, "inr_lpa": 42.0, "eur": 145000},
        },
        "skill_premiums": {
            "Deep Learning": 18,
            "ML Deployment": 15,
            "NLP": 14,
            "Statistics": 10,
            "Machine Learning": 12,
        },
        "top_locations": ["Remote", "San Francisco, CA", "Bengaluru, IN", "London, UK", "New York, NY"],
        "common_titles": ["Data Scientist", "Applied Scientist", "Quantitative Analyst", "Research Scientist"]
    },
    "Backend Developer": {
        "demand_level": "Extremely High",
        "growth_rate_yoy": "+24%",
        "hiring_status": "High Demand",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 78000, "inr_lpa": 7.5, "eur": 60000},
            "Mid-Level (2-5 yrs)": {"usd": 118000, "inr_lpa": 15.0, "eur": 82000},
            "Senior (5-8 yrs)": {"usd": 158000, "inr_lpa": 26.0, "eur": 110000},
            "Staff / Lead (8+ yrs)": {"usd": 205000, "inr_lpa": 40.0, "eur": 140000},
        },
        "skill_premiums": {
            "Microservices": 16,
            "Docker": 12,
            "Message Queues": 14,
            "CI/CD": 10,
            "Django/Flask/FastAPI": 10,
        },
        "top_locations": ["Remote", "Bengaluru, IN", "Austin, TX", "Berlin, DE", "Hyderabad, IN"],
        "common_titles": ["Backend Engineer", "Server-Side Developer", "API Engineer", "Systems Architect"]
    },
    "ML Engineer": {
        "demand_level": "Skyrocketing",
        "growth_rate_yoy": "+38%",
        "hiring_status": "Critical Shortage",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 95000, "inr_lpa": 10.0, "eur": 72000},
            "Mid-Level (2-5 yrs)": {"usd": 140000, "inr_lpa": 20.0, "eur": 95000},
            "Senior (5-8 yrs)": {"usd": 185000, "inr_lpa": 34.0, "eur": 128000},
            "Staff / Lead (8+ yrs)": {"usd": 235000, "inr_lpa": 50.0, "eur": 160000},
        },
        "skill_premiums": {
            "MLOps": 22,
            "ML Deployment": 20,
            "Deep Learning": 16,
            "Docker": 12,
            "Model Optimization": 15,
        },
        "top_locations": ["Remote", "San Francisco, CA", "Bengaluru, IN", "Seattle, WA", "Toronto, CA"],
        "common_titles": ["Machine Learning Engineer", "ML Platform Engineer", "AI Infrastructure Engineer"]
    },
    "Frontend Developer": {
        "demand_level": "High",
        "growth_rate_yoy": "+19%",
        "hiring_status": "Steady Demand",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 72000, "inr_lpa": 6.5, "eur": 55000},
            "Mid-Level (2-5 yrs)": {"usd": 110000, "inr_lpa": 13.5, "eur": 75000},
            "Senior (5-8 yrs)": {"usd": 148000, "inr_lpa": 24.0, "eur": 102000},
            "Staff / Lead (8+ yrs)": {"usd": 190000, "inr_lpa": 36.0, "eur": 130000},
        },
        "skill_premiums": {
            "Next.js": 15,
            "TypeScript": 14,
            "Performance Optimization": 16,
            "State Management": 10,
            "React": 12,
        },
        "top_locations": ["Remote", "Bengaluru, IN", "New York, NY", "Amsterdam, NL", "Pune, IN"],
        "common_titles": ["Frontend Engineer", "UI/UX Developer", "Web Application Engineer"]
    },
    "Full Stack Developer": {
        "demand_level": "Very High",
        "growth_rate_yoy": "+26%",
        "hiring_status": "Aggressive Hiring",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 80000, "inr_lpa": 8.0, "eur": 62000},
            "Mid-Level (2-5 yrs)": {"usd": 120000, "inr_lpa": 16.5, "eur": 85000},
            "Senior (5-8 yrs)": {"usd": 160000, "inr_lpa": 27.5, "eur": 112000},
            "Staff / Lead (8+ yrs)": {"usd": 208000, "inr_lpa": 42.0, "eur": 142000},
        },
        "skill_premiums": {
            "Docker": 14,
            "REST APIs": 12,
            "React": 10,
            "CI/CD": 12,
            "Database Design": 12,
        },
        "top_locations": ["Remote", "Bengaluru, IN", "San Francisco, CA", "London, UK", "Gurugram, IN"],
        "common_titles": ["Full Stack Engineer", "Full Stack Software Developer", "Software Engineer"]
    },
    "DevOps Engineer": {
        "demand_level": "Extremely High",
        "growth_rate_yoy": "+32%",
        "hiring_status": "Critical Shortage",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 85000, "inr_lpa": 8.0, "eur": 65000},
            "Mid-Level (2-5 yrs)": {"usd": 130000, "inr_lpa": 17.5, "eur": 90000},
            "Senior (5-8 yrs)": {"usd": 172000, "inr_lpa": 30.0, "eur": 120000},
            "Staff / Lead (8+ yrs)": {"usd": 220000, "inr_lpa": 45.0, "eur": 150000},
        },
        "skill_premiums": {
            "Kubernetes": 22,
            "Terraform": 18,
            "AWS": 15,
            "CI/CD": 14,
            "Docker": 12,
        },
        "top_locations": ["Remote", "Bengaluru, IN", "Dallas, TX", "Dublin, IE", "Noida, IN"],
        "common_titles": ["DevOps Engineer", "Site Reliability Engineer (SRE)", "Cloud Infrastructure Engineer"]
    },
    "Cloud Engineer": {
        "demand_level": "Very High",
        "growth_rate_yoy": "+30%",
        "hiring_status": "Aggressive Hiring",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 82000, "inr_lpa": 8.0, "eur": 64000},
            "Mid-Level (2-5 yrs)": {"usd": 126000, "inr_lpa": 17.0, "eur": 88000},
            "Senior (5-8 yrs)": {"usd": 168000, "inr_lpa": 29.0, "eur": 118000},
            "Staff / Lead (8+ yrs)": {"usd": 215000, "inr_lpa": 44.0, "eur": 148000},
        },
        "skill_premiums": {
            "Cloud Security": 20,
            "Kubernetes": 18,
            "Terraform": 16,
            "AWS": 14,
            "Microservices": 12,
        },
        "top_locations": ["Remote", "Bengaluru, IN", "Atlanta, GA", "London, UK", "Hyderabad, IN"],
        "common_titles": ["Cloud Engineer", "Cloud Architect", "Cloud Solutions Architect"]
    },
    "Cybersecurity Analyst": {
        "demand_level": "Skyrocketing",
        "growth_rate_yoy": "+35%",
        "hiring_status": "Severe Talent Shortage",
        "salary_bands": {
            "Junior (0-2 yrs)": {"usd": 80000, "inr_lpa": 7.5, "eur": 62000},
            "Mid-Level (2-5 yrs)": {"usd": 124000, "inr_lpa": 16.5, "eur": 86000},
            "Senior (5-8 yrs)": {"usd": 166000, "inr_lpa": 28.5, "eur": 116000},
            "Staff / Lead (8+ yrs)": {"usd": 218000, "inr_lpa": 44.0, "eur": 150000},
        },
        "skill_premiums": {
            "Penetration Testing": 22,
            "Threat Intelligence": 18,
            "Incident Response": 16,
            "Cloud Security": 18,
            "Network Security": 12,
        },
        "top_locations": ["Remote", "Washington, DC", "Bengaluru, IN", "Frankfurt, DE", "Singapore"],
        "common_titles": ["Cybersecurity Analyst", "Security Engineer", "SOC Analyst", "Information Security Specialist"]
    }
}

# Generic fallback for any other role
GENERIC_MARKET_DATA = {
    "demand_level": "High",
    "growth_rate_yoy": "+22%",
    "hiring_status": "Active Hiring",
    "salary_bands": {
        "Junior (0-2 yrs)": {"usd": 75000, "inr_lpa": 7.0, "eur": 58000},
        "Mid-Level (2-5 yrs)": {"usd": 115000, "inr_lpa": 15.0, "eur": 80000},
        "Senior (5-8 yrs)": {"usd": 155000, "inr_lpa": 25.0, "eur": 108000},
        "Staff / Lead (8+ yrs)": {"usd": 200000, "inr_lpa": 38.0, "eur": 138000},
    },
    "skill_premiums": {
        "Cloud Architecture": 18,
        "System Design": 16,
        "Automation": 14,
        "Security": 15,
        "Performance Tuning": 12,
    },
    "top_locations": ["Remote", "Bengaluru, IN", "San Francisco, CA", "London, UK", "New York, NY"],
    "common_titles": ["Software Engineer", "Systems Engineer", "Technical Specialist"]
}


def get_market_overview() -> Dict[str, Any]:
    """Returns top market highlights, high-growth roles, and skill trends."""
    sorted_roles = sorted(
        ROLE_MARKET_DATA.items(),
        key=lambda x: int(x[1]["growth_rate_yoy"].replace("+", "").replace("%", "")),
        reverse=True
    )

    hottest_roles = [
        {
            "role": r[0],
            "growth_rate": r[1]["growth_rate_yoy"],
            "demand": r[1]["demand_level"],
            "hiring_status": r[1]["hiring_status"],
            "mid_salary_usd": r[1]["salary_bands"]["Mid-Level (2-5 yrs)"]["usd"],
            "mid_salary_inr": f"₹{r[1]['salary_bands']['Mid-Level (2-5 yrs)']['inr_lpa']} LPA"
        }
        for r in sorted_roles
    ]

    highest_paying_skills = [
        {"skill": "MLOps & LLM Deployment", "premium": "+22%", "category": "AI / ML"},
        {"skill": "Kubernetes Orchestration", "premium": "+22%", "category": "DevOps & Cloud"},
        {"skill": "Cloud Security & DevSecOps", "premium": "+20%", "category": "Security"},
        {"skill": "Distributed Microservices", "premium": "+16%", "category": "Backend"},
        {"skill": "Next.js & React Performance", "premium": "+15%", "category": "Frontend"},
    ]

    return {
        "total_tracked_roles": len(ROLE_MARKET_DATA),
        "hottest_roles": hottest_roles,
        "highest_paying_skills": highest_paying_skills,
        "currency_rates": {"USD_TO_INR": 84.0, "USD_TO_EUR": 0.92},
        "last_updated": "Q3-Q4 2026 Tech Hiring Index"
    }


def get_role_market_data(role_name: str) -> Dict[str, Any]:
    """Returns detailed salary benchmarks and demand stats for a specific role."""
    data = ROLE_MARKET_DATA.get(role_name, GENERIC_MARKET_DATA)
    return {
        "role": role_name,
        **data
    }


def estimate_salary_boost(
    role: str,
    experience_level: str,
    current_skills: List[str],
    missing_skills: List[str]
) -> Dict[str, Any]:
    """
    Calculates candidate's current estimated compensation vs potential compensation
    after learning the missing roadmap skills.
    """
    role_info = ROLE_MARKET_DATA.get(role, GENERIC_MARKET_DATA)
    bands = role_info["salary_bands"]

    tier_key = "Mid-Level (2-5 yrs)"
    if "beginner" in experience_level.lower():
        tier_key = "Junior (0-2 yrs)"
    elif "advanced" in experience_level.lower():
        tier_key = "Senior (5-8 yrs)"

    base_band = bands.get(tier_key, bands["Mid-Level (2-5 yrs)"])
    base_usd = base_band["usd"]
    base_inr = base_band["inr_lpa"]

    # Calculate skill multiplier for missing skills
    premiums = role_info.get("skill_premiums", {})
    boost_pct = 0
    boost_breakdown = []

    for s in missing_skills:
        for p_name, p_val in premiums.items():
            if p_name.lower() in s.lower() or s.lower() in p_name.lower():
                boost_pct += p_val
                boost_breakdown.append({"skill": s, "boost_percent": p_val})
                break

    # Cap realistic immediate bump at 45%
    boost_pct = min(boost_pct, 45)
    if boost_pct == 0:
        boost_pct = min(len(missing_skills) * 4, 25)

    potential_usd = int(base_usd * (1 + (boost_pct / 100)))
    potential_inr = round(base_inr * (1 + (boost_pct / 100)), 1)

    return {
        "role": role,
        "experience_tier": tier_key,
        "current_estimated_salary": {
            "usd": base_usd,
            "formatted_usd": f"${base_usd:,}",
            "inr_lpa": base_inr,
            "formatted_inr": f"₹{base_inr} LPA"
        },
        "potential_salary_after_roadmap": {
            "usd": potential_usd,
            "formatted_usd": f"${potential_usd:,}",
            "inr_lpa": potential_inr,
            "formatted_inr": f"₹{potential_inr} LPA",
            "percent_gain": f"+{boost_pct}%",
            "annual_dollar_gain": f"+${potential_usd - base_usd:,}"
        },
        "high_value_skills_breakdown": boost_breakdown,
        "demand_level": role_info["demand_level"],
        "hiring_status": role_info["hiring_status"]
    }

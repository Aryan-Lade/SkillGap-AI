STAGE_ORDER = ["Foundational", "Intermediate", "Applied"]


def sequence_roadmap(ranked_missing_skills):
    stages = {stage: [] for stage in STAGE_ORDER}

    for skill_entry in ranked_missing_skills:
        stage = skill_entry.get("stage", "Foundational")
        if stage not in stages:
            stage = "Foundational"
        stages[stage].append({
            "skill": skill_entry["skill"],
            "weight": skill_entry["weight"],
            "reason": skill_entry["reason"],
        })

    for stage in STAGE_ORDER:
        stages[stage] = sorted(stages[stage], key=lambda x: x["weight"], reverse=True)

    return {stage: stages[stage] for stage in STAGE_ORDER if stages[stage]}

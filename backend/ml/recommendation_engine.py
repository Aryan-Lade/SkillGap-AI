def rank_missing_skills(missing_skills, role):
    sorted_skills = sorted(missing_skills, key=lambda x: x["weight"], reverse=True)

    enriched = []
    for skill in sorted_skills:
        weight_pct = int(skill["weight"] * 100)
        reason = f"High-impact skill required for {role} - {weight_pct}% of successful profiles have it."
        enriched.append({
            "skill": skill["name"],
            "weight": skill["weight"],
            "stage": skill["stage"],
            "reason": reason,
        })

    return enriched

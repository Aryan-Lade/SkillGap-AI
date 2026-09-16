import pandas as pd
import numpy as np
import json
import os
import joblib
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder

def _find_taxonomy():
    candidates = [
        os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'role_skill_taxonomy.json'),
        os.path.join(os.path.dirname(__file__), '..', 'data', 'role_skill_taxonomy.json'),
        os.path.join(os.path.dirname(__file__), 'data', 'processed', 'role_skill_taxonomy.json'),
        os.path.join(os.path.dirname(__file__), 'data', 'role_skill_taxonomy.json'),
        os.path.join(os.getcwd(), 'data', 'processed', 'role_skill_taxonomy.json'),
        os.path.join(os.getcwd(), 'data', 'role_skill_taxonomy.json'),
        os.path.join(os.getcwd(), 'backend', 'data', 'processed', 'role_skill_taxonomy.json'),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return candidates[0]

TAXONOMY_PATH = _find_taxonomy()
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'model_artifacts')
PROCESSED_DIR = os.path.dirname(TAXONOMY_PATH)

def _load_taxonomy():
    with open(TAXONOMY_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

TAXONOMY = _load_taxonomy()

ROLE_SKILLS = {
    role: [s["name"] for s in data["skills"]]
    for role, data in TAXONOMY.items()
}

ROLE_WEIGHTS = {
    role: {s["name"]: s["weight"] for s in data["skills"]}
    for role, data in TAXONOMY.items()
}

PROJECT_TO_SKILLS = {
    "EDA Project": ["Python", "Pandas", "NumPy", "Data Visualization", "Statistics"],
    "Web Scraper": ["Python", "REST APIs", "Linux/Bash"],
    "ML Classifier": ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy", "Statistics"],
    "Neural Network": ["Python", "Deep Learning", "NumPy", "Machine Learning"],
    "REST API": ["Python", "REST APIs", "Django/Flask/FastAPI", "SQL", "Authentication/Security"],
    "E-commerce Site": ["HTML/CSS", "JavaScript", "React", "REST APIs", "CSS Frameworks"],
    "Portfolio Website": ["HTML/CSS", "JavaScript", "Responsive Design", "Git"],
    "Data Dashboard": ["Python", "Data Visualization", "SQL", "Pandas", "React"],
    "Chatbot": ["Python", "NLP", "Deep Learning", "Machine Learning"],
    "Image Classifier": ["Python", "Deep Learning", "NumPy", "Machine Learning", "Scikit-learn"],
    "Recommendation System": ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy", "SQL"],
    "Mobile App Backend": ["Python", "REST APIs", "SQL", "Authentication/Security", "Django/Flask/FastAPI"],
    "Docker Deployment": ["Docker", "CI/CD", "Linux/Bash", "ML Deployment"],
    "Model Deployment API": ["Python", "REST APIs", "ML Deployment", "MLOps", "Docker"],
    "React Dashboard": ["React", "JavaScript", "HTML/CSS", "State Management", "REST APIs"],
    "Database Schema Design": ["SQL", "Database Design", "Python"],
    "A/B Test Analysis": ["Statistics", "Python", "Pandas", "A/B Testing", "Data Visualization"],
    "NLP Sentiment Analysis": ["Python", "NLP", "Machine Learning", "Pandas", "Scikit-learn"],
    "Feature Engineering Pipeline": ["Python", "Feature Engineering", "Pandas", "NumPy", "Scikit-learn"],
    "TypeScript App": ["TypeScript", "JavaScript", "React", "HTML/CSS"],
    "RAG Search Engine": ["Python", "PyTorch", "Hugging Face", "Vector Databases", "Prompt Engineering", "RAG Architectures"],
    "LLM Agent Assistant": ["Python", "LangChain/LlamaIndex", "Vector Databases", "Autonomous Agents", "Prompt Engineering"],
    "Kubernetes CI/CD Pipeline": ["Linux/Bash", "Git", "Docker", "CI/CD", "Kubernetes", "Infrastructure as Code"],
    "Terraform Cloud Infra": ["Terraform", "AWS/Cloud", "Networking", "Cloud Security/IAM", "Infrastructure as Code"],
    "Spring Boot Microservices": ["Java", "Spring Boot", "Hibernate/JPA", "Microservices", "REST APIs", "SQL", "Unit Testing (JUnit)"],
    "AWS Serverless API": ["AWS/Cloud", "Serverless (Lambda)", "Python", "Cloud Security/IAM", "REST APIs"],
    "Big Data ETL Pipeline": ["SQL", "Python", "Apache Spark", "Apache Airflow", "ETL Pipelines", "Data Warehousing"],
    "Kafka Real-Time Stream": ["Python", "Java", "Apache Kafka", "Docker", "ETL Pipelines"],
    "Penetration Testing Lab": ["Linux/Bash", "Networking", "Network Security", "Wireshark", "Ethical Hacking", "Vulnerability Assessment"],
    "SIEM Incident Monitor": ["Linux/Bash", "Python", "SIEM Tools", "Threat Modeling", "Incident Response"],
    "Full Stack MERN App": ["HTML/CSS", "JavaScript", "React", "Node.js/Express", "REST APIs", "TypeScript", "Authentication/Security"],
    "Flutter Mobile App": ["Dart", "Flutter/React Native", "Mobile UI/UX", "REST APIs", "Firebase", "State Management"],
    "Test Automation Suite": ["Python", "Selenium", "Cypress/Playwright", "API Testing", "CI/CD", "Test Automation Frameworks"],
    "Web3 DeFi DApp": ["Solidity", "Smart Contracts", "Web3.js/Ethers.js", "Hardhat/Foundry", "Cryptography", "JavaScript"],
    "Unity 3D Action Game": ["C#", "Unity/Unreal Engine", "3D Mathematics", "Physics Engines", "Game Loop Architecture"],
    "Embedded IoT Sensor Node": ["C", "C++", "Microcontrollers (ARM/ESP32)", "Protocols (I2C/SPI/UART)", "RTOS (FreeRTOS)", "Device Drivers"],
}

EXPERIENCE_SKILL_COUNTS = {
    "Beginner": (2, 5),
    "Intermediate": (5, 9),
    "Advanced": (8, 13),
}

ALL_SKILLS = sorted(set(s for skills in ROLE_SKILLS.values() for s in skills))
ALL_PROJECTS = list(PROJECT_TO_SKILLS.keys())
ROLES = sorted(list(ROLE_SKILLS.keys()))
EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"]


def compute_fit_score(current_skills, role, experience_level):
    role_skill_weights = ROLE_WEIGHTS[role]
    total_weight = sum(role_skill_weights.values())
    matched_weight = sum(role_skill_weights.get(s, 0) for s in current_skills if s in role_skill_weights)
    base_score = matched_weight / total_weight
    exp_bonus = {"Beginner": 0.0, "Intermediate": 0.05, "Advanced": 0.10}[experience_level]
    noise = np.random.normal(0, 0.05)
    raw_score = base_score + exp_bonus + noise
    return int(np.clip(raw_score, 0.0, 1.0) >= 0.55)


def generate_synthetic_dataset(n_samples=5000, seed=42):
    np.random.seed(seed)
    records = []

    samples_per_role = n_samples // len(ROLES)

    for role in ROLES:
        role_skills = ROLE_SKILLS[role]
        role_weights_dict = ROLE_WEIGHTS[role]

        for _ in range(samples_per_role):
            exp_level = np.random.choice(EXPERIENCE_LEVELS, p=[0.35, 0.40, 0.25])
            min_s, max_s = EXPERIENCE_SKILL_COUNTS[exp_level]
            n_skills = np.random.randint(min_s, max_s + 1)

            skill_weights_arr = np.array([role_weights_dict.get(s, 0.3) for s in role_skills])
            skill_probs = skill_weights_arr / skill_weights_arr.sum()

            n_role_skills = min(n_skills, len(role_skills))
            chosen_role_skills = np.random.choice(
                role_skills, size=n_role_skills, replace=False, p=skill_probs
            ).tolist()

            n_extra = np.random.randint(0, 3)
            other_skills = [s for s in ALL_SKILLS if s not in role_skills]
            extra_skills = (
                np.random.choice(other_skills, size=min(n_extra, len(other_skills)), replace=False).tolist()
                if other_skills
                else []
            )

            current_skills = list(set(chosen_role_skills + extra_skills))

            n_projects = np.random.randint(0, 4)
            projects_list = np.random.choice(
                ALL_PROJECTS, size=min(n_projects, len(ALL_PROJECTS)), replace=False
            ).tolist()

            derived_skills = set(current_skills)
            for proj in projects_list:
                derived_skills.update(PROJECT_TO_SKILLS.get(proj, []))

            label = compute_fit_score(list(derived_skills), role, exp_level)

            records.append({
                "student_id": f"STU{len(records):05d}",
                "current_skills": "|".join(current_skills),
                "target_role": role,
                "projects": "|".join(projects_list),
                "experience_level": exp_level,
                "label_fit": label,
            })

    remainder = n_samples - len(records)
    if remainder > 0:
        for _ in range(remainder):
            role = np.random.choice(ROLES)
            exp_level = np.random.choice(EXPERIENCE_LEVELS)
            role_skills = ROLE_SKILLS[role]
            min_s, max_s = EXPERIENCE_SKILL_COUNTS[exp_level]
            n_skills = np.random.randint(min_s, max_s + 1)
            current_skills = np.random.choice(
                role_skills, size=min(n_skills, len(role_skills)), replace=False
            ).tolist()
            projects_list = np.random.choice(
                ALL_PROJECTS, size=np.random.randint(0, 4), replace=False
            ).tolist()
            derived_skills = set(current_skills)
            for proj in projects_list:
                derived_skills.update(PROJECT_TO_SKILLS.get(proj, []))
            label = compute_fit_score(list(derived_skills), role, exp_level)
            records.append({
                "student_id": f"STU{len(records):05d}",
                "current_skills": "|".join(current_skills),
                "target_role": role,
                "projects": "|".join(projects_list),
                "experience_level": exp_level,
                "label_fit": label,
            })

    df = pd.DataFrame(records)
    df = df.sample(frac=1, random_state=seed).reset_index(drop=True)
    return df


def parse_pipe_separated(series):
    return series.apply(lambda x: [s.strip() for s in x.split("|") if s.strip()] if isinstance(x, str) else [])


def derive_skills_from_projects(projects_list):
    derived = set()
    for proj in projects_list:
        derived.update(PROJECT_TO_SKILLS.get(proj, []))
    return list(derived)


def build_unified_skill_list(current_skills, project_derived_skills):
    return list(set(current_skills + project_derived_skills))


def preprocess_dataset(df):
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    skill_lists = parse_pipe_separated(df["current_skills"])
    project_lists = parse_pipe_separated(df["projects"])

    project_derived = project_lists.apply(derive_skills_from_projects)
    unified_skills = skill_lists.combine(project_derived, func=build_unified_skill_list)

    skill_mlb = MultiLabelBinarizer()
    skill_mlb.fit([ALL_SKILLS])
    X_skills = skill_mlb.transform(unified_skills)

    role_enc = LabelEncoder()
    role_enc.fit(ROLES)
    X_role = role_enc.transform(df["target_role"]).reshape(-1, 1)

    exp_enc = LabelEncoder()
    exp_enc.fit(EXPERIENCE_LEVELS)
    X_exp = exp_enc.transform(df["experience_level"]).reshape(-1, 1)

    X = np.hstack([X_skills, X_role, X_exp])
    y = df["label_fit"].values

    joblib.dump(skill_mlb, os.path.join(ARTIFACTS_DIR, "skill_encoder.pkl"))
    joblib.dump(role_enc, os.path.join(ARTIFACTS_DIR, "role_encoder.pkl"))
    joblib.dump(exp_enc, os.path.join(ARTIFACTS_DIR, "exp_encoder.pkl"))

    return X, y, skill_mlb, role_enc, exp_enc


if __name__ == "__main__":
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    df = generate_synthetic_dataset(n_samples=8000)
    output_path = os.path.join(PROCESSED_DIR, "training_data.csv")
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} rows across {len(ROLES)} roles -> {output_path}")
    print(df["label_fit"].value_counts())
    X, y, *_ = preprocess_dataset(df)
    print(f"Feature matrix shape: {X.shape}")

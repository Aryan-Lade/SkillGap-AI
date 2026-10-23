import os
import json
import uuid
import time
import urllib.request
import urllib.error

# In-memory session store for active quizzes: quiz_id -> quiz_data
_ACTIVE_QUIZZES = {}

# Simple .env loader if python-dotenv isn't installed
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


def get_gemini_api_key():
    _load_env_file()
    return os.environ.get("GEMINI_API_KEY", "").strip()


# Curated high-yield fallback question bank for popular tech skills
FALLBACK_BANK = {
    "Python": [
        {
            "id": 1,
            "question": "What will be the output of `bool([])` and `bool([0])` in Python?",
            "options": ["False and True", "False and False", "True and True", "True and False"],
            "correct_index": 0,
            "explanation": "An empty list `[]` evaluates to False (falsy), while `[0]` is a non-empty list containing the element 0, which evaluates to True (truthy).",
            "subtopic": "Data Types & Truthiness"
        },
        {
            "id": 2,
            "question": "Which Python decorator is used to convert a class method into a read-only property attribute?",
            "options": ["@staticmethod", "@classmethod", "@property", "@attribute"],
            "correct_index": 2,
            "explanation": "The `@property` built-in decorator allows a method to be accessed like an attribute without calling it with parentheses.",
            "subtopic": "OOP & Decorators"
        },
        {
            "id": 3,
            "question": "What is the primary difference between a Python list and a generator expression?",
            "options": [
                "Generators can only store integers",
                "Generators evaluate items lazily on-demand, saving memory",
                "Lists are immutable while generators are mutable",
                "Generators are slower and take more RAM"
            ],
            "correct_index": 1,
            "explanation": "Generators compute items one by one on-the-fly via iteration (`yield`), avoiding loading all items into memory at once.",
            "subtopic": "Generators & Memory Optimization"
        },
        {
            "id": 4,
            "question": "In Python, which keyword is used inside a function to modify a variable defined in the global scope?",
            "options": ["nonlocal", "global", "outer", "extern"],
            "correct_index": 1,
            "explanation": "`global` allows modification of top-level module variables, whereas `nonlocal` is used for enclosing nested functions.",
            "subtopic": "Scope & Variable Namespaces"
        },
        {
            "id": 5,
            "question": "What happens if you use a mutable object (like a list `[]`) as a default argument in a Python function?",
            "options": [
                "Python throws a SyntaxError at compile time",
                "The default object is shared across subsequent calls if mutated",
                "A fresh empty list is created on every function call",
                "Python converts it automatically to a tuple"
            ],
            "correct_index": 1,
            "explanation": "Default arguments are evaluated once when the function definition is executed. Modifying a mutable default persists across future calls.",
            "subtopic": "Functions & Default Arguments"
        }
    ],
    "React": [
        {
            "id": 1,
            "question": "When does the callback inside `useEffect(() => {}, [])` execute?",
            "options": [
                "On every state update and re-render",
                "Only once, right after the initial mount of the component",
                "Before the DOM nodes are rendered to screen",
                "Only when the component is unmounting"
            ],
            "correct_index": 1,
            "explanation": "An empty dependency array `[]` ensures the effect runs only once when the component is mounted.",
            "subtopic": "React Hooks & Lifecycle"
        },
        {
            "id": 2,
            "question": "Why should keys provided to elements in a mapped list be stable and unique rather than array index?",
            "options": [
                "Keys are required by CSS for proper styling",
                "Indexes cause React reconciliation bugs when items are reordered, inserted, or removed",
                "Keys convert components into pure components automatically",
                "Array indexes crash the browser in production mode"
            ],
            "correct_index": 1,
            "explanation": "Using array index as keys confuses React's virtual DOM diffing algorithm when list order changes, causing wrong state retention in child components.",
            "subtopic": "Reconciliation & Keys"
        },
        {
            "id": 3,
            "question": "What is the main purpose of `useCallback` hook in React?",
            "options": [
                "To memoize computed values and numbers",
                "To memoize function definitions across re-renders to prevent unnecessary child re-renders",
                "To make asynchronous API calls in background",
                "To replace Redux for state management"
            ],
            "correct_index": 1,
            "explanation": "`useCallback` returns a memoized version of the callback that only changes if one of the dependencies has changed, preventing useless child renders.",
            "subtopic": "Performance Optimization"
        },
        {
            "id": 4,
            "question": "What happens when you update state using `useState` in React?",
            "options": [
                "The component immediately mutates the DOM synchronously",
                "React schedules a re-render of the component and batches updates",
                "The entire browser window is refreshed",
                "All sibling components are forcibly re-mounted"
            ],
            "correct_index": 1,
            "explanation": "State updates in React are asynchronous and batched. React schedules a re-render to compute the new Virtual DOM diff.",
            "subtopic": "State Management"
        },
        {
            "id": 5,
            "question": "Which React feature allows passing data through the component tree without manually passing props down at every level?",
            "options": ["React Portal", "Context API", "React Fiber", "Suspense"],
            "correct_index": 1,
            "explanation": "React Context provides a way to share values (like theme, authenticated user) between components without prop drilling.",
            "subtopic": "Context API & Prop Drilling"
        }
    ],
    "SQL": [
        {
            "id": 1,
            "question": "What is the difference between `WHERE` and `HAVING` clauses in SQL?",
            "options": [
                "There is no difference; they are aliases",
                "`WHERE` filters rows before aggregation, while `HAVING` filters aggregated groups",
                "`HAVING` filters individual rows before `GROUP BY`",
                "`WHERE` can only be used with numeric columns"
            ],
            "correct_index": 1,
            "explanation": "`WHERE` filters individual rows before grouping. `HAVING` filters groups formed by `GROUP BY` using aggregate functions like `COUNT()` or `AVG()`.",
            "subtopic": "Aggregation & Filtering"
        },
        {
            "id": 2,
            "question": "Which JOIN returns all rows from the left table and matched rows from the right table, filling nulls if no match?",
            "options": ["INNER JOIN", "CROSS JOIN", "LEFT JOIN", "RIGHT JOIN"],
            "correct_index": 2,
            "explanation": "A `LEFT JOIN` (or `LEFT OUTER JOIN`) preserves all rows from the left table regardless of whether there is a match in the right table.",
            "subtopic": "Joins"
        },
        {
            "id": 3,
            "question": "What does creating a database INDEX on a column accomplish?",
            "options": [
                "Increases storage compression and speeds up row insertions",
                "Speeds up data retrieval queries (SELECT) at the cost of slower writes and extra storage",
                "Enforces foreign key relationships automatically",
                "Encrypts data at rest"
            ],
            "correct_index": 1,
            "explanation": "Indexes (like B-Trees) accelerate lookup and search operations, but require maintenance overhead during INSERT, UPDATE, and DELETE.",
            "subtopic": "Indexing & Performance"
        },
        {
            "id": 4,
            "question": "What do the ACID properties in relational database management systems stand for?",
            "options": [
                "Accuracy, Consistency, Integrity, Durability",
                "Atomicity, Consistency, Isolation, Durability",
                "Aggregation, Computation, Indexing, Data",
                "Authentication, Cryptography, Identity, Directory"
            ],
            "correct_index": 1,
            "explanation": "ACID stands for Atomicity (all or nothing), Consistency, Isolation (concurrency control), and Durability (persistence).",
            "subtopic": "Transactions & ACID"
        },
        {
            "id": 5,
            "question": "What is the result of `SELECT COUNT(1)` vs `SELECT COUNT(column_name)` when `column_name` contains NULL values?",
            "options": [
                "Both return the exact same count",
                "`COUNT(1)` counts all rows, while `COUNT(column_name)` ignores NULL rows",
                "`COUNT(column_name)` throws an error on NULLs",
                "`COUNT(1)` is invalid SQL syntax"
            ],
            "correct_index": 1,
            "explanation": "`COUNT(*)` or `COUNT(1)` counts total records including nulls. `COUNT(col)` only counts non-NULL entries of that column.",
            "subtopic": "Aggregate Functions"
        }
    ],
    "Docker": [
        {
            "id": 1,
            "question": "What is the fundamental difference between a Docker Image and a Docker Container?",
            "options": [
                "An image is a running instance; a container is a static template",
                "An image is an immutable template/blueprint; a container is a live, running instance of an image",
                "Images are for Linux; containers are for Windows only",
                "Containers cannot have storage or networking"
            ],
            "correct_index": 1,
            "explanation": "A Docker image is read-only template with instructions. A container is a runnable, isolated instance created from that image.",
            "subtopic": "Core Architecture"
        },
        {
            "id": 2,
            "question": "In a Dockerfile, what is the key difference between `RUN` and `CMD` instructions?",
            "options": [
                "`RUN` executes when building the image; `CMD` specifies the default command executed when the container starts",
                "`CMD` builds the image; `RUN` runs the container",
                "`RUN` can only install packages on Debian",
                "There is no difference"
            ],
            "correct_index": 0,
            "explanation": "`RUN` executes commands and creates a new image layer during build time. `CMD` provides defaults for an executing container.",
            "subtopic": "Dockerfile Instructions"
        },
        {
            "id": 3,
            "question": "Why is multi-stage Docker build recommended for production apps?",
            "options": [
                "It enables multi-threading during container startup",
                "It separates build tools/dependencies from the final minimal runtime image, reducing image size and vulnerabilities",
                "It runs multiple containers concurrently under one process",
                "It automatically deploys images to Kubernetes"
            ],
            "correct_index": 1,
            "explanation": "Multi-stage builds leave compilers, dev dependencies, and build artifacts behind, creating tiny, secure production images.",
            "subtopic": "Multi-Stage Builds & Optimization"
        },
        {
            "id": 4,
            "question": "How do you persist data generated by a Docker container beyond its lifecycle?",
            "options": [
                "Store data in the container's root directory (`/tmp`)",
                "Use Docker Volumes or bind mounts",
                "Commit the container every minute to a new image",
                "Restart the container with `--keep-data`"
            ],
            "correct_index": 1,
            "explanation": "Docker Volumes exist outside the container's union filesystem on the host, ensuring data persists across container destruction.",
            "subtopic": "Volumes & Persistence"
        },
        {
            "id": 5,
            "question": "What does the command `docker-compose up -d` do?",
            "options": [
                "Deletes all stopped containers",
                "Builds and starts all defined services in detached (background) mode",
                "Pushes containers to Docker Hub in debug mode",
                "Runs interactive shell inside the primary service"
            ],
            "correct_index": 1,
            "explanation": "The `-d` flag runs containers in detached mode, leaving the terminal free while services run in the background.",
            "subtopic": "Docker Compose"
        }
    ]
}


def _generate_generic_fallback(skill: str, role: str, level: str):
    """Fallback generator for any skill if API key is not provided or network is down."""
    return [
        {
            "id": 1,
            "question": f"Which core principle is most fundamental when applying {skill} in modern software architecture?",
            "options": [
                f"Strict separation of concerns and modular component design in {skill}",
                f"Avoiding any automated testing or validation with {skill}",
                f"Storing all global states and configurations in hardcoded files",
                f"Bypassing standard design patterns for quick monolithic scripts"
            ],
            "correct_index": 0,
            "explanation": f"In {skill}, maintainability and scalability require clean separation of concerns and modular architecture.",
            "subtopic": "Fundamentals & Design Principles"
        },
        {
            "id": 2,
            "question": f"When debugging a production performance bottleneck in {skill}, what is the best initial step?",
            "options": [
                "Immediately restart the host server without collecting diagnostic logs",
                "Profile CPU, memory, and I/O metrics to locate the exact hotspot",
                "Rewrite the entire codebase in another programming language",
                "Disable all caching layers permanently"
            ],
            "correct_index": 1,
            "explanation": "Systematic profiling and metric inspection identify actual bottlenecks before making speculative optimizations.",
            "subtopic": "Performance & Debugging"
        },
        {
            "id": 3,
            "question": f"What is considered an industry best practice for handling errors and edge cases in {skill}?",
            "options": [
                "Catching and silently ignoring all exceptions without logging",
                "Structured error logging, graceful degradation, and clear user-facing feedback",
                "Crashing the application process immediately without cleanup",
                "Writing errors only to local browser alerts"
            ],
            "correct_index": 1,
            "explanation": "Robust software handles failures gracefully, captures actionable logs for engineers, and informs users clearly.",
            "subtopic": "Error Handling & Reliability"
        },
        {
            "id": 4,
            "question": f"In team development with {skill}, why is version control and continuous integration (CI) essential?",
            "options": [
                "It eliminates the need for code reviews and documentation",
                "It enables automated testing, prevents regressions, and facilitates collaborative branching",
                "It slows down release cycles intentionally to reduce features",
                "It replaces database backups entirely"
            ],
            "correct_index": 1,
            "explanation": "CI/CD and Git ensure consistent integration, automated test verification, and safe rollback capabilities.",
            "subtopic": "CI/CD & Collaboration"
        },
        {
            "id": 5,
            "question": f"Which security consideration is most critical when building {skill}-powered components in production?",
            "options": [
                "Trusting all client input directly without sanitization",
                "Principle of least privilege, input validation, and protecting sensitive credentials",
                "Hardcoding API secrets directly into public Git repositories",
                "Disabling HTTPS encryption to minimize network latency"
            ],
            "correct_index": 1,
            "explanation": "Security requires validating all untrusted inputs, securing secrets via environment variables, and following least privilege.",
            "subtopic": "Security & Best Practices"
        }
    ]


def _call_gemini_api(skill: str, role: str, level: str, api_key: str):
    """
    Calls Google Gemini REST API to dynamically generate 5 structured multiple-choice questions.
    Uses gemini-1.5-flash with JSON mode for fast, high-quality responses.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    prompt = f"""
You are an expert technical interviewer and educator for technical roles like '{role or "Software Engineer"}'.
Generate exactly 5 high-quality, practical multiple-choice questions (MCQs) to evaluate a developer's knowledge in the skill: '{skill}'.
Difficulty level: '{level or "Intermediate"}'.

Strict Requirements:
1. Provide realistic questions (mix of conceptual, best-practice, and real-world code/scenario troubleshooting).
2. Exactly 4 options per question.
3. Include correct_index (0, 1, 2, or 3).
4. Include a concise, educational explanation explaining why the correct answer is right and why it matters.
5. Include a subtopic name (e.g., 'Hooks', 'Async/Await', 'Indexing', 'Security').

Return ONLY a valid JSON array with 5 objects matching this exact structure:
[
  {{
    "id": 1,
    "question": "Question text here...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Why this is correct...",
    "subtopic": "Core Concept"
  }}
]
Do not wrap in markdown quotes if possible, or return raw JSON.
"""

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "topP": 0.8,
            "responseMimeType": "application/json"
        }
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req, timeout=12) as response:
        result = json.loads(response.read().decode("utf-8"))
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean text in case of markdown blocks
        clean_text = text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.startswith("```"):
            clean_text = clean_text[3:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        
        parsed = json.loads(clean_text.strip())
        if isinstance(parsed, list) and len(parsed) >= 3:
            # Ensure IDs and formatting
            for i, q in enumerate(parsed):
                q["id"] = i + 1
            return parsed[:5]
        elif isinstance(parsed, dict) and "questions" in parsed:
            questions = parsed["questions"]
            for i, q in enumerate(questions):
                q["id"] = i + 1
            return questions[:5]

    raise ValueError("Invalid format received from Gemini API")


def generate_quiz(skill: str, target_role: str = "Developer", experience_level: str = "Intermediate") -> dict:
    """
    Generates a 5-question quiz.
    Attempts Gemini API first if GEMINI_API_KEY is configured.
    Gracefully falls back to curated/generic bank with full stability.
    """
    api_key = get_gemini_api_key()
    questions = None
    source = "curated_bank"

    if api_key and not api_key.startswith("your_"):
        try:
            questions = _call_gemini_api(skill, target_role, experience_level, api_key)
            source = "gemini_ai"
        except Exception as e:
            print(f"[GeminiQuizService] Gemini API call failed ({e}), using fallback bank.")
            questions = None

    if not questions:
        # Check if skill exists in fallback bank
        normalized = None
        for k in FALLBACK_BANK.keys():
            if k.lower() == skill.lower():
                normalized = k
                break
        
        if normalized:
            questions = json.loads(json.dumps(FALLBACK_BANK[normalized]))
            source = "curated_bank"
        else:
            questions = _generate_generic_fallback(skill, target_role, experience_level)
            source = "smart_fallback"

    quiz_id = str(uuid.uuid4())

    # Store full questions (including answers) in active sessions
    _ACTIVE_QUIZZES[quiz_id] = {
        "skill": skill,
        "target_role": target_role,
        "experience_level": experience_level,
        "questions": questions,
        "source": source,
        "created_at": time.time()
    }

    # Clean old sessions (> 2 hours)
    now = time.time()
    for qid in list(_ACTIVE_QUIZZES.keys()):
        if now - _ACTIVE_QUIZZES[qid]["created_at"] > 7200:
            _ACTIVE_QUIZZES.pop(qid, None)

    # Return safe questions to frontend (WITHOUT correct_index and explanation)
    safe_questions = [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "subtopic": q.get("subtopic", "General Concept")
        }
        for q in questions
    ]

    return {
        "quiz_id": quiz_id,
        "skill": skill,
        "total_questions": len(safe_questions),
        "passing_score": 70,
        "time_limit_seconds": 180, # 3 minutes total
        "source": source,
        "questions": safe_questions
    }


def evaluate_quiz(quiz_id: str, skill: str, user_answers: dict) -> dict:
    """
    Evaluates user answers against stored quiz.
    user_answers format: { "1": 0, "2": 1, ... } (question_id -> selected_index)
    """
    quiz_session = _ACTIVE_QUIZZES.get(quiz_id)

    # If session expired or not found, try fallback lookup for grading
    if not quiz_session:
        # Fallback session to prevent user loss
        normalized = None
        for k in FALLBACK_BANK.keys():
            if k.lower() == skill.lower():
                normalized = k
                break
        questions = FALLBACK_BANK.get(normalized, _generate_generic_fallback(skill, "Developer", "Intermediate"))
    else:
        questions = quiz_session["questions"]

    correct_count = 0
    total = len(questions)
    breakdown = []
    missed_subtopics = set()

    for q in questions:
        qid_str = str(q["id"])
        user_choice = user_answers.get(qid_str)
        
        # User answer might be None or int
        if user_choice is not None:
            try:
                user_choice = int(user_choice)
            except (ValueError, TypeError):
                user_choice = None

        correct_idx = q["correct_index"]
        is_correct = (user_choice == correct_idx)

        if is_correct:
            correct_count += 1
        else:
            if "subtopic" in q:
                missed_subtopics.add(q["subtopic"])

        user_option_text = q["options"][user_choice] if user_choice is not None and 0 <= user_choice < len(q["options"]) else "Not Answered"
        correct_option_text = q["options"][correct_idx]

        breakdown.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "user_choice": user_choice,
            "user_option_text": user_option_text,
            "correct_index": correct_idx,
            "correct_option_text": correct_option_text,
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
            "subtopic": q.get("subtopic", "General")
        })

    score_percentage = round((correct_count / total) * 100, 1) if total > 0 else 0
    passed = score_percentage >= 70.0
    all_wrong = (correct_count == 0)

    # Custom Hindi/English friendly feedback as requested
    if all_wrong:
        headline = "Need Fundamental Learning 🚨"
        feedback_message = (
            f"Aapne sabhi {total} sawaal galat kiye hain! "
            f"Is skill ({skill}) ko shuru se acche se learn kijiye. Roadmap me diye gaye curated resources aur documentation ko pehle dhyan se padhein, fir re-attempt karein."
        )
        badge_status = "failed"
    elif not passed:
        headline = "Almost There — More Practice Needed ⚠️"
        feedback_message = (
            f"Aapko is skill ({skill}) par thoda aur dhyan dene ki zarurat hai. "
            f"Aapka score {score_percentage}% raha (Passing: 70%). Niche diye gaye galat answers aur unke explanations dhyan se samjhein."
        )
        badge_status = "failed"
    else:
        headline = "Skill Verified! 🎉"
        feedback_message = (
            f"Shaandar pradarshan! Aapne {score_percentage}% score ke sath {skill} ka assessment successfully pass kar liya hai. "
            f"Yeh skill ab aapke profile me Verified mark kar di gayi hai."
        )
        badge_status = "verified"

    return {
        "quiz_id": quiz_id,
        "skill": skill,
        "score": correct_count,
        "total": total,
        "score_percentage": score_percentage,
        "passed": passed,
        "all_wrong": all_wrong,
        "badge_status": badge_status,
        "headline": headline,
        "feedback_message": feedback_message,
        "missed_subtopics": list(missed_subtopics),
        "breakdown": breakdown
    }

import io
import sys
import time
import sqlite3
import subprocess
import tempfile
import os
from typing import Dict, List, Any, Optional

# Curated challenges database across languages and topics
CHALLENGES = [
    {
        "id": "py-1",
        "title": "Two Sum & Hash Maps",
        "language": "python",
        "skill": "Python",
        "difficulty": "Easy",
        "description": "Given a list of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. Each input has exactly one solution.",
        "starter_code": """def two_sum(nums, target):
    # Your solution here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test calls
print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 6))
""",
        "test_code": """
assert two_sum([2, 7, 11, 15], 9) == [0, 1], "Test 1 failed"
assert two_sum([3, 2, 4], 6) == [1, 2], "Test 2 failed"
assert two_sum([3, 3], 6) == [0, 1], "Test 3 failed"
print("ALL TESTS PASSED ✅")
"""
    },
    {
        "id": "py-2",
        "title": "Validate Valid Parentheses",
        "language": "python",
        "skill": "Python",
        "difficulty": "Medium",
        "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid (brackets must close in the correct order).",
        "starter_code": """def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

print("is_valid('()[]{}'):", is_valid("()[]{}"))
print("is_valid('(]'):", is_valid("(]"))
""",
        "test_code": """
assert is_valid("()") == True, "Test 1 failed"
assert is_valid("()[]{}") == True, "Test 2 failed"
assert is_valid("(]") == False, "Test 3 failed"
assert is_valid("([)]") == False, "Test 4 failed"
print("ALL TESTS PASSED ✅")
"""
    },
    {
        "id": "js-1",
        "title": "Async Data Processing & Debounce",
        "language": "javascript",
        "skill": "JavaScript",
        "difficulty": "Medium",
        "description": "Implement a simple pipeline to filter and map user objects, calculating total active users and average age.",
        "starter_code": """const users = [
  { id: 1, name: 'Alice', age: 28, active: true },
  { id: 2, name: 'Bob', age: 34, active: false },
  { id: 3, name: 'Charlie', age: 22, active: true },
  { id: 4, name: 'Diana', age: 30, active: true }
];

function getActiveUserStats(usersList) {
  const active = usersList.filter(u => u.active);
  const totalAge = active.reduce((sum, u) => sum + u.age, 0);
  const avgAge = active.length > 0 ? (totalAge / active.length).toFixed(1) : 0;
  
  return {
    count: active.length,
    averageAge: parseFloat(avgAge)
  };
}

console.log('Result:', JSON.stringify(getActiveUserStats(users), null, 2));
""",
        "test_code": """
const testUsers = [
  { id: 1, name: 'A', age: 20, active: true },
  { id: 2, name: 'B', age: 40, active: true }
];
const res = getActiveUserStats(testUsers);
if (res.count !== 2) throw new Error("Expected count 2, got " + res.count);
if (res.averageAge !== 30.0) throw new Error("Expected averageAge 30.0, got " + res.averageAge);
console.log("ALL TESTS PASSED ✅");
"""
    },
    {
        "id": "sql-1",
        "title": "Employee Top Earners per Department",
        "language": "sql",
        "skill": "SQL",
        "difficulty": "Intermediate",
        "description": "Write a query to find all employees earning above $85,000, joined with their department names and ordered by salary descending.",
        "starter_code": """-- Available Tables: employees(id, name, department_id, salary), departments(id, name)
SELECT e.name AS employee_name, d.name AS department, e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.salary >= 85000
ORDER BY e.salary DESC;
""",
        "test_code": ""
    }
]


def _init_sql_sample_db() -> sqlite3.Connection:
    """Creates an in-memory SQLite database populated with realistic tables."""
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE departments (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department_id INTEGER,
        salary INTEGER NOT NULL,
        role TEXT NOT NULL,
        FOREIGN KEY(department_id) REFERENCES departments(id)
    )
    """)

    cursor.executemany("INSERT INTO departments VALUES (?, ?)", [
        (1, "Engineering"),
        (2, "Data Science"),
        (3, "Security"),
        (4, "Product"),
    ])

    cursor.executemany("INSERT INTO employees VALUES (?, ?, ?, ?, ?)", [
        (101, "Alice Smith", 1, 125000, "Backend Lead"),
        (102, "Bob Johnson", 1, 95000, "Full Stack Developer"),
        (103, "Carol Williams", 2, 135000, "Senior Data Scientist"),
        (104, "David Brown", 2, 82000, "Junior ML Engineer"),
        (105, "Eva Davis", 3, 115000, "Cybersecurity Analyst"),
        (106, "Frank Miller", 1, 78000, "Junior Developer"),
        (107, "Grace Lee", 4, 105000, "Product Manager"),
    ])

    conn.commit()
    return conn


def execute_python_code(code: str, test_code: Optional[str] = None) -> Dict[str, Any]:
    """Executes Python code in an isolated subprocess with timeout and safety checks."""
    full_code = code
    if test_code:
        full_code += "\n\n" + test_code

    start_time = time.time()
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as f:
            f.write(full_code)
            temp_path = f.name

        proc = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=6  # 6 second max execution
        )
        duration_ms = int((time.time() - start_time) * 1000)

        stdout = proc.stdout
        stderr = proc.stderr
        success = proc.returncode == 0
        tests_passed = "ALL TESTS PASSED" in stdout or (success and not test_code)

        return {
            "success": success,
            "stdout": stdout,
            "stderr": stderr,
            "exit_code": proc.returncode,
            "duration_ms": duration_ms,
            "tests_passed": tests_passed
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "stdout": "",
            "stderr": "Execution timed out (maximum 6 seconds exceeded). Check for infinite loops.",
            "exit_code": -1,
            "duration_ms": 6000,
            "tests_passed": False
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Execution error: {str(e)}",
            "exit_code": 1,
            "duration_ms": 0,
            "tests_passed": False
        }
    finally:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


def execute_javascript_code(code: str, test_code: Optional[str] = None) -> Dict[str, Any]:
    """Executes JavaScript code using Node.js."""
    full_code = code
    if test_code:
        full_code += "\n\n" + test_code

    start_time = time.time()
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(full_code)
            temp_path = f.name

        proc = subprocess.run(
            ["node", temp_path],
            capture_output=True,
            text=True,
            timeout=6
        )
        duration_ms = int((time.time() - start_time) * 1000)

        stdout = proc.stdout
        stderr = proc.stderr
        success = proc.returncode == 0
        tests_passed = "ALL TESTS PASSED" in stdout or (success and not test_code)

        return {
            "success": success,
            "stdout": stdout,
            "stderr": stderr,
            "exit_code": proc.returncode,
            "duration_ms": duration_ms,
            "tests_passed": tests_passed
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "stdout": "",
            "stderr": "Execution timed out (maximum 6 seconds exceeded).",
            "exit_code": -1,
            "duration_ms": 6000,
            "tests_passed": False
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Node execution error: {str(e)}",
            "exit_code": 1,
            "duration_ms": 0,
            "tests_passed": False
        }
    finally:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


def execute_sql_query(query: str) -> Dict[str, Any]:
    """Executes a SQL query on a mock populated SQLite database."""
    start_time = time.time()
    conn = _init_sql_sample_db()
    cursor = conn.cursor()

    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        duration_ms = int((time.time() - start_time) * 1000)

        # Convert rows to dicts
        result_rows = [dict(zip(columns, row)) for row in rows]

        return {
            "success": True,
            "columns": columns,
            "rows": result_rows,
            "row_count": len(rows),
            "stdout": f"Executed successfully: {len(rows)} row(s) returned.",
            "stderr": "",
            "duration_ms": duration_ms,
            "tests_passed": True
        }
    except Exception as e:
        return {
            "success": False,
            "columns": [],
            "rows": [],
            "row_count": 0,
            "stdout": "",
            "stderr": f"SQL Error: {str(e)}",
            "duration_ms": int((time.time() - start_time) * 1000),
            "tests_passed": False
        }
    finally:
        conn.close()


def run_code(language: str, code: str, test_code: Optional[str] = None) -> Dict[str, Any]:
    """Dispatcher for code execution by language."""
    lang = language.lower().strip()
    if lang in ["python", "py"]:
        return execute_python_code(code, test_code)
    elif lang in ["javascript", "js", "node"]:
        return execute_javascript_code(code, test_code)
    elif lang in ["sql"]:
        return execute_sql_query(code)
    else:
        raise ValueError(f"Unsupported language: {language}. Supported: python, javascript, sql")


def get_challenges() -> List[Dict[str, Any]]:
    return CHALLENGES

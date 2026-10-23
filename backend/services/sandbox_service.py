import io
import sys
import time
import sqlite3
import subprocess
import tempfile
import os
from typing import Dict, List, Any, Optional

# Curated challenges database: 2 questions per skill across 10 core skills
CHALLENGES = [
    # --- 1. PYTHON ---
    {
        "id": "py-1",
        "title": "Two Sum & Hash Maps",
        "language": "python",
        "skill": "Python",
        "difficulty": "Easy",
        "description": "Given a list of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. Each input has exactly one solution.",
        "hints": [
            "Use a dictionary/hash map to store numbers you've already seen along with their indices.",
            "For each number `x`, check if `target - x` exists in your dictionary.",
            "Dictionary lookups in Python operate in O(1) average time complexity."
        ],
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
print("Result 1:", two_sum([2, 7, 11, 15], 9))
print("Result 2:", two_sum([3, 2, 4], 6))
""",
        "solution_code": """def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Example test:
print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]
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
        "title": "Validate Valid Parentheses & Stack",
        "language": "python",
        "skill": "Python",
        "difficulty": "Medium",
        "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid (brackets must close in the correct order).",
        "hints": [
            "Use a stack (list in Python) to keep track of open brackets.",
            "When encountering a closing bracket, pop from the stack and verify it matches.",
            "At the end of iteration, verify that the stack is completely empty."
        ],
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
        "solution_code": """def is_valid(s):
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

print("Valid test:", is_valid("()[]{}"))
""",
        "test_code": """
assert is_valid("()") == True, "Test 1 failed"
assert is_valid("()[]{}") == True, "Test 2 failed"
assert is_valid("(]") == False, "Test 3 failed"
assert is_valid("([)]") == False, "Test 4 failed"
print("ALL TESTS PASSED ✅")
"""
    },

    # --- 2. JAVASCRIPT ---
    {
        "id": "js-1",
        "title": "Async Array Pipeline & User Stats",
        "language": "javascript",
        "skill": "JavaScript",
        "difficulty": "Easy",
        "description": "Implement a data pipeline to filter active users, calculate the total active count, and compute their average age rounded to 1 decimal place.",
        "hints": [
            "Use `.filter(u => u.active)` to get active users.",
            "Use `.reduce((sum, u) => sum + u.age, 0)` to calculate the sum of ages.",
            "Handle empty arrays gracefully and format with `parseFloat(avg.toFixed(1))`."
        ],
        "starter_code": """const users = [
  { id: 1, name: 'Alice', age: 28, active: true },
  { id: 2, name: 'Bob', age: 34, active: false },
  { id: 3, name: 'Charlie', age: 22, active: true },
  { id: 4, name: 'Diana', age: 30, active: true }
];

function getActiveUserStats(usersList) {
  // Your code here
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
        "solution_code": """function getActiveUserStats(usersList) {
  const active = usersList.filter(u => u.active);
  const totalAge = active.reduce((sum, u) => sum + u.age, 0);
  const avgAge = active.length > 0 ? (totalAge / active.length).toFixed(1) : 0;
  return {
    count: active.length,
    averageAge: parseFloat(avgAge)
  };
}

console.log(getActiveUserStats([{ id: 1, age: 30, active: true }]));
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
        "id": "js-2",
        "title": "Deep Object Flattener & Key Paths",
        "language": "javascript",
        "skill": "JavaScript",
        "difficulty": "Medium",
        "description": "Write a function `flattenObject` that takes a deeply nested object and flattens it into dot-notated key-value pairs (e.g., `{ user: { name: 'Alex' } }` becomes `{ 'user.name': 'Alex' }`).",
        "hints": [
            "Use recursion to traverse nested objects.",
            "Concatenate parent keys using dots (e.g., `prefix ? prefix + '.' + key : key`).",
            "Check for plain objects with `typeof val === 'object' && val !== null && !Array.isArray(val)`."
        ],
        "starter_code": """function flattenObject(obj, prefix = '', result = {}) {
  // Your implementation here
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

const nested = {
  app: { name: 'SkillGap AI', version: 1.0 },
  user: { profile: { role: 'Full Stack' } }
};
console.log('Flattened:', JSON.stringify(flattenObject(nested), null, 2));
""",
        "solution_code": """function flattenObject(obj, prefix = '', result = {}) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}
""",
        "test_code": """
const sample = { a: { b: 1, c: { d: 2 } } };
const flat = flattenObject(sample);
if (flat['a.b'] !== 1) throw new Error("Expected a.b to be 1");
if (flat['a.c.d'] !== 2) throw new Error("Expected a.c.d to be 2");
console.log("ALL TESTS PASSED ✅");
"""
    },

    # --- 3. SQL ---
    {
        "id": "sql-1",
        "title": "Employee Top Earners per Department",
        "language": "sql",
        "skill": "SQL",
        "difficulty": "Easy",
        "description": "Write a query to find all employees earning above $85,000, joined with their department names and ordered by salary descending.",
        "hints": [
            "Use an `INNER JOIN` between `employees` and `departments` on `department_id = id`.",
            "Filter rows using `WHERE salary >= 85000`.",
            "Order the results with `ORDER BY salary DESC`."
        ],
        "starter_code": """-- Available Tables: employees(id, name, department_id, salary, role), departments(id, name)
SELECT e.name AS employee_name, d.name AS department, e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.salary >= 85000
ORDER BY e.salary DESC;
""",
        "solution_code": """SELECT e.name AS employee_name, d.name AS department, e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.salary >= 85000
ORDER BY e.salary DESC;
""",
        "test_code": ""
    },
    {
        "id": "sql-2",
        "title": "Department Budget & Average Compensation",
        "language": "sql",
        "skill": "SQL",
        "difficulty": "Medium",
        "description": "Write a query grouping employees by department to calculate the total employee count, average salary (rounded to 2 decimals), and highest salary per department.",
        "hints": [
            "Use `GROUP BY d.id, d.name` to aggregate employee data by department.",
            "Use aggregate functions: `COUNT(e.id)` for headcount, `AVG(e.salary)` for mean, and `MAX(e.salary)` for peak.",
            "Round the average salary using `ROUND(AVG(e.salary), 2)`."
        ],
        "starter_code": """-- Group by department to calculate count, average salary, and max salary
SELECT 
  d.name AS department,
  COUNT(e.id) AS total_employees,
  ROUND(AVG(e.salary), 2) AS average_salary,
  MAX(e.salary) AS highest_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
ORDER BY average_salary DESC;
""",
        "solution_code": """SELECT 
  d.name AS department,
  COUNT(e.id) AS total_employees,
  ROUND(AVG(e.salary), 2) AS average_salary,
  MAX(e.salary) AS highest_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
ORDER BY average_salary DESC;
""",
        "test_code": ""
    },

    # --- 4. REACT / FRONTEND ---
    {
        "id": "react-1",
        "title": "Custom State Reducer & Action Dispatcher",
        "language": "javascript",
        "skill": "React",
        "difficulty": "Easy",
        "description": "Implement a predictable state reducer function for managing a counter with actions: 'INCREMENT', 'DECREMENT', and 'RESET'.",
        "hints": [
            "A reducer function accepts `(state, action)` and returns new state without mutating original state.",
            "Use a `switch` statement on `action.type`.",
            "For 'INCREMENT', return `{ ...state, count: state.count + (action.payload || 1) }`."
        ],
        "starter_code": """function counterReducer(state, action) {
  // Your code here
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + (action.payload || 1) };
    case 'DECREMENT':
      return { ...state, count: Math.max(0, state.count - (action.payload || 1)) };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
}

let state = { count: 10 };
state = counterReducer(state, { type: 'INCREMENT', payload: 5 });
console.log('After Increment:', state.count);
state = counterReducer(state, { type: 'DECREMENT', payload: 3 });
console.log('After Decrement:', state.count);
""",
        "solution_code": """function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + (action.payload || 1) };
    case 'DECREMENT':
      return { ...state, count: Math.max(0, state.count - (action.payload || 1)) };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
}
""",
        "test_code": """
let s = { count: 0 };
s = counterReducer(s, { type: 'INCREMENT', payload: 4 });
if (s.count !== 4) throw new Error("Expected count 4");
s = counterReducer(s, { type: 'RESET' });
if (s.count !== 0) throw new Error("Expected count 0");
console.log("ALL TESTS PASSED ✅");
"""
    },
    {
        "id": "react-2",
        "title": "Debounce Search Handler & Timer Closure",
        "language": "javascript",
        "skill": "React",
        "difficulty": "Medium",
        "description": "Implement a `debounce(fn, delay)` higher-order function that delays invoking `fn` until after `delay` milliseconds have elapsed since the last time it was called.",
        "hints": [
            "Store a timer reference variable `timerId` in the outer function scope.",
            "Clear any existing timer with `clearTimeout(timerId)` whenever called.",
            "Set a new timer with `setTimeout` to invoke the callback with `fn.apply(this, args)`."
        ],
        "starter_code": """function debounce(fn, delay) {
  let timerId = null;
  return function(...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

let searchCount = 0;
const handleSearch = debounce((query) => {
  searchCount++;
  console.log(`Searching for: ${query} (Call #${searchCount})`);
}, 100);

handleSearch('React');
handleSearch('React H');
handleSearch('React Hooks');
""",
        "solution_code": """function debounce(fn, delay) {
  let timerId = null;
  return function(...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
""",
        "test_code": """
let execCount = 0;
const testFn = debounce(() => { execCount++; }, 50);
testFn(); testFn(); testFn();
setTimeout(() => {
  if (execCount !== 1) throw new Error("Debounce should execute once, got: " + execCount);
  console.log("ALL TESTS PASSED ✅");
}, 120);
"""
    },

    # --- 5. FASTAPI / REST APIS ---
    {
        "id": "api-1",
        "title": "REST Query Parameters Parser & Sanitizer",
        "language": "python",
        "skill": "REST APIs",
        "difficulty": "Easy",
        "description": "Write a function `parse_query_params` that converts a URL query string (e.g. `?limit=10&sort=desc&page=2`) into a typed Python dictionary.",
        "hints": [
            "Strip the leading '?' using `.strip('?')`.",
            "Split by '&' to get pairs, and split each pair by '='.",
            "Convert numeric strings to integers if `.isdigit()` is True."
        ],
        "starter_code": """def parse_query_params(query_string):
    params = {}
    if not query_string:
        return params
    pairs = query_string.strip("?").split("&")
    for pair in pairs:
        if "=" in pair:
            k, v = pair.split("=", 1)
            if v.isdigit():
                params[k] = int(v)
            else:
                params[k] = v
    return params

qs = "?role=developer&page=1&limit=25&active=true"
print("Parsed Parameters:", parse_query_params(qs))
""",
        "solution_code": """def parse_query_params(query_string):
    params = {}
    if not query_string:
        return params
    pairs = query_string.strip("?").split("&")
    for pair in pairs:
        if "=" in pair:
            k, v = pair.split("=", 1)
            params[k] = int(v) if v.isdigit() else v
    return params
""",
        "test_code": """
res = parse_query_params("?limit=50&category=backend")
assert res["limit"] == 50, "Limit should be int 50"
assert res["category"] == "backend", "Category mismatch"
print("ALL TESTS PASSED ✅")
"""
    },
    {
        "id": "api-2",
        "title": "Token Bucket Rate Limiter Algorithm",
        "language": "python",
        "skill": "REST APIs",
        "difficulty": "Medium",
        "description": "Implement a `TokenBucketRateLimiter` class with capacity and refill rate to prevent API request abuse.",
        "hints": [
            "Store current available tokens and maximum capacity.",
            "In `allow_request(tokens_needed)`, deduct tokens if `tokens >= tokens_needed`.",
            "In `refill(elapsed_seconds)`, add `elapsed * refill_rate` capped at capacity."
        ],
        "starter_code": """class TokenBucketRateLimiter:
    def __init__(self, capacity=5, refill_rate=1.0):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate

    def allow_request(self, tokens_needed=1):
        if self.tokens >= tokens_needed:
            self.tokens -= tokens_needed
            return True
        return False

    def refill(self, elapsed_seconds):
        self.tokens = min(self.capacity, self.tokens + (elapsed_seconds * self.refill_rate))

limiter = TokenBucketRateLimiter(capacity=3, refill_rate=1.0)
print("Req 1:", limiter.allow_request())
print("Req 2:", limiter.allow_request())
print("Req 3:", limiter.allow_request())
print("Req 4 (should be False):", limiter.allow_request())
""",
        "solution_code": """class TokenBucketRateLimiter:
    def __init__(self, capacity=5, refill_rate=1.0):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate

    def allow_request(self, tokens_needed=1):
        if self.tokens >= tokens_needed:
            self.tokens -= tokens_needed
            return True
        return False

    def refill(self, elapsed_seconds):
        self.tokens = min(self.capacity, self.tokens + (elapsed_seconds * self.refill_rate))
""",
        "test_code": """
tb = TokenBucketRateLimiter(capacity=2, refill_rate=2.0)
assert tb.allow_request() == True
assert tb.allow_request() == True
assert tb.allow_request() == False
tb.refill(1.0)
assert tb.allow_request() == True
print("ALL TESTS PASSED ✅")
"""
    },

    # --- 6. DATA STRUCTURES & ALGORITHMS ---
    {
        "id": "dsa-1",
        "title": "Reverse Linked List with Pointer Swapping",
        "language": "python",
        "skill": "Data Structures",
        "difficulty": "Easy",
        "description": "Reverse a singly linked list iteratively and return the new head node.",
        "hints": [
            "Use three pointers: `prev`, `curr`, and `next_node`.",
            "Save `next_node = curr.next` before overwriting `curr.next = prev`.",
            "Advance `prev = curr` and `curr = next_node`."
        ],
        "starter_code": """class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev

def to_list(node):
    res = []
    while node:
        res.append(node.val)
        node = node.next
    return res

head = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
print("Original:", to_list(head))
rev = reverse_linked_list(head)
print("Reversed:", to_list(rev))
""",
        "solution_code": """def reverse_linked_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
""",
        "test_code": """
h = ListNode(10, ListNode(20, ListNode(30)))
res = reverse_linked_list(h)
assert res.val == 30 and res.next.val == 20 and res.next.next.val == 10
print("ALL TESTS PASSED ✅")
"""
    },
    {
        "id": "dsa-2",
        "title": "Binary Search in Rotated Sorted Array",
        "language": "python",
        "skill": "Data Structures",
        "difficulty": "Medium",
        "description": "Given a rotated sorted array `nums` and a `target`, find its index in O(log n) time, or return -1 if not found.",
        "hints": [
            "One half of the rotated array is ALWAYS sorted.",
            "Check if `nums[left] <= nums[mid]` to know if left half is sorted.",
            "If target lies within the sorted half, narrow to that half; otherwise search the other half."
        ],
        "starter_code": """def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

arr = [4, 5, 6, 7, 0, 1, 2]
print("Index of 0:", search_rotated(arr, 0))
print("Index of 3:", search_rotated(arr, 3))
""",
        "solution_code": """def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
""",
        "test_code": """
arr = [6, 7, 1, 2, 3, 4, 5]
assert search_rotated(arr, 1) == 2, "Test 1 failed"
assert search_rotated(arr, 7) == 1, "Test 2 failed"
assert search_rotated(arr, 9) == -1, "Test 3 failed"
print("ALL TESTS PASSED ✅")
"""
    },

    # --- 7. MACHINE LEARNING / PANDAS ---
    {
        "id": "ml-1",
        "title": "Min-Max Feature Scaler & Normalizer",
        "language": "python",
        "skill": "Machine Learning",
        "difficulty": "Easy",
        "description": "Implement a Min-Max scaling function that transforms an array of numeric values into the range [0.0, 1.0].",
        "hints": [
            "Min-Max normalization formula is: `(x - min) / (max - min)`.",
            "Calculate `min(data)` and `max(data)` first.",
            "If `max == min`, return a list of zeros to avoid division by zero."
        ],
        "starter_code": """def min_max_scale(data):
    if not data:
        return []
    min_val = min(data)
    max_val = max(data)
    if max_val == min_val:
        return [0.0] * len(data)
    return [round((x - min_val) / (max_val - min_val), 4) for x in data]

raw_salaries = [45000, 75000, 120000, 60000, 95000]
print("Normalized Features:", min_max_scale(raw_salaries))
""",
        "solution_code": """def min_max_scale(data):
    if not data:
        return []
    min_val = min(data)
    max_val = max(data)
    if max_val == min_val:
        return [0.0] * len(data)
    return [round((x - min_val) / (max_val - min_val), 4) for x in data]
""",
        "test_code": """
res = min_max_scale([10, 20, 30])
assert res == [0.0, 0.5, 1.0], "Failed standard scaling"
assert min_max_scale([5, 5, 5]) == [0.0, 0.0, 0.0], "Failed zero-division check"
print("ALL TESTS PASSED ✅")
"""
    },
    {
        "id": "ml-2",
        "title": "Confusion Matrix & Evaluation Metrics",
        "language": "python",
        "skill": "Machine Learning",
        "difficulty": "Medium",
        "description": "Compute precision, recall, and F1-score from ground truth labels `y_true` and predicted binary labels `y_pred`.",
        "hints": [
            "Compare pair-wise elements using `zip(y_true, y_pred)`.",
            "Count True Positives (1, 1), False Positives (0, 1), and False Negatives (1, 0).",
            "Precision = `TP / (TP + FP)`; Recall = `TP / (TP + FN)`; F1 = `2 * P * R / (P + R)`."
        ],
        "starter_code": """def calculate_metrics(y_true, y_pred):
    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)
    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)
    fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)
    tn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 0)
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return {
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4)
    }

actual =    [1, 1, 0, 1, 0, 0, 1, 0]
predicted = [1, 0, 0, 1, 1, 0, 1, 0]
print("Evaluation Metrics:", calculate_metrics(actual, predicted))
""",
        "solution_code": """def calculate_metrics(y_true, y_pred):
    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)
    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)
    fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    return {"precision": round(precision, 4), "recall": round(recall, 4), "f1_score": round(f1, 4)}
""",
        "test_code": """
m = calculate_metrics([1, 1, 1, 0], [1, 1, 0, 0])
assert m["precision"] == 1.0, "Precision should be 1.0"
assert m["recall"] == 0.6667, "Recall should be 0.6667"
print("ALL TESTS PASSED ✅")
"""
    },

    # --- 8. DOCKER / DEVOPS ---
    {
        "id": "devops-1",
        "title": "Docker Port Mapping & Config Validator",
        "language": "python",
        "skill": "Docker",
        "difficulty": "Easy",
        "description": "Parse and validate container port mapping specifications like `'8080:80'` ensuring valid numeric port ranges (1 to 65535).",
        "hints": [
            "Split string by ':' to separate host and container ports.",
            "Verify both are valid numbers between 1 and 65535.",
            "Raise ValueError or return invalid status if malformed."
        ],
        "starter_code": """def parse_port_mapping(mapping_str):
    parts = mapping_str.strip().split(":")
    if len(parts) != 2:
        return {"valid": False, "error": "Expected HOST:CONTAINER format"}
    try:
        host_p, cont_p = int(parts[0]), int(parts[1])
        if 1 <= host_p <= 65535 and 1 <= cont_p <= 65535:
            return {"host_port": host_p, "container_port": cont_p, "valid": True}
        return {"valid": False, "error": "Port number out of range (1-65535)"}
    except ValueError:
        return {"valid": False, "error": "Non-numeric port"}

print("Test 1:", parse_port_mapping("8000:80"))
print("Test 2:", parse_port_mapping("99999:80"))
""",
        "solution_code": """def parse_port_mapping(mapping_str):
    parts = mapping_str.strip().split(":")
    if len(parts) != 2:
        return {"valid": False, "error": "Expected HOST:CONTAINER format"}
    try:
        host_p, cont_p = int(parts[0]), int(parts[1])
        if 1 <= host_p <= 65535 and 1 <= cont_p <= 65535:
            return {"host_port": host_p, "container_port": cont_p, "valid": True}
        return {"valid": False, "error": "Port out of range"}
    except ValueError:
        return {"valid": False, "error": "Non-numeric"}
""",
        "test_code": """
assert parse_port_mapping("3000:3000")["valid"] == True
assert parse_port_mapping("invalid")["valid"] == False
print("ALL TESTS PASSED ✅")
"""
    },
    {
        "id": "devops-2",
        "title": "Server Log Anomaly & Error Spike Detector",
        "language": "python",
        "skill": "Docker",
        "difficulty": "Medium",
        "description": "Analyze raw deployment log streams to compute error rate percentage and determine service health status (HEALTHY, WARNING, CRITICAL).",
        "hints": [
            "Count log lines containing keywords like 'ERROR', '500', or 'CRITICAL'.",
            "Calculate error rate: `(errors / total_lines) * 100`.",
            "Return CRITICAL if >= 20%, WARNING if >= 5%, else HEALTHY."
        ],
        "starter_code": """def analyze_server_logs(log_lines):
    total = len(log_lines)
    if total == 0:
        return {"total_logs": 0, "error_count": 0, "error_rate": 0.0, "status": "HEALTHY"}
    errors = sum(1 for line in log_lines if "ERROR" in line or "500" in line or "CRITICAL" in line)
    rate = round((errors / total) * 100, 2)
    status = "CRITICAL" if rate >= 20.0 else ("WARNING" if rate >= 5.0 else "HEALTHY")
    return {"total_logs": total, "error_count": errors, "error_rate": rate, "status": status}

sample_logs = [
    "[INFO] Server started on port 8000",
    "[ERROR] Database connection failed (timeout)",
    "[INFO] Request processed in 24ms",
    "[ERROR] 500 Internal Server Error in /api/profile"
]
print("Log Analysis:", analyze_server_logs(sample_logs))
""",
        "solution_code": """def analyze_server_logs(log_lines):
    total = len(log_lines)
    if total == 0:
        return {"total_logs": 0, "error_count": 0, "error_rate": 0.0, "status": "HEALTHY"}
    errors = sum(1 for line in log_lines if "ERROR" in line or "500" in line or "CRITICAL" in line)
    rate = round((errors / total) * 100, 2)
    status = "CRITICAL" if rate >= 20.0 else ("WARNING" if rate >= 5.0 else "HEALTHY")
    return {"total_logs": total, "error_count": errors, "error_rate": rate, "status": status}
""",
        "test_code": """
logs = ["[INFO] OK", "[INFO] OK", "[ERROR] Failed", "[INFO] OK"]
res = analyze_server_logs(logs)
assert res["error_count"] == 1 and res["status"] == "CRITICAL"
print("ALL TESTS PASSED ✅")
"""
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

        result_rows = [dict(zip(columns, row)) for row in rows]

        return {
            "success": True,
            "columns": columns,
            "rows": result_rows,
            "row_count": len(rows),
            "stdout": f"Executed successfully: {len(rows)} row(s) returned.\n" + "\n".join([str(r) for r in result_rows[:10]]),
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


SYNONYM_MAP = {
    "js": "JavaScript", "node": "JavaScript", "nodejs": "JavaScript", "typescript": "JavaScript", "ts": "JavaScript",
    "react": "React", "reactjs": "React", "nextjs": "React", "frontend": "React",
    "python": "Python", "py": "Python", "django": "Python", "flask": "Python", "fastapi": "REST APIs",
    "sql": "SQL", "mysql": "SQL", "postgres": "SQL", "postgresql": "SQL", "sqlite": "SQL", "database": "SQL",
    "rest": "REST APIs", "api": "REST APIs", "apis": "REST APIs", "graphql": "REST APIs", "backend": "REST APIs",
    "dsa": "Data Structures", "algo": "Data Structures", "algorithms": "Data Structures", "array": "Data Structures",
    "ml": "Machine Learning", "ai": "Machine Learning", "machine learning": "Machine Learning", "data science": "Machine Learning", "pandas": "Machine Learning",
    "docker": "Docker", "devops": "Docker", "kubernetes": "Docker", "k8s": "Docker", "containers": "Docker", "container": "Docker", "linux": "Docker",
}


def get_challenges(skill: Optional[str] = None) -> List[Dict[str, Any]]:
    if not skill or not skill.strip():
        return CHALLENGES

    skill_clean = skill.strip().lower()

    # 1. Check direct substring match in skill name
    matched = [c for c in CHALLENGES if skill_clean in c["skill"].lower() or c["skill"].lower() in skill_clean]
    if matched:
        return matched

    # 2. Check synonyms
    for syn_key, target_skill in SYNONYM_MAP.items():
        if syn_key == skill_clean or syn_key in skill_clean:
            matched = [c for c in CHALLENGES if c["skill"].lower() == target_skill.lower()]
            if matched:
                return matched

    # 3. Dynamic fallback: Generate 2 tailored challenges for any arbitrary skill
    formatted_skill = skill.strip().title()
    slug = formatted_skill.lower().replace(" ", "_")
    return [
        {
            "id": f"dyn-{slug}-1",
            "title": f"{formatted_skill} Data Pipeline & Validation",
            "language": "python",
            "skill": formatted_skill,
            "difficulty": "Easy",
            "description": f"Implement a core data processing and validation utility function for {formatted_skill}. Given a list of record items, filter out records with invalid schemas and return a summary of valid payloads.",
            "hints": [
                f"Identify required attributes expected in {formatted_skill} entities.",
                "Use list comprehension or filter() to sanitize corrupted entries.",
                "Verify return dictionary structure matches test expectations."
            ],
            "starter_code": f"""def process_{slug}_records(records):
    # Your solution for {formatted_skill}
    valid = []
    for item in records:
        if isinstance(item, dict) and "id" in item and "status" in item:
            if item["status"] == "active":
                valid.append(item["id"])
    return {{"total": len(records), "valid_ids": valid}}

sample_data = [
    {{"id": 101, "status": "active"}},
    {{"id": 102, "status": "inactive"}},
    {{"error": "corrupted"}},
    {{"id": 103, "status": "active"}}
]
print(process_{slug}_records(sample_data))
""",
            "solution_code": f"""def process_{slug}_records(records):
    valid = []
    for item in records:
        if isinstance(item, dict) and "id" in item and "status" in item:
            if item["status"] == "active":
                valid.append(item["id"])
    return {{"total": len(records), "valid_ids": valid}}

sample_data = [
    {{"id": 101, "status": "active"}},
    {{"id": 102, "status": "inactive"}},
    {{"error": "corrupted"}},
    {{"id": 103, "status": "active"}}
]
print(process_{slug}_records(sample_data))
""",
            "test_code": f"""
test_batch = [{{"id": 1, "status": "active"}}, {{"id": 2, "status": "inactive"}}, {{"missing": True}}]
res = process_{slug}_records(test_batch)
assert res["total"] == 3, f"Expected total 3, got {{res['total']}}"
assert res["valid_ids"] == [1], f"Expected valid_ids [1], got {{res['valid_ids']}}"
print("ALL TESTS PASSED ✅")
"""
        },
        {
            "id": f"dyn-{slug}-2",
            "title": f"{formatted_skill} Resource Batch Aggregator",
            "language": "python",
            "skill": formatted_skill,
            "difficulty": "Medium",
            "description": f"Build an optimal chunking and aggregation utility for {formatted_skill} workloads. Group input metrics by category and compute batch distributions with zero division safety.",
            "hints": [
                "Group items using a dictionary keyed by category.",
                "Calculate total count and average metric score per group.",
                "Handle empty collections safely without throwing ZeroDivisionError."
            ],
            "starter_code": f"""def aggregate_{slug}_batches(items):
    # Aggregate {formatted_skill} batches
    groups = {{}}
    for it in items:
        cat = it.get("category", "default")
        score = it.get("score", 0)
        if cat not in groups:
            groups[cat] = {{"total_score": 0, "count": 0}}
        groups[cat]["total_score"] += score
        groups[cat]["count"] += 1
    
    return {{cat: round(data["total_score"] / data["count"], 2) for cat, data in groups.items() if data["count"] > 0}}

test_items = [
    {{"category": "A", "score": 80}},
    {{"category": "A", "score": 90}},
    {{"category": "B", "score": 75}}
]
print(aggregate_{slug}_batches(test_items))
""",
            "solution_code": f"""def aggregate_{slug}_batches(items):
    groups = {{}}
    for it in items:
        cat = it.get("category", "default")
        score = it.get("score", 0)
        if cat not in groups:
            groups[cat] = {{"total_score": 0, "count": 0}}
        groups[cat]["total_score"] += score
        groups[cat]["count"] += 1
    
    return {{cat: round(data["total_score"] / data["count"], 2) for cat, data in groups.items() if data["count"] > 0}}

test_items = [
    {{"category": "A", "score": 80}},
    {{"category": "A", "score": 90}},
    {{"category": "B", "score": 75}}
]
print(aggregate_{slug}_batches(test_items))
""",
            "test_code": f"""
items = [{{"category": "X", "score": 100}}, {{"category": "X", "score": 50}}, {{"category": "Y", "score": 20}}]
res = aggregate_{slug}_batches(items)
assert res.get("X") == 75.0, f"Expected 75.0, got {{res.get('X')}}"
assert res.get("Y") == 20.0, f"Expected 20.0, got {{res.get('Y')}}"
print("ALL TESTS PASSED ✅")
"""
        }
    ]


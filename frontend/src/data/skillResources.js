/**
 * Curated metadata, sub-topics, and learning resources for skills in SkillGap AI.
 * Includes a fallback generator so any dynamically generated or unlisted skill
 * receives realistic subtopics, estimated hours, and curated learning links.
 */

export const SKILL_METADATA = {
  // Frontend
  'React': {
    description: 'Component-driven UI library for building responsive, stateful web interfaces.',
    hours: 24,
    weeks: '3-4 weeks',
    subtopics: ['Components, Props & JSX', 'Hooks (useState, useEffect, useMemo, useCallback)', 'State Management & Context API', 'React Router & Routing', 'Custom Hooks & Performance Tuning'],
    resources: [
      { type: 'docs', title: 'Official React Documentation', url: 'https://react.dev', platform: 'React Docs' },
      { type: 'course', title: 'Full React 18 Course 2024', url: 'https://www.freecodecamp.org/news/tag/react/', platform: 'freeCodeCamp' },
      { type: 'video', title: 'React in 100 Seconds', url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', platform: 'Fireship' },
    ],
  },
  'JavaScript': {
    description: 'Core scripting language for web functionality, asynchronous event loops, and modern ES6+ features.',
    hours: 20,
    weeks: '2-3 weeks',
    subtopics: ['ES6+ Syntax & Scope', 'Promises, Async/Await & Event Loop', 'DOM Manipulation & Events', 'Prototypes & Closures', 'Modular JavaScript (ESM)'],
    resources: [
      { type: 'docs', title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', platform: 'MDN Web Docs' },
      { type: 'course', title: 'JavaScript Algorithms and Data Structures', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', platform: 'freeCodeCamp' },
      { type: 'video', title: 'JavaScript: The Hard Parts', url: 'https://www.youtube.com/results?search_query=javascript+the+hard+parts', platform: 'Frontend Masters' },
    ],
  },
  'HTML/CSS': {
    description: 'Semantic markup and modern responsive stylesheets including Flexbox and CSS Grid.',
    hours: 14,
    weeks: '1-2 weeks',
    subtopics: ['Semantic HTML5 Elements', 'CSS Box Model & Typography', 'Flexbox & CSS Grid Mastery', 'Responsive Design & Media Queries', 'CSS Custom Properties (Variables)'],
    resources: [
      { type: 'docs', title: 'MDN Web Docs HTML & CSS', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', platform: 'MDN' },
      { type: 'course', title: 'Responsive Web Design Certification', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', platform: 'freeCodeCamp' },
      { type: 'video', title: 'CSS Grid & Flexbox Masterclass', url: 'https://www.youtube.com/results?search_query=css+grid+flexbox+masterclass', platform: 'YouTube' },
    ],
  },
  'TypeScript': {
    description: 'Strongly typed superset of JavaScript that enhances code quality and scalability.',
    hours: 18,
    weeks: '2-3 weeks',
    subtopics: ['Basic Types & Interfaces', 'Generics & Utility Types', 'Type Narrowing & Discriminated Unions', 'TypeScript with React', 'tsconfig & Project Architecture'],
    resources: [
      { type: 'docs', title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', platform: 'TypeScript Docs' },
      { type: 'course', title: 'Total TypeScript Essentials', url: 'https://www.totaltypescript.com/tutorials', platform: 'Total TypeScript' },
      { type: 'video', title: 'TypeScript - The Basics', url: 'https://www.youtube.com/watch?v=ahCwqrYpIuM', platform: 'Fireship' },
    ],
  },
  'State Management': {
    description: 'Patterns and libraries (Redux Toolkit, Zustand, Context) for predictable global state.',
    hours: 16,
    weeks: '2 weeks',
    subtopics: ['Global vs Local State', 'Zustand & Lightweight Stores', 'Redux Toolkit (RTK) & Slices', 'Server Cache (TanStack Query)', 'Immutability & State Normalization'],
    resources: [
      { type: 'docs', title: 'Zustand Documentation', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction', platform: 'Zustand' },
      { type: 'course', title: 'Redux Essentials Tutorial', url: 'https://redux.js.org/tutorials/essentials/part-1-overview-concepts', platform: 'Redux.js' },
      { type: 'video', title: 'React State Management in 2024', url: 'https://www.youtube.com/results?search_query=react+state+management+guide', platform: 'YouTube' },
    ],
  },
  // Backend & Databases
  'Python': {
    description: 'Versatile programming language for backend web services, data science, and automation.',
    hours: 22,
    weeks: '3 weeks',
    subtopics: ['Data Structures & Comprehensions', 'Object-Oriented Programming (OOP)', 'Generators & Decorators', 'Virtual Environments & pip', 'File I/O & Error Handling'],
    resources: [
      { type: 'docs', title: 'Python Official Documentation', url: 'https://docs.python.org/3/tutorial/', platform: 'Python.org' },
      { type: 'course', title: 'Scientific Computing with Python', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', platform: 'freeCodeCamp' },
      { type: 'video', title: 'Python Full Course for Beginners', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', platform: 'Programming with Mosh' },
    ],
  },
  'SQL': {
    description: 'Relational database query language for querying, aggregating, and joining structured tables.',
    hours: 16,
    weeks: '2 weeks',
    subtopics: ['SELECT, WHERE, GROUP BY & HAVING', 'Complex Joins (INNER, LEFT, FULL)', 'Subqueries & CTEs (WITH queries)', 'Window Functions (ROW_NUMBER, RANK)', 'Indexes & Query Optimization'],
    resources: [
      { type: 'docs', title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', platform: 'Postgres Tutorial' },
      { type: 'course', title: 'SQL for Data Analysis', url: 'https://mode.com/sql-tutorial/', platform: 'Mode Analytics' },
      { type: 'video', title: 'SQL Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeRR3h4', platform: 'freeCodeCamp' },
    ],
  },
  'REST APIs': {
    description: 'Architectural principles for robust HTTP services, status codes, and serialization.',
    hours: 14,
    weeks: '1-2 weeks',
    subtopics: ['HTTP Verbs, Headers & Status Codes', 'Resource-oriented URL Design', 'Request Validation & Error Handling', 'Pagination, Filtering & Sorting', 'API Versioning & Documentation (OpenAPI/Swagger)'],
    resources: [
      { type: 'docs', title: 'RESTful API Design Best Practices', url: 'https://restfulapi.net/', platform: 'REST API Tutorial' },
      { type: 'course', title: 'Build a REST API from Scratch', url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps', platform: 'MDN' },
      { type: 'video', title: 'REST APIs Explained in 10 Minutes', url: 'https://www.youtube.com/results?search_query=rest+api+explained', platform: 'YouTube' },
    ],
  },
  'Django/Flask/FastAPI': {
    description: 'Modern Python web frameworks for building high-performance asynchronous and RESTful APIs.',
    hours: 20,
    weeks: '2-3 weeks',
    subtopics: ['FastAPI Routing & Path Parameters', 'Pydantic Schemas & Data Validation', 'Dependency Injection & Middleware', 'Asynchronous Endpoints (async/await)', 'Database ORM (SQLAlchemy / Tortoise)'],
    resources: [
      { type: 'docs', title: 'FastAPI Official Documentation', url: 'https://fastapi.tiangolo.com/tutorial/', platform: 'FastAPI' },
      { type: 'course', title: 'FastAPI Microservice Development', url: 'https://testdriven.io/courses/tdd-fastapi/', platform: 'TestDriven.io' },
      { type: 'video', title: 'FastAPI in 100 Seconds', url: 'https://www.youtube.com/watch?v=gQTRsZpqzAw', platform: 'Fireship' },
    ],
  },
  'Node.js/Express': {
    description: 'Asynchronous event-driven JavaScript runtime and minimalist web framework for server-side apps.',
    hours: 20,
    weeks: '2-3 weeks',
    subtopics: ['Node Event Loop & Modules', 'Express Routing & Middleware', 'Authentication with JWT & Cookies', 'Database Integration (Mongoose/Prisma)', 'Error Handling & Security Best Practices'],
    resources: [
      { type: 'docs', title: 'Node.js Documentation', url: 'https://nodejs.org/en/docs', platform: 'Node.js' },
      { type: 'course', title: 'Back End Development and APIs', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', platform: 'freeCodeCamp' },
      { type: 'video', title: 'Node.js and Express Course', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', platform: 'freeCodeCamp' },
    ],
  },
  'Docker': {
    description: 'Containerization platform to package applications and dependencies into isolated environments.',
    hours: 15,
    weeks: '1-2 weeks',
    subtopics: ['Images, Containers & Registries', 'Writing Multi-stage Dockerfiles', 'Docker Compose for Multi-service Stacks', 'Volumes & Bind Mounts', 'Container Networking & Security'],
    resources: [
      { type: 'docs', title: 'Docker Getting Started Guide', url: 'https://docs.docker.com/get-started/', platform: 'Docker Docs' },
      { type: 'course', title: 'Docker for Developers', url: 'https://docker-curriculum.com/', platform: 'Docker Curriculum' },
      { type: 'video', title: 'Docker in 100 Seconds', url: 'https://www.youtube.com/watch?v=Gjnup-PuquQ', platform: 'Fireship' },
    ],
  },
  'Git': {
    description: 'Distributed version control system for tracking source code changes and collaborating.',
    hours: 10,
    weeks: '1 week',
    subtopics: ['Commits, Staging & Diffs', 'Branching & Merging Strategies', 'Resolving Merge Conflicts', 'Interactive Rebase & Cherry-pick', 'GitHub Pull Requests & Code Reviews'],
    resources: [
      { type: 'docs', title: 'Pro Git Book (Free)', url: 'https://git-scm.com/book/en/v2', platform: 'Git SCM' },
      { type: 'course', title: 'Learn Git Branching (Interactive)', url: 'https://learngitbranching.js.org/', platform: 'Interactive Git' },
      { type: 'video', title: 'Git & GitHub Crash Course', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', platform: 'freeCodeCamp' },
    ],
  },
  'CI/CD': {
    description: 'Continuous Integration & Deployment pipelines for automated testing, linting, and release.',
    hours: 14,
    weeks: '1-2 weeks',
    subtopics: ['GitHub Actions Workflows', 'Automated Test Runners & Linting', 'Secret Management & Environments', 'Docker Image Build & Push Pipelines', 'Cloud Deployment Automations'],
    resources: [
      { type: 'docs', title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', platform: 'GitHub Docs' },
      { type: 'course', title: 'CI/CD Pipeline Fundamentals', url: 'https://roadmap.sh/devops', platform: 'Roadmap.sh' },
      { type: 'video', title: 'GitHub Actions Tutorial', url: 'https://www.youtube.com/results?search_query=github+actions+tutorial', platform: 'YouTube' },
    ],
  },
  'Machine Learning': {
    description: 'Supervised and unsupervised learning algorithms, validation techniques, and evaluation metrics.',
    hours: 30,
    weeks: '4 weeks',
    subtopics: ['Regression & Classification Models', 'Cross-Validation & Hyperparameter Tuning', 'Overfitting, Bias-Variance Tradeoff', 'Ensemble Methods (Random Forest, XGBoost)', 'Clustering & Dimensionality Reduction'],
    resources: [
      { type: 'docs', title: 'Scikit-learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', platform: 'Scikit-learn' },
      { type: 'course', title: 'Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', platform: 'Coursera / DeepLearning.AI' },
      { type: 'video', title: 'StatQuest Machine Learning Course', url: 'https://www.youtube.com/c/joshstarmer', platform: 'StatQuest' },
    ],
  },
  'Deep Learning': {
    description: 'Neural networks, activation functions, backpropagation, and deep learning architectures.',
    hours: 32,
    weeks: '4-5 weeks',
    subtopics: ['Perceptrons & Multilayer Networks', 'Loss Functions & Optimizers (Adam, SGD)', 'Convolutional Neural Networks (CNNs)', 'Recurrent & Transformer Basics', 'PyTorch / TensorFlow Frameworks'],
    resources: [
      { type: 'docs', title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', platform: 'PyTorch' },
      { type: 'course', title: 'Deep Learning Specialization', url: 'https://www.deeplearning.ai/courses/deep-learning-specialization/', platform: 'DeepLearning.AI' },
      { type: 'video', title: 'Neural Networks Explained by 3Blue1Brown', url: 'https://www.3blue1brown.com/topics/neural-networks', platform: '3Blue1Brown' },
    ],
  },
  'Pandas': {
    description: 'Data manipulation library for series, dataframes, filtering, grouping, and time series.',
    hours: 15,
    weeks: '2 weeks',
    subtopics: ['Series & DataFrame Fundamentals', 'Indexing, Filtering & Boolean Slicing', 'GroupBy, Aggregations & Pivot Tables', 'Handling Missing Values & Nulls', 'Merge, Concat & Reshaping Data'],
    resources: [
      { type: 'docs', title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/user_guide/index.html', platform: 'Pandas Docs' },
      { type: 'course', title: 'Data Analysis with Python', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', platform: 'freeCodeCamp' },
      { type: 'video', title: 'Pandas in 100 Seconds', url: 'https://www.youtube.com/watch?v=dcqPhpY7tWk', platform: 'Fireship' },
    ],
  },
  'NumPy': {
    description: 'High-performance multidimensional arrays and vector mathematical operations in Python.',
    hours: 12,
    weeks: '1-2 weeks',
    subtopics: ['ndarray Creation & Properties', 'Broadcasting & Vectorized Operations', 'Array Slicing & Reshaping', 'Linear Algebra & Matrix Operations', 'Random Sampling & Seeds'],
    resources: [
      { type: 'docs', title: 'NumPy Quickstart', url: 'https://numpy.org/doc/stable/user/quickstart.html', platform: 'NumPy.org' },
      { type: 'course', title: 'NumPy Tutorial for Beginners', url: 'https://cs231n.github.io/python-numpy-tutorial/', platform: 'Stanford CS231n' },
      { type: 'video', title: 'Python NumPy Tutorial', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI', platform: 'freeCodeCamp' },
    ],
  },
  'Statistics': {
    description: 'Descriptive and inferential statistics, probability distributions, hypothesis testing, and confidence intervals.',
    hours: 18,
    weeks: '2-3 weeks',
    subtopics: ['Mean, Median, Variance & Standard Deviation', 'Normal, Binomial & Poisson Distributions', 'Central Limit Theorem & Sampling', 'Hypothesis Testing (p-values, t-test)', 'Correlation vs Causation'],
    resources: [
      { type: 'docs', title: 'Khan Academy Statistics & Probability', url: 'https://www.khanacademy.org/math/statistics-probability', platform: 'Khan Academy' },
      { type: 'course', title: 'Introduction to Probability & Statistics', url: 'https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2014/', platform: 'MIT OpenCourseWare' },
      { type: 'video', title: 'StatQuest Statistics Fundamentals', url: 'https://www.youtube.com/c/joshstarmer', platform: 'StatQuest' },
    ],
  },
  'ML Deployment': {
    description: 'Packaging ML models into scalable prediction microservices with Docker, FastAPI, and cloud endpoints.',
    hours: 22,
    weeks: '3 weeks',
    subtopics: ['Model Serialization (joblib / ONNX)', 'Creating Prediction REST APIs with FastAPI', 'Containerizing Model Endpoints with Docker', 'Batch vs Real-time Inference', 'Latency Benchmarking & Monitoring'],
    resources: [
      { type: 'docs', title: 'FastAPI for Machine Learning', url: 'https://fastapi.tiangolo.com/', platform: 'FastAPI' },
      { type: 'course', title: 'Deployment of Machine Learning Models', url: 'https://www.udemy.com/course/deployment-of-machine-learning-models/', platform: 'Udemy' },
      { type: 'video', title: 'Deploy ML Models to Production', url: 'https://www.youtube.com/results?search_query=deploy+ml+models+production', platform: 'YouTube' },
    ],
  },
  'Authentication/Security': {
    description: 'User identity, JWT tokens, OAuth2, password hashing, and OWASP security practices.',
    hours: 16,
    weeks: '2 weeks',
    subtopics: ['Password Hashing with bcrypt/Argon2', 'JWT Token Lifecycle (Access & Refresh)', 'OAuth2 & Social Logins', 'CSRF, XSS & CORS Protections', 'Role-Based Access Control (RBAC)'],
    resources: [
      { type: 'docs', title: 'OWASP Top 10 Security Guide', url: 'https://owasp.org/www-project-top-ten/', platform: 'OWASP' },
      { type: 'course', title: 'Web Security Academy (Free)', url: 'https://portswigger.net/web-security', platform: 'PortSwigger' },
      { type: 'video', title: 'JWT Authentication Explained', url: 'https://www.youtube.com/results?search_query=jwt+authentication+guide', platform: 'YouTube' },
    ],
  },
}

/**
 * Returns complete skill details with safe defaults.
 */
export function getSkillDetails(skillName, stage = 'Foundational', weight = 0.5) {
  if (SKILL_METADATA[skillName]) {
    return {
      ...SKILL_METADATA[skillName],
      skill: skillName,
      stage,
      weight,
    }
  }

  // Safe fallback calculation for any other skill
  const baseHours = stage === 'Foundational' ? 14 : stage === 'Intermediate' ? 20 : 26
  const adjustedHours = Math.round(baseHours * (0.8 + (weight || 0.5) * 0.4))
  const weeks = adjustedHours <= 15 ? '1-2 weeks' : adjustedHours <= 22 ? '2-3 weeks' : '3-4 weeks'

  const difficultyTitle = stage === 'Foundational' ? 'Core Fundamentals' : stage === 'Intermediate' ? 'Practical Implementation' : 'Advanced Architecture'

  return {
    skill: skillName,
    description: `Master ${skillName} and its real-world implementation for modern development workflows.`,
    hours: adjustedHours,
    weeks,
    subtopics: [
      `${skillName} ${difficultyTitle}`,
      `Practical hands-on exercises & syntax`,
      `Design patterns and industry best practices`,
      `Integration with supporting ecosystem tools`,
      `Production debugging and performance optimization`,
    ],
    resources: [
      {
        type: 'docs',
        title: `${skillName} Official Documentation`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}`,
        platform: 'Official Docs',
      },
      {
        type: 'course',
        title: `${skillName} Comprehensive Guide`,
        url: `https://roadmap.sh`,
        platform: 'Roadmap.sh / freeCodeCamp',
      },
      {
        type: 'video',
        title: `${skillName} Crash Course & Tutorial`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' crash course')}`,
        platform: 'Video Masterclass',
      },
    ],
    stage,
    weight,
  }
}

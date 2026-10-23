/**
 * Realistic sample profiles and roadmaps used as fallbacks and for interactive demo preview.
 * Exact same schema as backend response to ensure full compatibility.
 */

export const SAMPLE_PROFILES = {
  'Full Stack Developer': {
    profile: {
      student_id: 'sample_student_01',
      target_role: 'Full Stack Developer',
      current_skills: ['HTML/CSS', 'JavaScript', 'Git'],
      projects: ['Portfolio Website', 'React Dashboard'],
      experience_level: 'Beginner',
    },
    skillGapData: {
      student_id: 'sample_student_01',
      target_role: 'Full Stack Developer',
      match_percentage: 58.5,
      present_skills: ['HTML/CSS', 'JavaScript', 'Git'],
      missing_skills: [
        { skill: 'React', weight: 0.95, stage: 'Intermediate', reason: 'Industry standard library for modern frontends — needed in 95% of job listings.' },
        { skill: 'Node.js/Express', weight: 0.90, stage: 'Intermediate', reason: 'Core backend JavaScript runtime for scalable web APIs and microservices.' },
        { skill: 'SQL', weight: 0.88, stage: 'Foundational', reason: 'Essential for data modeling, transactional queries, and database persistence.' },
        { skill: 'REST APIs', weight: 0.85, stage: 'Foundational', reason: 'Fundamental communication protocol between client and server layers.' },
        { skill: 'TypeScript', weight: 0.82, stage: 'Intermediate', reason: 'Provides type safety, self-documenting code, and reduces runtime errors.' },
        { skill: 'Authentication/Security', weight: 0.80, stage: 'Intermediate', reason: 'Critical for secure login, JWT sessions, and protecting customer data.' },
        { skill: 'Docker', weight: 0.78, stage: 'Applied', reason: 'Standardizes environments and simplifies containerized cloud deployments.' },
        { skill: 'CI/CD', weight: 0.72, stage: 'Applied', reason: 'Automates testing, linting, and continuous delivery to staging and production.' },
      ],
    },
    roadmap: {
      Foundational: [
        { skill: 'SQL', weight: 0.88, reason: 'Essential for relational data modeling and database queries.' },
        { skill: 'REST APIs', weight: 0.85, reason: 'Fundamental communication protocol between client and server layers.' },
      ],
      Intermediate: [
        { skill: 'React', weight: 0.95, reason: 'Industry standard library for component-based reactive web UIs.' },
        { skill: 'Node.js/Express', weight: 0.90, reason: 'Core backend JavaScript runtime for building high-performance APIs.' },
        { skill: 'TypeScript', weight: 0.82, reason: 'Type safety and modern tooling for large-scale codebases.' },
        { skill: 'Authentication/Security', weight: 0.80, reason: 'Secure JWT authentication, password hashing, and OWASP defenses.' },
      ],
      Applied: [
        { skill: 'Docker', weight: 0.78, reason: 'Containerization for consistent developer and cloud environments.' },
        { skill: 'CI/CD', weight: 0.72, reason: 'Automated GitHub Actions pipelines for tests, builds, and releases.' },
      ],
    },
    defaultCompleted: ['SQL'],
  },
  'Data Scientist': {
    profile: {
      student_id: 'sample_student_02',
      target_role: 'Data Scientist',
      current_skills: ['Python', 'SQL', 'Data Visualization'],
      projects: ['EDA Project', 'Web Scraper'],
      experience_level: 'Intermediate',
    },
    skillGapData: {
      student_id: 'sample_student_02',
      target_role: 'Data Scientist',
      match_percentage: 64.0,
      present_skills: ['Python', 'SQL', 'Data Visualization'],
      missing_skills: [
        { skill: 'Statistics', weight: 0.90, stage: 'Foundational', reason: 'Theoretical backbone for hypothesis testing, distributions, and inferential models.' },
        { skill: 'Pandas', weight: 0.88, stage: 'Intermediate', reason: 'Essential library for tabular data manipulation, cleaning, and aggregation.' },
        { skill: 'Machine Learning', weight: 0.92, stage: 'Intermediate', reason: 'Core predictive algorithms for supervised and unsupervised analytics.' },
        { skill: 'Scikit-learn', weight: 0.85, stage: 'Intermediate', reason: 'Standard toolkit for building, evaluating, and tuning ML pipelines.' },
        { skill: 'Feature Engineering', weight: 0.78, stage: 'Intermediate', reason: 'Transforms raw attributes into predictive signals that boost model accuracy.' },
        { skill: 'Deep Learning', weight: 0.72, stage: 'Applied', reason: 'Neural networks for complex unstructured data, NLP, and computer vision.' },
        { skill: 'ML Deployment', weight: 0.68, stage: 'Applied', reason: 'Packages trained models into REST microservices for production inference.' },
      ],
    },
    roadmap: {
      Foundational: [
        { skill: 'Statistics', weight: 0.90, reason: 'Foundational mathematics for distributions, p-values, and hypothesis testing.' },
      ],
      Intermediate: [
        { skill: 'Machine Learning', weight: 0.92, reason: 'Core predictive algorithms, regression, classification, and clustering.' },
        { skill: 'Pandas', weight: 0.88, reason: 'Tabular data manipulation and feature wrangling.' },
        { skill: 'Scikit-learn', weight: 0.85, reason: 'Standard Python toolkit for cross-validation and ML pipelines.' },
        { skill: 'Feature Engineering', weight: 0.78, reason: 'Scaling, encoding, and engineering high-signal features.' },
      ],
      Applied: [
        { skill: 'Deep Learning', weight: 0.72, reason: 'Neural networks, PyTorch fundamentals, and modern architectures.' },
        { skill: 'ML Deployment', weight: 0.68, reason: 'FastAPI microservices and Docker containers for production models.' },
      ],
    },
    defaultCompleted: ['Statistics'],
  },
}

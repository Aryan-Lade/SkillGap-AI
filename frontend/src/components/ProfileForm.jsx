import { useState, useRef, useEffect } from 'react'
import { getAllRoles } from '../api/client'
import ResumeUploadSection from './ResumeUploadSection'

const DEFAULT_ROLE_OPTIONS = [
  'AI Engineer',
  'Backend Developer',
  'Blockchain Developer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'Data Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Embedded Systems Engineer',
  'Frontend Developer',
  'Full Stack Developer',
  'Game Developer',
  'Java Developer',
  'ML Engineer',
  'Mobile App Developer',
  'QA / Automation Engineer',
]
const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced']

const ALL_SKILLS_BY_ROLE = {
  'Data Scientist': ['Python', 'Statistics', 'SQL', 'Data Visualization', 'Pandas', 'NumPy', 'Machine Learning', 'Feature Engineering', 'Scikit-learn', 'Deep Learning', 'NLP', 'ML Deployment', 'A/B Testing'],
  'Backend Developer': ['Python', 'SQL', 'REST APIs', 'Git', 'Linux/Bash', 'Django/Flask/FastAPI', 'Database Design', 'Authentication/Security', 'Unit Testing', 'Message Queues', 'Docker', 'CI/CD', 'Microservices'],
  'ML Engineer': ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Pandas', 'NumPy', 'Deep Learning', 'Scikit-learn', 'Model Optimization', 'ML Deployment', 'MLOps', 'Docker', 'Feature Engineering'],
  'Frontend Developer': ['HTML/CSS', 'JavaScript', 'Responsive Design', 'Git', 'React', 'State Management', 'REST APIs', 'TypeScript', 'CSS Frameworks', 'Testing (Jest/RTL)', 'Performance Optimization', 'Webpack/Vite', 'Accessibility (a11y)'],
  'AI Engineer': ['Python', 'Deep Learning', 'Linear Algebra', 'NLP', 'PyTorch', 'Hugging Face', 'Prompt Engineering', 'Vector Databases', 'LangChain/LlamaIndex', 'RAG Architectures', 'LLM Fine-Tuning', 'Model Quantization', 'Autonomous Agents'],
  'DevOps Engineer': ['Linux/Bash', 'Git', 'Networking', 'Python', 'Docker', 'CI/CD', 'Terraform', 'AWS/Cloud', 'Nginx', 'Kubernetes', 'Prometheus/Grafana', 'Infrastructure as Code', 'Site Reliability (SRE)'],
  'Java Developer': ['Java', 'Object-Oriented Programming', 'Data Structures & Algorithms', 'SQL', 'Spring Boot', 'Hibernate/JPA', 'REST APIs', 'Maven/Gradle', 'Unit Testing (JUnit)', 'Microservices', 'Docker', 'Spring Security', 'Kafka/Message Queues'],
  'Cloud Engineer': ['Linux/Bash', 'Networking', 'Python', 'Git', 'AWS/Cloud', 'Terraform', 'Docker', 'Cloud Security/IAM', 'Serverless (Lambda)', 'Kubernetes', 'Multi-Cloud Architecture', 'Disaster Recovery', 'CI/CD'],
  'Data Engineer': ['SQL', 'Python', 'Database Design', 'Linux/Bash', 'Pandas', 'Apache Spark', 'Data Warehousing', 'Docker', 'REST APIs', 'Apache Kafka', 'Apache Airflow', 'ETL Pipelines', 'Cloud Data Lakes'],
  'Cybersecurity Analyst': ['Networking', 'Linux/Bash', 'Operating Systems', 'Python', 'Network Security', 'Wireshark', 'Vulnerability Assessment', 'Cryptography', 'Authentication/Security', 'SIEM Tools', 'Ethical Hacking', 'Incident Response', 'Threat Modeling'],
  'Full Stack Developer': ['HTML/CSS', 'JavaScript', 'Git', 'SQL', 'React', 'Node.js/Express', 'REST APIs', 'TypeScript', 'Authentication/Security', 'State Management', 'Docker', 'CI/CD', 'Microservices'],
  'Mobile App Developer': ['JavaScript', 'Dart', 'Object-Oriented Programming', 'Git', 'Flutter/React Native', 'Mobile UI/UX', 'REST APIs', 'State Management', 'Local Storage (SQLite)', 'Firebase', 'App Store Deployment', 'Push Notifications', 'Mobile Performance'],
  'QA / Automation Engineer': ['Manual Testing', 'Test Case Design', 'Python', 'Git', 'Selenium', 'API Testing', 'Cypress/Playwright', 'Unit Testing', 'SQL', 'CI/CD', 'Performance Testing', 'Test Automation Frameworks', 'Bug Tracking (Jira)'],
  'Blockchain Developer': ['Cryptography', 'JavaScript', 'Data Structures & Algorithms', 'Git', 'Solidity', 'Smart Contracts', 'Web3.js/Ethers.js', 'Hardhat/Foundry', 'Unit Testing', 'DeFi Protocols', 'Security Auditing', 'Gas Optimization', 'Decentralized Storage (IPFS)'],
  'Game Developer': ['C++', 'C#', '3D Mathematics', 'Object-Oriented Programming', 'Git', 'Unity/Unreal Engine', 'Physics Engines', 'Game Loop Architecture', '3D Modeling Basics', 'Shader Programming', 'Multiplayer Networking', 'Game AI', 'Performance Optimization'],
  'Embedded Systems Engineer': ['C', 'C++', 'Computer Architecture', 'Digital Electronics', 'Git', 'Microcontrollers (ARM/ESP32)', 'Protocols (I2C/SPI/UART)', 'RTOS (FreeRTOS)', 'Linux/Bash', 'Device Drivers', 'Embedded Linux', 'Low-Power Optimization', 'Hardware Debugging'],
}

const ALL_PROJECTS = [
  'EDA Project', 'Web Scraper', 'ML Classifier', 'Neural Network', 'REST API',
  'E-commerce Site', 'Portfolio Website', 'Data Dashboard', 'Chatbot', 'Image Classifier',
  'Recommendation System', 'Mobile App Backend', 'Docker Deployment', 'Model Deployment API',
  'React Dashboard', 'Database Schema Design', 'A/B Test Analysis', 'NLP Sentiment Analysis',
  'Feature Engineering Pipeline', 'TypeScript App', 'RAG Search Engine', 'LLM Agent Assistant',
  'Kubernetes CI/CD Pipeline', 'Terraform Cloud Infra', 'Spring Boot Microservices',
  'AWS Serverless API', 'Big Data ETL Pipeline', 'Kafka Real-Time Stream',
  'Penetration Testing Lab', 'SIEM Incident Monitor', 'Full Stack MERN App',
  'Flutter Mobile App', 'Test Automation Suite', 'Web3 DeFi DApp',
  'Unity 3D Action Game', 'Embedded IoT Sensor Node',
]

function TagInput({ value, onChange, suggestions, placeholder, color }) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef(null)

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  )

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const addTag = (tag) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setInput('')
    setShowSuggestions(false)
  }

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag))

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addTag(input.trim())
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const tagStyle = color === 'purple'
    ? { background: 'rgba(183,148,244,0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(183,148,244,0.25)' }
    : {}

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <div className="tag-input-wrapper" onClick={() => document.getElementById(`tif-${placeholder}`)?.focus()}>
        {value.map((tag) => (
          <span key={tag} className="tag" style={color === 'purple' ? tagStyle : {}}>
            {tag}
            <button className="tag-remove" onClick={() => removeTag(tag)} type="button">×</button>
          </span>
        ))}
        <input
          id={`tif-${placeholder}`}
          className="tag-input-field"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="suggestions-dropdown">
          {filtered.slice(0, 8).map((s) => (
            <div key={s} className="suggestion-item" onMouseDown={() => addTag(s)}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfileForm({ onSubmit, loading }) {
  const [roleOptions, setRoleOptions] = useState(DEFAULT_ROLE_OPTIONS)
  const [skillsByRole, setSkillsByRole] = useState(ALL_SKILLS_BY_ROLE)
  const [currentSkills, setCurrentSkills] = useState([])
  const [targetRole, setTargetRole] = useState('')
  const [projects, setProjects] = useState([])
  const [experienceLevel, setExperienceLevel] = useState('')
  const [studentId, setStudentId] = useState(() => `student_${Math.random().toString(36).slice(2, 8)}`)

  useEffect(() => {
    getAllRoles()
      .then((res) => {
        if (res?.data?.roles?.length > 0) {
          const roles = res.data.roles
          setRoleOptions(roles.map((r) => r.role).sort())
          const mappedSkills = {}
          roles.forEach((r) => {
            mappedSkills[r.role] = r.skills.map((s) => s.name)
          })
          setSkillsByRole((prev) => ({ ...prev, ...mappedSkills }))
        }
      })
      .catch((err) => {
        console.warn('Could not fetch dynamic roles from API, using full fallback list', err)
      })
  }, [])

  const skillSuggestions = targetRole ? skillsByRole[targetRole] || [] : Object.values(skillsByRole).flat()

  const handleRoleChange = (e) => {
    const newRole = e.target.value
    setTargetRole(newRole)
    setCurrentSkills([])
  }

  const handleApplyResumeProfile = ({ targetRole: r, experienceLevel: e, skills: s }) => {
    if (r) setTargetRole(r)
    if (e) setExperienceLevel(e)
    if (s && s.length > 0) setCurrentSkills(s)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!targetRole || !experienceLevel || currentSkills.length === 0) return
    onSubmit({ student_id: studentId, current_skills: currentSkills, target_role: targetRole, projects, experience_level: experienceLevel })
  }

  const canSubmit = targetRole && experienceLevel && currentSkills.length > 0 && !loading

  return (
    <div className="glass-card animate-fadeIn" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="section-title">
        <span className="icon">🎯</span>
        Build Your Profile
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Tell us where you are and where you want to go — we'll map the gap.
      </p>

      <ResumeUploadSection onApplyProfile={handleApplyResumeProfile} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Target Role</label>
          <select
            className="form-select"
            value={targetRole}
            onChange={handleRoleChange}
            required
          >
            <option value="">Select a role...</option>
            {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Experience Level</label>
          <select
            className="form-select"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            required
          >
            <option value="">Select level...</option>
            {EXPERIENCE_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Current Skills</label>
          <TagInput
            value={currentSkills}
            onChange={setCurrentSkills}
            suggestions={skillSuggestions}
            placeholder="Type a skill and press Enter..."
            color="blue"
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {currentSkills.length} skill{currentSkills.length !== 1 ? 's' : ''} added
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Projects (optional)</label>
          <TagInput
            value={projects}
            onChange={setProjects}
            suggestions={ALL_PROJECTS}
            placeholder="Type a project name..."
            color="purple"
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Projects imply additional skills for a more accurate gap analysis
          </span>
        </div>

        {(!targetRole || !experienceLevel || currentSkills.length === 0) && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ⚡ Select a role, experience level, and add at least one skill to continue
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-lg" disabled={!canSubmit}>
          {loading ? (
            <>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Analyzing...
            </>
          ) : (
            <>✨ Analyze My Skill Gap</>
          )}
        </button>
      </form>
    </div>
  )
}

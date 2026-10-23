// Utility to record and retrieve user activity history across SkillGap AI

const HISTORY_STORAGE_KEY_PREFIX = 'skillgap_history_'

export function getUserHistory(userId = 'guest') {
  try {
    const raw = localStorage.getItem(`${HISTORY_STORAGE_KEY_PREFIX}${userId}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error('Error reading user history:', err)
  }

  // Default seed history for demonstration so user immediately sees past history
  const defaultHistory = [
    {
      id: 'hist-1',
      type: 'skillgap',
      title: 'Full Stack Developer Skill Gap Analysis',
      subtitle: 'Target Role: Full Stack Developer',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      score: '78% Match',
      details: 'Identified 4 missing skills: Docker, Microservices, CI/CD, Redis',
      link: '/dashboard',
    },
    {
      id: 'hist-2',
      type: 'jd',
      title: 'Senior Frontend Engineer Job Match',
      subtitle: 'Analyzed custom posting for React & TypeScript',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      score: '84% Fit Score',
      details: 'Matched 11 skills. Missing: Webpack performance profiling, GraphQL',
      link: '/job-analyzer',
    },
    {
      id: 'hist-3',
      type: 'quiz',
      title: 'React Hooks & State Assessment',
      subtitle: 'Skill: React · Level: Intermediate',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      score: 'Score: 4/5 (Passed)',
      details: 'Skill verified: React. Credited towards Full Stack roadmap.',
      link: '/dashboard',
    },
    {
      id: 'hist-4',
      type: 'planner',
      title: '8-Week Accelerated Study Plan',
      subtitle: 'Generated for Full Stack Developer · 15 hrs/week',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      score: 'Active Schedule',
      details: 'Milestone 1: Backend architecture & APIs (Week 1-2)',
      link: '/planner',
    },
  ]

  saveUserHistory(userId, defaultHistory)
  return defaultHistory
}

export function saveUserHistory(userId = 'guest', history) {
  try {
    localStorage.setItem(
      `${HISTORY_STORAGE_KEY_PREFIX}${userId}`,
      JSON.stringify(history)
    )
  } catch (err) {
    console.error('Error saving user history:', err)
  }
}

export function recordActivity(userId = 'guest', { type, title, subtitle, score, details, link }) {
  try {
    const existing = getUserHistory(userId)
    const newEntry = {
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type, // 'skillgap' | 'resume' | 'quiz' | 'jd' | 'planner' | 'sandbox'
      title,
      subtitle: subtitle || '',
      score: score || '',
      details: details || '',
      link: link || '/dashboard',
      timestamp: new Date().toISOString(),
    }
    const updated = [newEntry, ...existing].slice(0, 50) // keep latest 50
    saveUserHistory(userId, updated)
    // Dispatch custom event for real-time reactivity
    window.dispatchEvent(new CustomEvent('skillgap_history_updated', { detail: updated }))
    return updated
  } catch (err) {
    console.error('Error recording activity:', err)
    return []
  }
}

export function clearUserHistory(userId = 'guest') {
  try {
    localStorage.removeItem(`${HISTORY_STORAGE_KEY_PREFIX}${userId}`)
    window.dispatchEvent(new CustomEvent('skillgap_history_updated', { detail: [] }))
  } catch (err) {
    console.error('Error clearing history:', err)
  }
}

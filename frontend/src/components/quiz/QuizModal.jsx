import { useState, useEffect, useRef } from 'react'
import {
  X,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Check,
  HelpCircle,
  Award,
} from 'lucide-react'
import { getSkillQuiz, submitSkillQuiz } from '../../api/client'
import { recordActivity } from '../../utils/history'
import { useAuth } from '../../context/AuthContext'

export default function QuizModal({
  isOpen,
  skill,
  role = 'Full Stack Developer',
  onClose,
  onVerified,
}) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizData, setQuizData] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [qid]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(180) // 3 mins default
  const [timerActive, setTimerActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [showReview, setShowReview] = useState(false)

  const timerRef = useRef(null)

  // Reset and fetch quiz on open
  useEffect(() => {
    if (!isOpen || !skill) return

    let isMounted = true
    setLoading(true)
    setError(null)
    setResult(null)
    setAnswers({})
    setCurrentIndex(0)
    setShowReview(false)
    setTimerActive(false)

    getSkillQuiz(skill, role)
      .then((res) => {
        if (!isMounted) return
        setQuizData(res.data)
        setTimeLeft(res.data.time_limit_seconds || 180)
        setLoading(false)
        setTimerActive(true)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Quiz fetch error:', err)
        setError('Failed to generate quiz. Please check your connection or try again.')
        setLoading(false)
      })

    return () => {
      isMounted = false
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isOpen, skill, role])

  // Timer countdown
  useEffect(() => {
    if (!timerActive || result || loading) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerActive, result, loading, answers, quizData])

  // Auto-submit when timer expires
  const handleAutoSubmit = () => {
    if (!quizData || submitting || result) return
    handleSubmitQuiz(answers)
  }

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionIndex,
    }))
  }

  const handleSubmitQuiz = async (currentAnswers = answers) => {
    if (!quizData || submitting) return
    setSubmitting(true)
    setTimerActive(false)
    if (timerRef.current) clearInterval(timerRef.current)

    try {
      const res = await submitSkillQuiz({
        quiz_id: quizData.quiz_id,
        skill: quizData.skill,
        answers: currentAnswers,
      })
      setResult(res.data)

      // Record to User History
      recordActivity(user?.id || 'guest', {
        type: 'quiz',
        title: `${quizData.skill} Assessment`,
        subtitle: `Role: ${role} · Skill: ${quizData.skill}`,
        score: `Score: ${res.data.score}/${res.data.total} (${res.data.score_percentage}%)`,
        details: res.data.passed
          ? `Verified! Passed with ${res.data.score_percentage}%.`
          : `Attempt completed. Scored ${res.data.score_percentage}%. Needs review.`,
        link: '/dashboard',
      })

      if (res.data.passed && onVerified) {
        onVerified(quizData.skill)
      }
    } catch (err) {
      console.error('Submit quiz error:', err)
      setError('Failed to evaluate quiz answers. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setAnswers({})
    setCurrentIndex(0)
    setShowReview(false)

    getSkillQuiz(skill, role)
      .then((res) => {
        setQuizData(res.data)
        setTimeLeft(res.data.time_limit_seconds || 180)
        setLoading(false)
        setTimerActive(true)
      })
      .catch((err) => {
        setError('Failed to generate quiz. Please try again.')
        setLoading(false)
      })
  }

  if (!isOpen) return null

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`
  }

  const questions = quizData?.questions || []
  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0
  const isTimeCritical = timeLeft < 30

  return (
    <div
      className="modal-overlay animate-fadeIn"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(19, 19, 17, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
      }}
    >
      <div
        className="animate-slideUp"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '16px',
          border: '2.5px solid #131311',
          boxShadow: '8px 8px 0px #131311',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          color: '#131311',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '2px solid #131311',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary, #f8f7f2)',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'var(--accent-lime, #c6fd50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #131311',
                boxShadow: '2px 2px 0px #131311',
                flexShrink: 0,
              }}
            >
              <Award size={22} color="#131311" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-secondary, #52524e)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Skill Verification Assessment
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#131311',
                  letterSpacing: '-0.02em',
                }}
              >
                {skill}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!result && !loading && !error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 9999,
                  background: isTimeCritical ? 'var(--accent-coral-subtle, #ffece8)' : '#ffffff',
                  border: '2px solid #131311',
                  boxShadow: '2px 2px 0px #131311',
                  color: isTimeCritical ? '#dc2626' : '#131311',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                }}
              >
                <Clock size={16} color={isTimeCritical ? '#dc2626' : '#131311'} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              aria-label="Close Quiz"
              style={{
                background: '#ffffff',
                border: '2px solid #131311',
                boxShadow: '2px 2px 0px #131311',
                color: '#131311',
                cursor: 'pointer',
                width: 36,
                height: 36,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-1px, -1px)'
                e.currentTarget.style.boxShadow = '3px 3px 0px #131311'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '2px 2px 0px #131311'
              }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Neo Progress Bar (during quiz) */}
        {!result && !loading && !error && (
          <div
            style={{
              width: '100%',
              height: 8,
              background: 'var(--bg-surface-secondary, #f3f2ea)',
              borderBottom: '2px solid #131311',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'var(--accent-lime, #c6fd50)',
                borderRight: progressPercent > 0 ? '2px solid #131311' : 'none',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
        )}

        {/* Main Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1,
            background: '#ffffff',
          }}
        >
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  border: '4px solid #e5e5dc',
                  borderTopColor: '#131311',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#131311',
                  marginBottom: '0.4rem',
                }}
              >
                Generating Assessment for {skill}...
              </h4>
              <p style={{ color: 'var(--text-secondary, #52524e)', fontSize: '0.92rem', maxWidth: 440, margin: '0 auto' }}>
                Curating 5 high-yield multiple-choice questions tailored to test practical, production-level knowledge.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                background: 'var(--accent-coral-subtle, #ffece8)',
                border: '2px solid #131311',
                borderRadius: '12px',
                boxShadow: '4px 4px 0px #131311',
                margin: '1rem 0',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: '#ff7660',
                  border: '2px solid #131311',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '2px 2px 0px #131311',
                }}
              >
                <AlertTriangle size={28} color="#131311" />
              </div>
              <h4 style={{ color: '#131311', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Assessment Unavailable
              </h4>
              <p style={{ color: '#52524e', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '2px solid #131311',
                  boxShadow: '3px 3px 0px #131311',
                }}
              >
                <RotateCcw size={16} /> Try Again
              </button>
            </div>
          )}

          {/* Active Question View */}
          {!loading && !error && !result && currentQuestion && (
            <div>
              {/* Question Navigation Chips & Metadata */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {questions.map((q, idx) => {
                    const isAnswered = answers[String(q.id)] !== undefined
                    const isCurrent = idx === currentIndex
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: '2px solid #131311',
                          background: isCurrent
                            ? 'var(--accent-lime, #c6fd50)'
                            : isAnswered
                            ? '#131311'
                            : '#ffffff',
                          color: isCurrent
                            ? '#131311'
                            : isAnswered
                            ? 'var(--accent-lime, #c6fd50)'
                            : '#52524e',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          boxShadow: isCurrent ? '2px 2px 0px #131311' : 'none',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#131311',
                      background: 'var(--bg-surface-secondary, #f3f2ea)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 9999,
                      border: '1.5px solid #131311',
                    }}
                  >
                    Topic: <strong>{currentQuestion.subtopic}</strong>
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div
                style={{
                  background: 'var(--bg-primary, #f8f7f2)',
                  border: '2px solid #131311',
                  borderRadius: '12px',
                  padding: '1.25rem 1.4rem',
                  marginBottom: '1.5rem',
                  boxShadow: '3px 3px 0px #131311',
                }}
              >
                <div
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary, #52524e)',
                    letterSpacing: '0.06em',
                    marginBottom: '0.4rem',
                  }}
                >
                  Question {currentIndex + 1} of {totalQuestions}
                </div>
                <h4
                  style={{
                    fontSize: '1.18rem',
                    fontWeight: 800,
                    color: '#131311',
                    lineHeight: 1.5,
                    margin: 0,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[String(currentQuestion.id)] === optIdx
                  const optionLetters = ['A', 'B', 'C', 'D']

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: isSelected ? 'var(--accent-lime, #c6fd50)' : '#ffffff',
                        border: isSelected ? '2.5px solid #131311' : '2px solid #131311',
                        color: '#131311',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.96rem',
                        fontWeight: isSelected ? 700 : 500,
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '4px 4px 0px #131311' : '3px 3px 0px #131311',
                        transform: isSelected ? 'translate(-1px, -1px)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translate(-2px, -2px)'
                          e.currentTarget.style.boxShadow = '5px 5px 0px #131311'
                          e.currentTarget.style.background = '#fafaf5'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'none'
                          e.currentTarget.style.boxShadow = '3px 3px 0px #131311'
                          e.currentTarget.style.background = '#ffffff'
                        }
                      }}
                    >
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: isSelected ? '#131311' : 'var(--bg-surface-secondary, #f3f2ea)',
                          color: isSelected ? 'var(--accent-lime, #c6fd50)' : '#131311',
                          border: '1.5px solid #131311',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {optionLetters[optIdx]}
                      </span>

                      <span style={{ flex: 1, lineHeight: 1.45 }}>{opt}</span>

                      {isSelected && (
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: '#131311',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={14} color="var(--accent-lime, #c6fd50)" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Results View */}
          {result && (
            <div className="animate-fadeIn">
              {/* Result Summary Neo Card */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem 1.5rem',
                  borderRadius: '14px',
                  background: result.passed
                    ? 'var(--accent-lime-subtle, #f1fccf)'
                    : result.all_wrong
                    ? 'var(--accent-coral-subtle, #ffece8)'
                    : '#fef3c7',
                  border: '2.5px solid #131311',
                  boxShadow: '6px 6px 0px #131311',
                  marginBottom: '1.5rem',
                  position: 'relative',
                }}
              >
                {/* Result Icon */}
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 16,
                    background: result.passed
                      ? 'var(--accent-lime, #c6fd50)'
                      : result.all_wrong
                      ? '#ff7660'
                      : '#ffd15c',
                    border: '2.5px solid #131311',
                    boxShadow: '3px 3px 0px #131311',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  {result.passed ? (
                    <ShieldCheck size={38} color="#131311" strokeWidth={2.2} />
                  ) : result.all_wrong ? (
                    <XCircle size={38} color="#131311" strokeWidth={2.2} />
                  ) : (
                    <AlertTriangle size={38} color="#131311" strokeWidth={2.2} />
                  )}
                </div>

                {/* Status Badge */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.9rem',
                      borderRadius: 9999,
                      background: '#131311',
                      color: result.passed ? 'var(--accent-lime, #c6fd50)' : '#ffffff',
                      border: '1.5px solid #131311',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {result.passed ? '✓ Skill Verified' : 'Assessment Result'}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#131311',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {result.headline}
                </h3>

                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: '#131311',
                    margin: '0.5rem 0',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {result.score_percentage}%
                  <span
                    style={{
                      fontSize: '1.05rem',
                      color: 'var(--text-secondary, #52524e)',
                      fontWeight: 700,
                      marginLeft: '0.5rem',
                      letterSpacing: 'normal',
                    }}
                  >
                    ({result.score}/{result.total} Correct)
                  </span>
                </div>

                {/* English Feedback Message Box */}
                <div
                  style={{
                    fontSize: '0.94rem',
                    color: '#131311',
                    lineHeight: 1.6,
                    maxWidth: 580,
                    margin: '1rem auto 0',
                    background: '#ffffff',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: '2px solid #131311',
                    boxShadow: '3px 3px 0px #131311',
                    textAlign: 'left',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {result.feedback_message}
                  </p>
                </div>
              </div>

              {/* Missed Topics Tags */}
              {result.missed_subtopics && result.missed_subtopics.length > 0 && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-primary, #f8f7f2)',
                    border: '2px solid #131311',
                    borderRadius: '12px',
                    boxShadow: '3px 3px 0px #131311',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#131311',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.65rem',
                    }}
                  >
                    Recommended Sub-topics to Focus On:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.missed_subtopics.map((sub, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #131311',
                          boxShadow: '2px 2px 0px #131311',
                          color: '#131311',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          padding: '0.3rem 0.75rem',
                          borderRadius: 9999,
                        }}
                      >
                        ⚡ {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Toggle Review Button */}
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReview(!showReview)}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    border: '2px solid #131311',
                    boxShadow: '3px 3px 0px #131311',
                    background: '#ffffff',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <BookOpen size={17} />
                  {showReview ? 'Hide Detailed Answers' : 'Review Answers & Detailed Explanations'}
                </button>
              </div>

              {/* Question Breakdown List */}
              {showReview && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {result.breakdown.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#ffffff',
                        border: '2px solid #131311',
                        borderRadius: '12px',
                        boxShadow: '3px 3px 0px #131311',
                        padding: '1.25rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              background: '#131311',
                              color: 'var(--accent-lime, #c6fd50)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#131311', lineHeight: 1.45 }}>
                            {item.question}
                          </span>
                        </div>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: 9999,
                            background: item.is_correct
                              ? 'var(--accent-lime, #c6fd50)'
                              : 'var(--accent-coral-subtle, #ffece8)',
                            color: item.is_correct ? '#131311' : '#dc2626',
                            border: '1.5px solid #131311',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {item.is_correct ? (
                            <>
                              <CheckCircle2 size={14} color="#131311" /> Correct
                            </>
                          ) : (
                            <>
                              <XCircle size={14} color="#dc2626" /> Incorrect
                            </>
                          )}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.88rem', color: '#52524e', marginLeft: '2.25rem' }}>
                        <div style={{ marginBottom: '0.35rem' }}>
                          <strong style={{ color: '#131311' }}>Your Answer:</strong>{' '}
                          <span
                            style={{
                              color: item.is_correct ? '#16a34a' : '#dc2626',
                              fontWeight: 700,
                            }}
                          >
                            {item.user_option_text}
                          </span>
                        </div>

                        {!item.is_correct && (
                          <div style={{ marginBottom: '0.35rem' }}>
                            <strong style={{ color: '#131311' }}>Correct Answer:</strong>{' '}
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>
                              {item.correct_option_text}
                            </span>
                          </div>
                        )}

                        <div
                          style={{
                            marginTop: '0.65rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 8,
                            background: 'var(--bg-surface-secondary, #f3f2ea)',
                            border: '1.5px solid #131311',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            color: '#131311',
                          }}
                        >
                          <strong style={{ color: '#131311' }}>💡 Why:</strong> {item.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '2px solid #131311',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary, #f8f7f2)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {!result && !loading && !error && (
            <>
              <div
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary, #52524e)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: answeredCount === totalQuestions ? 'var(--accent-lime, #c6fd50)' : '#ffd15c',
                    border: '1px solid #131311',
                  }}
                />
                {answeredCount} of {totalQuestions} answered
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    className="btn btn-outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.88rem',
                      padding: '0.55rem 1.15rem',
                      border: '2px solid #131311',
                      boxShadow: '3px 3px 0px #131311',
                      background: '#ffffff',
                    }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                )}

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.88rem',
                      padding: '0.55rem 1.15rem',
                      border: '2px solid #131311',
                      boxShadow: '3px 3px 0px #131311',
                      background: 'var(--accent-lime, #c6fd50)',
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmitQuiz()}
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      background: 'var(--accent-lime, #c6fd50)',
                      border: '2.5px solid #131311',
                      boxShadow: '4px 4px 0px #131311',
                      padding: '0.6rem 1.35rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.75 : 1,
                    }}
                  >
                    {submitting ? 'Evaluating Answers...' : 'Submit Assessment ✓'}
                  </button>
                )}
              </div>
            </>
          )}

          {result && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.85rem',
                flexWrap: 'wrap',
              }}
            >
              {!result.passed && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn btn-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    border: '2px solid #131311',
                    boxShadow: '3px 3px 0px #131311',
                    background: '#ffffff',
                    padding: '0.6rem 1.25rem',
                  }}
                >
                  <RotateCcw size={16} /> Retake Assessment
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  border: '2.5px solid #131311',
                  boxShadow: '4px 4px 0px #131311',
                  background: 'var(--accent-lime, #c6fd50)',
                  padding: '0.6rem 1.35rem',
                }}
              >
                {result.passed ? 'Great, Done! 🎉' : 'Back to Roadmap'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

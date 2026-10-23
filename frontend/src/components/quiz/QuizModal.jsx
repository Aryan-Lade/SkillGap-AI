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
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  ShieldCheck,
  Flame,
} from 'lucide-react'
import { getSkillQuiz, submitSkillQuiz } from '../../api/client'

export default function QuizModal({
  isOpen,
  skill,
  role = 'Full Stack Developer',
  onClose,
  onVerified,
}) {
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

  return (
    <div
      className="modal-overlay animate-fadeIn"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(5, 8, 18, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
      }}
    >
      <div
        className="modal-content animate-slideUp"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'linear-gradient(145deg, #0e1424 0%, #080c16 100%)',
          borderRadius: 'var(--radius-lg, 16px)',
          border: '1px solid rgba(99, 179, 237, 0.25)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 179, 237, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(99, 179, 237, 0.2) 0%, rgba(183, 148, 244, 0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(99, 179, 237, 0.3)',
              }}
            >
              <Sparkles size={18} color="var(--accent-blue, #63b3ed)" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Skill Verification Assessment
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                {skill}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!result && !loading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 999,
                  background: timeLeft < 30 ? 'rgba(252, 129, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${timeLeft < 30 ? 'rgba(252, 129, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: timeLeft < 30 ? 'var(--accent-pink, #fc8181)' : 'var(--text-primary, #e2e8f0)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Clock size={15} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              aria-label="Close Quiz"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #718096)',
                cursor: 'pointer',
                padding: 4,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar (during quiz) */}
        {!result && !loading && (
          <div style={{ width: '100%', height: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #63b3ed, #b794f4)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}

        {/* Main Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  border: '3px solid rgba(99, 179, 237, 0.2)',
                  borderTopColor: 'var(--accent-blue, #63b3ed)',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.4rem' }}>
                Generating AI Assessment for {skill}...
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Google Gemini AI is crafting 5 targeted multiple-choice questions for your experience level.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <AlertTriangle size={42} color="var(--accent-pink, #fc8181)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Could not load quiz</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {error}
              </p>
              <button onClick={handleRetry} className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                <RotateCcw size={16} /> Try Again
              </button>
            </div>
          )}

          {/* Active Question View */}
          {!loading && !error && !result && currentQuestion && (
            <div>
              {/* Question Meta */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent-blue, #63b3ed)',
                    background: 'rgba(99, 179, 237, 0.12)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                  }}
                >
                  Question {currentIndex + 1} of {totalQuestions}
                </span>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Topic: <strong>{currentQuestion.subtopic}</strong>
                </span>
              </div>

              {/* Question Text */}
              <h4
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                }}
              >
                {currentQuestion.question}
              </h4>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                        gap: '0.85rem',
                        padding: '0.9rem 1.15rem',
                        borderRadius: 'var(--radius-md, 10px)',
                        background: isSelected ? 'rgba(99, 179, 237, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--accent-blue, #63b3ed)' : 'rgba(255, 255, 255, 0.08)'}`,
                        color: isSelected ? '#fff' : 'var(--text-primary, #e2e8f0)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.93rem',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 15px rgba(99, 179, 237, 0.2)' : 'none',
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: isSelected ? 'var(--accent-blue, #63b3ed)' : 'rgba(255, 255, 255, 0.07)',
                          color: isSelected ? '#000' : 'var(--text-secondary, #a0aec0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {optionLetters[optIdx]}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Results View */}
          {result && (
            <div className="animate-fadeIn">
              {/* Result Summary Card */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-md, 12px)',
                  background: result.passed
                    ? 'linear-gradient(145deg, rgba(72, 187, 120, 0.15) 0%, rgba(56, 161, 105, 0.05) 100%)'
                    : result.all_wrong
                    ? 'linear-gradient(145deg, rgba(245, 101, 101, 0.18) 0%, rgba(229, 62, 62, 0.05) 100%)'
                    : 'linear-gradient(145deg, rgba(237, 137, 54, 0.15) 0%, rgba(221, 107, 32, 0.05) 100%)',
                  border: `1px solid ${
                    result.passed
                      ? 'rgba(72, 187, 120, 0.35)'
                      : result.all_wrong
                      ? 'rgba(245, 101, 101, 0.4)'
                      : 'rgba(237, 137, 54, 0.35)'
                  }`,
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: result.passed ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  {result.passed ? (
                    <ShieldCheck size={36} color="var(--accent-green, #48bb78)" />
                  ) : result.all_wrong ? (
                    <XCircle size={36} color="var(--accent-pink, #fc8181)" />
                  ) : (
                    <AlertTriangle size={36} color="var(--accent-orange, #ed8936)" />
                  )}
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                  {result.headline}
                </h3>

                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: result.passed
                      ? 'var(--accent-green, #48bb78)'
                      : result.all_wrong
                      ? 'var(--accent-pink, #fc8181)'
                      : 'var(--accent-orange, #ed8936)',
                    margin: '0.4rem 0',
                  }}
                >
                  {result.score_percentage}%
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.4rem' }}>
                    ({result.score}/{result.total} correct)
                  </span>
                </div>

                {/* Feedback message (Hindi / English informative text) */}
                <p
                  style={{
                    fontSize: '0.94rem',
                    color: 'var(--text-primary, #e2e8f0)',
                    lineHeight: 1.6,
                    maxWidth: 540,
                    margin: '0.75rem auto 0',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.85rem 1.15rem',
                    borderRadius: 'var(--radius-sm, 8px)',
                    borderLeft: `4px solid ${
                      result.passed
                        ? 'var(--accent-green, #48bb78)'
                        : result.all_wrong
                        ? 'var(--accent-pink, #fc8181)'
                        : 'var(--accent-orange, #ed8936)'
                    }`,
                  }}
                >
                  {result.feedback_message}
                </p>
              </div>

              {/* Missed Topics Tags */}
              {result.missed_subtopics && result.missed_subtopics.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Recommended Sub-topics to Re-learn:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.missed_subtopics.map((sub, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'rgba(237, 137, 54, 0.15)',
                          border: '1px solid rgba(237, 137, 54, 0.3)',
                          color: 'var(--accent-orange, #ed8936)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          padding: '0.25rem 0.65rem',
                          borderRadius: 999,
                        }}
                      >
                        {sub}
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
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
                >
                  <BookOpen size={16} />
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
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${
                          item.is_correct ? 'rgba(72, 187, 120, 0.25)' : 'rgba(245, 101, 101, 0.3)'
                        }`,
                        borderRadius: 'var(--radius-md, 10px)',
                        padding: '1.1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {item.is_correct ? (
                          <CheckCircle2 size={18} color="var(--accent-green, #48bb78)" />
                        ) : (
                          <XCircle size={18} color="var(--accent-pink, #fc8181)" />
                        )}
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                          Q{i + 1}: {item.question}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginLeft: '1.6rem' }}>
                        <div style={{ marginBottom: '0.25rem' }}>
                          <strong>Your Answer:</strong>{' '}
                          <span style={{ color: item.is_correct ? 'var(--accent-green)' : 'var(--accent-pink)' }}>
                            {item.user_option_text}
                          </span>
                        </div>
                        {!item.is_correct && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            <strong>Correct Answer:</strong>{' '}
                            <span style={{ color: 'var(--accent-green)' }}>{item.correct_option_text}</span>
                          </div>
                        )}
                        <div
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 6,
                            background: 'rgba(255, 255, 255, 0.04)',
                            fontSize: '0.8rem',
                            lineHeight: 1.5,
                          }}
                        >
                          <strong style={{ color: 'var(--accent-blue)' }}>Why:</strong> {item.explanation}
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
            borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {!result && !loading && !error && (
            <>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {answeredCount} of {totalQuestions} answered
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem' }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                )}

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem' }}
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
                      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    }}
                  >
                    {submitting ? 'Evaluating...' : 'Submit Assessment ✓'}
                  </button>
                )}
              </div>
            </>
          )}

          {result && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              {!result.passed && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', gap: '0.4rem', fontSize: '0.88rem' }}
                >
                  <RotateCcw size={15} /> Retake Assessment
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ fontSize: '0.88rem' }}
              >
                {result.passed ? 'Great, Done!' : 'Back to Roadmap'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

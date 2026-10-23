import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  FileSearch,
  Code2,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  Award,
  TrendingUp,
} from 'lucide-react'

export default function Home() {
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 1.5rem 4rem 1.5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4.5rem 0 3.5rem 0', position: 'relative' }}>
        {/* Floating Handwritten Sticky Notes */}
        <div
          className="sticker-bubble"
          style={{
            position: 'absolute',
            top: '20px',
            left: '3%',
            transform: 'rotate(-6deg)',
            display: 'none',
          }}
        >
          No more guessing tutorials! 🎯
        </div>

        <div
          className="sticker-bubble"
          style={{
            position: 'absolute',
            top: '35px',
            right: '4%',
            transform: 'rotate(5deg)',
            display: 'none',
          }}
        >
          Built for real developers ⚡
        </div>

        {/* Top Pill Badge */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="pill-badge">
            <span className="pill-accent">⚡</span> ONE ROADMAP. ONE GOAL. ZERO GUESSWORK.
          </span>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            maxWidth: 960,
            margin: '0 auto 1.5rem auto',
            color: 'var(--text-primary)',
          }}
        >
          Stop wasting months on tutorials you don't need.{' '}
          <span
            style={{
              background: 'var(--accent-lime)',
              padding: '0 8px',
              borderRadius: '8px',
              border: 'var(--border-main)',
              display: 'inline-block',
              transform: 'rotate(-1deg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Map your exact skill gap
          </span>{' '}
          in seconds.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: 720,
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.55,
          }}
        >
          SkillGap AI benchmarks your current experience against real industry taxonomy,
          ranks your critical missing skills, and builds an actionable fast-track roadmap so you only learn what gets you hired.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
            <Zap size={18} fill="#131311" /> Map My Skill Gap Now <ArrowRight size={18} />
          </Link>
          <Link to="/job-analyzer" className="btn btn-outline" style={{ padding: '0.85rem 1.65rem', fontSize: '1rem' }}>
            <FileSearch size={18} /> Match Against a Job Posting
          </Link>
        </div>

        {/* Trust Marks Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} color="#16a34a" /> 90%+ ML Model Accuracy
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} color="#16a34a" /> 128+ Tech Industry Skills
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} color="#16a34a" /> In-Browser Code Sandbox
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={16} color="#16a34a" /> 100% Free & Open
          </span>
        </div>
      </section>

      {/* Floating Polaroid Showcase Banner */}
      <section style={{ margin: '1rem 0 4rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Card 1: Resume Parser */}
          <div
            className="neo-card"
            style={{
              transform: 'rotate(-1deg)',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'var(--accent-lime)',
                border: 'var(--border-main)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
              }}
            >
              📄 AI RESUME PARSER
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Upload Resume. Detect Gaps Instantly.
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Upload your PDF/TXT resume or paste your LinkedIn bio. Automatically extracts skills and benchmarks role fit.
            </p>
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-secondary)',
                border: 'var(--border-main)',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Skills Detected: 7</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>54.2% Match</span>
            </div>
          </div>

          {/* Card 2: Interactive Sandbox */}
          <div
            className="neo-card"
            style={{
              transform: 'rotate(1.2deg)',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'var(--accent-coral-subtle)',
                border: 'var(--border-main)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
              }}
            >
              💻 CODE SANDBOX
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Practice Code in Python, JS & SQL
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Solve real-world coding challenges and run automated test validation right in your browser.
            </p>
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-secondary)',
                border: 'var(--border-main)',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Two Sum · Python</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>ALL TESTS PASSED ✅</span>
            </div>
          </div>

          {/* Card 3: Calendar Sync */}
          <div
            className="neo-card"
            style={{
              transform: 'rotate(-0.8deg)',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'var(--accent-teal-subtle)',
                border: 'var(--border-main)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
              }}
            >
              📅 1-CLICK CALENDAR SYNC
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Day-by-Day Study Schedule
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Export your roadmap directly to Google Calendar, Apple iCal, or Outlook as an `.ics` file.
            </p>
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-secondary)',
                border: 'var(--border-main)',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Commitment: 10 hrs/wk</span>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>.ics Ready 📥</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Contrast Problem Section (ProjectOne Style) */}
      <section style={{ margin: '4rem 0' }}>
        <div className="dark-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'var(--accent-lime)',
              color: '#131311',
              fontWeight: 800,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}
          >
            THE HARD TRUTH
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', color: '#ffffff', maxWidth: 800, margin: '0 auto 1.25rem auto' }}>
            Your Career Transition Shouldn't Feel Like An Infinite Guessing Game.
          </h2>

          <p style={{ color: '#a1a19d', fontSize: '1.05rem', maxWidth: 660, margin: '0 auto 2.5rem auto' }}>
            Most developers spend 6 months grinding irrelevant frameworks because they don't know what employers actually look for. SkillGap AI changes that.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '10px',
                background: '#1c1d1a',
                border: '1.5px solid #2e2f2b',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>❌</div>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                Course Overwhelm
              </h4>
              <p style={{ color: '#969694', fontSize: '0.88rem' }}>
                Buying 12 different 60-hour video tutorials without knowing which 2 skills are actually blocking your job interviews.
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: '10px',
                background: '#1c1d1a',
                border: '1.5px solid #2e2f2b',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>❌</div>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                Ghost Applications
              </h4>
              <p style={{ color: '#969694', fontSize: '0.88rem' }}>
                Sending 80 generic resumes because ATS filters automatically discard applicants missing crucial core dependencies.
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: '10px',
                background: '#1c1d1a',
                border: '1.5px solid #2e2f2b',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>✅</div>
              <h4 style={{ color: '#c6fd50', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                The SkillGap AI Approach
              </h4>
              <p style={{ color: '#d3d3ce', fontSize: '0.88rem' }}>
                Instant gap diagnosis, targeted weekly study plan, in-browser sandbox practice, and live market salary calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Capabilities Grid */}
      <section style={{ margin: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="pill-badge">
            <Sparkles size={14} color="#c6fd50" /> ALL-IN-ONE CAREER PLATFORM
          </span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem' }}>Everything You Need to Get Hired</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Feature 1 */}
          <div className="neo-card">
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--accent-lime)', border: 'var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <Zap size={22} color="#131311" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>ML Skill Gap Analysis</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Random Forest model trained on thousands of developer profiles computes your exact match percentage and missing skills.
            </p>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Try Assessment <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="neo-card">
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--accent-coral-subtle)', border: 'var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <FileSearch size={22} color="#ff7660" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Custom Job Description Matcher</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Paste any job posting from LinkedIn or Indeed to benchmark your skills against specific company requirements.
            </p>
            <Link to="/job-analyzer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Analyze Job Posting <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="neo-card">
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--accent-lime-subtle)', border: 'var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <DollarSign size={22} color="#131311" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Live Tech Salary Estimator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Simulate your compensation increase across USD ($), INR (₹ LPA), and EUR (€) by learning specific high-value skills.
            </p>
            <Link to="/job-market" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Explore Salaries <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="neo-card">
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--accent-teal-subtle)', border: 'var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <Code2 size={22} color="#0d9488" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>In-Browser Code Sandbox</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Write and execute Python, JavaScript, and SQL solutions with automated unit test assertions directly in the browser.
            </p>
            <Link to="/sandbox" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Open Code Runner <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="neo-card">
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--accent-lime)', border: 'var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <Calendar size={22} color="#131311" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Weekly Study Calendar & .ics Sync</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Turn your missing skills into structured daily 60–90 min study blocks and export to Google Calendar or Apple iCal.
            </p>
            <Link to="/planner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Create Study Schedule <ArrowRight size={15} />
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="neo-card">
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg-surface-secondary)', border: 'var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <Award size={22} color="#131311" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Skill Verification Quizzes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Validate your knowledge with timed technical MCQs to earn verification badges on your personalized roadmap.
            </p>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Take Skill Quiz <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ margin: '4rem 0 2rem 0' }}>
        <div
          className="neo-card"
          style={{
            background: 'var(--accent-lime)',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <div className="sticker-note" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
            Ready to upgrade your engineering career? 🚀
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Build Your Personalized Career Roadmap Today
          </h2>
          <p style={{ maxWidth: 600, margin: '0 auto 1.75rem auto', fontSize: '1.05rem', color: '#272822' }}>
            Join thousands of developers leveling up their technical skills with precise, data-driven learning paths.
          </p>
          <Link to="/dashboard" className="btn btn-dark" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            ⚡ Get Started For Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

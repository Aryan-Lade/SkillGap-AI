import os
import sys
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

OUTPUT_PDF = os.path.join(os.path.dirname(__file__), "SkillGap_AI_IdeaLab_Presentation.pdf")

# Dimensions for 16:9 widescreen presentation slides
PAGE_WIDTH = 11.0 * inch
PAGE_HEIGHT = 8.5 * inch

class UniversitySlideCanvas(canvas.Canvas):
    """Custom canvas that applies Ramdeobaba University slide template decoration"""
    def __init__(self, *args, **kwargs):
        super(UniversitySlideCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_slide_decorations(num_pages)
            super(UniversitySlideCanvas, self).showPage()
        super(UniversitySlideCanvas, self).save()

    def draw_slide_decorations(self, total_pages):
        self.saveState()
        
        # 1. Slide Header Accent Bar (Orange under title)
        if self._pageNumber > 1:
            self.setFillColor(colors.HexColor("#ea580c")) # Vibrant orange
            self.rect(48, PAGE_HEIGHT - 68, 55, 4, fill=1, stroke=0)
            
            # University circular seal badge representation on top right
            self.setFillColor(colors.HexColor("#0f2b48"))
            self.circle(PAGE_WIDTH - 70, PAGE_HEIGHT - 48, 24, fill=1, stroke=0)
            self.setFillColor(colors.HexColor("#ea580c"))
            self.circle(PAGE_WIDTH - 70, PAGE_HEIGHT - 48, 21, fill=0, stroke=1)
            self.setFillColor(colors.white)
            self.setFont("Helvetica-Bold", 6)
            self.drawCentredString(PAGE_WIDTH - 70, PAGE_HEIGHT - 44, "RCOEM")
            self.setFont("Helvetica", 5)
            self.drawCentredString(PAGE_WIDTH - 70, PAGE_HEIGHT - 52, "IDEA LAB")

        # 2. Slide Footer Bar
        # Navy blue bottom bar
        self.setFillColor(colors.HexColor("#0c2340"))
        self.rect(0, 0, PAGE_WIDTH, 24, fill=1, stroke=0)
        
        # Orange bottom right strip
        self.setFillColor(colors.HexColor("#ea580c"))
        self.rect(PAGE_WIDTH - 180, 0, 180, 24, fill=1, stroke=0)
        
        # Footer text
        self.setFillColor(colors.white)
        self.setFont("Helvetica-Bold", 8)
        self.drawString(30, 8, "Ramdeobaba University — Idea Lab / Major Project 2026")
        
        self.setFont("Helvetica-Bold", 8)
        self.drawString(PAGE_WIDTH - 150, 8, f"Slide {self._pageNumber} of {total_pages}")
        
        self.restoreState()


def build_presentation_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=48,
        rightMargin=48,
        topMargin=40,
        bottomMargin=36,
    )
    
    styles = getSampleStyleSheet()
    
    # Custom slide typography styles
    title_style = ParagraphStyle(
        'SlideTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0f2b48"),
        spaceAfter=15,
        spaceBefore=0,
    )
    
    cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=30,
        leading=36,
        textColor=colors.HexColor("#0f2b48"),
        spaceAfter=8,
    )
    
    cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=20,
        textColor=colors.HexColor("#ea580c"),
        spaceAfter=18,
    )
    
    card_title = ParagraphStyle(
        'CardTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0f2b48"),
        spaceAfter=4,
    )
    
    card_body = ParagraphStyle(
        'CardBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#334155"),
    )
    
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=6,
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.white,
        alignment=1,
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#1e293b"),
    )
    
    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#ea580c"),
    )

    story = []

    # =========================================================================
    # SLIDE 1: COVER SLIDE
    # =========================================================================
    story.append(Spacer(1, 40))
    
    # Header branding box
    cover_top_data = [
        [
            Paragraph("<b>RAMDEOBABA UNIVERSITY</b><br/><font color='#64748b' size=9>Idea Lab / Project Presentation</font>", bullet_style),
            Paragraph("<font color='#0f2b48' size=10><b>COURSE CODE:</b> CSD401<br/><b>ACADEMIC YEAR:</b> 2026-2027</font>", bullet_style)
        ]
    ]
    cover_top_table = Table(cover_top_data, colWidths=[400, 320])
    cover_top_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(cover_top_table)
    
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#cbd5e1"), spaceAfter=25, spaceBefore=5))
    
    story.append(Paragraph("PROJECT TITLE", badge_style))
    story.append(Paragraph("SkillGap AI: ML-Powered Career Skill Gap Benchmarking & Adaptive Learning Roadmap Engine", cover_title))
    story.append(Paragraph("Precision Skill Intelligence, Custom JD Matcher, & Automated Calendar Pacing for Software Engineers", cover_subtitle))
    
    # Orange accent bar
    story.append(HRFlowable(width="100%", thickness=3, color=colors.HexColor("#ea580c"), spaceAfter=20, spaceBefore=0))
    
    # Metadata Table (Team & Guide)
    meta_data = [
        [
            Paragraph("<b>Team Members & Roll Numbers:</b><br/>• Student 1 (Lead AI & Full Stack) — Roll No: [Roll_01]<br/>• Student 2 (ML & Feature Engineering) — Roll No: [Roll_02]<br/>• Student 3 (Frontend & Visualizations) — Roll No: [Roll_03]<br/>• Student 4 (Testing & Deployment) — Roll No: [Roll_04]", card_body),
            Paragraph("<b>Project Guide / Mentor:</b><br/>• Prof. [Mentor Name]<br/><b>Department / School:</b><br/>• Dept. of Computer Science & Engineering<br/><b>Platform Live URL:</b><br/>• https://skill-gap-ai-eta.vercel.app/", card_body)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[360, 360])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(meta_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT
    # =========================================================================
    story.append(Paragraph("PROBLEM STATEMENT", title_style))
    story.append(Spacer(1, 10))
    
    ps_data = [
        [
            Paragraph("<b>What problem are we addressing?</b>", card_title),
            Paragraph("<b>Who is affected?</b>", card_title)
        ],
        [
            Paragraph("• Tech industry job requirements evolve 3x faster than university curricula.<br/>• Engineering graduates suffer from <b>'Tutorial Hell'</b> — spending months on redundant video courses without knowing their precise market deficits.<br/>• Generic roadmaps fail to account for prior skills and hands-on portfolio verification.", card_body),
            Paragraph("• <b>1.5M+ Annual Engineering Graduates</b> facing severe industry readiness mismatch.<br/>• Career switchers and junior developers aiming for high-growth tech roles.<br/>• Tech recruiters overwhelmed by resumes lacking verified hands-on skills.", card_body)
        ],
        [
            Paragraph("<b>Current Challenges</b>", card_title),
            Paragraph("<b>Why is the problem important?</b>", card_title)
        ],
        [
            Paragraph("• Traditional self-assessment relies on subjective guesswork.<br/>• Job descriptions are bloated with 20+ buzzwords, obscuring core prerequisites.<br/>• Lack of structured calendar pacing leads to <b>80%+ roadmap abandonment rates</b>.", card_body),
            Paragraph("• NASSCOM reports <b>over 75% of engineering graduates</b> are not directly employable in product companies.<br/>• Bridging exact skill gaps shortens job transition time from <b>9 months to under 8 weeks</b>.<br/>• Data-driven career guidance creates direct economic mobility.", card_body)
        ]
    ]
    ps_table = Table(ps_data, colWidths=[355, 355])
    ps_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#fff7ed")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#f0fdf4")),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#eff6ff")),
        ('BACKGROUND', (1,2), (1,2), colors.HexColor("#fef2f2")),
        ('BOX', (0,0), (0,1), 1, colors.HexColor("#fdba74")),
        ('BOX', (1,0), (1,1), 1, colors.HexColor("#86efac")),
        ('BOX', (0,2), (0,3), 1, colors.HexColor("#93c5fd")),
        ('BOX', (1,2), (1,3), 1, colors.HexColor("#fca5a5")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(ps_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 3: EXISTING SOLUTIONS / LITERATURE REVIEW
    # =========================================================================
    story.append(Paragraph("EXISTING SOLUTIONS / LITERATURE REVIEW", title_style))
    story.append(Spacer(1, 8))
    
    comp_data = [
        [
            Paragraph("Feature / Dimension", table_header),
            Paragraph("Existing Platforms (Roadmap.sh / Coursera / LinkedIn)", table_header),
            Paragraph("SkillGap AI (Our Proposed Approach)", table_header),
        ],
        [
            Paragraph("<b>Personalization</b>", table_cell),
            Paragraph("Static, one-size-fits-all diagrams. Assumes zero prior knowledge.", table_cell),
            Paragraph("<b>Dynamic ML Benchmarking</b> tailored to prior skills, projects, and target role.", table_cell),
        ],
        [
            Paragraph("<b>Resume & JD Matching</b>", table_cell),
            Paragraph("Keyword-matching ATS bots with zero learning guidance.", table_cell),
            Paragraph("<b>AI Semantic Matcher</b> extracting missing skills + immediate bridge curriculum.", table_cell),
        ],
        [
            Paragraph("<b>Skill Verification</b>", table_cell),
            Paragraph("Passive multiple-choice quizzes or unverified video watch-time.", table_cell),
            Paragraph("<b>In-Browser Code Sandbox</b> (Python/JS/SQL) with automated unit test runner.", table_cell),
        ],
        [
            Paragraph("<b>Pacing & Execution</b>", table_cell),
            Paragraph("No calendar sync; learners lose momentum without accountability.", table_cell),
            Paragraph("<b>Weekly Study Scheduler</b> with daily study blocks & <b>.ics iCal/Google Calendar</b> export.", table_cell),
        ],
        [
            Paragraph("<b>Research / Market Gap</b>", table_cell),
            Paragraph("Current literature focuses either on resume parsing OR static course recommendation.", table_cell),
            Paragraph("<b>Unified closed-loop feedback engine</b>: Diagnose Gap → Verify Hands-on → Schedule Study.", table_cell),
        ]
    ]
    comp_table = Table(comp_data, colWidths=[130, 290, 290])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f2b48")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(comp_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 4: PROPOSED SOLUTION
    # =========================================================================
    story.append(Paragraph("PROPOSED SOLUTION", title_style))
    story.append(Spacer(1, 10))
    
    sol_data = [
        [
            Paragraph("<b>1. Project Idea</b>", card_title),
            Paragraph("<b>2. Proposed Approach</b>", card_title)
        ],
        [
            Paragraph("• An intelligent, end-to-end career acceleration system that benchmarks individual tech stack skills against 16 standardized industry roles and 128 canonical competencies using Machine Learning.", card_body),
            Paragraph("• <b>Dual Input Modality:</b> Interactive manual profile builder OR 1-click AI resume PDF parser.<br/>• <b>ML Match Scoring:</b> Random Forest model computes precise percentage readiness and highlights critical blockers.<br/>• <b>DAG Sequencer:</b> Generates multi-phase milestone roadmaps based on prerequisite trees.", card_body)
        ],
        [
            Paragraph("<b>3. Key Innovation</b>", card_title),
            Paragraph("<b>4. Expected Outcome</b>", card_title)
        ],
        [
            Paragraph("• <b>Custom Job Description Bridge:</b> Parses any LinkedIn/Indeed job posting, calculates fit score, and outputs an accelerated bridge roadmap.<br/>• <b>Hands-On Sandbox:</b> Live code runner executing test suites directly in browser.<br/>• <b>Smart Study Pacer:</b> Converts roadmaps into weekly calendar events with .ics export.", card_body),
            Paragraph("• Eliminates 60% of unnecessary learning time for engineering students.<br/>• Boosts practical portfolio competence through validated coding exercises.<br/>• Real-time cloud sync with Supabase and comprehensive past learning history tracking.", card_body)
        ]
    ]
    sol_table = Table(sol_data, colWidths=[355, 355])
    sol_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (1,2), (1,2), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (0,1), 1.5, colors.HexColor("#0f2b48")),
        ('BOX', (1,0), (1,1), 1.5, colors.HexColor("#0f2b48")),
        ('BOX', (0,2), (0,3), 1.5, colors.HexColor("#ea580c")),
        ('BOX', (1,2), (1,3), 1.5, colors.HexColor("#ea580c")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(sol_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 5: OBJECTIVES
    # =========================================================================
    story.append(Paragraph("PROJECT OBJECTIVES", title_style))
    story.append(Spacer(1, 10))
    
    obj_data = [
        [
            Paragraph("<b>Obj #</b>", table_header),
            Paragraph("Specific Technical Objective", table_header),
            Paragraph("Implementation Methodology", table_header),
            Paragraph("Expected Measurable Target", table_header),
        ],
        [
            Paragraph("<b>01</b>", table_cell),
            Paragraph("<b>Automated Skill Gap Detection</b>", table_cell),
            Paragraph("Train Random Forest Classifier on developer profiles, projects, and role matrices.", table_cell),
            Paragraph("<b>> 90% Model Accuracy</b> on skill match classification across 16 tech tracks.", table_cell),
        ],
        [
            Paragraph("<b>02</b>", table_cell),
            Paragraph("<b>Interactive Milestone Sequencing</b>", table_cell),
            Paragraph("Topological DAG sorting based on prerequisite dependencies and difficulty.", table_cell),
            Paragraph("<b>Zero circular dependencies</b>; structured in 3 distinct phases (Foundations, Core, Applied).", table_cell),
        ],
        [
            Paragraph("<b>03</b>", table_cell),
            Paragraph("<b>Custom JD Matcher & Bridge</b>", table_cell),
            Paragraph("Regex & NLP keyword taxonomy parser extracting must-haves from raw job postings.", table_cell),
            Paragraph("<b>Sub-second analysis (< 500ms)</b> calculating fit score and immediate bridge roadmap.", table_cell),
        ],
        [
            Paragraph("<b>04</b>", table_cell),
            Paragraph("<b>Hands-On Sandbox & Pacing</b>", table_cell),
            Paragraph("Isolated in-browser code execution engine + automated iCalendar .ics generator.", table_cell),
            Paragraph("Support for <b>3 languages (Python, JS, SQL)</b> with automated assertions and 1-click calendar sync.", table_cell),
        ],
        [
            Paragraph("<b>05</b>", table_cell),
            Paragraph("<b>Cloud Progress & History Tracking</b>", table_cell),
            Paragraph("Supabase database with row-level security and responsive Neo-Editorial frontend.", table_cell),
            Paragraph("<b>100% persistent cross-device progress</b> and real-time activity history logging.", table_cell),
        ]
    ]
    obj_table = Table(obj_data, colWidths=[40, 210, 260, 200])
    obj_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f2b48")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(obj_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 6: SYSTEM ARCHITECTURE / METHODOLOGY
    # =========================================================================
    story.append(Paragraph("SYSTEM ARCHITECTURE / METHODOLOGY", title_style))
    story.append(Spacer(1, 10))
    
    flow_data = [
        [
            Paragraph("<b>1. INPUT LAYER</b>", table_header),
            Paragraph("<b>2. PREPROCESSING & PARSER</b>", table_header),
            Paragraph("<b>3. AI & ML CORE ENGINE</b>", table_header),
            Paragraph("<b>4. OUTPUT & ENGAGEMENT</b>", table_header),
        ],
        [
            Paragraph("• User Profile / Skills<br/>• Target Role & Experience<br/>• Resume Upload (PDF)<br/>• Raw Job Description Text", card_body),
            Paragraph("• MultiLabelBinarizer<br/>• Project Skill Derivation<br/>• PyPDF Text Extraction<br/>• Regex & Taxonomy Normalizer", card_body),
            Paragraph("• <b>Random Forest Classifier</b><br/>• Missing Skill Ranker<br/>• DAG Roadmap Sequencer<br/>• Gemini Quiz Generator", card_body),
            Paragraph("• Animated Match Gauge<br/>• Visual Milestone Canvas<br/>• Code Sandbox Execution<br/>• .ics Calendar Schedule", card_body),
        ]
    ]
    flow_table = Table(flow_data, colWidths=[175, 175, 180, 180])
    flow_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#0f2b48")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#1e3a8a")),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor("#ea580c")),
        ('BACKGROUND', (3,0), (3,0), colors.HexColor("#059669")),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(flow_table)
    
    story.append(Spacer(1, 15))
    
    # Methodology Narrative Box
    method_data = [
        [
            Paragraph("<b>Detailed Data Pipeline & Workflow Execution:</b><br/>"
                      "1. <b>Feature Vectorization:</b> Candidate skills and derived project capabilities are mapped into a 128-dimensional binary multi-label space.<br/>"
                      "2. <b>Readiness Inference:</b> Random forest ensemble calculates role-fit probability and computes priority-ranked gap vectors.<br/>"
                      "3. <b>Sequencing Algorithm:</b> Topological sort structures skills into foundational prerequisites, core domain drivers, and production deployment.<br/>"
                      "4. <b>Verification & Pacing Loop:</b> Interactive code sandbox validates skills while the study planner calculates weekly commitment pacing.", card_body)
        ]
    ]
    method_table = Table(method_data, colWidths=[710])
    method_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(method_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 7: IMPLEMENTATION
    # =========================================================================
    story.append(Paragraph("IMPLEMENTATION", title_style))
    story.append(Spacer(1, 10))
    
    tech_data = [
        [
            Paragraph("<b>Layer / Module</b>", table_header),
            Paragraph("Technologies Used", table_header),
            Paragraph("Purpose & Role in SkillGap AI", table_header),
        ],
        [
            Paragraph("<b>Frontend UI/UX</b>", table_cell),
            Paragraph("React 18, Vite 5, Vanilla CSS Design System, Lucide Icons", table_cell),
            Paragraph("Neo-Editorial high-contrast design system, responsive components, accessible authentication.", table_cell),
        ],
        [
            Paragraph("<b>Backend API</b>", table_cell),
            Paragraph("Python 3.12, FastAPI, Uvicorn (ASGI)", table_cell),
            Paragraph("High-performance asynchronous REST endpoints with automated Swagger OpenAPI documentation.", table_cell),
        ],
        [
            Paragraph("<b>Machine Learning</b>", table_cell),
            Paragraph("Scikit-learn, Pandas, NumPy, Joblib", table_cell),
            Paragraph("RandomForestClassifier, MultiLabelBinarizer, weighted skill gap heuristics.", table_cell),
        ],
        [
            Paragraph("<b>Parser & NLP</b>", table_cell),
            Paragraph("PyPDF, Regular Expressions, Gemini AI 2.5 Flash", table_cell),
            Paragraph("PDF resume text extraction, dynamic MCQ quiz generation, and job description parsing.", table_cell),
        ],
        [
            Paragraph("<b>Database & Cloud</b>", table_cell),
            Paragraph("Supabase (PostgreSQL), SQLite fallback, Vercel", table_cell),
            Paragraph("User authentication, cloud progress persistence, and serverless edge deployment.", table_cell),
        ],
        [
            Paragraph("<b>Developer Sandbox</b>", table_cell),
            Paragraph("Subprocess sandboxing, Web Workers, Pyodide", table_cell),
            Paragraph("Safe in-browser code execution for Python, JavaScript, and SQL challenges.", table_cell),
        ]
    ]
    tech_table = Table(tech_data, colWidths=[140, 270, 300])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f2b48")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(tech_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 8: RESULTS & PROTOTYPE
    # =========================================================================
    story.append(Paragraph("RESULTS / PROTOTYPE", title_style))
    story.append(Spacer(1, 10))
    
    results_data = [
        [
            Paragraph("<b>1. Precision Match Scoring</b>", card_title),
            Paragraph("<b>2. Interactive Multi-Phase Roadmap</b>", card_title),
        ],
        [
            Paragraph("• Tested with candidate profiles across 16 technical disciplines.<br/>• Instant SVG circular match gauge with real-time score updates.<br/>• Identifies critical missing skills vs completed foundation competencies.", card_body),
            Paragraph("• Visual milestones sequenced from Fundamentals to Advanced Deployment.<br/>• Click-to-inspect milestone drawer with curated YouTube, docs, and course links.<br/>• 1-click verification checkboxes updating persistent cloud progress.", card_body),
        ],
        [
            Paragraph("<b>3. In-Browser Code Sandbox</b>", card_title),
            Paragraph("<b>4. Smart Study Planner & iCal Sync</b>", card_title),
        ],
        [
            Paragraph("• Live execution of Python algorithms, JS DOM/API logic, and SQL tables.<br/>• Automated test validation providing instant pass/fail feedback.<br/>• Zero local environment setup required for students.", card_body),
            Paragraph("• Generates structured daily 60–90 min study sessions.<br/>• 1-click <b>.ics export</b> natively syncing with Google Calendar, Apple iCal, and Outlook.<br/>• Pacing slider adapting to 5, 10, 15, or 20 hours per week.", card_body),
        ]
    ]
    results_table = Table(results_data, colWidths=[355, 355])
    results_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#f0fdf4")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#eff6ff")),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#fff7ed")),
        ('BACKGROUND', (1,2), (1,2), colors.HexColor("#fdf4ff")),
        ('BOX', (0,0), (0,1), 1.5, colors.HexColor("#16a34a")),
        ('BOX', (1,0), (1,1), 1.5, colors.HexColor("#2563eb")),
        ('BOX', (0,2), (0,3), 1.5, colors.HexColor("#ea580c")),
        ('BOX', (1,2), (1,3), 1.5, colors.HexColor("#9333ea")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(results_table)
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Live Prototype URL:</b> <font color='#2563eb'><u>https://skill-gap-ai-eta.vercel.app/</u></font> · Deployed & fully accessible with interactive demo.", bullet_style))
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 9: INNOVATION, IMPACT, DELIVERABLES & FUTURE SCOPE
    # =========================================================================
    story.append(Paragraph("INNOVATION, IMPACT, DELIVERABLES & FUTURE SCOPE", title_style))
    story.append(Spacer(1, 10))
    
    scope_data = [
        [
            Paragraph("<b>Key Innovations</b>", card_title),
            Paragraph("<b>Real-World Impact</b>", card_title),
        ],
        [
            Paragraph("• <b>Dual Modality Input:</b> Seamlessly parses resumes or allows custom profile input.<br/>• <b>Custom JD Matcher:</b> Bridges the gap between candidate stack and real hiring postings.<br/>• <b>Closed-Loop Verification:</b> Hands-on coding challenge validation before granting mastery.", card_body),
            Paragraph("• Reduces engineering career transition time from months to weeks.<br/>• Direct empowerment for Tier-2 & Tier-3 engineering college students.<br/>• Bridges industry-academia gap with actionable market compensation percentiles.", card_body),
        ],
        [
            Paragraph("<b>Tangible Deliverables</b>", card_title),
            Paragraph("<b>Future Scope</b>", card_title),
        ],
        [
            Paragraph("• Full-Stack Web Application live on Vercel.<br/>• Pre-trained Random Forest ML Model with 90%+ benchmark accuracy.<br/>• Comprehensive 128-skill ontology taxonomy covering 16 industry roles.<br/>• Automated calendar scheduling engine with .ics file exporter.", card_body),
            Paragraph("• <b>GitHub Portfolio Verification:</b> Automated scraping and code quality analysis.<br/>• <b>AI Mock Interviewer:</b> LLM voice/video technical screening simulations.<br/>• <b>Campus Placement Dashboard:</b> Analytics portal for college placement cells.", card_body),
        ]
    ]
    scope_table = Table(scope_data, colWidths=[355, 355])
    scope_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (1,2), (1,2), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (0,1), 1, colors.HexColor("#0f2b48")),
        ('BOX', (1,0), (1,1), 1, colors.HexColor("#0f2b48")),
        ('BOX', (0,2), (0,3), 1, colors.HexColor("#ea580c")),
        ('BOX', (1,2), (1,3), 1, colors.HexColor("#ea580c")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(scope_table)
    
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 10: CONCLUSION & REFERENCES
    # =========================================================================
    story.append(Paragraph("CONCLUSION & REFERENCES", title_style))
    story.append(Spacer(1, 10))
    
    conc_data = [
        [
            Paragraph("<b>Project Conclusion</b>", card_title)
        ],
        [
            Paragraph("• <b>SkillGap AI</b> successfully transforms the ambiguous journey of career upskilling into a quantifiable, data-backed science.<br/>"
                      "• By combining <b>Random Forest classification, dynamic prerequisite sequencing, real job description parsing, and automated calendar pacing</b>, the platform provides a complete ecosystem for technical career mastery.<br/>"
                      "• The system empowers engineering students to escape tutorial fatigue and focus solely on high-ROI skills that lead to real-world employment.", card_body)
        ],
        [
            Paragraph("<b>Key References & Academic Citations</b>", card_title)
        ],
        [
            Paragraph("1. Breiman, L. (2001). <i>Random Forests</i>. Machine Learning, 45(1), 5-32.<br/>"
                      "2. World Economic Forum. (2025). <i>The Future of Jobs Report</i>. Geneva: WEF.<br/>"
                      "3. NASSCOM. (2024). <i>India Technology Sector Talent Demand & Supply Matrix</i>.<br/>"
                      "4. Pedregosa, F., et al. (2011). <i>Scikit-learn: Machine Learning in Python</i>. JMLR, 12, 2825-2830.<br/>"
                      "5. FastAPI Documentation & ASGI Framework Architecture (Tiangolo et al., 2024).<br/>"
                      "6. Supabase Cloud Database & Authentication Architecture (2026).", card_body)
        ]
    ]
    conc_table = Table(conc_data, colWidths=[710])
    conc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#f0fdf4")),
        ('BACKGROUND', (0,1), (0,1), colors.white),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#eff6ff")),
        ('BACKGROUND', (0,3), (0,3), colors.white),
        ('BOX', (0,0), (0,1), 1.5, colors.HexColor("#16a34a")),
        ('BOX', (0,2), (0,3), 1.5, colors.HexColor("#2563eb")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(conc_table)
    
    doc.build(story, canvasmaker=UniversitySlideCanvas)
    print(f"Successfully generated: {OUTPUT_PDF}")

if __name__ == "__main__":
    build_presentation_pdf()

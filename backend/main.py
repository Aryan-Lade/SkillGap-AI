import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from routes import profile, skillgap, roadmap, roles, progress
except ImportError:
    from backend.routes import profile, skillgap, roadmap, roles, progress

app = FastAPI(
    title="SkillGap AI API",
    description="ML-powered personalized skill recommendation and roadmap system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix="/api")
app.include_router(skillgap.router, prefix="/api")
app.include_router(roadmap.router, prefix="/api")
app.include_router(roles.router, prefix="/api")
app.include_router(progress.router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SkillGap AI API"}


@app.get("/")
def root():
    return {"message": "SkillGap AI API — visit /docs for interactive API documentation"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

"""
FastAPI application entry point.
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import SessionLocal, engine
from .models import Base, WikiQuiz
from .scraper import scrape_wikipedia
from .llm import generate_all

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DeepKlarity AI Wiki Quiz Generator")

# ✅ CORS (MANDATORY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/generate")
def generate_quiz(url: str, db: Session = Depends(get_db)):
    """
    Generates or retrieves a quiz for a given Wikipedia URL.
    """
    try:
        quiz_record = db.query(WikiQuiz).filter(WikiQuiz.url == url).first()
        if quiz_record:
            return quiz_record

        scraped_content = scrape_wikipedia(url)
        llm_output = generate_all(scraped_content["content"])

        quiz_record = WikiQuiz(
            url=url,
            title=scraped_content["title"],
            summary=llm_output["summary"],
            key_entities=llm_output["key_entities"],
            sections=scraped_content["sections"],
            quiz=llm_output["quiz"],
            related_topics=llm_output["related_topics"],
            raw_html=scraped_content["html"]
        )

        db.add(quiz_record)
        db.commit()
        db.refresh(quiz_record)

        return quiz_record

    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    """
    Returns all generated quizzes.
    """
    return db.query(WikiQuiz).all()

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vector_db import collection
from skills import extract_skills
from ocr import extract_text_from_pdf
from database import insert_candidate, get_all_candidates
from s3 import upload_to_s3
import os
import uuid

app = FastAPI(title="Resume AI API", version="1.0.0")

# ✅ CORS — allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf"}


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/")
def home():
    return {"message": "Resume AI API is running", "version": "1.0.0"}


# ── Upload Resume ─────────────────────────────────────────────────────────────
@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    try:
        # ✅ Validate file type
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        # ✅ Save file locally
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # ✅ Extract text from PDF
        text = extract_text_from_pdf(file_path)
        if not text:
            raise HTTPException(status_code=422, detail="No text could be extracted from the PDF.")

        # ✅ Extract skills
        resume_skills = extract_skills(text)

        # ✅ Upload to S3
        s3_url = upload_to_s3(file_path, file.filename)

        # ✅ Store in PostgreSQL
        insert_candidate(
            name=os.path.splitext(file.filename)[0],
            filename=s3_url,
            skills=", ".join(resume_skills)
        )

        # ✅ Store in ChromaDB
        unique_id = str(uuid.uuid4())
        collection.add(
            documents=[text],
            ids=[unique_id],
            metadatas=[{
                "filename": file.filename,
                "skills": ", ".join(resume_skills)
            }]
        )

        return {
            "message": "Resume processed successfully",
            "file": file.filename,
            "skills": resume_skills,
            "s3_url": s3_url,
            "total_skills_found": len(resume_skills)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Match Resumes ─────────────────────────────────────────────────────────────
class MatchRequest(BaseModel):
    job_description: str
    n_results: int = 5


@app.post("/match")
def match_resumes(request: MatchRequest):
    try:
        job_skills = extract_skills(request.job_description)

        results = collection.query(
            query_texts=[request.job_description],
            n_results=request.n_results
        )

        if not results["ids"][0]:
            return {"results": [], "job_skills": job_skills}

        response = []
        for i in range(len(results["ids"][0])):
            resume_skills_raw = results["metadatas"][0][i].get("skills", "")
            resume_skills = [s.strip() for s in resume_skills_raw.split(",") if s.strip()]

            matched_skills = list(set(job_skills) & set(resume_skills))
            missing_skills = list(set(job_skills) - set(resume_skills))

            skill_score = len(matched_skills)
            similarity_score = (1 - results["distances"][0][i]) * 100
            final_score = min(round(similarity_score + (skill_score * 5), 2), 100)

            response.append({
                "id": results["ids"][0][i],
                "filename": results["metadatas"][0][i].get("filename", "Unknown"),
                "score": final_score,
                "similarity_score": round(similarity_score, 2),
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "all_resume_skills": resume_skills,
                "explanation": f"Matched {len(matched_skills)} of {len(job_skills)} required skills"
            })

        response.sort(key=lambda x: x["score"], reverse=True)

        return {
            "results": response,
            "job_skills": job_skills,
            "total_candidates_checked": len(response)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── List All Candidates ───────────────────────────────────────────────────────
@app.get("/candidates")
def list_candidates():
    try:
        candidates = get_all_candidates()
        return {"candidates": candidates, "total": len(candidates)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
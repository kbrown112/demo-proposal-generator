import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from src.proposal_generator.crew import ProposalCrew
from fastapi import File, UploadFile
import fitz

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

global rfp
rfp: str = ""

# generic proposal
@app.get("/proposal")
def get_proposal():
    crew_instance = ProposalCrew()
    result = crew_instance.crew().kickoff()
    return str(result)
    
# specify proposal topic and rfp
@app.post("/proposal", response_model=str)
def add_topic(topic: str):
    crew_instance = ProposalCrew()
    inputs = {"topic": topic, "rfp": rfp}

    result = crew_instance.crew().kickoff(inputs=inputs)
    return str(result)

# upload rfp
@app.post("/upload")
async def endpoint(file: UploadFile = File(...)):
    content = await file.read()
    if file.filename.lower().endswith(".pdf"):
        # Handle PDF files
        pdf_document = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            text += page.get_text() + "\n"  # Add newline between pages
        pdf_document.close()
        rfp = text

    print(rfp)
    return rfp

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
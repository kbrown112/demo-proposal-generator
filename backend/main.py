import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from src.proposal_generator.crew import ProposalCrew
from fastapi import File, UploadFile

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

rfp: str = ""

# generic proposal
@app.get("/proposal")
def get_proposal():
    crew_instance = ProposalCrew()
    result = crew_instance.crew().kickoff()
    return str(result)
    
# specify proposal
@app.post("/proposal", response_model=str)
def add_topic(topic: str):
    crew_instance = ProposalCrew()
    inputs = {"topic": topic, "rfp": rfp}
    result = crew_instance.crew().kickoff(inputs=inputs)
    return str(result)

@app.post("/upload")
async def endpoint(file: UploadFile = File(...)):
    content = await file.read()
    print(content)
    global rfp
    rfp = content.decode('utf-8')
    return rfp

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
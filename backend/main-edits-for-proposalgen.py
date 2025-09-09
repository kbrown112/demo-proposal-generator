import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# proposal topic
class ProposalTopic(BaseModel):
    topic: str

# proposal response
class ProposalResponse(BaseModel):
    response: str

app = FastAPI()

response = "this should be the crewai response"

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

@app.get("/proposal-response", response_model=ProposalResponse)
def get_proposal_response():
    return ProposalResponse(response=response)

@app.post("/proposal-topic", response_model=ProposalTopic)
def generate_proposal_from_topic(topic: ProposalTopic):
    return topic

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
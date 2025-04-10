from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai

app = FastAPI()

openai.api_key = "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"

class Query(BaseModel):
    query: str

@app.post("/diagnose")
async def diagnose_car(query: Query):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert car mechanic AI."},
            {"role": "user", "content": f"My car is having this issue: {query.query}"}
        ]
    )
    return {"answer": response.choices[0].message["content"]}

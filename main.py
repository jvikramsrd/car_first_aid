from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai

app = FastAPI()


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

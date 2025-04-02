import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

 Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

 Initialize FastAPI
app = FastAPI()

 Connect to MongoDB
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

 Define Pydantic Model
class CarIssue(BaseModel):
    issue: str
    solution: str

 Insert troubleshooting data into MongoDB
@app.post("/add_issue")
async def add_issue(car_issue: CarIssue):
    result = await collection.insert_one(car_issue.dict())
    return {"message": "Issue added successfully", "id": str(result.inserted_id)}

 Get solution from MongoDB
@app.get("/troubleshoot/{issue}")
async def get_solution(issue: str):
    result = await collection.find_one({"issue": issue.lower()})
    if result:
        return {"solution": result["solution"]}
    raise HTTPException(status_code=404, detail="Solution not found")

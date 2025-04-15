from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from groq import Groq
import re

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-learning-outcomes/")
async def generate_learning_outcomes(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    grade = data.get("grade")
    if not prompt or not grade:
        return {"error": "Missing prompt or grade"}
    try:
        response = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": f"Generate up to 5 learning outcome tags for a lesson plan on '{prompt}' for {grade} students. "
                          f"Each tag should be concise, containing 1-3 words. "
                          f"Return only the tags as a numbered list (e.g., 1. Tag1, 2. Tag2) without descriptions."
            }],
            model="llama-3.3-70b-versatile"
        )
        text = response.choices[0].message.content.strip()
        tags = re.findall(r'\d+\.\s*([^\n]+)', text)
        learning_outcomes = [tag.strip() for tag in tags[:5]]
        return {"learning_outcomes": learning_outcomes if learning_outcomes else ["No learning outcomes"]}
    except Exception as e:
        return {"error": f"Model error: {str(e)}"}

@app.post("/generate-disambiguation-tags/")
async def generate_disambiguation_tags(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    grade = data.get("grade")
    if not prompt or not grade:
        return {"error": "Missing prompt or grade"}
    try:
        response = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": f"Generate up to 5 disambiguation tags to better understand the topic of a lesson plan on '{prompt}' for {grade} students. "
                          f"Each tag should be concise, containing 1-3 words. "
                          f"Return only the tags as a numbered list (e.g., 1. Tag1, 2. Tag2) without descriptions."
            }],
            model="llama-3.3-70b-versatile"
        )
        text = response.choices[0].message.content.strip()
        tags = re.findall(r'\d+\.\s*([^\n]+)', text)
        disambiguation_tags = [tag.strip() for tag in tags[:5]]
        return {"disambiguation_tags": disambiguation_tags if disambiguation_tags else ["No disambiguation tags"]}
    except Exception as e:
        return {"error": f"Model error: {str(e)}"}

@app.post("/generate-lesson-plan/")
async def generate_lesson_plan(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    grade = data.get("grade")
    learning_outcomes = data.get("learning_outcomes", [])
    disambiguation_tags = data.get("disambiguation_tags", [])
    if not prompt or not grade:
        return {"error": "Missing prompt or grade"}
    try:
        response = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": f"Create a detailed lesson plan on '{prompt}' for {grade} students. Incorporate learning outcomes: {', '.join(learning_outcomes)} and disambiguation tags: {', '.join(disambiguation_tags)}."
            }],
            model="llama-3.3-70b-versatile"
        )
        return {"lesson_plan": response.choices[0].message.content if response.choices[0].message.content else "No lesson plan generated."}
    except Exception as e:
        return {"error": f"Model error: {str(e)}"}
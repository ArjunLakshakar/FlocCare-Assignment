import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv() 
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://arjunlakshkar1234:ArJuN963@cluster0.prqkuw4.mongodb.net/flocCare_Assignment?retryWrites=true&w=majority&appName=Cluster0") 
DB_NAME = os.getenv("DB_NAME", "blogdb")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
blogs_collection = db["blogs"]

# Use smaller model for Render free plan
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
generator = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_blog/")
async def generate_blog(request: Request):
    data = await request.json()
    topic = data.get("topic")
    
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")
    try:
        prompt = f"Write a detailed blog (~1000 words) on the topic: {topic}."
        result = generator(prompt, max_length=800, do_sample=True)
        generated_blog = result[0]["generated_text"]
        blog_doc = {
            "topic": topic,
            "blog": generated_blog,
            "created_at": datetime.utcnow()
        }
        blogs_collection.insert_one(blog_doc)
        return {"blog": generated_blog}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/blogs/")
async def get_blogs():
    blogs = []
    for blog in blogs_collection.find().sort("created_at", -1):
        blog["_id"] = str(blog["_id"])
        blogs.append(blog)
    return blogs

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=port)

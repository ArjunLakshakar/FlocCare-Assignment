# 📝 Blog Generator API

A FastAPI-based blog generation platform that uses HuggingFace Transformers to generate ~1000-word blogs from a given topic and stores them in MongoDB.

---

## 🚀 Features
- Generate long-form blogs using HuggingFace models (`flan-t5-small` recommended for Render free plan).
- Store and fetch blogs from MongoDB Atlas.
- CORS-enabled API for frontend integration.
- REST endpoints:
  - `POST /generate_blog/` → Generate and save a blog.
  - `GET /blogs/` → Fetch all blogs.

---

## ⚙️ Tech Stack
- **Backend:** FastAPI, Uvicorn
- **ML Model:** HuggingFace Transformers (`flan-t5-small` / `flan-t5-base`)
- **Database:** MongoDB (Atlas)
- **Hosting:** Vercel (frontend),Render (backend)

---

## 📦 Installation (Local Development)

### 🔹 Backend (FastAPI)
```bash
cd Backend

python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt
uvicorn main:app --reload


### 🔹 Frontend
npm install
npm run dev

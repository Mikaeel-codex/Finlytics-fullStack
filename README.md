Finlytics – Bank Statement Parser

Finlytics lets users upload bank statements (PDF, CSV, or image) and automatically extract and categorize transactions into:

💰 Money In

💸 Money Out

⚙️ Other (fees, bank charges, service charges, etc.)

🧩 Project Structure
Finlytics/
├── finlytics-backend/   # FastAPI backend
└── finlytics-frontend/  # React + Vite frontend

🚀 How to Run
1. Backend Setup (FastAPI)
cd finlytics-backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn pandas pdfplumber python-multipart
uvicorn main:app --reload


The backend runs on:
👉 http://127.0.0.1:8000

Swagger docs: http://127.0.0.1:8000/docs

2. Frontend Setup (Vite + React)

In a new terminal:

cd finlytics-frontend
npm install
npm run dev


Frontend runs on:
👉 http://127.0.0.1:5173

CORS is already configured, so it will connect to the backend automatically.

📄 Features

Upload and parse PDF, CSV, or image bank statements.

Automatically categorize transactions.

View, filter, and search transactions.

Download parsed results as a CSV file.

Simple onboarding and clean UI.

⚙️ API Endpoint

POST /upload
Upload a statement file (file field).
Returns categorized transactions.

Example:

{
  "count": 15,
  "moneyIn": [...],
  "moneyOut": [...],
  "other": [...],
  "raw": [...]
}

🧠 Common Issues

Parsed 0 transactions: PDF may be scanned (image-based). Use CSV or enable OCR.

CORS errors: Make sure backend is running on port 8000 before frontend.

Code not updating: Run backend with --reload.

🗂️ Folder Overview
Finlytics/
├── finlytics-backend/
│   └── main.py
└── finlytics-frontend/
    └── src/

👨‍💻 Quick Start Summary

Run backend → uvicorn main:app --reload

Run frontend → npm run dev

Open browser → http://127.0.0.1:5173

Upload a statement → See categorized results

Click “Download CSV” to export parsed data

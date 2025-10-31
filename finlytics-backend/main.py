# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import pdfplumber
import tempfile
import os
from typing import List, Dict, Any
import re

# ---- try to load OCR deps (optional) ----
OCR_AVAILABLE = False
try:
    import pytesseract
    from pdf2image import convert_from_path
    from PIL import Image
    import numpy as np
    import cv2  
    OCR_AVAILABLE = True
except Exception:
    OCR_AVAILABLE = False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# helpers
# -------------------------------------------------

FEE_WORDS = [
    "fee",
    "fees",
    "bank fee",
    "bank fees",
    "bank charge",
    "bank charges",
    "service charge",
    "service charges",
    "admin fee",
]


def categorize_from_cols(withdrawal: float | None, deposit: float | None, desc: str = "") -> str:
    low = desc.lower()
    if any(w in low for w in FEE_WORDS):
        return "Other"

    if deposit is not None and deposit != 0:
        return "Money In"
    if withdrawal is not None and withdrawal != 0:
        return "Money Out"
    return "Other"


def parse_amount(v: str | None) -> float | None:
    if v is None:
        return None
    v = v.strip().replace(",", "")
    if v in ("", "-"):
        return None
    try:
        return float(v)
    except ValueError:
        return None


# -------------------------------------------------
# CSV
# -------------------------------------------------
def parse_csv(tmp_path: str) -> List[Dict[str, Any]]:
    df = pd.read_csv(tmp_path)
    records = df.to_dict(orient="records")
    parsed: list[dict] = []

    for r in records:
        date = r.get("date") or r.get("Date")
        desc = (
            r.get("description")
            or r.get("Description")
            or r.get("details")
            or r.get("Details")
            or ""
        )
        amt_raw = (
            r.get("amount")
            or r.get("Amount")
            or r.get("Debit")
            or r.get("Credit")
        )
        amt = parse_amount(str(amt_raw)) if amt_raw is not None else None

        if any(w in desc.lower() for w in FEE_WORDS):
            cat = "Other"
        else:
            if amt is None:
                cat = "Other"
            elif amt > 0:
                cat = "Money In"
            elif amt < 0:
                cat = "Money Out"
            else:
                cat = "Other"

        parsed.append(
            {
                "date": date,
                "description": desc,
                "amount": amt,
                "category": cat,
            }
        )

    return parsed


# -------------------------------------------------
# image (PNG/JPG) – ONLY if OCR installed
# -------------------------------------------------
def parse_image(tmp_path: str) -> List[Dict[str, Any]]:
    if not OCR_AVAILABLE:
        return [{
            "date": None,
            "description": "Image uploaded but OCR not installed on server.",
            "amount": None,
            "category": "Other",
        }]

    img = cv2.imread(tmp_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(Image.fromarray(gray))
    return parse_text_lines(text.splitlines())


# -------------------------------------------------
# PDF
# -------------------------------------------------
DATE_PATTERNS = [
    r"^[A-Z][a-z]{2}\s+\d{1,2}$",          
    r"^\d{1,2}/\d{1,2}/\d{2,4}$",          
    r"^\d{4}-\d{2}-\d{2}$",                
]
date_regexes = [re.compile(p) for p in DATE_PATTERNS]


def looks_like_date(token: str) -> bool:
    token = token.strip()
    
    if re.match(r"^[A-Z][a-z]{2}$", token):
        return True
    
    if re.match(r"^[A-Z][a-z]{2,8}\s+\d{1,2}$", token):
        return True

    if re.match(r"^\d{1,2}\s+[A-Z][a-z]{2,8}$", token):
        return True

    if re.match(r"^\d{1,2}/\d{1,2}/\d{2,4}$", token):
        return True

    if re.match(r"^\d{4}-\d{2}-\d{2}$", token):
        return True

    return False


def extract_text_from_pdf(tmp_path: str) -> str:
    text = ""
    with pdfplumber.open(tmp_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"

    print("[PDF] text from pdfplumber:", len(text), "chars")

    if len(text.strip()) < 500 and OCR_AVAILABLE:
        print("[PDF] pdfplumber text too short, trying OCR fallback...")
        try:
            pages = convert_from_path(tmp_path)
            ocr_text = ""
            for p in pages:
                np_img = np.array(p)
                gray = cv2.cvtColor(np_img, cv2.COLOR_BGR2GRAY)
                ocr_text += pytesseract.image_to_string(Image.fromarray(gray)) + "\n"
            if len(ocr_text.strip()) > len(text.strip()):
                text = ocr_text
        except Exception as e:
            print("[PDF] OCR failed:", e)

    print("[PDF] first 300 chars:\n", text[:300])
    return text


def parse_text_lines(lines: list[str]) -> List[Dict[str, Any]]:
    """
    Parse extracted text lines into structured transactions.
    Uses positional parsing for Withdrawals/Deposits columns.
    """

    START_MARKERS = ["transaction", "transactions", "statement"]
    
    in_tx_table = False
    results: list[dict] = []
    
    # Column boundaries
    WITHDRAWAL_COL_START = 35
    WITHDRAWAL_COL_END = 55
    DEPOSIT_COL_START = 55
    DEPOSIT_COL_END = 75

    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        low = line.lower()
        
        if not in_tx_table:
            if any(m in low for m in START_MARKERS):
                in_tx_table = True
            continue

        if any(h in low for h in ["date", "details", "withdrawals", "deposits", "balance", "opening", "closing"]):
            continue

        parts = line.split()
        if len(parts) < 3:
            continue
            
        if not re.match(r"^[A-Z][a-z]{2}$", parts[0]):
            continue

        if not re.match(r"^\d{1,2}$", parts[1]):
            continue

        date = f"{parts[0]} {parts[1]}"
        
        amounts_with_pos = []
        
        line_cleaned = line
        line_cleaned = re.sub(r'(\d)\.(\d{3})\.(\d{2})', r'\1\2.\3', line_cleaned)
        
        for match in re.finditer(r"\d[\d,]*\.\d{2}", line_cleaned):
            amount_str = match.group()
            position = match.start()
            amounts_with_pos.append((position, parse_amount(amount_str)))
        
        if len(amounts_with_pos) < 1:
            continue
        
        first_amount_pos = amounts_with_pos[0][0]
        desc_text = line_cleaned[len(date):first_amount_pos].strip()
        
        if "Deposit" in desc_text or "Insurance" in desc_text:
            print(f"DEBUG LINE: {repr(line)}")
            print(f"  cleaned: {repr(line_cleaned)}")
            print(f"  amounts_with_pos: {amounts_with_pos}")
            print(f"  desc_text: {desc_text}")
        
        withdrawal = None
        deposit = None
        balance = None
        
        if len(amounts_with_pos) >= 1:
            balance = amounts_with_pos[-1][1]
        
        if len(amounts_with_pos) == 2:
            amount_val = amounts_with_pos[0][1]
            amount_pos = amounts_with_pos[0][0]
            
            if amount_pos < 55:
                withdrawal = amount_val
            else:
                deposit = amount_val
                
        elif len(amounts_with_pos) == 3:
            withdrawal = amounts_with_pos[0][1]
            deposit = amounts_with_pos[1][1]
        
        desc_lower = desc_text.lower()
        if withdrawal and any(w in desc_lower for w in ["deposit", "payroll", "transfer", "credit"]):
            deposit = withdrawal
            withdrawal = None
        
        if any(w in desc_text.lower() for w in FEE_WORDS):
            category = "Other"
        elif deposit is not None and deposit != 0:
            category = "Money In"
        elif withdrawal is not None and withdrawal != 0:
            category = "Money Out"
        else:
            category = "Other"

        tx = {
            "date": date,
            "description": desc_text,
            "withdrawal": withdrawal,
            "deposit": deposit,
            "balance": balance,
            "category": category,
        }
        results.append(tx)

    print(f"[PARSED] Found {len(results)} transactions")
    return results


def parse_pdf(tmp_path: str) -> List[Dict[str, Any]]:
    text = extract_text_from_pdf(tmp_path)
    raw_lines = text.splitlines()

    print("------ RAW LINES (first 50) ------")
    for i, l in enumerate(raw_lines[:50]):
        print(f"{i}: {repr(l)}")

    cleaned = []
    for line in raw_lines:
        l = line.strip()
        if l:
            cleaned.append(l)

    return parse_text_lines(cleaned)


# -------------------------------------------------
# API
# -------------------------------------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        if suffix == ".csv":
            transactions = parse_csv(tmp_path)
        elif suffix == ".pdf":
            transactions = parse_pdf(tmp_path)
        elif suffix in (".png", ".jpg", ".jpeg"):
            transactions = parse_image(tmp_path)
        else:
            raise HTTPException(status_code=415, detail="File type not supported yet")

        money_in = [t for t in transactions if t["category"] == "Money In"]
        money_out = [t for t in transactions if t["category"] == "Money Out"]
        other = [t for t in transactions if t["category"] == "Other"]

        return {
            "count": len(transactions),
            "moneyIn": money_in,
            "moneyOut": money_out,
            "other": other,
            "raw": transactions,
            "ocrEnabled": OCR_AVAILABLE,
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.get("/")
def root():
    return {"status": "ok", "message": "Finlytics parser API"}
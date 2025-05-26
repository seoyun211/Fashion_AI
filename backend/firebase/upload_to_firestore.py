import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os
from dotenv import load_dotenv

# 🔐 .env 파일 로드
load_dotenv()

KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
CSV_PATH = os.getenv("CSV_PATH")

cred = credentials.Certificate(KEY_PATH)
firebase_admin.initialize_app(cred)
db = firestore.client()

df = pd.read_csv(CSV_PATH)

for _, row in df.iterrows():
    doc = {
        "name": row["상품명"],
        "price": int(row["가격"]),
        "like": int(row["좋아요"]),
        "review": int(row["리뷰"]),
        "trend_score": float(row["trend_score"]),
        "url": row["URL"]
    }
    db.collection("musinsa_trend").add(doc)

print("✅ Firestore 업로드 완료!")


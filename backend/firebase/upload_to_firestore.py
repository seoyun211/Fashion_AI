import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os
import glob
from dotenv import load_dotenv

# .env 불러오기
load_dotenv()
KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
CSV_FOLDER = os.getenv("DATA_PATH")

# ✅ Firebase 초기화
if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# 🔍 CSV 병합
csv_files = glob.glob(os.path.join(CSV_FOLDER, "*.csv"))
print(f"🔍 총 {len(csv_files)}개의 CSV 파일을 찾았어요.")

df_list = [pd.read_csv(file, quotechar='"') for file in csv_files if os.path.getsize(file) > 0]
merged_df = pd.concat(df_list, ignore_index=True)
print(f"📊 병합된 데이터 총 {len(merged_df)}개 항목")

# 🔁 업로드
upload_count = 0
for _, row in merged_df.iterrows():
    try:
        # 가격 처리
        price_raw = str(row["가격"]).replace(",", "").replace("원", "").replace('"', '').strip()
        price = int(float(price_raw) * 1000) if "." in price_raw else int(price_raw)

        # 리뷰수, 판매량 처리
        reviews_raw = row["리뷰수"]
        sales_raw = row["판매량"]

        reviews = int(float(str(reviews_raw).replace(",", "").strip())) if pd.notna(reviews_raw) else 0
        sales = int(float(str(sales_raw).replace(",", "").strip())) if pd.notna(sales_raw) else 0

        rating = float(row["별점(5점)"]) if pd.notna(row["별점(5점)"]) else 0.0
        style = row["스타일"] if pd.notna(row["스타일"]) else "미지정"
        category = row["분류"] if pd.notna(row["분류"]) else "기타"

        # ✅ 중복 검사 수정 (positional arguments로 변경!)
        existing_docs = db.collection("products") \
            .where("product_name", "==", row["상품명"]) \
            .where("shop_name", "==", row["쇼핑몰"]) \
            .limit(1) \
            .stream()

        doc_data = {
            "product_name": row["상품명"],
            "price": price,
            "shop_name": row["쇼핑몰"],
            "rating": rating,
            "image_url": row["이미지"],
            "reviews": reviews,
            "style": style,
            "category": category,
            "sales": sales,
        }

        existing_docs = list(existing_docs)
        if existing_docs:
            # 🔁 기존 문서 → 덮어쓰기 (created_at 유지)
            existing_docs[0].reference.set(doc_data, merge=True)
        else:
            # 🆕 새로운 문서 → created_at 포함 추가
            doc_data["created_at"] = firestore.SERVER_TIMESTAMP
            db.collection("products").add(doc_data)

        upload_count += 1

    except Exception as e:
        print(f"❌ 오류 (상품명: {row.get('상품명', '알 수 없음')}): {e}")

print(f"✅ Firestore 업로드 완료! 총 {upload_count}개 상품 등록됨.")



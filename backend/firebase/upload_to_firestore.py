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

# ✅ 🔥 컬렉션 초기화 함수 위치 (💡 여기에 넣기!)
def clear_products_collection():
    docs = db.collection("products").stream()
    for doc in docs:
        doc.reference.delete()
    print("🧹 기존 products 컬렉션 전체 삭제 완료!")

clear_products_collection()

## CSV 병합
csv_files = glob.glob(os.path.join(CSV_FOLDER, "*.csv"))
print(f"🔍 총 {len(csv_files)}개의 CSV 파일을 찾았어요.")

df_list = [pd.read_csv(file) for file in csv_files]
merged_df = pd.concat(df_list, ignore_index=True)
print(f"📊 병합된 데이터 총 {len(merged_df)}개 항목")

# 업로드
upload_count = 0
for _, row in merged_df.iterrows():
    try:
        # 가격 처리
        price_raw = str(row["가격"]).replace(",", "").replace("원", "").strip()
        if '.' in price_raw:
            price = int(float(price_raw) * 1000)
        else:
            price = int(price_raw)

        # 리뷰수, 판매량 처리
        reviews_raw = str(row["리뷰수"]).replace(",", "").strip()
        sales_raw = str(row["판매량"]).replace(",", "").strip()

        reviews = int(float(reviews_raw)) if reviews_raw else 0
        sales = int(float(sales_raw)) if sales_raw else 0

        doc = {
            "product_name": row["상품명"],
            "price": price,
            "shop_name": row["쇼핑몰"],
            "rating": float(row["별점(5점)"]),
            "image_url": row["이미지"],
            "reviews": reviews,
            "style": row["스타일"] if pd.notna(row["스타일"]) else "미지정",
            "category": row["분류"] if pd.notna(row["분류"]) else "기타",
            "sales": sales,
            "created_at": firestore.SERVER_TIMESTAMP
        }

        db.collection("products").add(doc)
        upload_count += 1

    except Exception as e:
        print(f"❌ 오류 (상품명: {row.get('상품명', '알 수 없음')}): {e}")

print(f"✅ Firestore 업로드 완료! 총 {upload_count}개 상품 등록됨.")
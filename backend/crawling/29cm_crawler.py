import requests
from bs4 import BeautifulSoup
import pandas as pd
import os

url = "https://www.29cm.co.kr/search/shop_goods?category=1170010"  # 예: 여성 의류
headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

items = soup.select("li.list_item")

results = []
for item in items[:10]:
    try:
        name = item.select_one("p.tit").text.strip()
        price = item.select_one("span.price").text.strip().replace(",", "").replace("원", "")
        img = item.select_one("img")["src"]
        url = item.select_one("a")["href"]

        results.append({
            "상품명": name,
            "가격": int(price),
            "URL": url,
            "이미지": img
        })
        print(f"✅ {name} 크롤링 완료")
    except Exception as e:
        print(f"❌ 크롤링 실패: {e}")

os.makedirs("../data", exist_ok=True)
df = pd.DataFrame(results)
df.to_csv("../data/29cm_trend.csv", index=False, encoding="utf-8-sig")
print("🎉 29CM 크롤링 완료!")

import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

# 저장 경로 지정
save_path = 'backend/data'
os.makedirs(save_path, exist_ok=True)

# 스타일 데이터 정의
styles = ['캐주얼', '스트릿', '미니멀', '러블리', '빈티지', '스포티', '클래식', '모던']
materials = ['면', '린넨', '데님', '실크', '니트', '폴리에스터', '울', '레이온']
colors = ['블랙', '화이트', '네이비', '베이지', '그레이', '브라운', '카키', '레드', '블루']
categories = ['상의', '하의', '원피스', '아우터']
seasons = ['봄', '여름', '가을', '겨울', '사계절']

# 쇼핑몰별 특성 정의
shops = {
    '무신사': {'price_range': (30000, 300000), 'likes_range': (500, 5000)},
    '지그재그': {'price_range': (20000, 150000), 'likes_range': (100, 2000)},
    '더블유컨셉': {'price_range': (50000, 400000), 'likes_range': (200, 3000)},
    '29CM': {'price_range': (40000, 350000), 'likes_range': (300, 4000)}
}

def generate_product_name():
    adj = ['오버핏', '슬림핏', '베이직', '프리미엄', '빈티지', '클래식', '트렌디']
    items = {
        '상의': ['티셔츠', '셔츠', '블라우스', '니트', '맨투맨', '후드'],
        '하의': ['청바지', '슬랙스', '면바지', '스커트', '숏팬츠', '와이드팬츠'],
        '원피스': ['미니 원피스', '미디 원피스', '맥시 원피스', '셔츠 원피스'],
        '아우터': ['자켓', '코트', '패딩', '가디건', '블레이저', '점퍼']
    }
    category = np.random.choice(list(categories))
    return f"{np.random.choice(adj)} {np.random.choice(items[category])}"

def generate_dummy_data(shop_name, num_products=50):
    shop_info = shops[shop_name]
    data = []
    
    # 현재 날짜 기준 최근 30일 데이터
    base_date = datetime.now()
    
    for _ in range(num_products):
        category = np.random.choice(categories)
        price = np.random.randint(shop_info['price_range'][0], shop_info['price_range'][1])
        # 1000 단위로 반올림
        price = round(price, -3)
        
        # 시간에 따른 판매량과 재고량 변화 생성
        daily_sales = []
        daily_stock = []
        initial_stock = np.random.randint(50, 200)
        
        for day in range(30):
            date = base_date - timedelta(days=day)
            daily_sale = np.random.randint(0, 10)
            initial_stock = max(0, initial_stock - daily_sale)
            
            daily_sales.append(daily_sale)
            daily_stock.append(initial_stock)
        
        product = {
            '상품명': generate_product_name(),
            '가격': f"{price:,}",
            '쇼핑몰': shop_name,
            '좋아요개수': str(np.random.randint(shop_info['likes_range'][0], shop_info['likes_range'][1])),
            '이미지': f"https://example.com/{shop_name.lower()}/image{_}.jpg",
            '리뷰수': str(np.random.randint(50, 1000)),
            '스타일': np.random.choice(styles),
            '카테고리': category,
            '소재': np.random.choice(materials),
            '색상': np.random.choice(colors),
            '시즌': np.random.choice(seasons),
            '일일판매량': daily_sales,
            '일일재고량': daily_stock,
            '출시일': (base_date - timedelta(days=np.random.randint(0, 90))).strftime('%Y-%m-%d')
        }
        data.append(product)
    
    return data

# 각 쇼핑몰별 데이터 생성 및 저장
for shop_name in shops.keys():
    shop_data = generate_dummy_data(shop_name)
    df = pd.DataFrame(shop_data)
    
    # 기본 정보 CSV
    basic_cols = ['상품명', '가격', '쇼핑몰', '좋아요개수', '이미지', '리뷰수', '스타일', 
                  '카테고리', '소재', '색상', '시즌', '출시일']
    df[basic_cols].to_csv(f'{save_path}/{shop_name.lower()}_products.csv', 
                         index=False, encoding='utf-8-sig')
    
    # 판매/재고 데이터 CSV (시계열 데이터)
    time_series_data = []
    for _, row in df.iterrows():
        for day in range(30):
            date = datetime.now() - timedelta(days=day)
            time_series_data.append({
                '상품명': row['상품명'],
                '날짜': date.strftime('%Y-%m-%d'),
                '판매량': row['일일판매량'][day],
                '재고량': row['일일재고량'][day]
            })
    
    pd.DataFrame(time_series_data).to_csv(
        f'{save_path}/{shop_name.lower()}_time_series.csv',
        index=False, encoding='utf-8-sig'
    )

print("테스트 데이터 생성이 완료되었습니다.")
print("생성된 파일:")
print("1. [쇼핑몰명]_products.csv - 상품 기본 정보")
print("2. [쇼핑몰명]_time_series.csv - 판매/재고 시계열 데이터")

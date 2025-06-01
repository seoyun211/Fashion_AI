import pandas as pd
import os

# 저장 경로 지정
save_path = 'backend/data'
os.makedirs(save_path, exist_ok=True)

# 공통 컬럼 정의
columns = ['상품명', '가격', '쇼핑몰', '좋아요개수', '이미지', '리뷰수', '스타일']

# 더미 데이터 예시
zigzag_data = [
    ['여름 린넨 셔츠', '29,000', '지그재그', '1200', 'https://example.com/image1.jpg', '245', '캐주얼'],
    ['플라워 블라우스', '35,000', '지그재그', '980', 'https://example.com/image2.jpg', '190', '러블리']
]

wconcept_data = [
    ['루즈핏 반팔티', '19,800', '에이블리', '2200', 'https://example.com/image3.jpg', '312', '스트릿'],
    ['크롭 니트 탑', '25,900', '에이블리', '1500', 'https://example.com/image4.jpg', '281', '섹시']
]

cm29_data = [
    ['모던 체크 셔츠', '49,000', '29CM', '870', 'https://example.com/image5.jpg', '110', '댄디'],
    ['슬리브리스 탑', '39,000', '29CM', '645', 'https://example.com/image6.jpg', '95', '미니멀']
]

# DataFrame 생성 및 저장
pd.DataFrame(zigzag_data, columns=columns).to_csv(f'{save_path}/zigzag.csv', index=False, encoding='utf-8-sig')
pd.DataFrame(wconcept_data, columns=columns).to_csv(f'{save_path}/wconcept.csv', index=False, encoding='utf-8-sig')
pd.DataFrame(cm29_data, columns=columns).to_csv(f'{save_path}/29cm.csv', index=False, encoding='utf-8-sig')

print("3개의 CSV 파일이 성공적으로 생성되었습니다.")

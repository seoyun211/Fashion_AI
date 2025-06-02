import pandas as pd
from ..firebase.firebase_admin import FirebaseAdmin

def migrate_data_to_firebase():
    """CSV 데이터를 Firebase로 마이그레이션"""
    firebase = FirebaseAdmin()
    shops = ['무신사', '지그재그', '더블유컨셉', '29cm']
    
    for shop in shops:
        # 상품 데이터 마이그레이션
        products_file = f'backend/data/{shop.lower()}_products.csv'
        time_series_file = f'backend/data/{shop.lower()}_time_series.csv'
        
        try:
            # 상품 데이터 로드 및 저장
            products_df = pd.read_csv(products_file)
            products_data = products_df.to_dict('records')
            firebase.save_products_data(shop, products_data)
            print(f"{shop} 상품 데이터 마이그레이션 완료")
            
            # 시계열 데이터 로드 및 저장
            time_series_df = pd.read_csv(time_series_file)
            time_series_data = time_series_df.to_dict('records')
            firebase.save_time_series_data(shop, time_series_data)
            print(f"{shop} 시계열 데이터 마이그레이션 완료")
            
        except Exception as e:
            print(f"{shop} 데이터 마이그레이션 중 오류 발생: {str(e)}")

if __name__ == "__main__":
    migrate_data_to_firebase()
    print("데이터 마이그레이션이 완료되었습니다.") 
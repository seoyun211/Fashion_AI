import firebase_admin
from firebase_admin import credentials, firestore
import os

class FirebaseAdmin:
    def __init__(self):
        # Firebase 초기화
        if not firebase_admin._apps:
            cred = credentials.Certificate('C:/Users/dlaxo/Downloads/fashion-ai-f0e5e-firebase-adminsdk-fbsvc-702425b148.json')
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()

    def save_products_data(self, shop_name, products_data):
        """상품 데이터를 Firestore에 저장"""
        batch = self.db.batch()
        products_ref = self.db.collection('products')
        
        for product in products_data:
            doc_ref = products_ref.document()
            batch.set(doc_ref, {
                'shop_name': shop_name,
                'product_name': product['상품명'],
                'price': int(product['가격'].replace(',', '')),
                'likes': int(product['좋아요개수']),
                'reviews': int(product['리뷰수']),
                'style': product['스타일'],
                'category': product['카테고리'],
                'material': product['소재'],
                'color': product['색상'],
                'season': product['시즌'],
                'image_url': product['이미지'],
                'created_at': firestore.SERVER_TIMESTAMP
            })
        
        batch.commit()

    def save_time_series_data(self, shop_name, time_series_data):
        """시계열 데이터를 Firestore에 저장"""
        batch = self.db.batch()
        sales_ref = self.db.collection('sales_data')
        
        for data in time_series_data:
            doc_ref = sales_ref.document()
            batch.set(doc_ref, {
                'shop_name': shop_name,
                'product_name': data['상품명'],
                'date': data['날짜'],
                'sales': data['판매량'],
                'stock': data['재고량'],
                'created_at': firestore.SERVER_TIMESTAMP
            })
        
        batch.commit()

    def get_products_by_shop(self, shop_name):
        """특정 쇼핑몰의 상품 데이터 조회"""
        products = self.db.collection('products').where('shop_name', '==', shop_name).stream()
        return [product.to_dict() for product in products]

    def get_trending_products(self, limit=10):
        """인기 상품 조회"""
        products = self.db.collection('products').order_by('likes', direction=firestore.Query.DESCENDING).limit(limit).stream()
        return [product.to_dict() for product in products]

    def get_sales_data_by_date_range(self, start_date, end_date):
        """특정 기간의 판매 데이터 조회"""
        sales = self.db.collection('sales_data')\
            .where('date', '>=', start_date)\
            .where('date', '<=', end_date)\
            .stream()
        return [sale.to_dict() for sale in sales] 
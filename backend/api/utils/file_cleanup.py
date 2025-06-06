import os
import time
from datetime import datetime, timedelta
import threading
import logging

logger = logging.getLogger(__name__)

class TempFileManager:
    def __init__(self, temp_dir: str = "temp", max_age_minutes: int = 30):
        """임시 파일 관리자 초기화
        
        Args:
            temp_dir: 임시 파일 디렉토리 경로
            max_age_minutes: 파일의 최대 보관 시간(분)
        """
        self.temp_dir = temp_dir
        self.max_age_minutes = max_age_minutes
        self._stop_flag = False
        
        # 임시 디렉토리 생성
        os.makedirs(temp_dir, exist_ok=True)
        
        # 정리 스레드 시작
        self._cleanup_thread = threading.Thread(target=self._cleanup_loop, daemon=True)
        self._cleanup_thread.start()
    
    def _cleanup_loop(self):
        """주기적으로 오래된 파일들을 정리하는 루프"""
        while not self._stop_flag:
            try:
                self.cleanup_old_files()
            except Exception as e:
                logger.error(f"파일 정리 중 오류 발생: {e}")
            time.sleep(300)  # 5분마다 실행
    
    def cleanup_old_files(self):
        """max_age_minutes보다 오래된 파일들을 삭제"""
        now = datetime.now()
        count = 0
        
        for filename in os.listdir(self.temp_dir):
            file_path = os.path.join(self.temp_dir, filename)
            if not os.path.isfile(file_path):
                continue
                
            # 파일의 수정 시간 확인
            mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
            age = now - mtime
            
            # 오래된 파일 삭제
            if age > timedelta(minutes=self.max_age_minutes):
                try:
                    os.remove(file_path)
                    count += 1
                except Exception as e:
                    logger.error(f"파일 삭제 중 오류 발생 ({file_path}): {e}")
        
        if count > 0:
            logger.info(f"{count}개의 임시 파일이 정리되었습니다.")
    
    def stop(self):
        """정리 스레드 중지"""
        self._stop_flag = True
        self._cleanup_thread.join()

# 전역 인스턴스 생성
temp_manager = TempFileManager() 
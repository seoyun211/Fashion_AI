from typing import Any, Dict
from datetime import datetime, timedelta

class SimpleCache:
    """간단한 인메모리 캐시 구현"""
    def __init__(self, ttl_seconds: int = 300):  # 기본 TTL 5분
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.ttl_seconds = ttl_seconds

    def get(self, key: str) -> Any:
        """캐시에서 값을 가져옵니다."""
        if key in self._cache:
            cache_data = self._cache[key]
            if datetime.now() < cache_data["expires_at"]:
                return cache_data["value"]
            else:
                del self._cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        """캐시에 값을 저장합니다."""
        self._cache[key] = {
            "value": value,
            "expires_at": datetime.now() + timedelta(seconds=self.ttl_seconds)
        }

    def clear(self) -> None:
        """캐시를 비웁니다."""
        self._cache.clear()

# 전역 캐시 인스턴스 생성
cache = SimpleCache() 
# 05 — Rate Limiting: In-Memory Ceiling vs. Heavy Infrastructure

**Rung áp dụng: Rung 3 (Stdlib) & Rung 7 (Deliberate Shortcut & Ceiling)**

> _"Sử dụng In-Memory Token Bucket cho micro-task đơn lẻ kèm chú thích ceiling & upgrade trigger, thay vì bắt buộc dựng Redis cluster."_

---

## Bài toán

User yêu cầu: **"Thêm rate limit cho endpoint `/api/v1/auth/login` để chặn kẻ gian brute force mật khẩu (tối đa 5 lần thử trong 1 phút)."**

---

## ❌ Before — AI Over-Engineered (~160 dòng + Redis cluster)

AI tự phỏng đoán rằng mọi rate limiter đều phải sẵn sàng cho kiến trúc phân tán đa vùng:

```bash
pip install redis aioredis
```

```python
# rate_limiter.py (~120 dòng)
import redis.asyncio as redis
from fastapi import HTTPException, Request, status
import time

class DistributedRedisRateLimiter:
    def __init__(self, redis_url: str = "redis://localhost:6379/0"):
        self.redis_url = redis_url
        self.pool = None

    async def init_pool(self):
        self.pool = redis.ConnectionPool.from_url(
            self.redis_url, max_connections=20, timeout=2.0
        )

    async def is_rate_limited(self, key: str, max_requests: int, window: int) -> bool:
        if not self.pool:
            await self.init_pool()
        r = redis.Redis(connection_pool=self.pool)
        current = int(time.time())
        pipeline = r.pipeline()
        pipeline.zremrangebyscore(key, 0, current - window)
        pipeline.zadd(key, {str(current): current})
        pipeline.zcard(key)
        pipeline.expire(key, window)
        results = await pipeline.execute()
        return results[2] > max_requests

# ... Thêm docker-compose.yml có Redis container, healthcheck, và các file env cấu hình Redis URL
```

**Hậu quả:**

- Dự án nhỏ/vừa bị ép phải chạy kèm daemon Redis, cấu hình Docker Compose phức tạp chỉ vì 1 API login.
- Thêm điểm gãy (single point of failure) khi Redis connection timeout.

---

## ✅ After — The Ladder / Ponytail (18 dòng, 0 dependencies)

Sử dụng thư viện chuẩn của Python (`collections.defaultdict`, `time`) và ghi chú rõ ràng giới hạn và điều kiện nâng cấp bằng comment `# ponytail:`:

```python
# auth_limiter.py (18 dòng)
import time
from collections import defaultdict
from fastapi import HTTPException, status

# ponytail: in-memory token bucket, switch to redis cluster when running >1 replica
_attempts: dict[str, list[float]] = defaultdict(list)

def check_login_rate_limit(ip: str, max_attempts: int = 5, window_sec: int = 60) -> None:
    now = time.monotonic()
    # Giữ lại các lần thử trong cửa sổ thời gian
    _attempts[ip] = [t for t in _attempts[ip] if now - t < window_sec]
    if len(_attempts[ip]) >= max_attempts:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút."
        )
    _attempts[ip].append(now)
```

---

## 📊 So sánh

| Tiêu chí                 | ❌ Before (Redis Infrastructure)    | ✅ After (In-Memory Deliberate Ceiling) |
| :----------------------- | :---------------------------------- | :-------------------------------------- |
| **Hạ tầng yêu cầu**      | Cần Redis Server, Docker, Port 6379 | **Không có hạ tầng phụ**                |
| **Dependencies**         | `redis`, `aioredis`                 | **0** (Python `time`, `collections`)    |
| **Số dòng mã**           | ~160 dòng + Docker Compose          | **18 dòng**                             |
| **Quản trị nợ kỹ thuật** | Ẩn giấu sự cồng kềnh                | Minh bạch qua `# ponytail:` comment     |

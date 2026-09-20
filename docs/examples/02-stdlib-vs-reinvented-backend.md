# 02 — Stdlib vs. Self-Reinvented Backend

**Rung áp dụng: Rung 3 — Standard Library**

> _"Dùng `functools.lru_cache` / `@lru_cache` thay vì tự viết cache class."_

---

## Bài toán

User yêu cầu: **"Cache kết quả gọi API config để không phải fetch mỗi request."**

---

## ❌ Before — AI Over-Engineered (~80 dòng)

```python
# cache.py (~80 dòng)
import time
from typing import Any, Optional, Dict
from threading import Lock

class TTLCache:
    """A thread-safe dictionary-based TTL cache."""

    def __init__(self, ttl_seconds: int = 300, max_size: int = 1000):
        self._store: Dict[str, tuple[Any, float]] = {}
        self._ttl = ttl_seconds
        self._max_size = max_size
        self._lock = Lock()
        self._hits = 0
        self._misses = 0

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            if key in self._store:
                value, expiry = self._store[key]
                if time.monotonic() < expiry:
                    self._hits += 1
                    return value
                del self._store[key]
            self._misses += 1
            return None

    def set(self, key: str, value: Any) -> None:
        with self._lock:
            if len(self._store) >= self._max_size:
                # Evict oldest
                oldest = min(self._store, key=lambda k: self._store[k][1])
                del self._store[oldest]
            self._store[key] = (value, time.monotonic() + self._ttl)

    def invalidate(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)

    def stats(self) -> dict:
        return {"hits": self._hits, "misses": self._misses}

# config_service.py (sử dụng TTLCache)
_cache = TTLCache(ttl_seconds=300)

def get_config(key: str) -> dict:
    cached = _cache.get(key)
    if cached is not None:
        return cached
    result = fetch_config_from_api(key)
    _cache.set(key, result)
    return result
```

**Tổng: ~80 dòng, tự reinvent wheel có bugs tiềm ẩn (eviction policy, thread safety edge cases)**

---

## ✅ After — Ponytail (~3 dòng)

```python
from functools import lru_cache

@lru_cache(maxsize=256)
def get_config(key: str) -> dict:
    return fetch_config_from_api(key)
```

Nếu cần TTL (stdlib `cachetools` nếu đã install, hoặc):

```python
# ponytail: lru_cache, add TTL via cachetools if cache staleness becomes an issue
from functools import lru_cache

@lru_cache(maxsize=256)
def get_config(key: str) -> dict:
    return fetch_config_from_api(key)
```

**Tổng: 3 dòng. Thread-safe. Tested bởi Python core team.**

---

## Các ví dụ stdlib khác hay bị reinvent

| Reinvented              | Stdlib thay thế                                        |
| ----------------------- | ------------------------------------------------------ |
| Custom retry decorator  | `tenacity` (nếu đã install) hoặc vòng lặp đơn giản     |
| Email validator 30 dòng | `"@" in email` + confirmation email là validation thật |
| UUID generator class    | `import uuid; uuid.uuid4()`                            |
| JSON serializer class   | `json.dumps()`                                         |
| Date formatter 40 dòng  | `Intl.DateTimeFormat` (JS) / `strftime` (Python)       |
| HTTP retry logic        | `requests.Session` với `HTTPAdapter` + `Retry`         |

---

## Phân tích

|               | Before                  | After       |
| ------------- | ----------------------- | ----------- |
| LOC           | ~80                     | ~3          |
| Bugs tiềm ẩn  | Eviction, thread-safety | 0 (stdlib)  |
| Test coverage | Tự viết                 | Python core |
| Maintenance   | Owner                   | Python team |

**Rung thang**: Rung 3 (Stdlib) → `functools.lru_cache` có trong Python 3.2+.

**Khi nào nên viết custom cache?** Khi cần distributed cache (Redis), TTL với invalidation events, hoặc LRU với hit-rate monitoring ở production scale.

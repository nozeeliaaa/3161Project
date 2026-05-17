import time
from functools import wraps


_cache = {}


def ttl_cache(seconds=60):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = (func.__name__, args, tuple(sorted(kwargs.items())))
            cached = _cache.get(key)
            now = time.time()

            if cached and cached["expires_at"] > now:
                return cached["value"]

            value = func(*args, **kwargs)
            _cache[key] = {
                "value": value,
                "expires_at": now + seconds,
            }
            return value

        return wrapper

    return decorator

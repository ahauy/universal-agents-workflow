# 04 — Debounce Search Input: Native vs. Lodash Dependency

**Rung áp dụng: Rung 3 (Language Feature) & Rung 5 (Zero New Dependencies)**

> _"Sử dụng closure / standard timer thay vì kéo thêm `lodash` hoặc `lodash.debounce`."_

---

## Bài toán

User yêu cầu: **"Debounce ô tìm kiếm sản phẩm để không gửi request lên server liên tục sau mỗi ký tự người dùng gõ."**

---

## ❌ Before — AI Over-Engineered (~85 dòng + 2 dependencies)

AI thường ngay lập tức đề xuất cài đặt thư viện:

```bash
npm install lodash @types/lodash
```

Và viết một custom hook phức tạp với quản lý bộ nhớ, flush, cancel:

```tsx
// useDebounce.ts (~55 dòng)
import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  wait: number = 300,
  options?: DebounceOptions,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedCallback = useMemo(() => {
    const func = (...args: Parameters<T>) => {
      return callbackRef.current(...args);
    };
    return debounce(func, wait, options);
  }, [wait, options]);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}

// SearchBar.tsx (~30 dòng)
// Sử dụng useDebounce, bọc qua 3 tầng handler
```

**Hậu quả:**

- Thêm `lodash` vào `node_modules` (thường kéo thêm vài chục KB vào bundle).
- Phức tạp hoá vòng đời component với `useRef`, `useMemo`, `useEffect` chỉ để hoãn một hàm gọi API.

---

## ✅ After — The Ladder / Ponytail (6 dòng, 0 dependencies)

### Phương án 1: Vanilla React Hook (Không cần bất kỳ thư viện nào)

```tsx
// useDebounceValue.ts (6 dòng)
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

### Phương án 2: Vanilla JavaScript Function (1 closure đơn giản)

```typescript
// debounce.ts (4 dòng)
export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```

---

## 📊 So sánh

| Tiêu chí                       | ❌ Before (Lodash)                             | ✅ After (The Ladder)               |
| :----------------------------- | :--------------------------------------------- | :---------------------------------- |
| **Dependencies mới**           | `lodash`, `@types/lodash` (+70KB unpacked)     | **0** (Native `setTimeout`)         |
| **Số dòng mã**                 | ~85 dòng                                       | **6 dòng**                          |
| **Độ phức tạp nhận thức**      | Cao (quản lý memo, callback ref, cancel/flush) | Cực thấp (timer cleanup tiêu chuẩn) |
| **Thời gian review & bảo trì** | 15 phút                                        | **30 giây**                         |

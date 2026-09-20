# 07 — Deep Clone: `structuredClone()` vs. Lodash / Hand-Rolled Recursion

**Rung áp dụng: Rung 4 — Native Platform Feature**

> _"Sử dụng hàm native `structuredClone()` có sẵn trong JavaScript/Node.js thay vì cài `lodash.clonedeep`."_

---

## Bài toán

User yêu cầu: **"Tạo một bản sao sâu (deep clone) của cấu hình dự án phức tạp chứa mảng, Map, Set và Date để chỉnh sửa mà không làm đột biến cấu hình gốc."**

---

## ❌ Before — AI Over-Engineered (~75 dòng hoặc cài thư viện)

AI thường đề xuất cài đặt `lodash.clonedeep`:

```bash
npm install lodash.clonedeep @types/lodash.clonedeep
```

Hoặc tự tay viết một hàm đệ quy phức tạp dễ gặp lỗi khi có quan hệ vòng tròn (circular references):

```typescript
// utils/deepClone.ts (~65 dòng)
export function deepClone<T>(obj: T, hash = new WeakMap()): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as any;
  if (hash.has(obj as any)) return hash.get(obj as any);

  if (obj instanceof Map) {
    const result = new Map();
    hash.set(obj as any, result);
    obj.forEach((val, key) => result.set(key, deepClone(val, hash)));
    return result as any;
  }

  if (obj instanceof Set) {
    const result = new Set();
    hash.set(obj as any, result);
    obj.forEach((val) => result.add(deepClone(val, hash)));
    return result as any;
  }

  const result = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj as any, result);
  for (const key of Reflect.ownKeys(obj as any)) {
    result[key] = deepClone((obj as any)[key], hash);
  }
  return result;
}
```

**Hậu quả:**

- Thêm dependency `lodash.clonedeep`.
- Tự viết hàm đệ quy không thể xử lý hết các kiểu dữ liệu đặc biệt như `ArrayBuffer`, `Blob`, `TypedArray`, `DOMException`.

---

## ✅ After — The Ladder / Ponytail (1 dòng duy nhất)

Toàn bộ trình duyệt hiện đại (Chrome 98+, Firefox 94+, Safari 15.4+) và Node.js (từ v17.0.0+) đã tích hợp sẵn API tiêu chuẩn:

```typescript
// 1 dòng duy nhất, hỗ trợ sẵn Circular References, Date, Map, Set, TypedArray
const clonedConfig = structuredClone(originalConfig);
```

---

## 📊 So sánh

| Tiêu chí                      | ❌ Before (Lodash / Hand-rolled)         | ✅ After (`structuredClone`)          |
| :---------------------------- | :--------------------------------------- | :------------------------------------ |
| **Dependencies mới**          | `lodash.clonedeep`                       | **0**                                 |
| **Số dòng mã**                | 65 - 75 dòng                             | **1 dòng**                            |
| **Xử lý Circular References** | Dễ crash stack overflow nếu quên WeakMap | **Hỗ trợ tự nhiên ở cấp C++ runtime** |
| **Tốc độ thực thi**           | Chậm hơn (JavaScript user space)         | **Rất nhanh (native engine)**         |

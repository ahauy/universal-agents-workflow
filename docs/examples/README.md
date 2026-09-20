# Before & After Examples — The Ladder in Practice

Thư mục này chứa các ví dụ thực tế minh họa **The Ladder of Minimal Code** so sánh giữa cách AI thường sinh code (over-engineered) và cách đúng (minimal, native, stdlib-first).

Mỗi file chứa cặp **Before** (bloated) và **After** (ponytail) với giải thích rung thang nào đã được áp dụng.

---

## Index

| File                                                                                         | Rung thang áp dụng                         | LOC tiết kiệm   | Điểm nhấn cốt lõi                                     |
| :------------------------------------------------------------------------------------------- | :----------------------------------------- | :-------------- | :---------------------------------------------------- |
| [01-native-vs-overengineered-ui.md](01-native-vs-overengineered-ui.md)                       | **Rung 4**: Native Platform Feature        | ~404 → ~1 dòng  | Thẻ `<input type="date">` thay vì Flatpickr           |
| [02-stdlib-vs-reinvented-backend.md](02-stdlib-vs-reinvented-backend.md)                     | **Rung 3**: Standard Library               | ~80 → ~3 dòng   | `@functools.lru_cache` thay vì tự viết TTLCache class |
| [03-deep-module-vs-shallow-bloat.md](03-deep-module-vs-shallow-bloat.md)                     | **Rung 2 & 5**: Reuse & Minimal Seams      | ~60 → ~15 dòng  | Giao diện Ousterhout sâu thay vì wrapper nông         |
| [04-debounce-throttle-native-vs-lodash.md](04-debounce-throttle-native-vs-lodash.md)         | **Rung 3 & 5**: Native Closure & Zero Deps | ~85 → ~6 dòng   | Native `setTimeout` hook thay vì kéo `lodash`         |
| [05-rate-limiting-in-memory-vs-heavy-infra.md](05-rate-limiting-in-memory-vs-heavy-infra.md) | **Rung 3 & 7**: In-Memory & Debt Ceiling   | ~160 → ~18 dòng | Token bucket in-memory kèm `# ponytail:` comment      |
| [06-modal-dialog-native-vs-third-party.md](06-modal-dialog-native-vs-third-party.md)         | **Rung 4**: Native Platform Feature        | ~180 → ~15 dòng | Thẻ HTML5 `<dialog>` có sẵn A11y & ESC đóng           |
| [07-deep-clone-structured-clone.md](07-deep-clone-structured-clone.md)                       | **Rung 4**: Native Platform Feature        | ~75 → ~1 dòng   | `structuredClone()` chuẩn của JS/Node.js              |

---

Nguồn benchmark và cảm hứng: [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail/tree/main/examples)

# 06 — Modal Dialog: HTML5 `<dialog>` vs. Custom Portal Component

**Rung áp dụng: Rung 4 — Native Platform Feature**

> _"Sử dụng thẻ `<dialog>` có sẵn của HTML5 thay vì thư viện Modal hoặc hand-rolled React Portal."_

---

## Bài toán

User yêu cầu: **"Tạo hộp thoại xác nhận khi người dùng bấm Xóa tài khoản (có backdrop tối màu, bấm phím ESC để đóng, bẫy tiêu điểm bàn phím)."**

---

## ❌ Before — AI Over-Engineered (~180 dòng + CSS phức tạp)

AI thường viết một giải pháp tùy biến nặng nề với React Portal, listener bàn phím, khóa cuộn trang (body scroll lock) và bẫy focus:

```tsx
// Modal.tsx (~120 dòng)
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Hand-rolled Focus Trap (~40 lines of finding tab-index elements...)

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <h3>{title}</h3>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") || document.body,
  );
};
```

**Hậu quả:**

- Dễ sinh lỗi memory leak khi đóng/mở nhanh.
- Hand-rolled focus trap thường không đạt chuẩn tiếp cận WCAG AA (dễ bị kẹt bàn phím hoặc thoát ra ngoài).
- Thêm node `#modal-root` vào `index.html`.

---

## ✅ After — The Ladder / Ponytail (15 dòng HTML + Native API)

Trình duyệt hiện đại đã hỗ trợ sẵn thẻ `<dialog>` với method `.showModal()`. Nền tảng tự động xử lý:

1. Tạo lớp nền `::backdrop` chuẩn xác.
2. Tự động bẫy tiêu điểm (focus trap) chuẩn WCAG.
3. Tự động đóng khi bấm phím `Escape`.
4. Khóa cuộn trang phía sau hoàn toàn tự động.

```tsx
// ConfirmDialog.tsx (15 dòng)
import { useRef } from "react";

export function ConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button onClick={() => dialogRef.current?.showModal()}>
        Xóa tài khoản
      </button>
      <dialog ref={dialogRef} className="rounded-lg p-6 backdrop:bg-black/50">
        <h3>Bạn có chắc chắn muốn xóa?</h3>
        <p>Hành động này không thể hoàn tác.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => dialogRef.current?.close()}>Hủy</button>
          <button
            onClick={() => {
              onConfirm();
              dialogRef.current?.close();
            }}
          >
            Xóa
          </button>
        </div>
      </dialog>
    </>
  );
}
```

---

## 📊 So sánh

| Tiêu chí                        | ❌ Before (Custom Portal Modal)      | ✅ After (Native `<dialog>`)       |
| :------------------------------ | :----------------------------------- | :--------------------------------- |
| **Dependencies / Portals**      | React Portal, quản lý node DOM ngoài | **0** (Thẻ HTML5 chuẩn)            |
| **Xử lý phím ESC & Focus trap** | Tự code ~60 dòng dễ lỗi              | **Tự động 100% từ Browser engine** |
| **Số dòng mã**                  | ~180 dòng + CSS                      | **~15 dòng**                       |
| **Chuẩn Accessibility (A11y)**  | Dễ sót thẻ ARIA                      | **Đạt chuẩn WCAG mặc định**        |

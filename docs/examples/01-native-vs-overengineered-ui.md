# 01 — Native vs. Over-Engineered UI

**Rung áp dụng: Rung 4 — Native Platform Feature**

> _"Sử dụng `<input type="date">` thay vì date picker library."_

---

## Bài toán

User yêu cầu: **"Thêm trường nhập ngày sinh vào form."**

---

## ❌ Before — AI Over-Engineered (404 dòng)

```bash
npm install flatpickr
```

```tsx
// DatePickerWrapper.tsx (~120 dòng)
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useEffect, useRef, forwardRef } from "react";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  format?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      minDate,
      maxDate,
      disabled,
      format = "Y-m-d",
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fpRef = useRef<flatpickr.Instance | null>(null);

    useEffect(() => {
      fpRef.current = flatpickr(inputRef.current!, {
        dateFormat: format,
        minDate,
        maxDate,
        defaultDate: value,
        onChange: ([date]) => onChange(date.toISOString().split("T")[0]),
      });
      return () => fpRef.current?.destroy();
    }, []);

    // ... 80 more lines of sync logic, locale handling, theme support
    return (
      <input ref={inputRef} disabled={disabled} placeholder={placeholder} />
    );
  },
);
```

```tsx
// DatePickerField.tsx (~80 dòng)
// ... controller wrapper, form integration, validation display

// types/date-picker.ts (~40 dòng)
// ... DatePickerConfig, DateRange, LocaleOptions interfaces

// styles/date-picker.css (~164 dòng)
// ... override flatpickr styles to match design system
```

**Tổng: ~404 dòng + 1 dependency mới + 1 CSS bundle**

---

## ✅ After — Ponytail (1 dòng HTML + form integration tự nhiên)

```html
<!-- ponytail: browser has one -->
<input type="date" name="dob" min="1900-01-01" max="2010-12-31" />
```

Nếu cần React form integration:

```tsx
<input
  type="date"
  name="dob"
  min="1900-01-01"
  max="2010-12-31"
  value={dob}
  onChange={(e) => setDob(e.target.value)}
/>
```

**Tổng: 1–5 dòng. 0 dependencies. Keyboard accessible tự nhiên. Mobile picker tự nhiên.**

---

## Phân tích

|                | Before       | After    |
| -------------- | ------------ | -------- |
| LOC            | ~404         | ~5       |
| Dependencies   | +flatpickr   | 0        |
| Accessibility  | Manual aria- | Built-in |
| Mobile support | Manual       | Native   |
| Maintenance    | Owner        | Browser  |

**Rung thang**: Rung 4 (Native Platform) → `<input type="date">` là date picker built vào browser từ HTML5.

**Khi nào nên dùng thư viện?** Khi cần date range picker với custom time zones, multiple calendar display, hoặc design system phức tạp mà browser input không đáp ứng được sau khi đã thử CSS styling.

```
// ponytail: native input, upgrade to react-day-picker when design requires date range or custom calendar
```

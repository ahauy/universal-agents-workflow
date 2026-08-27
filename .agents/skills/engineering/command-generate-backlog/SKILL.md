---
invocation: user
name: command-generate-backlog
description: >-
  Activated when the user types /generate-backlog (or shortcuts /create-roadmap, /plan-backlog).
  Conducts a structured grilling interview (2-3 batches, 6 core questions) to extract
  Product, Platform, Auth, Content, Monetization, and Scope constraints from the user's
  raw product idea. Then renders a fully-structured docs/PRODUCT_BACKLOG_ROADMAP.md
  file with YAML frontmatter, Won't-Have fence, Dependency chain, Effort sizing, and
  Context-budget fields — ready to power /command-continue-project auto-routing.
  Zero hallucination: never invents stories or ACs without user confirmation.
triggers:
  - "/generate-backlog"
  - "/create-roadmap"
  - "/plan-backlog"
  - "generate backlog"
  - "tạo roadmap"
  - "tạo backlog"
  - "create product roadmap"
---

# Command: Generate Product Backlog (/generate-backlog)

## Purpose

Prevents **hallucinated scope**: AI must NEVER invent User Stories, Acceptance Criteria,
or Won't-Have boundaries from a vague idea. This skill forces a structured grilling
interview first, then renders the canonical `docs/PRODUCT_BACKLOG_ROADMAP.md` from
confirmed answers only.

See template: [PRODUCT_BACKLOG_ROADMAP-template.md](../../.specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md)

---

## Protocol

### Step 0: Frame & Echo

Restate the user's raw idea in one sentence and confirm understanding before questioning:

> 🎯 **Ý tưởng tôi hiểu:** `<restatement>`. Để tạo roadmap chính xác, tôi cần hỏi bạn
> **6 câu** chia làm 2 lượt (3 câu/lượt). Sẵn sàng chưa?

### Step 1: Grilling Batch 1 — Product & Platform (3 câu)

Ask exactly these 3 questions in one message. Do NOT ask more or fewer:

```
**Lượt 1/2 — Product & Platform:**

Q1. 🖥️ **Platform**: Ứng dụng sẽ chạy trên nền tảng nào?
    → Chỉ Web (Browser) / Mobile-first (PWA) / Native iOS+Android / Cross-platform (tất cả)

Q2. 🔐 **Authentication**: Người dùng cần đăng ký tài khoản không?
    → Không (anonymous/guest) / Có (Email+Password) / Có + OAuth (Google/GitHub...) / Cả hai

Q3. 📦 **Content Source**: Nội dung/dữ liệu chính đến từ đâu?
    → Người dùng tự nhập / Import file (CSV, JSON...) / Kéo từ API bên ngoài / AI tự sinh
```

**STOP. Wait for user answers.** Do NOT proceed to Batch 2 without answers.

### Step 2: Grilling Batch 2 — Scale & Scope (3 câu)

After receiving Batch 1 answers, ask Batch 2:

```
**Lượt 2/2 — Scale & Scope:**

Q4. 👥 **Multi-user/Team**: Có nhiều người dùng chia sẻ dữ liệu chung không?
    → Không (mỗi user là một "đảo" độc lập) / Có (shared workspace / team) / Chưa rõ

Q5. 💰 **Monetization**: MVP có tính phí không?
    → Không (free MVP, billing sau) / Có (cần billing/Stripe ngay) / Freemium (plan free + paid)

Q6. 🚫 **Won't-Have**: Có tính năng nào bạn CHẮC CHẮN KHÔNG làm trong MVP?
    → (VD: Không app mobile, không email notification, không export PDF, không admin panel...)
    → Gõ "không biết" nếu chưa có ý kiến.
```

**STOP. Wait for user answers.** Do NOT generate the roadmap without answers.

### Step 3: Tech Stack Elicitation (Optional, 1 câu)

After Batch 2, ask one final optional question:

```
**Câu tùy chọn — Tech Stack:**

Q7. 🛠️ **Tech Stack** (nếu bạn đã có ý định): Bạn muốn dùng ngôn ngữ/framework nào?
    → Gõ "tùy AI quyết" nếu chưa có preference — tôi sẽ đề xuất stack phù hợp.
```

### Step 4: Confirm Before Generating

Present a compact decision summary for user sign-off BEFORE writing any file:

```markdown
✅ **Xác nhận trước khi sinh file:**

| Câu hỏi        | Câu trả lời đã xác nhận       |
| :------------- | :---------------------------- |
| Platform       | <answer>                      |
| Auth           | <answer>                      |
| Content Source | <answer>                      |
| Multi-user     | <answer>                      |
| Monetization   | <answer>                      |
| Won't-Have     | <list>                        |
| Tech Stack     | <answer or AI recommendation> |

**Tôi sẽ sinh `docs/PRODUCT_BACKLOG_ROADMAP.md` với khoảng `<N>` User Stories chia thành `<M>` Sprint.**
Bạn xác nhận chưa? (Gõ "ok" hoặc sửa lại điểm nào sai)
```

**STOP. Do NOT write the file until user confirms.**

### Step 5: Generate `docs/PRODUCT_BACKLOG_ROADMAP.md`

Only after explicit user confirmation ("ok", "đúng", "proceed", "generate", etc.):

1. **Xác định Tech Stack** từ Q7:
   - Nếu user chưa chọn: đề xuất stack mặc định phù hợp (TypeScript + NestJS + Next.js + PostgreSQL).
   - Ghi vào YAML frontmatter.

2. **Phân rã Epics theo Vertical Slicing**:
   - Không chia theo Layer (Database, Backend, Frontend).
   - Chia theo **User Journey End-to-End**: mỗi story đều chạm UI + API + DB.
   - Xác định tối đa 3–4 Epics/Module từ domain của ý tưởng.

3. **Gán Effort & Context-budget**:
   - `S` (< 200 LOC, 1 entity, 1 screen) → `single-session`
   - `M` (200–500 LOC, 1–2 entities, 2 screens) → `single-session`
   - `L` (500–1000 LOC, 3+ entities, 3+ screens) → `multi-session`
   - `XL` (cross-cutting, new infra) → `multi-session`

4. **Gán Dependency chain**: Mỗi story phải khai báo `Depends-on` và `Blocks` chính xác.
   Không có circular dependency. Auth thường là story đầu tiên, không có dependency.

5. **Sprint Priority**:
   - Sprint 1 (MVP): `Must-Have (P0)` chỉ. Max 5 stories.
   - Sprint 2: `Should-Have (P1)` trước, `Could-Have (P2)` sau. Max 5 stories.
   - Future Horizons: Mọi thứ chưa cam kết.

6. **Viết file** theo cấu trúc chuẩn từ template:
   [PRODUCT_BACKLOG_ROADMAP-template.md](../../.specify/templates/PRODUCT_BACKLOG_ROADMAP-template.md)

7. **Ghi ra** `docs/PRODUCT_BACKLOG_ROADMAP.md` (tạo thư mục `docs/` nếu chưa có).

### Step 6: Activation Message

Sau khi file được tạo, thông báo:

```markdown
✅ **File `docs/PRODUCT_BACKLOG_ROADMAP.md` đã sẵn sàng!**

📊 **Tổng quan:**

- Sprint 1 (MVP): `<N>` User Stories — ước tính `<X>` sessions
- Sprint 2: `<N>` User Stories
- Future Horizons: `<N>` ý tưởng

🚀 **Bước tiếp theo:**
Gõ `/continue` (hoặc `/command-continue-project`) để AI tự động bắt đầu làm
User Story đầu tiên (`<US-ID>: <Title>`) theo đúng pipeline BA → Spec → TDD → Docs.
```

---

## Boundaries & Non-Goals

- ❌ **NEVER** generate the roadmap file before user confirms the decision summary (Step 4).
- ❌ **NEVER** invent Acceptance Criteria not derived from user answers.
- ❌ **NEVER** set `[x]` on any story — only `/command-continue-project` can do that.
- ❌ **NEVER** create `.specify/features/<slug>/` folders — that is `/command-continue-project`'s job.
- ❌ **NEVER** write tech-specific implementation details inside AC — keep them business-level.
- ✅ Always record any remaining ambiguity as `ASM-BACKLOG-NN` in a comment within the file.
- ✅ Always use the YAML frontmatter tech-stack block even if user says "tùy AI" (fill with recommended stack).
- ✅ Won't-Have section is MANDATORY. If user says "không biết", derive sensible defaults from the domain and list them for confirmation.

---

## Exit Checklist

- [ ] Grilling Batch 1 answered (Platform, Auth, Content Source)
- [ ] Grilling Batch 2 answered (Multi-user, Monetization, Won't-Have)
- [ ] Tech Stack confirmed (Q7) or AI recommendation stated
- [ ] Decision summary presented and user confirmed
- [ ] `docs/PRODUCT_BACKLOG_ROADMAP.md` written with valid YAML frontmatter
- [ ] Every story has: Slug, Effort, Context-budget, Priority, Depends-on, Blocks, AC
- [ ] Won't-Have section is non-empty
- [ ] Activation message with `/continue` call-to-action displayed

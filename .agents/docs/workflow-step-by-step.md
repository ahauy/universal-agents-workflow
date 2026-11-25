# Quy Trình Làm Việc Từng Bước (Practical Workflow)

> Cẩm nang thao tác thực tế: gõ lệnh gì, AI kích hoạt skill nào, cổng kiểm soát ở đâu.
> Nguồn chân lý về luật là [`AGENTS.md`](../../AGENTS.md); chi tiết từng stage nằm ở
> [`pipeline-detail.md`](pipeline-detail.md).

**7 bước · 4 cổng · 3 làn tốc độ.** Các stage trùng lặp đã được gộp: gap-analysis
vào domain-modeling, risk-scanner + analyze thành consistency-scan, 4 tài liệu đặc
tả thành 1 `requirements.md`, Handover Brief vào `baseline.md`.

---

## Bước 1 — Intake & phân loại (Tier)

- **Bạn làm**: đưa yêu cầu (ticket, mô tả, hoặc `/command-continue-project`).
- **AI chạy**: `intake-classifier`.
- **Kết quả**: một trong bốn làn — kèm ngân sách token.

| Tier | Dấu hiệu | Thủ tục | Ngân sách |
| --- | --- | --- | --- |
| 1 | < 80 dòng, bug fix, typo | không có — reproduce → test fail → fix → verify → 1 commit | ≤ 20k |
| 2 | 80–250 dòng, US từ roadmap có AC, không `[!]` | `test-plan.md` → TDD → review | ≤ 80k |
| 3 | > 250 dòng, entity mới, auth/billing, hoặc `[!]` | domain baseline + plan đầy đủ | ≤ 250k |
| Spike | câu hỏi nghiên cứu | chỉ ghi chú | ≤ 15k |

Vượt ngân sách > 50% → AI phải dừng và báo, không được chạy tiếp âm thầm.

## Bước 2 — Domain Baseline (chỉ Tier 3)

Sáu stage, không còn tám.

1. **`elicitation-interview`** — 🛑 **AI dừng lại phỏng vấn bạn**, 2–3 câu mỗi đợt,
   phủ 6 trụ cột: RBAC, state machine, luật nghiệp vụ/công thức, workflow & edge
   case, dữ liệu & riêng tư, UX/NFR. Không được tự bịa luật.
2. **`domain-modeling`** — gộp cả gap analysis (AS-IS/TO-BE). Sinh ma trận RBAC,
   state diagram Mermaid, `BR-<SLUG>-###`, ERD. Cập nhật `CONTEXT.md` + `adr/`.
3. **`consistency-scan`** — gộp `risk-contradiction-scanner` + `speckit-analyze`.
   Quét mâu thuẫn logic, deadlock trạng thái, phá vỡ tương thích; lập `RISK-`;
   khoá scope MoSCoW kèm danh sách **Won't-Have**.
4. **`spec-writer`** — **một** file `requirements.md` 4 section (bối cảnh KD · hành vi
   SP · `REQ-###` · `US-###` Given-When-Then). Bản BRD/PRD/SRS/user-stories chỉ được
   **render** ra `exports/` khi có khán giả thật (khách hàng, chữ ký riêng, import
   Jira/DOORS, hoặc hợp đồng gọi tên tài liệu) — không soạn riêng 4 lần.
5. **`spec-validator`** — kiểm IEEE 29148, 8 tiêu chí mỗi REQ/US, dựng ma trận
   truy vết. Tối đa 2 vòng lặp sửa.
6. **`handover`** — duyệt cổng, đánh dấu `baseline.md` = `SIGNED-OFF v1.0`, và
   **thêm section Dev Handover Brief ngay trong file đó** (không tạo file rời).

- 🛑 **Gate 1**: chưa SIGNED-OFF thì không có code, không có spec kỹ thuật.

## Bước 3 — Spec kỹ thuật & Kế hoạch

- **AI chạy**: `speckit-specify` → `speckit-plan` (kèm `codebase-design`) →
  `speckit-tasks`.
- **Kết quả**: `spec.md`, `plan.md`, `data-model.md`, `contracts/`, `tasks.md`.
- 🛑 **Gate 2**: bạn duyệt `plan.md` + `tasks.md`.

## Bước 3.5 — Scaffold (chỉ greenfield)

- **AI chạy**: `scaffold-architecture` — **chỉ khi repo chưa có cấu trúc**. Repo đã
  có layout thì bỏ qua, đi theo layout sẵn có.
- Khi chạy: hỏi bạn chọn 1 blueprint (C4 Layered / Hexagonal / Feature-Based), ghi
  `adr/ADR-ARCH-001`, cập nhật Module Map trong `CONTEXT.md`.

## Bước 4 — TDD theo lát cắt

- **AI chạy**: `implementation-orchestrator` → dev agent → `build-resolver`.
- **Chia slice theo tier**: Tier 1 không chia; Tier 2 chia 2 (dev + UI); Tier 3
  chia 4 theo tầng phụ thuộc.
- **Vòng TDD**: `test-plan.md` (map `US-` → `TC-###`) → 🔴 Red → 🟢 Green → 🔵 Refactor.
- **Bắt buộc trước mỗi lần giao việc**: ghi `context-pack.md` (≤ 150 dòng) để
  subagent đọc pack thay vì đọc cả chuỗi spec.
- `code-explorer` chỉ chạy khi orchestrator không tự xác định được file bị ảnh hưởng.
- Lỗi build → `build-resolver`; bug khó/flaky → `diagnosing-bugs` (6 pha).

## Bước 5 — Review đối kháng

- **AI chạy**: `code-reviewer` với **2 pass mặc định**:
  - Pass A: chuẩn & bảo mật (injection, secret, authz, type safety, async).
  - Pass B: độ khớp spec (`REQ-`/`BR-`, chuyển trạng thái, từ vựng `CONTEXT.md`).
  - Pass C (chống over-engineering) **chỉ khi diff > 300 dòng**.
- `ui-ux-reviewer` **chỉ chạy khi diff chạm file UI** (`.tsx .jsx .css .scss .html .vue .svelte`).
- **4 quy tắc dừng**: tối đa 3 vòng (cấm vòng 4 tự động) · vòng 2–3 chỉ xem diff mới ·
  gom bug theo 5 nhóm · ID cố định, không báo lại bug đã `[RESOLVED]`/`[ACCEPTED]`.
- 🛑 **Gate 3**: không còn lỗi `Critical`.

## Bước 6 — Tài liệu

- `tech-doc-architect`: `docs/features/<slug>/README.md` + cập nhật index. Chỉ tạo
  ADR khi kiến trúc thay đổi thật.
- `user-guide-with-screenshots`: **theo release, không theo feature**. Gom thay đổi
  UI rồi chụp một lần mỗi release.
- `agent-evaluator`: **không** nằm trong đường giao mặc định — chạy qua `/retro`.

## Bước 7 — Ship (chỉ khi bạn gõ lệnh)

- `/command-git-push` → chia modular commit theo tầng: `docs(spec)` → `feat(shared-types)`
  → `feat(api)` → `feat(ui)` → `docs`, xuất PR brief tiếng Anh.
- **Không auto-rebase.** Nếu branch phân kỳ hoặc có conflict, AI dừng và báo bạn
  (`git diff --name-only --diff-filter=U`). Không bao giờ `--force` khi chưa được lệnh.

---

## Hộp cứu hộ

| Tình huống | Gõ gì | Skill |
| --- | --- | --- |
| Không biết bước tiếp theo | `/route` | `route` |
| AI nói khó hiểu | `/wait-what` | `wait-what` |
| Cần hỏi stakeholder | `tạo khảo sát` | `to-questionnaire` |
| Bài toán quá lớn, mờ mịt | `lập bản đồ quyết định` | `wayfinder` |
| Sắp đầy context window | `/handoff` | `handoff` |
| Muốn tinh chỉnh chính workflow | `/retro` | `retro` |

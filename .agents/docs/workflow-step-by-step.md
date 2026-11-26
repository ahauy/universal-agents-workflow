# Quy Trình Làm Việc Từng Bước (Practical Workflow)

> Cẩm nang thao tác thực tế: gõ lệnh gì, AI làm gì, cổng kiểm soát ở đâu.
> Luật gốc là [`AGENTS.md`](../../AGENTS.md); chi tiết từng stage ở
> [`pipeline-detail.md`](pipeline-detail.md).

**Checkpoint nghiệp vụ trước triển khai · Fast cho hành vi hiện có đã rõ · Full khi có trigger.**
Chỉ hỏi khoảng trống trọng yếu; khi chạm trigger thì escalate một lần rồi đi tiếp.

---

## Bước 1 — Chọn làn

- **Bạn làm**: đưa yêu cầu (ticket, mô tả, hoặc `/continue`).
- **AI chạy**: `intake-classifier` — checkpoint: mục tiêu, hành vi, scope, bằng chứng, điểm chưa rõ và AC; dùng lại câu trả lời đã xác nhận.
- **Mặc định**: Fast cho hành vi hiện có đã rõ, phạm vi gọn, không có trigger. Checkpoint giữ trong chat; research chỉ đọc không cần lặp pipeline BA.

### Trigger escalate (chỉ cần 1)

| # | Trigger |
| --- | --- |
| T1 | Diff dự kiến > 250 dòng hoặc > 8 file |
| T2 | Đổi schema breaking, hoặc migration có rủi ro mất dữ liệu |
| T3 | Auth, phân quyền/RBAC, billing/payment, PII |
| T4 | Entity/service/public API contract mới |
| T5 | Story roadmap đánh dấu `[!]` |
| T6 | Bạn gõ `/full` hoặc yêu cầu enterprise/audit-grade |
| T7 | Hành vi nghiệp vụ mới/chưa rõ, rule/default/AC trọng yếu chưa xác nhận |

AI phải nói rõ làn + trigger trước khi làm. Nếu bạn ép ngược lại, AI làm theo bạn
và ghi override, không tự đổi.

## Fast lane (mặc định)

Một context duy nhất, không feature folder, không subagent.

1. **Đọc trước khi viết**: file liên quan, test hiện có, thuật ngữ trong `CONTEXT.md`.
2. **Plan ≤ 5 dòng** ngay trong chat: file, cách làm, test, rủi ro.
3. 🔴 **Red**: viết test fail (hoặc reproduce bug) và chạy.
4. 🟢 **Green**: code tối thiểu, chạy test vừa viết.
5. **Verify**: test/lint/typecheck của vùng vừa chạm.
6. **Self-check**: `SECURITY` · `SPEC_FIDELITY` · `RELIABILITY`. Không mở context
   reviewer riêng.
7. **Đóng**: cập nhật checkbox roadmap và chạy
   `node .agents/scripts/metrics.mjs end`. Commit chỉ khi bạn yêu cầu.

`test-plan.md` chỉ xuất hiện khi task cần > 3 test case. Không tạo `baseline.md`,
`00-intake.md`, `CHANGELOG.md`, `context-pack.md`.

Giữa task nếu chạm trigger: announce `Escalating to Full lane: <T#>`, tạo folder,
ghi trigger vào `00-intake.md`, đi tiếp từ Bước 2. **Một chiều**, không hạ cấp lại.

## Bước 2 — Domain Baseline (Full lane)

Sáu stage; chỉ hỏi phần nghiệp vụ còn thiếu, không hỏi lại bằng chứng đã duyệt. Không giới hạn tổng số câu hỏi.

1. **`elicitation-interview`** — 🛑 **AI dừng lại phỏng vấn bạn**, 2–3 câu mỗi đợt,
   phủ 6 trụ cột: RBAC, state machine, luật nghiệp vụ/công thức, workflow & edge
   case, dữ liệu & riêng tư, UX/NFR. Neo vào AC trong roadmap, không hỏi lại cái
   AC đã trả lời.
2. **`domain-modeling`** — gộp cả gap analysis (AS-IS/TO-BE). Sinh ma trận RBAC,
   state diagram Mermaid, `BR-<SLUG>-###`, ERD. Cập nhật `CONTEXT.md` + `adr/`.
3. **`risk-contradiction-scanner`** — kiểm tính nhất quán nghiệp vụ trước baseline; chưa phân tích spec/plan/tasks chưa tồn tại.
   Quét mâu thuẫn logic, deadlock trạng thái, phá vỡ tương thích; lập `RISK-`;
   khoá scope MoSCoW kèm danh sách **Won't-Have**.
4. **`spec-writer`** — **một** file `requirements.md` 4 section (bối cảnh KD · hành vi
   SP · `REQ-###` · `US-###` Given-When-Then). Bản BRD/PRD/SRS/user-stories chỉ được
   **render** ra `exports/` khi có khán giả thật.
5. **`spec-validator`** — kiểm IEEE 29148, 8 tiêu chí mỗi REQ/US, dựng ma trận
   truy vết. Tối đa 2 vòng lặp sửa.
6. **`handover`** — duyệt cổng, đánh dấu `baseline.md` = `SIGNED-OFF v1.0`, thêm
   section Dev Handover Brief ngay trong file đó.

- 🛑 **Gate 1**: chưa SIGNED-OFF thì không có spec kỹ thuật, không có code.

## Bước 3 — Spec kỹ thuật & Kế hoạch (Full lane)

- **AI chạy**: `technical-spec` → `implementation-plan` (kèm `codebase-design`) →
  `task-breakdown` → `technical-consistency-review` sau khi có đủ spec/plan/tasks.
- **Kết quả**: `spec.md`, `plan.md`, `tasks.md`; data-model/contracts chỉ khi cần.
- 🛑 **Gate 2**: bạn duyệt `plan.md` + `tasks.md`.

## Bước 3.5 — Scaffold (Full lane, chỉ greenfield)

- **AI chạy**: `scaffold-architecture` — **chỉ khi repo chưa có cấu trúc**. Repo đã
  có layout thì bỏ qua.
- Khi chạy: hỏi bạn chọn blueprint (C4 Layered / Hexagonal / Feature-Based), ghi
  `adr/ADR-ARCH-001`, cập nhật Module Map trong `CONTEXT.md`.

## Bước 4 — TDD theo lát cắt (Full lane)

- **AI chạy**: `implementation-orchestrator` → dev agent → `build-resolver`.
- Chia slice theo tầng phụ thuộc; **slice độc lập chạy song song**, chỉ serialize
  khi slice này ăn output của slice kia.
- Một dev cho một slice liền mạch (Data+Logic+API), UI tách riêng. Không chia thành
  4 micro-subagent.
- Trước mỗi lần dispatch: ghi `context-pack.md` (≤ 150 dòng) để subagent đọc pack
  thay vì cả chuỗi spec.
- Vòng TDD: `test-plan.md` (`US-` → `TC-###`) → 🔴 Red → 🟢 Green → 🔵 Refactor.
- Lỗi build → `build-resolver`; bug khó/flaky → `diagnosing-bugs`.

## Bước 5 — Review đối kháng (Full lane)

- **AI chạy**: `code-reviewer` với **2 pass**:
  - Pass A: chuẩn & bảo mật (injection, secret, authz, type safety, async).
  - Pass B: độ khớp spec (`REQ-`/`BR-`, chuyển trạng thái, từ vựng `CONTEXT.md`).
  - Pass C (chống over-engineering) **chỉ khi diff > 300 dòng**.
- `ui-ux-reviewer` **chỉ chạy khi diff chạm file UI**.
- **4 quy tắc dừng**: tối đa 3 vòng · vòng 2–3 chỉ xem diff mới · gom bug theo 5
  nhóm · ID cố định, không báo lại bug đã `[RESOLVED]`/`[ACCEPTED]`.
- 🛑 **Gate 3**: không còn lỗi `Critical`.

## Bước 6 — Tài liệu (Full lane)

- `tech-doc-architect`: `docs/features/<slug>/README.md` + cập nhật index. Chỉ tạo
  ADR khi kiến trúc thay đổi thật.
- `user-guide-with-screenshots`: **theo release, không theo feature**.
- `agent-evaluator`: chạy qua `/retro`, không nằm trong đường giao mặc định.

## Bước 7 — Ship (cả 2 làn, chỉ khi bạn gõ lệnh)

- `/command-git-push` → chia modular commit theo tầng: `docs(spec)` →
  `feat(shared-types)` → `feat(api)` → `feat(ui)` → `docs`, xuất PR brief tiếng Anh.
- **Không auto-rebase.** Nếu branch phân kỳ hoặc có conflict, AI dừng và báo bạn.
- Không bao giờ `--force` khi chưa được lệnh.
- Đóng task bằng `node .agents/scripts/metrics.mjs end`; xem lại bằng
  `node .agents/scripts/metrics.mjs report` sau mỗi 10 task.

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

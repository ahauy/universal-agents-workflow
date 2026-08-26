# Proposal: Đối chiếu & chỉnh sửa Universal-Agents-Workflow theo mattpocock/skills

> Trạng thái: **CHỈ LÀ BẢN GIẢI THÍCH (proposal)** — chưa sửa file nào.
> Mọi thay đổi scope sẽ ghi vào feature CHANGELOG và chờ bạn duyệt trước khi thực thi.
> Nguồn tham chiếu: `github.com/mattpocock/skills` (README + danh sách skill) đối chiếu với `.agents/`, `.specify/`, `GEMINI.md`, `README.md`.

---

## 0. QUYẾT ĐỊNH TRIẾT LÝ (Meta) — trả lời câu "lấy của ai?"

Mình **không lật ngược** framework của bạn về mô hình nhẹ của Matt, cũng **không bỏ** các kỹ thuật hay của Matt. Thay vào đó, tách theo 2 "mặt phẳng" (plane):

| Lớp | Triết lý | Nội dung |
|---|---|---|
| **Control Plane** (quy trình / governance) | 🟦 **BẠN** (giữ nguyên) | 8-stage BA pipeline, mandatory multi-agent lifecycle, model-allocation matrix, gate, anti-AI-slop, independent adversarial review, subagent transparency. Đây là **điểm khác biệt** của bạn — Matt **không** có (ông chọn ngược GSD/BMAD/Spec-Kit). |
| **Data Plane** (kỹ năng nguyên tử + ngôn ngữ chung) | 🟧 **MATT** (borrow) | Các skill nhỏ/composable/model-agnostic + kỹ thuật shared-language: `CONTEXT.md`, `ADR`, `grilling` primitive, `prototype`, `wait-what`, ... |
| **Nơi 2 mặt phẳng gặp nhau** | 🟪 **GỘP** | `domain-modeling` → sinh ra `CONTEXT.md`/`ADR`; `code-reviewer` → tách 2 trục song song kiểu Matt; `AGENTS.md` → thêm failure-mode index kiểu Matt; `elicitation-interview` → delegate loop cho `grilling`. |

**Luồng dẫn (một câu):**
> *"Quản trị thì của BẠN (ai làm, khi nào, gate nào), kỹ thuật làm việc thì của MATT (skill nguyên tử, ngôn ngữ chung), và những điểm bạn đã có sẵn nhưng chưa nối về ngôn ngữ chung thì GỘP."*

Legend tag:
- 🟦 **BẠN** = giữ nguyên / vệ sinh của chính framework bạn
- 🟧 **MATT** = borrow thẳng từ repo Matt
- 🟪 **GỘP** = tổ hợp cả hai

---

## 1. BẠNG OVERLAP — bạn đã có gì, Matt có gì

Để biết "gap thật" là gì, map trước:

| Matt (model-invoked engineering) | Bạn đã có? | Nhận xét |
|---|---|---|
| `diagnosing-bugs` | ✅ có (`diagnosing-bugs`) | Cùng họ — chỉ cần tag trục invocation |
| `domain-modeling` | ✅ có | **GỘP**: thêm bước sinh `CONTEXT.md`/`ADR` |
| `codebase-design` | ✅ có | Đã share — giữ, tag trục |
| `wizard` | ✅ có | Đã share — giữ |
| `code-review` | ✅ (agent `code-reviewer` + skill `ui-design-review`) | **GỘP**: tách 2 trục Standards/Spec song song |
| `research` | ✅ (subagent `deep-search`) | Giữ deep-search, không nhân bản |
| `tdd` | ✅ (TDD-first trong pipeline + `verification-before-completion`) | Giữ; cân nhắc tách 1 skill `tdd` nhỏ |
| `resolving-merge-conflicts` | ⚠️ (trong `git-workflow`, chưa tách "theo intent") | **MATT**: tách skill riêng |
| `prototype` | ❌ chưa | **MATT**: thêm mới |
| `writing-for-agents` | ❌ chưa | **MATT**: thêm mới |

| Matt (user-invoked) | Bạn đã có? | Nhận xét |
|---|---|---|
| `grill-me` / `grill-with-docs` | ⚠️ (`elicitation-interview` + `intake-classifier`, chưa tách primitive) | **GỘP**: tách `grilling` |
| `triage` | ❌ | **MATT**: thêm (nếu dùng issue tracker) |
| `to-spec` | ✅ (`speckit-specify`) | **Giữ speckit** — coi to-spec là "alias no-interview" |
| `to-tickets` / `wayfinder` | ✅ (`speckit-tasks` / `taskstoissues`) | **Giữ speckit** — chỉ thêm wayfinder khi làm việc rất lớn, multi-session |
| `implement` | ✅ (`implementation-orchestrator`) | Giữ |
| `improve-codebase-architecture` | ✅ | **GỘP**: dùng `grilling` + ghi ADR |
| `setup-matt-pocock-skills` (self-config) | ❌ (onboarding hiện là copy tay + sửa Tech Stack thủ công) | **MATT**: thêm skill self-config |
| `ask-matt` (router) | ⚠️ (`AGENTS.md` là map, nhưng không có skill "skill nào hợp tình huống?") | **GỘP**: thêm skill router |

| Matt (productivity) | Bạn đã có? | Nhận xét |
|---|---|---|
| `handoff` (compact hội thoại cho agent khác) | ❌ (bạn có `handover` = BA sign-off, **khác nghĩa**) | **MATT**: thêm `handoff` riêng |
| `teach` | ❌ | **MATT/niche**: chỉ thêm nếu dùng |
| `to-questionnaire` (async cho đúng người) | ❌ | **MATT**: thêm |
| `wait-what` (pitch lại bằng vocab CONTEXT.md) | ❌ | **MATT**: thêm (phụ thuộc CONTEXT.md) |
| `grilling` (primitive) | ⚠️ rải trong elicitation | **GỘP**: tách primitive |

**Kết luận:** gap thật = `CONTEXT.md`, `ADR`, trục `invocation`, `grilling`, `prototype`, `to-questionnaire`, `wait-what`, `handoff`, `writing-for-agents`, router/self-config, 2-trục code-review, failure-mode index. Phần còn lại bạn **đã có**.

---

## 2. BẢN ĐỒ DELTA TỔNG QUÁT

### 2.1 🟦 KEEP — giữ nguyên, không động (triết lý của bạn, đang tốt)
- 8-stage BA pipeline (`intake-classifier` → `handover`)
- Mandatory subagent delegation + model-allocation matrix (Opus cho elicitation, Sonnet cho arch/review, Flash cho exec/test)
- TDD-first (`test-plan.md` trước khi code)
- Independent adversarial review (`code-reviewer` + `ui-ux-reviewer`)
- Anti-AI-slop governance (`DESIGN.md`/`MEMORY.md`, `ui-taste-pro`, `design-taste-*`, `motion-design`)
- Subagent transparency & model notification
- `rules/` (common / react / typescript: coding-style, patterns, testing, security, performance, hooks)
- `optional-stack-skills/` (nestjs, prisma, frontend, liquid-glass)
- 13 subagents — **giữ đủ 13** (không xài agent nào, Matt cũng không cần thêm agent; thay đổi nằm ở *skill*, không phải *agent*)

> Ý nghĩa: đây là "tài sản" control-plane của bạn. Sửa sẽ làm mất lợi thế governance. Chỉ gắn thêm Data Plane vào, không phá Control Plane.

### 2.2 🟧 ADD — thêm mới (borrow từ Matt)

| # | Item | Loại | Ý nghĩa |
|---|---|---|---|
| A1 | **`CONTEXT.md`** (root mỗi project) | file | **Shared language / Ubiquitous Language** (Eric Evans). Dịch lóng dự án → thuật ngữ ngắn. Trước: "a lesson in a section is made 'real' (given a spot in fs)" → Sau: "the materialization cascade". Lợi: giảm verbose, **tiết kiệm token suy nghĩ**, naming nhất quán, agent điều hướng codebase dễ hơn. *(bản thân file = MATT, nhưng nguồn nội dung được sinh từ domain-modeling của bạn → thực tế 🟪)* |
| A2 | **`adr/` + `adr-template.md`** | dir + file | **Architecture Decision Record** cho những quyết định "khó giải thích". Ghi cả quyết định tooling (Matt có `.agents/adr/0002-ship-as-a-claude-code-plugin.md`). immutable, chỉ thêm không sửa. |
| A3 | **`grilling`** (model-invoked primitive) | skill | **Mô phỏng/khảo sát không mệt mỏi** cho đến khi mọi nhánh design-tree được giải quyết. Là "xương sống" chung; `grill-with-docs`, `triage`, `wayfinder`, `improve-codebase-architecture` đều delegate về đây. *(nội dung lấy từ `elicitation-interview` của bạn → 🟪)* |
| A4 | **`prototype`** (model-invoked) | skill | Build **HTML throwaway** trả lời 1 câu hỏi design: hoặc 1 file shareable cho câu hỏi state/logic, hoặc **nhiều biến thể UI rất khác nhau** trên cùng 1 route (toggle). Rẻ, dùng trước khi commit vào sản phẩm thật. |
| A5 | **`to-questionnaire`** (user-invoked) | skill | Biến quyết định "mình không trả lời được một mình" thành **Markdown questionnaire** cho đúng người có thể trả lời, **async** (điền sau) hoặc họp. Nó khảo sát "gửi cho ai, cần lại gì", không phải nội dung chuyên môn. |
| A6 | **`wait-what`** (user-invoked) | skill | Dùng **ngay khi 1 message không "land"**. Agent pitch lại bằng tiếng đơn giản, đúng vocab trong `CONTEXT.md`. Phụ thuộc A1. |
| A7 | **`writing-for-agents`** (model-invoked) | skill | **Cách viết tài liệu CHO agent đọc** (skill, AGENTS.md, mọi doc agent chạm tới qua pointer). Rút gọn, actionable, tránh "người viết cho người". |
| A8 | **`handoff`** (user-invoked) | skill | **Compact hội thoại hiện tại** thành handoff-doc để agent khác nối tiếp. Khác hẳn `handover` (BA sign-off) của bạn — giữ cả hai, tách scope. |
| A9 | **Failure-mode index** (sec trong `AGENTS.md`) | nội dung | Ánh xạ "triệu chứng hỏng" → "skill nào". Giúp troubleshoot theo failure-mode (triết lý Matt) thay vì chỉ theo phase. |
| A10 | **Router skill** (`route` / "which-skill") (user-invoked) | skill | Thay `ask-matt`. Hỏi "tình huống này nên dùng skill/flow nào?". Bổ trợ `AGENTS.md` (map) bằng 1 skill callable. |
| A11 | **Self-config skill** (thay `setup-matt-pocock-skills`) (user-invoked) | skill | Chạy **1 lần/repo**: tự hỏi issue tracker (GitHub/Linear/local), triage labels, layout doc, bảng Tech Stack → tự ghi. Thay vì copy tay + sửa thủ công. |
| A12 | **`resolving-merge-conflicts`** (model-invoked) | skill | Tách khỏi `git-workflow`: xử lý conflict **hunk-by-hunk**, trace intent về source của **mỗi bên**, không bao giờ `--abort`. |

> Chọn lọc (YAGNI): A4–A8, A12 là "thêm khi thật sự dùng". **Bắt buộc thêm trước:** A1, A2, A3, A9, A10, A11 (nhóm leverage cao, rủi ro thấp).

### 2.3 🟧 REORGANIZE — cấu trúc lại (borrow trục của Matt)

| # | Item | Ý nghĩa |
|---|---|---|
| R1 | **Tag `invocation: user\|model`** trong frontmatter mọi skill | Làm rõ ai được quyền gọi. Matt split đúng 1 trục này. |
| R2 | **Invariant: user-invoked gọi được model-invoked, KHÔNG gọi user-invoked khác** | Ngăn "vòng lặp điều phối", mỗi orchestrator chỉ có 1. |
| R3 | **Gom nhóm `engineering/` + `productivity/`** (hoặc giữ flat + tag) | Tăng khả năng discoverability. Đề xuất: **giữ flat + tag** (thoải mái hơn với template universal của bạn, ít move file). |

> Đây là "đẻ" (cheap, low-risk) nhất nhưng có **leverage cao** vì R1+R2 ràng buộc cả Control Plane của bạn.

### 2.4 🟪 MODIFY — sửa hiện có (gộp bạn + Matt)

| # | Item | Đổi gì | Ý nghĩa |
|---|---|---|---|
| M1 | `domain-modeling` | **Thêm bước** "update `CONTEXT.md` + ghi ADR inline" mỗi khi có thuật ngữ/định nghĩa mới | Skill DM của bạn (RBAC/State/BR/ERD) giờ **sinh ra shared-language artifacts** của Matt. Cầu nối 2 plane. |
| M2 | `elicitation-interview` | **Delegate** vòng hỏi-chuyên-sâu cho primitive `grilling` | DRY: 1 nguồn "cách hỏi", nhiều "vỏ điều phối". |
| M3 | `code-reviewer` (agent) / `ui-design-review` | **Tách 2 pass song song, context độc lập:** (a) **Standards** (theo coding-style + Fowler smell baseline) (b) **Spec** (faithful với spec/issue gốc) | Mỗi trục một sub-context → "không trục nào ô nhiễm trục kia". Bạn có agent rồi, chỉ tách trục. |
| M4 | `improve-codebase-architecture` | Dùng `grilling` primitive + ghi ADR cho việc "deepen" nào được chọn | Đối phiên với bản của Matt (survey → HTML report → grill). |
| M5 | `AGENTS.md` | Thêm `CONTEXT.md` + `adr/` vào **danh sách bắt buộc đọc** trước khi code; thêm Failure-mode index (A9) | Agent luôn "bắt" shared language + troubleshoot theo failure-mode. |
| M6 | `GEMINI.md` | **Khử cứng-cod WordStreak** (sec 5 hiện reference `apps/web/DESIGN.md`, `MEMORY.md` của WordStreak) → **parameterize** | Template "universal" mà đang bake 1 project cụ thể. Lấy design-token riêng về phía project đích; giữ chỉ generic anti-slop + governance. *(🟦 vệ sinh)* |
| M7 | `speckit-specify` | Ghi chú trong README rằng nó ≈ `to-spec` của Matt (không nhân bản to-spec) | Tránh trùng lặp (CONSOLIDATE). |

### 2.5 🟪 CONSOLIDATE — giải va chạm / không nhân bản

| Va chạm | Chốt |
|---|---|
| `to-spec`(Matt) vs `speckit-specify`(bạn) | **Giữ speckit.** Không thêm `to-spec`. |
| `to-tickets`/`wayfinder`(Matt) vs `speckit-tasks`/`taskstoissues`(bạn) | **Giữ speckit.** Chỉ thêm `wayfinder` nếu bạn thường xuyên lên kế hoạch việc cực lớn (vượt 1 session). |
| `research`(Matt) vs subagent `deep-search`(bạn) | **Giữ `deep-search`.** Không nhân bản. |
| `handoff`(Matt) vs `handover`(bạn) | **Giữ cả hai, tách scope rõ:** `handover`=BA sign-off (control plane), `handoff`=compact hội thoại (data plane). Đổi tên hoặc thêm 1 dòng "NOT to be confused with" trong mỗi skill. |
| `codebase-design`/`diagnosing-bugs`/`wizard`/`domain-modeling` | **Đã share** — không đổi nội dung, chỉ tag trục invocation (R1). |

### 2.6 🟦 CLEANUP — dọn / di chuyển (hygiene của chính bạn)

| # | Item | Ý nghĩa |
|---|---|---|
| C1 | **Tách `wordstreak-ba-skills` + `wordstreak-workflow`** ra khỏi template universal | Template "universal/language-agnostic" đang chứa skill **đặc thù WordStreak**. Di chuyển về phía project WordStreak (hoặc giữ làm *example* rõ nhãn). |
| C2 | **Cân nhắc `teach`, `triage`** (MATT) | Chỉ thêm nếu bạn thật sự dùng (YAGNI). `triage` cần issue-tracker labels → gắn với A11. |
| C3 | Kiểm tra các skill "gốc ECC/optional" trùng | `optional-stack-skills/` (nestjs, prisma...) là *bổ sung theo stack* — giữ tách khỏi core để template không phình. |

---

## 3. CÂY THƯ MỤC MỤC TIÊU (after)

```
Universal-Agents-Workflow/            (master template, vẫn universal sau khi C1+M6)
├── README.md                        (+ thêm: axis user/model, failure-mode, cách ADR/CONTEXT)
├── GEMINI.md                        (M6: de-WordStreak, parameterized; thêm ref shared-language)
├── CONTEXT.md                       (A1: mẫu template + placeholder — project đích fill)
├── adr/                             (A2)
│   └── adr-template.md
├── .agents/
│   ├── AGENTS.md                    (M5: + CONTEXT/ADR required; A9: failure-mode index)
│   ├── agents/                      (KEEP đủ 13 — không thêm agent)
│   │   └── ... (code-reviewer.md: M3 tách 2 trục)
│   ├── rules/                       (KEEP: common/react/typescript)
│   ├── scripts/                     (KEEP hooks; A11: thêm setup/self-config script)
│   └── skills/                      (flat + tag invocation: R1/R3)
│       # ---- BA / control plane (🟦 BẠN) ----
│       intake-classifier/           (KEEP; thêm failure-mode framing nhẹ)
│       elicitation-interview/       (M2: delegate → grilling)
│       gap-analysis/                (KEEP)
│       domain-modeling/            (M1: + sinh CONTEXT/ADR)
│       risk-contradiction-scanner/  (KEEP)
│       spec-writer/                 (KEEP)
│       spec-validator/              (KEEP)
│       handover/                    (KEEP; note "≠ handoff")
│       speckit-*                    (KEEP; M7: note ≈ to-spec)
│       implementation-orchestrator/ (KEEP)
│       verification-before-completion/ (KEEP; cân nhắc tách skill `tdd` nhỏ)
│       ui-design-review/            (M3 phần UI: 2-trục)
│       user-guide-with-screenshots/ (KEEP)
│       technical-documentation/     (KEEP)
│       git-workflow/                (M12 tách → resolving-merge-conflicts)
│       wizard/                      (KEEP — đã share với Matt)
│       diagnosing-bugs/             (KEEP — đã share; tag model)
│       codebase-design/             (KEEP — đã share; tag model)
│       improve-codebase-architecture/ (M4: grilling + ADR)
│       motion-design/ design-taste-*/ ui-taste-pro/ frontend-* (KEEP, 🟦 anti-slop)
│       command-*                    (KEEP)
│       # ---- data plane mới (🟧 MATT) ----
│       grilling/                    (A3: primitive)
│       prototype/                   (A4)
│       to-questionnaire/            (A5)
│       wait-what/                   (A6)
│       writing-for-agents/          (A7)
│       handoff/                     (A8)
│       route/                       (A10: router)
│       setup-workspace/             (A11: self-config, 1 lần/repo)
│       resolving-merge-conflicts/   (A12)
│       (triage/ , teach/            (C2: tùy chọn))
├── .specify/                        (KEEP: templates, workflows)
└── optional-stack-skills/           (KEEP, tách khỏi core — C3)
```

> **Không thêm agent nào.** Mọi thay đổi nằm ở **skill + artifacts (CONTEXT/ADR) + cấu trúc trục**. Đây có chủ đích: giữ Control Plane (13 agent + matrix model) nguyên vẹn, chỉ làm dày Data Plane.

---

## 4. THỨ TỰ ƯU TIÊN (effort/risk)

**P0 — làm trước (leverage cao, rủi ro thấp, "đẻ"):**
1. R1+R2+R3 — tag `invocation` + invariant cho 39 skill (chỉ sửa frontmatter).
2. A1 `CONTEXT.md` + A2 `adr/` (thêm file mẫu, chưa cần nội dung thật).
3. M1 `domain-modeling` → sinh CONTEXT/ADR (nối 2 plane).
4. M3 code-review 2-trục song song.
5. A9 failure-mode index + M5 required-reads trong AGENTS.md.

**P1 — tiếp (giá trị lớn hơn, effort vừa):**
6. A3 `grilling` + M2 (tách primitive, DRY elicitation).
7. A10 `route` (router) + A11 `setup-workspace` (self-config).
8. M6 de-WordStreak trong GEMINI.md (vệ sinh universal).
9. C1 tách wordstreak-* khỏi template.

**P2 — thêm khi dùng thật (YAGNI, MATT):**
10. A4 `prototype`, A5 `to-questionnaire`, A6 `wait-what`, A7 `writing-for-agents`, A8 `handoff`, A12 `resolving-merge-conflicts`.
11. C2 `triage`, `teach` (nếu cần).

---

## 5. CÂU HỎI CẦN BẠN CHỐT (trước khi thực thi)

1. **Trục skill:** bạn chọn **(a)** giữ flat + tag `invocation` (đề xuất, ít move) hay **(b)** gom `engineering/`+`productivity/` như Matt (đẹp nhưng move ~40 thư mục)?
2. **`handover` vs `handoff`:** giữ cả 2 (đề xuất) hay đổi tên 1 để tránh nhầm?
3. **wordstreak-*** : tách hẳn ra khỏi template universal (đề xuất) hay giữ làm example có nhãn?
4. **GEMINI.md**: parameterize design-token (rút về project đích) — bạn có OK tách phần WordStreak hardcode ra?
5. **P2 skills** (prototype, to-questionnaire, wait-what, handoff, ...): thêm ngay P1 hay để P2 "when-needed"?
6. **Speckit vs Matt's to-spec/to-tickets**: chốt **giữ speckit làm chuẩn** (đề xuất) và bỏ ý định thêm to-spec/to-tickets?

trả lời câu hỏi: 1 - b, 2 giữ cả 2 đề xuất. 3 - tách ra vì đây là dự án cũ, 4 - ok, 5 - thêm ngay p1, 6 - làm theo đề xuất , bạn hãy thay đổi cho mình dựa án theo hướng đề xuất trên nhé

---

## 6. BƯỚC KẾ TIẾP (mình có thể draft trước, KHÔNG auto-commit)

Nếu bạn gật, mình sẽ soạn (và chờ bạn duyệt theo quy tắc Git governance của bạn):
- `CONTEXT.md` (template + hướng dẫn fill) + `adr/adr-template.md`
- frontmatter mẫu có trường `invocation:` + invariant note
- 2 skill nhỏ: `route` (router) và `setup-workspace` (self-config)
- bản `failure-mode index` bổ sung vào `AGENTS.md`
- diff gợi ý cho `domain-modeling` (M1) và `code-reviewer` (M3)

> Tuân thủ: mọi thứ chỉ là draft + chờ sign-off; scope-log ghi vào CHANGELOG; không chạy `git add/commit/push` trừ khi bạn ra `/command-git-push`.

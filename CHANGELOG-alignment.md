# Alignment Progress & Changelog (mattpocock/skills alignment)

> **Mục đích:** Theo dõi tiến độ chỉnh sửa và đối chiếu `Universal-Agents-Workflow` theo triết lý kết hợp với `mattpocock/skills`, căn cứ trên các quyết định đã được người dùng chốt trong `PROPOSAL-framework-alignment.md`.

---

## 1. Tóm tắt Quyết định Thiết kế (User Decisions)

| #   | Câu hỏi                              | Quyết định của người dùng                    | Hướng thực hiện                                                                                                                                                                  |
| --- | ------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Cấu trúc trục skill**              | **(b) Gom `engineering/` + `productivity/`** | Phân loại toàn bộ kỹ năng vào 2 nhóm: `engineering/` (kỹ thuật, kiến trúc, kiểm thử, mẫu mã) và `productivity/` (phỏng vấn, làm rõ, router, bàn giao ngữ cảnh).                  |
| 2   | **`handover` vs `handoff`**          | **Giữ cả 2 đề xuất**                         | `handover`: Gate ký duyệt BA Baseline Phase 1.<br>`handoff`: Kỹ năng cô đọng hội thoại / ngữ cảnh để chuyển giao agent giữa các phiên. Thêm chú thích phân biệt rõ ở cả 2 skill. |
| 3   | **Tách WordStreak**                  | **Tách ra vì là dự án cũ**                   | Xóa thư mục `examples/wordstreak/` khỏi template universal. Loại bỏ toàn bộ hardcode liên quan đến WordStreak trong hooks, `GEMINI.md`, `AGENTS.md`, agents và skills.           |
| 4   | **Khử hardcode trong `GEMINI.md`**   | **OK (Parameterize)**                        | Chuyển Mục 5 của `GEMINI.md` thành tiêu chuẩn Anti-AI-Slop và Design System chung (tham chiếu design tokens của từng dự án đích), tích hợp `CONTEXT.md` và `adr/`.               |
| 5   | **Tiến độ bổ sung skill (P2 vs P1)** | **Thêm ngay trong đợt này (P1)**             | Triển khai đầy đủ các kỹ năng: `prototype`, `to-questionnaire`, `wait-what`, `writing-for-agents`, `handoff`, `resolving-merge-conflicts`, `route`, `setup-workspace`.           |
| 6   | **Speckit vs to-spec/to-tickets**    | **Giữ Speckit làm chuẩn**                    | Giữ vững `speckit-*` của framework, ghi chú vai trò tương đương `to-spec` / `to-tickets` của Matt để tránh trùng lặp.                                                            |

---

## 2. Bảng Tiến độ Chi tiết (Action Checklist)

### Pha 1: Cấu trúc & Nền tảng Shared Language (P0)

- [x] **A1: `CONTEXT.md`** — Tạo file mẫu Ubiquitous Language tại gốc dự án.
- [x] **A2: `adr/adr-template.md`** — Tạo thư mục lưu trữ Architecture Decision Records và mẫu chuẩn.
- [x] **R1+R2+R3: Tag `invocation: user | model`** — Chuẩn hóa frontmatter trên toàn bộ 40+ kỹ năng.
- [x] **Phân nhóm thư mục**: Đã phân chia thành `.agents/skills/engineering/` và `.agents/skills/productivity/`.

### Pha 2: Bổ sung Kỹ năng Mới (P1 & P2 hợp nhất)

- [x] **A3: `grilling`** (`.agents/skills/productivity/grilling/SKILL.md`) — Primitive phỏng vấn / đào sâu quyết định đa nhánh.
- [x] **A4: `prototype`** (`.agents/skills/engineering/prototype/SKILL.md`) — Tạo mẫu thử nghiệm throwaway nhanh để làm rõ thiết kế (HTML/UI variants).
- [x] **A5: `to-questionnaire`** (`.agents/skills/productivity/to-questionnaire/SKILL.md`) — Tạo bảng câu hỏi Markdown async gửi đúng người giải quyết.
- [x] **A6: `wait-what`** (`.agents/skills/productivity/wait-what/SKILL.md`) — Giải thích lại thông điệp bằng ngôn ngữ đơn giản theo `CONTEXT.md`.
- [x] **A7: `writing-for-agents`** (`.agents/skills/engineering/writing-for-agents/SKILL.md`) — Hướng dẫn soạn tài liệu, skill và luật tối ưu cho AI agent.
- [x] **A8: `handoff`** (`.agents/skills/productivity/handoff/SKILL.md`) — Cô đọng session context cho agent khác tiếp quản (phân biệt rõ với `handover`).
- [x] **A12: `resolving-merge-conflicts`** (`.agents/skills/engineering/resolving-merge-conflicts/SKILL.md`) — Giải quyết conflict git theo intent của từng bên.
- [x] **A10: `route`** (`.agents/skills/productivity/route/SKILL.md`) — Router xác định kỹ năng / quy trình phù hợp tình huống hoặc triệu chứng.
- [x] **A11: `setup-workspace`** (`.agents/skills/productivity/setup-workspace/SKILL.md`) — Tự động hóa cấu hình và onboarding dự án lần đầu.

### Pha 3: Cải tiến & Gộp Kỹ năng Hiện có (Modify / Consolidate)

- [x] **M1: `domain-modeling`** — Thêm bước tự động cập nhật `CONTEXT.md` inline và ghi nhận ADR vào `adr/`; tổng quát hóa ví dụ khỏi WordStreak.
- [x] **M2: `elicitation-interview`** — Ủy quyền vòng lặp phỏng vấn cho primitive `grilling`; đồng bộ `CONTEXT.md` inline.
- [x] **M3: `code-reviewer`** — Tách thành 2 pass độc lập: Standards Pass (chuẩn mực, bảo mật, anti-patterns) và Spec Fidelity Pass (đối chiếu yêu cầu spec/issue); de-WordStreak.
- [x] **M4: `improve-codebase-architecture`** — Cập nhật tham chiếu tới primitive `grilling` và ghi nhận ADR vào `adr/`.
- [x] **Phân biệt `handover` & `handoff`** — Thêm ghi chú phân biệt rõ ràng vào `handover/SKILL.md` và `handoff/SKILL.md`.
- [x] **M7: `speckit-specify`** — Ghi chú vai trò tương đương `to-spec` của Matt Pocock với tích hợp sâu spec-kit.

### Pha 4: Dọn dẹp & Khử cứng WordStreak (Universal Hygiene)

- [x] **C1: Xóa `examples/wordstreak`** — Đã xóa hoàn toàn thư mục ví dụ dự án cũ khỏi master template.
- [x] **Hooks: Cập nhật `session-context-init.js`** — Tự động nhận diện stack, package manifest, git branch, `CONTEXT.md` và `adr/` động; xóa bỏ hoàn toàn hardcode WordStreak monorepo.
- [x] **M6: Cập nhật `GEMINI.md`** — Khử hardcode WordStreak ở Mục 5, chuyển thành tiêu chuẩn chung về Design System, tham chiếu `CONTEXT.md`, `adr/` và Anti-AI-Slop.
- [x] **M5: Cập nhật `AGENTS.md`** — Đổi tiêu đề thành Universal Development Workflow; thêm `CONTEXT.md` & `adr/` vào danh mục bắt buộc đọc; thêm **Failure-Mode Index (A9)**; chuẩn hóa đường dẫn skills phân nhóm `engineering/` và `productivity/`.
- [x] **Tài liệu hóa: `README.md`** — Cập nhật sơ đồ 2 mặt phẳng (Control Plane + Data Plane), hướng dẫn onboard dự án qua `setup-workspace` và sơ đồ phân loại kỹ năng.

---

## 3. Nhật ký Chi tiết các Tệp Thay đổi (Files Changed Log)

| Tệp                                                                 | Hành động      | Nội dung thay đổi                                                                                    |
| ------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `CHANGELOG-alignment.md`                                            | Tạo mới        | File theo dõi tiến độ và lưu vết thay đổi theo yêu cầu người dùng.                                   |
| `CONTEXT.md`                                                        | Chỉnh sửa      | Bản dịch tiếng Anh chuẩn Ubiquitous Language (Eric Evans) & Shared Language (Matt Pocock).           |
| `adr/adr-template.md`                                               | Tạo mới (P0)   | Mẫu Architecture Decision Record chuẩn (Status, Context, Decision, Consequences).                    |
| `.agents/skills/productivity/grilling/SKILL.md`                     | Tạo mới (A3)   | Primitive phỏng vấn đa nhánh, kiểm soát câu hỏi batch 2-3, zero silent assumptions.                  |
| `.agents/skills/engineering/prototype/SKILL.md`                     | Tạo mới (A4)   | Tạo mockup throwaway (Mode A: logic/state HTML, Mode B: UI multi-variants).                          |
| `.agents/skills/productivity/to-questionnaire/SKILL.md`             | Tạo mới (A5)   | Chuyển quyết định phụ thuộc bên ngoài thành bảng câu hỏi async Markdown.                             |
| `.agents/skills/productivity/wait-what/SKILL.md`                    | Tạo mới (A6)   | Giải thích lại thông điệp/khái niệm khó hiểu bằng từ ngữ đơn giản và `CONTEXT.md`.                   |
| `.agents/skills/engineering/writing-for-agents/SKILL.md`            | Tạo mới (A7)   | Chuẩn mực viết tài liệu cho AI: density cao, pointer thay vì duplicate, failure modes.               |
| `.agents/skills/productivity/handoff/SKILL.md`                      | Tạo mới (A8)   | Cô đọng session context cho agent khác tiếp nối; phân biệt rõ với `handover`.                        |
| `.agents/skills/engineering/resolving-merge-conflicts/SKILL.md`     | Tạo mới (A12)  | Giải quyết xung đột git theo intent của từng bên, không bao giờ blind abort.                         |
| `.agents/skills/productivity/route/SKILL.md`                        | Tạo mới (A10)  | Router định tuyến quy trình và kỹ năng theo giai đoạn hoặc theo triệu chứng failure.                 |
| `.agents/skills/productivity/setup-workspace/SKILL.md`              | Tạo mới (A11)  | Kỹ năng tự động phát hiện stack và cấu hình repo lần đầu (`CONTEXT.md`, `adr/`).                     |
| `.agents/skills/engineering/domain-modeling/SKILL.md`               | Chỉnh sửa (M1) | Thêm bước đồng bộ `CONTEXT.md` inline & ghi nhận ADR; loại bỏ ví dụ WordStreak.                      |
| `.agents/skills/engineering/elicitation-interview/SKILL.md`         | Chỉnh sửa (M2) | Ủy quyền câu hỏi sâu cho `grilling`; cập nhật `CONTEXT.md` inline; de-WordStreak.                    |
| `.agents/skills/agents/code-reviewer.md`                            | Chỉnh sửa (M3) | Tách 2 pass độc lập: Pass A (Standards & Security) và Pass B (Spec Fidelity); de-WordStreak.         |
| `.agents/skills/engineering/improve-codebase-architecture/SKILL.md` | Chỉnh sửa (M4) | Tham chiếu primitive `grilling` và ghi nhận ADR vào `adr/`.                                          |
| `.agents/skills/engineering/handover/SKILL.md`                      | Chỉnh sửa      | Thêm note phân biệt với `handoff`; de-WordStreak.                                                    |
| `.agents/skills/engineering/speckit-specify/SKILL.md`               | Chỉnh sửa (M7) | Ghi chú vai trò tương đương `to-spec` với spec-kit native.                                           |
| `.agents/skills/engineering/ui-design-review/SKILL.md`              | Chỉnh sửa      | Chuẩn hóa dual-pass UI review; de-WordStreak.                                                        |
| `examples/wordstreak/`                                              | Xóa bỏ (C1)    | Loại bỏ hoàn toàn ví dụ WordStreak cũ khỏi master template.                                          |
| `.agents/scripts/hooks/session-context-init.js`                     | Chỉnh sửa      | Nhận diện ngữ cảnh dự án động (package.json, git branch, CONTEXT.md, adr/); xóa WordStreak hardcode. |
| `GEMINI.md`                                                         | Chỉnh sửa (M6) | Chuyển Section 5 thành Design System & Anti-AI-Slop tổng quát; bổ sung CONTEXT.md/adr.               |
| `.agents/AGENTS.md`                                                 | Chỉnh sửa (M5) | Universal hóa workflow; bổ sung Failure-Mode Index (A9); cập nhật bảng kỹ năng và đường dẫn.         |
| `README.md`                                                         | Chỉnh sửa      | Cập nhật tổng thể kiến trúc 2 mặt phẳng, sơ đồ phân nhóm và hướng dẫn onboard.                       |

### Pha 5: Triết lý Matt Pocock & Chuẩn hóa Đa Ngôn Ngữ (Polyglot)

- [x] **Kỹ năng Hồi cứu `retro`**: Tạo `.agents/skills/productivity/retro/SKILL.md` đánh giá 5 trụ cột môi trường (Navigation, Automated checks, Coding standards, AGENTS.md hygiene, Tool economy).
- [x] **Kỹ năng Thám hiểm `wayfinder`**: Tạo `.agents/skills/engineering/wayfinder/SKILL.md` lập bản đồ quyết định (Decision tickets) cho bài toán lớn vượt phiên trước khi vào BA spec.
- [x] **Kỹ năng Seam Kiến trúc `setup-deep-modules`**: Tạo `.agents/skills/engineering/setup-deep-modules/SKILL.md` tự động cài đặt linter kiểm soát ranh giới module sâu đa ngôn ngữ.
- [x] **Cơ cấu Thư mục Ngôn ngữ Chuyên Dụng**:
  - Tạo `optional-stack-skills/languages/` gồm `python/` (`.importlinter.ini`, `python-patterns`), `go/` (`depguard.yaml`, `go-patterns`), `rust/` (`rust-patterns`), `typescript/` (`dependency-cruiser.config.cjs`).
  - Gom các framework vào `optional-stack-skills/frameworks/` (`nestjs-patterns`, `prisma-patterns`, `frontend-patterns`, `liquid-glass-design`).
- [x] **Khóa Cứng Git Guardrails**: Tạo hook `.agents/scripts/hooks/git-guardrails.js` và đăng ký vào `hooks.json` chặn đứng các lệnh nguy hiểm (`git push --force`, `git reset --hard`, `git clean -fd`, `git branch -D`).
- [x] **Phổ Quát Hóa Toàn Bộ Hooks (Polyglot)**:
  - `pre-push-test.js`: Tự động nhận diện test runner của Rust, Go, Python, Node, Java thay vì ép buộc pnpm.
  - `package-install-guardian.js`: Tự động kiểm tra lockfile (`pnpm`, `npm`, `yarn`, `bun`, `poetry`) thay vì hardcode WordStreak/pnpm.
  - `auto-format-on-edit.js`: Tích hợp thêm `ruff format`/`black` (Python), `gofmt` (Go), `rustfmt` (Rust) bên cạnh Prettier.
  - `prevent-direct-main-commit.js` & `prisma-safety-guard.js`: Khử cứng các đường dẫn cục bộ.
- [x] **Quy Chế Fast-Track Micro-Task**:
  - Cập nhật `intake-classifier/SKILL.md` thêm cấp độ thứ 4 (**Micro-Task / Fast-Fix**): cho phép bypass BA 8 stages và `.specify/features/<slug>/` đối với các thay đổi nhỏ (< 30 dòng), đi thẳng vào chu trình TDD.
  - Đồng bộ hóa quy chế Micro-Task và tính chất Polyglot vào `AGENTS.md` và `GEMINI.md`.

---

## 3. Nhật ký Chi tiết các Tệp Thay đổi (Files Changed Log)

| Tệp                                                             | Hành động      | Nội dung thay đổi                                                                                 |
| --------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| `CHANGELOG-alignment.md`                                        | Tạo mới        | File theo dõi tiến độ và lưu vết thay đổi theo yêu cầu người dùng.                                |
| `CONTEXT.md`                                                    | Chỉnh sửa      | Bản dịch tiếng Anh chuẩn Ubiquitous Language (Eric Evans) & Shared Language (Matt Pocock).        |
| `adr/adr-template.md`                                           | Tạo mới (P0)   | Mẫu Architecture Decision Record chuẩn (Status, Context, Decision, Consequences).                 |
| `.agents/skills/productivity/grilling/SKILL.md`                 | Tạo mới (A3)   | Primitive phỏng vấn đa nhánh, kiểm soát câu hỏi batch 2-3, zero silent assumptions.               |
| `.agents/skills/engineering/prototype/SKILL.md`                 | Tạo mới (A4)   | Tạo mockup throwaway (Mode A: logic/state HTML, Mode B: UI multi-variants).                       |
| `.agents/skills/productivity/to-questionnaire/SKILL.md`         | Tạo mới (A5)   | Chuyển quyết định phụ thuộc bên ngoài thành bảng câu hỏi async Markdown.                          |
| `.agents/skills/productivity/wait-what/SKILL.md`                | Tạo mới (A6)   | Giải thích lại thông điệp/khái niệm khó hiểu bằng từ ngữ đơn giản và `CONTEXT.md`.                |
| `.agents/skills/engineering/writing-for-agents/SKILL.md`        | Tạo mới (A7)   | Chuẩn mực viết tài liệu cho AI: density cao, pointer thay vì duplicate, failure modes.            |
| `.agents/skills/productivity/handoff/SKILL.md`                  | Tạo mới (A8)   | Cô đọng session context cho agent khác tiếp nối; phân biệt rõ với `handover`.                     |
| `.agents/skills/engineering/resolving-merge-conflicts/SKILL.md` | Tạo mới (A12)  | Giải quyết xung đột git theo intent của từng bên, không bao giờ blind abort.                      |
| `.agents/skills/productivity/route/SKILL.md`                    | Tạo mới (A10)  | Router định tuyến quy trình và kỹ năng theo giai đoạn hoặc theo triệu chứng failure.              |
| `.agents/skills/productivity/setup-workspace/SKILL.md`          | Cập nhật (A11) | Tự động hóa cấu hình repo lần đầu & liên kết kỹ năng chuyên dụng theo ngôn ngữ/framework.         |
| `.agents/skills/productivity/retro/SKILL.md`                    | Tạo mới        | Kỹ năng hồi cứu sau phiên làm việc & tối ưu hóa môi trường theo Matt Pocock.                      |
| `.agents/skills/engineering/wayfinder/SKILL.md`                 | Tạo mới        | Bản đồ quyết định (Decision tickets) thám hiểm bài toán lớn trước khi viết Spec.                  |
| `.agents/skills/engineering/setup-deep-modules/SKILL.md`        | Tạo mới        | Kỹ năng tự động hóa ranh giới Deep Modules đa ngôn ngữ (TS, Python, Go, Rust, Java).              |
| `optional-stack-skills/languages/`                              | Tạo mới        | Cấu hình mẫu & kỹ năng chuyên dụng cho từng ngôn ngữ: Python, Go, Rust, TypeScript.               |
| `optional-stack-skills/frameworks/`                             | Tái cấu trúc   | Gom nhóm các kỹ năng framework (NestJS, Prisma, React, Liquid Glass).                             |
| `.agents/scripts/hooks/git-guardrails.js`                       | Tạo mới        | Khóa cứng cơ học chặn đứng các lệnh git nguy hiểm (push --force, reset --hard, clean, branch -D). |
| `.agents/hooks.json`                                            | Cập nhật       | Đăng ký hook `git-guardrails` vào PreToolUse.                                                     |
| `.agents/scripts/hooks/pre-push-test.js`                        | Cập nhật       | Kiểm thử đa ngôn ngữ động (Rust, Go, Python, Node, Java) trước khi push.                          |
| `.agents/scripts/hooks/package-install-guardian.js`             | Cập nhật       | Bảo vệ lockfile đa ngôn ngữ (pnpm, npm, yarn, bun, poetry), loại bỏ hardcode WordStreak.          |
| `.agents/scripts/hooks/auto-format-on-edit.js`                  | Cập nhật       | Định dạng code tự động đa ngôn ngữ: Ruff/Black (Python), Gofmt (Go), Rustfmt (Rust), Prettier.    |
| `.agents/scripts/hooks/prevent-direct-main-commit.js`           | Cập nhật       | Khử sạch tàn dư WordStreak.                                                                       |
| `.agents/scripts/hooks/prisma-safety-guard.js`                  | Cập nhật       | Động hóa lệnh sinh Prisma Client theo package manager của repo.                                   |
| `.agents/skills/engineering/intake-classifier/SKILL.md`         | Cập nhật       | Bổ sung cấp độ Micro-Task / Fast-Fix bypass BA 8 stages; xóa bỏ tàn dư WordStreak.                |
| `GEMINI.md`                                                     | Cập nhật       | Tuyên bố đa ngôn ngữ 100% & quy chế Fast-Track cho Micro-Task.                                    |
| `.agents/AGENTS.md`                                             | Cập nhật       | Cập nhật quy chế Micro-Task, Failure-Mode Index và ma trận kỹ năng mới.                           |
| `README.md`                                                     | Cập nhật       | Cập nhật cấu trúc thư mục mới và các kỹ năng bổ sung.                                             |

### Pha 6: Phổ Quát Hóa Subagents & Tái Cấu Trúc Rules On-Demand

- [x] **Phổ quát hóa 100% 13 Subagents (`.agents/agents/`)**:
  - `backend-developer.md`: Xóa bỏ NestJS, Prisma, PostgreSQL, SuperMemo-2; chuyển thành Senior Polyglot Backend Engineer tự động nhận diện ngôn ngữ và thực thi TDD & Deep Modules.
  - `frontend-developer.md`: Xóa bỏ React 19, Tailwind, Nunito; chuyển thành Senior Polyglot Frontend & UI Engineer tuân thủ design tokens dự án đích, 4 UX states, WCAG AA và Anti-AI-Slop.
  - `system-architect.md`: Xóa bỏ các ví dụ monorepo/vocabulary; chuyển thành Senior Polyglot System Architect.
  - `business-analyst.md`: Xóa sạch xưng danh dự án cũ; bổ sung định tuyến Micro-Task Fast-Track.
  - `build-resolver.md`: Chuyển từ bảng tra cứu monorepo WordStreak sang bảng chẩn đoán lỗi compiler/typecheck đa ngôn ngữ (Go, Rust, Python, TypeScript, Java).
  - `slice-implementer.md`, `tech-doc-architect.md`, `user-guide-creator.md`, `e2e-runner.md`, `agent-evaluator.md`, `code-explorer.md`, `ui-ux-reviewer.md`: Đã khử sạch hoàn toàn 100% tàn dư xưng danh WordStreak.
- [x] **Tái cơ cấu thư mục `rules/` theo triết lý On-Demand**:
  - Di chuyển `.agents/rules/react/` $\rightarrow$ `optional-stack-skills/frameworks/react-rules/`.
  - Di chuyển `.agents/rules/typescript/` $\rightarrow$ `optional-stack-skills/languages/typescript/rules/`.
  - Khởi tạo rules mẫu cho `optional-stack-skills/languages/python/rules/coding-style.md` và `go/rules/coding-style.md`.
  - Tinh gọn `.agents/rules/common/agents.md` & `development-workflow.md` sạch tàn dư dự án cũ.
- [x] **Tạo Danh mục Metadata Agent Đa Nền Tảng**:
  - Tạo `.agents/agents/openai.yaml` khai báo đầy đủ 13 subagents cho các hệ thống như OpenAI Codex, Claude Code, và Antigravity.

---

## 3. Nhật ký Chi tiết các Tệp Thay đổi (Files Changed Log)

| Tệp                                                             | Hành động      | Nội dung thay đổi                                                                                 |
| --------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| `CHANGELOG-alignment.md`                                        | Tạo mới        | File theo dõi tiến độ và lưu vết thay đổi theo yêu cầu người dùng.                                |
| `CONTEXT.md`                                                    | Chỉnh sửa      | Bản dịch tiếng Anh chuẩn Ubiquitous Language (Eric Evans) & Shared Language (Matt Pocock).        |
| `adr/adr-template.md`                                           | Tạo mới (P0)   | Mẫu Architecture Decision Record chuẩn (Status, Context, Decision, Consequences).                 |
| `.agents/skills/productivity/grilling/SKILL.md`                 | Tạo mới (A3)   | Primitive phỏng vấn đa nhánh, kiểm soát câu hỏi batch 2-3, zero silent assumptions.               |
| `.agents/skills/engineering/prototype/SKILL.md`                 | Tạo mới (A4)   | Tạo mockup throwaway (Mode A: logic/state HTML, Mode B: UI multi-variants).                       |
| `.agents/skills/productivity/to-questionnaire/SKILL.md`         | Tạo mới (A5)   | Chuyển quyết định phụ thuộc bên ngoài thành bảng câu hỏi async Markdown.                          |
| `.agents/skills/productivity/wait-what/SKILL.md`                | Tạo mới (A6)   | Giải thích lại thông điệp/khái niệm khó hiểu bằng từ ngữ đơn giản và `CONTEXT.md`.                |
| `.agents/skills/engineering/writing-for-agents/SKILL.md`        | Tạo mới (A7)   | Chuẩn mực viết tài liệu cho AI: density cao, pointer thay vì duplicate, failure modes.            |
| `.agents/skills/productivity/handoff/SKILL.md`                  | Tạo mới (A8)   | Cô đọng session context cho agent khác tiếp nối; phân biệt rõ với `handover`.                     |
| `.agents/skills/engineering/resolving-merge-conflicts/SKILL.md` | Tạo mới (A12)  | Giải quyết xung đột git theo intent của từng bên, không bao giờ blind abort.                      |
| `.agents/skills/productivity/route/SKILL.md`                    | Tạo mới (A10)  | Router định tuyến quy trình và kỹ năng theo giai đoạn hoặc theo triệu chứng failure.              |
| `.agents/skills/productivity/setup-workspace/SKILL.md`          | Cập nhật (A11) | Tự động hóa cấu hình repo lần đầu & liên kết kỹ năng chuyên dụng theo ngôn ngữ/framework.         |
| `.agents/skills/productivity/retro/SKILL.md`                    | Tạo mới        | Kỹ năng hồi cứu sau phiên làm việc & tối ưu hóa môi trường theo Matt Pocock.                      |
| `.agents/skills/engineering/wayfinder/SKILL.md`                 | Tạo mới        | Bản đồ quyết định (Decision tickets) thám hiểm bài toán lớn trước khi viết Spec.                  |
| `.agents/skills/engineering/setup-deep-modules/SKILL.md`        | Tạo mới        | Kỹ năng tự động hóa ranh giới Deep Modules đa ngôn ngữ (TS, Python, Go, Rust, Java).              |
| `optional-stack-skills/languages/`                              | Tạo mới        | Cấu hình mẫu & kỹ năng chuyên dụng cho từng ngôn ngữ: Python, Go, Rust, TypeScript.               |
| `optional-stack-skills/frameworks/`                             | Tái cấu trúc   | Gom nhóm các kỹ năng framework (NestJS, Prisma, React, Liquid Glass).                             |
| `.agents/scripts/hooks/git-guardrails.js`                       | Tạo mới        | Khóa cứng cơ học chặn đứng các lệnh git nguy hiểm (push --force, reset --hard, clean, branch -D). |
| `.agents/hooks.json`                                            | Cập nhật       | Đăng ký hook `git-guardrails` vào PreToolUse.                                                     |
| `.agents/scripts/hooks/pre-push-test.js`                        | Cập nhật       | Kiểm thử đa ngôn ngữ động (Rust, Go, Python, Node, Java) trước khi push.                          |
| `.agents/scripts/hooks/package-install-guardian.js`             | Cập nhật       | Bảo vệ lockfile đa ngôn ngữ (pnpm, npm, yarn, bun, poetry), loại bỏ hardcode WordStreak.          |
| `.agents/scripts/hooks/auto-format-on-edit.js`                  | Cập nhật       | Định dạng code tự động đa ngôn ngữ: Ruff/Black (Python), Gofmt (Go), Rustfmt (Rust), Prettier.    |
| `.agents/scripts/hooks/prevent-direct-main-commit.js`           | Cập nhật       | Khử sạch tàn dư WordStreak.                                                                       |
| `.agents/scripts/hooks/prisma-safety-guard.js`                  | Cập nhật       | Động hóa lệnh sinh Prisma Client theo package manager của repo.                                   |
| `.agents/skills/engineering/intake-classifier/SKILL.md`         | Cập nhật       | Bổ sung cấp độ Micro-Task / Fast-Fix bypass BA 8 stages; xóa bỏ tàn dư WordStreak.                |
| `GEMINI.md`                                                     | Cập nhật       | Tuyên bố đa ngôn ngữ 100% & quy chế Fast-Track cho Micro-Task.                                    |
| `.agents/AGENTS.md`                                             | Cập nhật       | Cập nhật quy chế Micro-Task, Failure-Mode Index và ma trận kỹ năng mới.                           |
| `.agents/agents/*` (13 files)                                   | Cập nhật       | Phổ quát hóa 100% 13 Subagents thành Polyglot, xóa sạch WordStreak và hardcodes.                  |
| `.agents/agents/openai.yaml`                                    | Tạo mới        | Danh mục khai báo metadata đa nền tảng cho 13 Subagents.                                          |
| `.agents/rules/`                                                | Tái cấu trúc   | Chuyển react/ và typescript/ sang optional-stack-skills/, giữ common/ sạch sẽ.                    |
| `README.md`                                                     | Cập nhật       | Cập nhật cấu trúc thư mục mới và các kỹ năng bổ sung.                                             |

---

## 4. Trạng thái Hiện tại

- **Đã hoàn thành 100% việc tích hợp các giá trị tinh hoa của `mattpocock/skills`**.
- **Đã hoàn thành 100% 3 Đề xuất**:
  1. 13 Subagents đã độc lập với stack, tự động nhận diện ngôn ngữ của dự án đích.
  2. Thư mục `rules/` đã được tinh gọn, đưa các luật của React/TypeScript vào thư mục chuyên dụng theo cơ chế On-Demand để ngăn ngừa hiện tượng Rule Bloat và Context Fatigue.
  3. Bổ sung file catalog `openai.yaml` tương thích đa nền tảng.
- **Codebase hiện tại hoàn toàn sạch sẽ, 100% Language-Agnostic, sẵn sàng áp dụng ngay vào bất kỳ dự án thực tế nào.**

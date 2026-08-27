# 🌐 Universal Agentic Development Framework

[![Language Agnostic](https://img.shields.io/badge/Language-Polyglot-blue.svg)](#-t%E1%BB%95ng-quan--%C3%BD-ngh%C4%A9a-d%E1%BB%B1-%C3%A1n)
[![Multi-AI Support](https://img.shields.io/badge/AI_Harness-Claude%20%7C%20Cursor%20%7C%20Windsurf%20%7C%20Copilot%20%7C%20Gemini-success.svg)](#-t%C3%ADnh-t%C6%B0%C6%A1ng-th%C3%ADch-%C4%91a-n%E1%BB%81n-t%E1%BA%A3ng-ai-multi-ai-universal-support)
[![Language Extension Standard](https://img.shields.io/badge/Language%20Pack-The%20Language%20Quad-yellowgreen.svg)](#-chu%E1%BA%A9n-h%C3%B3a-g%C3%B3i-m%E1%BB%9F-r%E1%BB%99ng-ng%C3%B4n-ng%E1%BB%AF-language-pack-standard)
[![Zero Hallucination](https://img.shields.io/badge/Requirements-IREB%2FBABOK-green.svg)](#-v%C3%B2ng-%C4%91%E1%BB%9Di-ph%C3%A1t-tri%E1%BB%83n-chu%E1%BA%A9n-7-b%C6%B0%E1%BB%9Bc)
[![Deep Modules](https://img.shields.io/badge/Architecture-Ousterhout%20Seams-orange.svg)](#-tri%E1%BA%BFt-l%C3%BD-ki%E1%BA%BFn-tr%C3%BAc-c%E1%BB%91t-l%C3%B5i)
[![Anti-AI-Slop](https://img.shields.io/badge/Design-Anti--AI--Slop-purple.svg)](#-tri%E1%BA%BFt-l%C3%BD-ki%E1%BA%BFn-tr%C3%BAc-c%E1%BB%91t-l%C3%B5i)
[![Git Guardrails](https://img.shields.io/badge/Git-Hardware%20Locks-red.svg)](#-kh%C3%B3a-b%E1%BA%A3o-v%E1%BB%87-git-guardrails)

> **Bộ khung quy trình Multi-Agent & Kỹ năng AI cấp doanh nghiệp, hoạt động độc lập với mọi ngôn ngữ lập trình và tương thích với toàn bộ AI Editor hiện đại (Antigravity IDE, Cursor, Claude Code, Windsurf, Copilot).**

---

## 🎯 Ý Nghĩa Cốt Lõi Của Dự Án

Trong phát triển phần mềm với AI, các lập trình viên thường đối mặt với 4 vấn đề lớn:

1. **AI Ảo Tưởng (Hallucination)**: Tự biên tự diễn quy tắc nghiệp vụ và phỏng đoán sai yêu cầu.
2. **Kiến Trúc Rác (AI Slop & Shallow Code)**: Viết code chắp vá, phá vỡ ranh giới module, tạo giao diện màu mè rẻ tiền.
3. **Mất Ngữ Cảnh Dài Hạn**: Quên kiến trúc sau vài lượt chat, không lưu lại vết quyết định kỹ thuật.
4. **Ô Nhiễm Git Repo**: Đẩy hàng trăm file prompt, cấu hình AI cá nhân lên repo chung của công ty.

**Universal Agents Workflow** giải quyết triệt để các vấn đề trên bằng mô hình **Hai Mặt Phẳng (Two-Plane Architecture)**:

- **Control Plane (Quản trị Vòng đời)**: Ép AI tuân thủ quy trình công nghiệp nghiêm ngặt: _Khảo sát nghiệp vụ IREB (BA Pipeline) $\rightarrow$ Đặc tả kỹ thuật (SpecKit) $\rightarrow$ Lập trình kiểm thử trước (TDD) $\rightarrow$ Phản biện độc lập kép (Dual-Pass Review) $\rightarrow$ Đóng gói Modular Commit_.
- **Data Plane (Ngữ cảnh & Tri thức)**: Duy trì từ điển thuật ngữ nhất quán ([CONTEXT.md](CONTEXT.md)), ghi vết quyết định kiến trúc bất biến ([adr/](adr/)), và cơ chế **Scan First** — tự động quét tech stack để chỉ nạp đúng kỹ năng cần thiết, tuyệt đối không làm rác dự án.

---

## 🚀 Hướng Dẫn Bắt Đầu Nhanh (Quickstart)

### Phương Án 1: Tích Hợp Vào Dự Án Đang Có (Brownfield - Khuyên dùng)

Bạn có 2 cách cực kỳ linh hoạt để tích hợp bộ khung vào dự án đang làm:

#### ⚡ Cách 1: Chạy trực tiếp trong dự án của bạn (Không cần clone repo trước)

Mở terminal ngay tại thư mục dự án bạn đang làm và chạy 1 dòng lệnh duy nhất tương ứng với hệ điều hành:

- **🍎 macOS / 🐧 Linux / 🪟 Windows (Git Bash)**:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.sh | bash
  ```

  _(Hoặc: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.sh)"`)_

- **🪟 Windows (PowerShell)**:
  ```powershell
  irm https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.ps1 | iex
  ```

> Script sẽ tự động kéo các thành phần cần thiết từ GitHub về thư mục tạm, quét Tech Stack, hiển thị menu chọn chế độ Git và tích hợp sạch sẽ vào dự án của bạn, sau đó tự động dọn dẹp sạch sẽ.

#### 💻 Cách 2: Chạy từ thư mục đã clone `Universal-Agents-Workflow`

Nếu bạn đã clone thư mục `Universal-Agents-Workflow` về máy:

- **macOS / Linux / Git Bash**:
  ```bash
  ./install.sh /duong-dan/toi/du-an-cua-ban
  ```
- **Windows PowerShell**:
  ```powershell
  .\install.ps1 -Target "D:\duong-dan\toi\du-an"
  ```

---

Cả 2 cách trên đều hiển thị menu tương tác để bạn chọn **Chế độ Quản lý Git**:

```text
? Chọn chế độ quản lý Git cho Universal Agents Workflow trong dự án đích:
  1) 🌐 Team Mode (Shared)                      - Đẩy toàn bộ lên Git, chia sẻ quy chuẩn cho cả team
  2) 🔒 Local-Only Mode (Private .gitignore)     - Thêm toàn bộ workflow vào .gitignore, repo 100% sạch
  3) 🕶️ Stealth Mode (Private .git/info/exclude) - Thêm vào exclude cục bộ, không sửa cả .gitignore repo
  4) ⚖️ Hybrid Mode (Docs on Git, Engine Ignore) - Đẩy CONTEXT/adr/specs, giấu engine AI & skills
```

> [!TIP]
> **Tự động hóa hoàn toàn (Non-interactive cho CI/CD hoặc chạy nhanh)**:
>
> ```bash
> # macOS / Linux / Git Bash:
> curl -fsSL https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/install.sh | bash -s -- --mode=local -y
>
> # Windows PowerShell:
> .\install.ps1 -Mode local -Yes
> ```

#### 🛡️ Bảng So Sánh 4 Chế Độ Git:

| Chế độ                            | Khi nào nên dùng?                                                                         | Ảnh hưởng đến Git Repo                                                                                 |
| :-------------------------------- | :---------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **🌐 Team Mode**                  | Cả team đồng thuận cùng dùng AI framework.                                                | Theo dõi toàn bộ trên Git (chỉ ignore log tạm).                                                        |
| **🔒 Local-Only** _(Khuyên dùng)_ | Bạn dùng cá nhân, **không muốn đồng nghiệp/khách hàng thấy file AI**.                     | Tự động thêm toàn bộ `.agents/`, `.specify/`, `CONTEXT.md`, `GEMINI.md` vào `.gitignore`.              |
| **🕶️ Stealth Mode**               | Repo công ty khắt khe **cấm sửa cả file `.gitignore` chung**.                             | Ghi quy tắc ignore vào `.git/info/exclude` cục bộ trên máy. File `.gitignore` chung không bị chạm vào. |
| **⚖️ Hybrid Mode**                | Chia sẻ tài liệu nghiệp vụ (`CONTEXT.md`, `adr/`, `.specify/`), nhưng **giấu engine AI**. | Theo dõi tài liệu trên Git; tự động ignore `.agents/`, `GEMINI.md`, `CLAUDE.md`.                       |

> [!IMPORTANT]
> **Nguyên tắc "Scan First - Zero Clutter"**: Bộ khung **KHÔNG BAO GIỜ** copy thư mục chứa toàn bộ ngôn ngữ thừa (`optional-stack-skills`) vào dự án của bạn. Script sẽ quét codebase trước, nếu là dự án Swift/iOS thì giữ sạch 100%; nếu là Go/Python/TypeScript thì chỉ copy duy nhất kỹ năng của ngôn ngữ đó vào `.agents/skills/engineering/`!

---

### Phương Án 2: Khởi Tạo Dự Án Mới Toanh (Greenfield)

```bash
git clone https://github.com/ahauy/universal-agents-workflow.git my-new-project
cd my-new-project
rm -rf .git && git init && git branch -M main
```

Sau đó mở dự án trong AI Editor (Antigravity IDE, Cursor, Claude Code, Windsurf) và bắt đầu làm việc.

---

## 🎮 Cách Sử Dụng Bộ Kỹ Năng Trong AI Editor

Bạn có thể kích hoạt các kỹ năng theo 3 cách cực kỳ trực quan:

```mermaid
graph LR
    subgraph S1 ["Cách 1: Lệnh gõ trực tiếp"]
        C1["Nhập /skill-setup, /command-git-push..."]
    end
    subgraph S2 ["Cách 2: Ngôn ngữ tự nhiên"]
        C2["'Làm tính năng...', 'Debug lỗi query...'"]
    end
    subgraph S3 ["Cách 3: Chỉ định đích danh"]
        C3["'Dùng skill grilling phỏng vấn tôi'"]
    end
    C1 --> Agent["🤖 AI Agent nạp SKILL.md & thi hành"]
    C2 --> Agent
    C3 --> Agent
```

1. **Gõ lệnh trực tiếp vào khung chat (Khuyên dùng)**:
   - Gõ `/skill-setup` $\rightarrow$ Quét Tech Stack và kích hoạt bộ kỹ năng tương thích.
   - Gõ `/command-git-push` $\rightarrow$ Tự động kiểm tra chất lượng, chia Modular Commits và push an toàn.
   - Gõ `/command-continue-project` $\rightarrow$ Tự động quét Roadmap và làm tiếp User Story kế tiếp.
   - Gõ `/route` $\rightarrow$ Hỏi Agent xem trong tình huống hiện tại nên đi bước nào tiếp theo.
   - Gõ `/wait-what` $\rightarrow$ Yêu cầu Agent giải thích lại thuật ngữ bằng ngôn ngữ đời thường.
2. **Kích hoạt tự nhiên (Model-Invoked - Không cần nhớ lệnh)**:
   - _"Thiết kế API thanh toán qua Stripe"_ $\rightarrow$ Agent tự nạp `api-design`.
   - _"Hàm này bị crash khi chạy concurrency, tìm nguyên nhân"_ $\rightarrow$ Agent tự nạp `diagnosing-bugs`.
   - _"Giao diện này nhìn ổn chưa?"_ $\rightarrow$ Agent tự nạp `ui-design-review`.
3. **Gọi đích danh kỹ năng**:
   - _"Dùng skill `grilling` để phỏng vấn sâu tôi về tính năng này trước khi code."_
   - _"Chạy `setup-deep-modules` để thiết lập linter ranh giới module."_

---

## 🎯 2 Kịch Bản Vận Hành Thực Tế: Doanh Nghiệp vs Dự Án Cá Nhân

Framework tự động điều chỉnh độ sâu của quy trình dựa trên ngữ cảnh làm việc của bạn:

```mermaid
graph TD
    Trigger["Yêu cầu công việc mới"] --> Env{"Ngữ cảnh làm việc"}

    Env -->|🏢 Doanh nghiệp / Brownfield| Ticket["Nhận Task/Ticket từ Jira/Linear"]
    Ticket --> Classify{"Độ phức tạp (intake-classifier)"}
    Classify -->|Sửa lỗi / Việc nhỏ < 30 dòng| FT["⚡ Fast-Track TDD (Surgical Fix)<br/>Bỏ qua BA, chỉ viết test & sửa thẳng"]
    Classify -->|Tính năng vừa / Bounded| Light["📝 Bounded Flow<br/>Hỏi nhanh 2-3 câu -> Spec ngắn -> TDD"]

    Env -->|🚀 Dự án cá nhân / Greenfield| Roadmap["File docs/PRODUCT_BACKLOG_ROADMAP.md"]
    Roadmap --> Auto["🤖 Chạy lệnh /continue (/command-continue-project)<br/>Tự động quét [ ] -> Làm trọn vẹn -> Tích [x]"]
```

### 🏢 Kịch Bản 1: Doanh Nghiệp (Nhận từng Task/Ticket lẻ từ Jira, Linear...)

Trong môi trường công ty, bạn **không cần và không nên** tạo file roadmap trong repo vì công ty đã quản lý tiến độ trên Jira/Linear.

1. **Cách giao việc**: Dán trực tiếp nội dung/mã Ticket vào khung chat:
   - _Fix bug nhỏ_: `"Fix bug JIRA-892: Hàm export invoice bị crash khi customer_id = null."`
   - _Task tính năng_: `"Làm task JIRA-405: Thêm trường tax_code vào form checkout và validate định dạng MST Việt Nam."`
2. **Cơ chế xử lý tự động**:
   - **Với Micro-Task / Bug Fix (< 30 dòng - chiếm 70% công việc)**: AI kích hoạt **Fast-Track**, bỏ qua mọi thủ tục BA, đi thẳng vào TDD: _Viết test đỏ $\rightarrow$ Sửa đúng dòng code cần sửa $\rightarrow$ Test xanh $\rightarrow$ Tạo 1 single-line commit_.
   - **Với Bounded Task (30–200 dòng)**: AI chỉ hỏi bạn 2–3 câu làm rõ edge case, tạo spec ngắn rồi code.
3. **Bảo vệ Repo công ty (100% Clean PR)**:
   - Chọn chế độ Git **`local`** hoặc **`stealth`** khi cài đặt. Toàn bộ file của framework (`.agents/`, `.specify/`, prompts) đều được ẩn hoàn toàn.
   - Khi bạn tạo Pull Request, repo công ty **chỉ chứa code sản phẩm và unit test sạch sẽ chuẩn senior**, tuyệt đối không có "rác" AI.

---

### 🚀 Kịch Bản 2: Dự Án Cá Nhân (Xây dựng từ đầu theo Roadmap)

Khi xây dựng sản phẩm cá nhân hoặc MVP từ đầu, bạn làm chủ toàn bộ sản phẩm và có file lộ trình rõ ràng.

1. **Chuẩn bị Roadmap**: Tạo file `docs/PRODUCT_BACKLOG_ROADMAP.md` với danh sách checklist:
   ```markdown
   # Product Roadmap

   - [x] US-001: Đăng ký tài khoản qua Email/Password
   - [ ] US-002: Đăng nhập và tạo JWT Token
   - [ ] US-003: Quên mật khẩu và gửi OTP qua Email
   ```
2. **Kích hoạt tự động hóa toàn diện**: Gõ lệnh `/command-continue-project` (hoặc `/continue`, `/next`).
3. **AI tự động vận hành trọn gói**:
   - Quét roadmap tìm User Story `[ ]` đầu tiên chưa làm.
   - Chạy đầy đủ vòng đời: Phỏng vấn nghiệp vụ $\rightarrow$ Đặc tả SpecKit $\rightarrow$ TDD Implementation $\rightarrow$ Khởi chạy Playwright chụp ảnh màn hình thật lưu vào `docs/user-guides/`.
   - Tự động đánh dấu `[x]` vào User Story vừa hoàn tất và tạo commit chuẩn.

---

| Tiêu Chí           | 🏢 Doanh Nghiệp (Task Lẻ)                                           | 🚀 Dự Án Cá Nhân (Roadmap)                                                       |
| :----------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------- |
| **Nguồn yêu cầu**  | Ticket từ Jira / Linear / Redmine / Asana.                          | File `docs/PRODUCT_BACKLOG_ROADMAP.md`.                                          |
| **Cách kích hoạt** | Paste nội dung Ticket vào chat kèm mã task.                         | Gõ `/command-continue-project` (hoặc `/continue`).                               |
| **Thủ tục**        | Tối giản, ưu tiên **Fast-Track** để giải quyết nhanh.               | Đầy đủ từ A đến Z (BA $\rightarrow$ Spec $\rightarrow$ TDD $\rightarrow$ Guide). |
| **Chế độ Git**     | Dùng **`local`** hoặc **`stealth`** (giấu sạch file AI).            | Dùng **`team`** (theo dõi cả roadmap & spec trên Git).                           |
| **Commit Message** | Gắn kèm Ticket ID: `fix(invoice): handle null customer (JIRA-892)`. | Gắn kèm Story ID: `feat(auth): implement US-002 login JWT`.                      |

---

## 🌐 Tính Tương Thích Đa Nền Tảng AI (Multi-AI Universal Support)

Universal Agents Workflow được thiết kế độc lập hoàn toàn với bất kỳ nhà cung cấp AI nào. Hệ thống sử dụng tệp **`AGENTS.md` tại thư mục gốc** làm **Single Source of Truth** (Chân lý duy nhất) theo chuẩn mở công nghiệp, kèm theo hệ thống cầu nối tự động:

```
Thư mục dự án đích
├── AGENTS.md                          # ⭐️ Chuẩn mở công nghiệp (Single Source of Truth)
├── CLAUDE.md                          # Cầu nối tự động cho Claude Code
├── .cursorrules                       # Cầu nối tự động cho Cursor IDE
├── .windsurfrules                     # Cầu nối tự động cho Windsurf IDE
├── .github/copilot-instructions.md    # Cầu nối tự động cho GitHub Copilot
└── GEMINI.md                          # Đồng bộ trọn vẹn cho Google Antigravity / Gemini CLI
```

> Bất kể bạn hoặc đồng nghiệp mở dự án bằng công cụ AI nào, tất cả đều tuân thủ chung 100% quy trình 7 bước, tiêu chuẩn Anti-AI-Slop và kỷ luật kiểm thử TDD.

---

## 🧩 Chuẩn Hóa Gói Mở Rộng Ngôn Ngữ (Language Pack Standard)

Mọi ngôn ngữ được đưa vào hệ sinh thái đều tuân thủ nghiêm ngặt **The Language Quad (Bộ Tứ Thành Phần)** theo đặc tả kiến trúc [docs/architecture/LANGUAGE_PACK_SPEC.md](docs/architecture/LANGUAGE_PACK_SPEC.md):

1. **`skills/`**: Hướng dẫn mẫu kiến trúc Deep Modules, Concurrency và Testing đặc thù.
2. **`rules/`**: Tiêu chuẩn cú pháp, an toàn bộ nhớ và phòng chống Anti-Patterns.
3. **`agents/`**: Bộ đôi Subagents chuyên môn hóa động (**`<lang>-reviewer`** ở Phase 6A và **`<lang>-build-resolver`** ở Phase 5).
4. **`linters/`**: Cấu hình kiểm soát ranh giới module (Depguard, SwiftLint, Import-Linter...).

Bộ cài đặt `install.sh` và `install.ps1` vận hành theo cơ chế **Universal Registry-Driven Engine** đọc trực tiếp từ `catalog.json` — tự động nhận diện ngôn ngữ dự án đích và nạp chính xác các thành phần cần thiết mà không có file rác.

---

## 🔄 Vòng Đời Phát Triển Chuẩn 7 Bước (End-to-End Pipeline)

Mọi tính năng quan trọng đều được vận hành qua 7 bước chuẩn công nghiệp với các cổng kiểm soát (Gates) nghiêm ngặt:

```mermaid
flowchart TD
    S1["1. /skill-setup<br/>(Quét Stack & Bơm Skill)"] --> S2["2. Phase 1: BA Pipeline<br/>(Phỏng vấn 6 Trụ cột & Ký duyệt Baseline)"]
    S2 -->|🛑 Gate 1: Baseline Signed-Off| S3["3. Phase 2-4: SpecKit<br/>(spec.md, plan.md, tasks.md)"]
    S3 -->|🛑 Gate 2: Tech Plan Approved| S4["4. Phase 5: TDD Implementation<br/>(Red -> Green -> Refactor theo Slice)"]
    S4 --> S5["5. Phase 6A: Dual-Pass Review<br/>(Review Code & Anti-AI-Slop Độc lập)"]
    S5 --> S6["6. Phase 6B: Docs & User Guide<br/>(Diataxis Docs + Ảnh chụp Playwright thật)"]
    S6 --> S7["7. /command-git-push<br/>(Modular Commits chuẩn Conventional)"]
```

| Bước  | Tên Giai Đoạn               | Kỹ Năng / Subagent Đảm Nhiệm                               | Đầu Ra Bắt Buộc (Artifacts)                                                                                           |
| :---: | :-------------------------- | :--------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| **1** | **Onboarding Stack**        | `/skill-setup`, `setup-workspace`                          | `.agents/catalog.json`, skills, rules & subagents (`<lang>-reviewer`, `<lang>-build-resolver`) chuyên biệt cho stack. |
| **2** | **Nghiệp Vụ (BA Pipeline)** | `intake-classifier`, `elicitation-interview`, `grilling`   | `.specify/features/<slug>/baseline.md` (**Ký duyệt v1.0**).                                                           |
| **3** | **Đặc Tả & Thiết Kế**       | `speckit-specify`, `speckit-plan`, `speckit-tasks`         | `spec.md`, `plan.md`, `data-model.md`, `tasks.md`.                                                                    |
| **4** | **Lập Trình TDD**           | `code-explorer`, `backend-developer`, `frontend-developer` | `test-plan.md`, Unit Tests đỏ $\rightarrow$ xanh, Code tối giản.                                                      |
| **5** | **Phản Biện Độc Lập**       | `code-reviewer`, `ui-design-review`                        | Báo cáo kiểm tra chuẩn bảo mật, spec fidelity & Anti-AI-Slop.                                                         |
| **6** | **Tài Liệu Hóa**            | `tech-doc-architect`, `command-user-guide`                 | `docs/features/<slug>/README.md`, `docs/user-guides/<slug>.md` (Ảnh thật).                                            |
| **7** | **Đóng Gói & Đẩy Mã**       | `/command-git-push`                                        | Tự động chia Modular Commits theo tầng và push an toàn.                                                               |

> [!TIP]
> **Quy chế Fast-Track cho Micro-Task**: Với các thay đổi nhỏ (< 30 dòng, sửa bug hiển nhiên, đổi biến, sửa typo), `intake-classifier` sẽ tự động chuyển sang luồng **Fast-Track**, bỏ qua toàn bộ hồ sơ BA nặng nề để đi thẳng vào chu trình TDD: _Reproduce $\rightarrow$ Failing Test $\rightarrow$ Fix $\rightarrow$ Verify $\rightarrow$ 1-Line Commit_.

---

## 📋 Bảng Tra Cứu Toàn Bộ Kỹ Năng Mặc Định (Default Skills Cheatsheet)

Để dễ dàng theo dõi và kích hoạt đúng thời điểm, toàn bộ các kỹ năng mặc định được phân nhóm theo từng giai đoạn trong vòng đời phát triển:

### ⚡ 1. Lệnh Tự Động Hóa (Commands)

| Lệnh / Trigger                  | Bí Danh (Aliases)            | Ý Nghĩa & Giá Trị Thực Tế                                                            | Khi Nào Sử Dụng?                                         |
| :------------------------------ | :--------------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------- |
| **`/skill-setup`**              | `/setup`, `/setup-workspace` | Quét manifest dự án, đối chiếu `catalog.json` và tự động nạp kỹ năng phù hợp.        | Khi mới tích hợp workflow vào dự án hoặc đổi tech stack. |
| **`/command-git-push`**         | `/push`, `/ship`             | Kiểm tra cổng tài liệu, phân tách commit theo tầng (Modular Commit) và push an toàn. | Khi hoàn thành tính năng hoặc sửa lỗi cần đẩy lên Git.   |
| **`/command-continue-project`** | `/continue`, `/next`         | Quét `PRODUCT_BACKLOG_ROADMAP.md` và kích hoạt chu trình làm tính năng tiếp theo.    | Trong dự án cá nhân/greenfield phát triển theo roadmap.  |
| **`/command-user-guide`**       | `/user-guide`, `/guide`      | Khởi chạy Playwright chụp ảnh giao diện thực tế và viết tài liệu hướng dẫn.          | Sau khi hoàn thiện giao diện người dùng.                 |

---

### 🍉 2. Phân Tích Nghiệp Vụ (Phase 1: BA Skill Pack)

| Kỹ Năng                          | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                       | Khi Nào Sử Dụng?                                       |
| :------------------------------- | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| **`intake-classifier`**          | Đo lường độ phức tạp yêu cầu; phân luồng **Fast-Track** (cho task nhỏ < 30 dòng) hoặc **Full Pipeline**. | Điểm khởi đầu bắt buộc cho mọi yêu cầu mới.            |
| **`elicitation-interview`**      | Phỏng vấn trực tiếp 6 trụ cột nghiệp vụ (RBAC, State, Rules, Flows, Data, NFRs); cấm AI tự bịa đặt.      | Giai đoạn 2 của BA Pipeline khi làm tính năng mới.     |
| **`gap-analysis`**               | Phân tích mã nguồn và schema hiện tại; đối chiếu hiện trạng AS-IS với mục tiêu tương lai TO-BE.          | Khi làm tính năng lớn cần hiểu rõ mã nguồn cũ.         |
| **`domain-modeling`**            | Thiết kế ERD dữ liệu, ma trận phân quyền RBAC, biểu đồ trạng thái Mermaid và bộ luật `BR-###`.           | Xác lập mô hình nghiệp vụ trước khi thiết kế kỹ thuật. |
| **`risk-contradiction-scanner`** | Quét mâu thuẫn logic, rà soát bế tắc trạng thái, lập bảng rủi ro và chốt phạm vi theo MoSCoW.            | Kiểm toán an toàn nghiệp vụ trước khi viết spec.       |
| **`spec-writer`**                | Biên soạn hồ sơ nghiệp vụ BRD, PRD, SRS và các User Stories chuẩn `Given-When-Then`.                     | Xuất tài liệu đặc tả nghiệp vụ chính thức.             |
| **`spec-validator`**             | Thẩm định chất lượng yêu cầu đối chiếu theo 8 tiêu chí chuẩn công nghiệp IEEE 29148.                     | Cổng kiểm định chất lượng spec trước khi bàn giao.     |
| **`handover`**                   | Rà soát toàn bộ điều kiện nghiệm thu, ký duyệt `baseline.md v1.0` và bàn giao cho System Architect.      | Cổng kết thúc Phase 1, chuyển giao sang SpecKit.       |

---

### 🏗️ 3. Đặc Tả Kỹ Thuật & Kiến Trúc (Phase 2-4: SpecKit Planning)

| Kỹ Năng               | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                          | Khi Nào Sử Dụng?                                              |
| :-------------------- | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------ |
| **`speckit-specify`** | Chuyển đổi baseline nghiệp vụ đã ký duyệt thành đặc tả kỹ thuật chi tiết (`spec.md`).       | Phase 2: Xác định rõ ràng các API contracts và luồng dữ liệu. |
| **`speckit-plan`**    | Lập kế hoạch kiến trúc sâu (`plan.md`), thiết kế DTO contracts và cấu trúc bảng dữ liệu.    | Phase 3: Thiết kế cấu trúc hệ thống trước khi chia nhỏ việc.  |
| **`speckit-tasks`**   | Phân rã kế hoạch thành danh sách tác vụ (`tasks.md`) theo thứ tự độc lập và ranh giới seam. | Phase 4: Lập danh sách công việc sẵn sàng để thực thi TDD.    |
| **`speckit-analyze`** | Đối chiếu chéo spec, plan và tasks để đảm bảo không sót yêu cầu nào từ baseline.            | Trước khi bắt đầu viết mã để loại bỏ rủi ro sai lệch.         |

---

### ⚡ 4. Thực Thi Mã Nguồn, Kiến Trúc Sâu & Gỡ Lỗi (Phase 5: Implementation)

| Kỹ Năng                             | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                            | Khi Nào Sử Dụng?                                             |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------- |
| **`implementation-orchestrator`**   | Điều phối lập trình theo từng lát cắt độc lập (Data $\rightarrow$ Logic $\rightarrow$ API $\rightarrow$ UI).  | Phase 5: Quản lý các subagent thực thi theo TDD.             |
| **`codebase-design`**               | Thiết kế Deep Modules theo John Ousterhout: giao diện đơn giản, giấu chi tiết cài đặt, làm lộ ranh giới sạch. | Khi tạo module mới, thiết kế service hoặc refactor.          |
| **`api-design`**                    | Thiết kế REST API chuẩn mực (HTTP verbs, status codes, query pagination, versioning `/api/v1/`).              | Khi xây dựng hoặc sửa đổi endpoints backend.                 |
| **`setup-deep-modules`**            | Tự động cài đặt và cấu hình linter kiểm soát ranh giới import tĩnh (`depguard`, `import-linter`, `cruiser`).  | Khóa ranh giới kiến trúc tự động, cấm import chéo.           |
| **`improve-codebase-architecture`** | Quét các điểm nóng mã nguồn (hotspots, churn), sinh báo cáo HTML trực quan và ghi nhận ADR.                   | Khi audit kiến trúc hoặc chuẩn bị cho đợt tái cấu trúc lớn.  |
| **`diagnosing-bugs`**               | Quy trình 6 bước chẩn đoán lỗi phức tạp, flaky test hoặc crash mà không bao giờ đoán mò.                      | Khi gặp lỗi khó tái hiện hoặc nghi ngờ có regression.        |
| **`prototype`**                     | Dựng bản nháp throwaway HTML độc lập để thử nghiệm luồng/giao diện trước khi viết mã production.              | Khi phương án UI hoặc máy trạng thái chưa chắc chắn.         |
| **`e2e-testing`**                   | Thiết kế và vận hành bộ kiểm thử tự động End-to-End toàn diện với Playwright.                                 | Kiểm thử tích hợp luồng người dùng từ giao diện đến backend. |
| **`resolving-merge-conflicts`**     | Giải quyết xung đột Git từng khối (hunk-by-hunk) dựa trên chủ đích mã nguồn, không làm mất code.              | Khi merge hoặc rebase nhánh bị xung đột.                     |
| **`wizard`**                        | Hướng dẫn tự động hóa thiết lập môi trường, biến môi trường `.env` và cấu hình cloud an toàn.                 | Khi cấu hình dự án mới hoặc deploy hạ tầng.                  |

---

### 🎨 5. Thiết Kế UI/UX & Tiêu Chuẩn Anti-AI-Slop (Frontend Design)

| Kỹ Năng                     | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                         | Khi Nào Sử Dụng?                                            |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| **`ui-taste-pro`**          | Bộ quy chuẩn Anti-AI-Slop: cấm gradient neon tùy tiện, chỉ dùng viền hairline 1px, typography có phân cấp. | Bộ lọc bắt buộc cho mọi mã nguồn giao diện.                 |
| **`design-taste-frontend`** | Tiêu chuẩn thẩm mỹ thị giác hiện đại dành cho Landing Page, Marketing Page và Public Surfaces.             | Khi thiết kế trang công cộng cần gây ấn tượng mạnh.         |
| **`design-taste-product`**  | Tiêu chuẩn thiết kế giao diện ứng dụng chuyên sâu: Dashboard, Bảng dữ liệu, Form nhập liệu phức tạp.       | Khi xây dựng in-app UI, admin portal, ứng dụng web/desktop. |
| **`motion-design`**         | Tiêu chuẩn hiệu ứng chuyển động, easing curves, tương tác vi mô và hỗ trợ `prefers-reduced-motion`.        | Khi tạo animations, transitions mượt mà không gây giật lag. |
| **`frontend-a11y`**         | Tiêu chuẩn tiếp cận người dùng khuyết tật đạt chuẩn quốc tế WCAG 2.1 AA (ARIA, phím tắt, tương phản màu).  | Kiểm tra tính tiếp cận cho ứng dụng web/mobile.             |
| **`ui-design-review`**      | Quy trình phản biện giao diện kép (Pass A: Anti-Slop & Design System; Pass B: Spec & UX Fidelity).         | Phase 6A: Audit visual giao diện trước khi bàn giao.        |

---

### 📚 6. Phản Biện Chất Lượng, Tài Liệu & Đóng Gói (Phase 6: Delivery)

| Kỹ Năng                              | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                          | Khi Nào Sử Dụng?                                        |
| :----------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ |
| **`verification-before-completion`** | Thu thập bằng chứng kiểm thử thực tế (test output, log) chứng minh code hoạt động trước khi chốt task.      | Bước cuối cùng của Phase 6 trước khi tạo commit.        |
| **`technical-documentation`**        | Soạn thảo tài liệu kỹ thuật tính năng theo chuẩn 4 góc Diataxis (Tutorial, How-To, Reference, Explanation). | Phase 6B: Lưu vào `docs/features/<slug>/README.md`.     |
| **`user-guide-with-screenshots`**    | Khởi chạy Playwright chụp ảnh màn hình thật và viết tài liệu hướng dẫn cho người dùng cuối.                 | Phase 6B: Lưu vào `docs/user-guides/<slug>.md`.         |
| **`writing-for-agents`**             | Kỹ thuật viết tài liệu, rules và hướng dẫn được tối ưu hóa cho AI Agents dễ hiểu và làm theo.               | Khi bổ sung kỹ năng mới hoặc viết prompts cho subagent. |

---

### 🧠 7. Giao Tiếp, Phỏng Vấn & Năng Suất (Productivity & Collaboration)

| Kỹ Năng                | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                           | Khi Nào Sử Dụng?                                                 |
| :--------------------- | :----------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| **`grilling`**         | Kỹ thuật phỏng vấn đào sâu, liên tục đặt câu hỏi sắc bén để lột trần mọi giả định ngầm.                      | Sử dụng trong Phase 1 Elicitation hoặc khi làm rõ yêu cầu mơ hồ. |
| **`wait-what`**        | Yêu cầu AI diễn giải lại các đề xuất hoặc thuật ngữ phức tạp bằng ngôn ngữ đời thường, dễ hiểu.              | Khi người dùng thấy AI dùng quá nhiều thuật ngữ khó hiểu.        |
| **`to-questionnaire`** | Chuyển đổi các thắc mắc nghiệp vụ thành bảng khảo sát có cấu trúc để gửi bất đồng bộ cho stakeholders.       | Khi cần ý kiến từ khách hàng, Product Owner hoặc bên thứ ba.     |
| **`route`**            | Trợ lý định hướng: gợi ý chính xác kỹ năng, lệnh hoặc giai đoạn tiếp theo cần chạy dựa trên tình huống.      | Khi không chắc chắn bước tiếp theo nên làm gì.                   |
| **`handoff`**          | Nén và tổng kết toàn bộ ngữ cảnh quan trọng của phiên làm việc để bàn giao cho phiên làm việc mới.           | Khi sắp hết context window hoặc kết thúc ca làm việc.            |
| **`retro`**            | Hồi cứu phiên làm việc, phân tích những điểm chưa tối ưu để tự động đề xuất tinh chỉnh rules và skills.      | Sau khi hoàn thành một milestone lớn.                            |
| **`wayfinder`**        | Phân rã mục tiêu lớn thành bản đồ quyết định (Decision Tickets) khi đối mặt với bài toán mơ hồ (Fog of War). | Khi bắt đầu một dự án lớn hoặc bài toán kiến trúc mới toanh.     |

---

## 🔒 Khóa Bảo Vệ Git (Guardrails)

Framework tích hợp các script hook kiểm soát cơ học tại [.agents/scripts/hooks/](.agents/scripts/hooks/), bảo vệ dự án khỏi các thao tác nguy hiểm của AI:

- ❌ **Chặn đứng `git push --force` & `git push -f`**: Không thể ghi đè lịch sử nhánh từ xa.
- ❌ **Chặn đứng `git reset --hard` & `git clean -fd`**: Không thể xóa sạch mã nguồn ngoài ý muốn.
- ❌ **Chặn commit trực tiếp vào `main`/`master`**: Bắt buộc tạo nhánh tính năng (`feat/*`, `chore/*`).
- ❌ **Chặn commit chứa mã độc/Secret**: Quét tự động private keys, `.env`, tokens trước khi commit.
- ❌ **Bảo vệ Lockfile đa ngôn ngữ**: Ngăn chặn AI cài nhầm package manager làm lệch lockfile (`pnpm`, `npm`, `yarn`, `poetry`, `cargo`).

---

## 📁 Cấu Trúc Thư Mục Chuẩn

```text
Universal-Agents-Workflow/
├── install.sh                          # Script cài đặt tự động cho macOS/Linux (Registry-Driven)
├── install.ps1                         # Script cài đặt tự động cho Windows PowerShell (Registry-Driven)
├── AGENTS.md                           # ⭐️ Single Source of Truth (Chuẩn mở công nghiệp cho AI Agents)
├── CLAUDE.md                           # Cầu nối tự động cho Anthropic Claude Code
├── GEMINI.md                           # Chỉ dẫn vận hành chuyên biệt cho Google Antigravity / Gemini CLI
├── .cursorrules                        # Cầu nối tự động cho Cursor IDE
├── .windsurfrules                      # Cầu nối tự động cho Windsurf / Cascade IDE
├── .github/
│   └── copilot-instructions.md         # Cầu nối tự động cho GitHub Copilot
├── CONTEXT.md                          # Từ điển thuật ngữ chung (Ubiquitous Language)
├── adr/                                # Hồ sơ lưu vết các quyết định kiến trúc bất biến
│   ├── adr-template.md
│   └── 0001-record-architecture-decisions.md
├── docs/                               # Tài liệu dự án theo chuẩn Diataxis
│   ├── architecture/                   # Đặc tả kiến trúc (LANGUAGE_PACK_SPEC.md...)
│   ├── features/                       # Tài liệu kỹ thuật các tính năng
│   └── user-guides/                    # Hướng dẫn sử dụng kèm ảnh chụp màn hình thật
├── .specify/                           # Thư mục chứa đặc tả & hồ sơ BA của các tính năng
│   ├── features/                       # Mỗi tính năng có 1 thư mục riêng (<slug>/)
│   └── templates/                      # Mẫu tài liệu chuẩn IEEE 29148
├── .agents/                            # Bộ não & công cụ vận hành của AI Agent
│   ├── catalog.json                    # Kho đăng ký động kỹ năng & module theo stack
│   ├── skills.json                     # Khai báo đường dẫn nạp kỹ năng cho AI
│   ├── mcp_config.json                 # Cấu hình máy chủ MCP (Playwright, Code-Review-Graph)
│   ├── agents/                         # Danh mục subagents chuyên môn hóa
│   ├── rules/                          # Quy chuẩn coding style theo ngôn ngữ
│   ├── scripts/hooks/                  # Các khóa bảo vệ Git cơ học
│   └── skills/
│       ├── engineering/                # Kỹ năng kỹ thuật, BA, TDD, Review & Commands
│       └── productivity/               # Kỹ năng giao tiếp, phỏng vấn & định tuyến
└── optional-stack-skills/              # Kho gói mở rộng ngôn ngữ chuẩn (The Language Quad)
    ├── catalog.json                    # Single Source of Truth của toàn bộ hệ sinh thái
    ├── languages/                      # Swift, Go, Python, Rust, TypeScript...
    └── frameworks/                     # React, NestJS, Prisma...
```

---

## 🤝 Đóng Góp & Giấy Phép

Framework được thiết kế theo triết lý mở, trung lập với mọi nền tảng và ngôn ngữ. Mọi đóng góp cải tiến kỹ năng, luật kiểm tra ranh giới kiến trúc hay tối ưu hóa prompt đều được hoan nghênh qua Pull Request!

Phát triển với ❤️ bởi cộng đồng AI Engineer Việt Nam. Giấy phép **MIT License**.

# 📋 Bảng Tra Cứu Toàn Bộ Kỹ Năng & Lệnh (Default Skills Cheatsheet)

> **Mục tiêu**: Bảng tra cứu nhanh toàn bộ hơn 25 kỹ năng mặc định và lệnh tự động hóa trong **Universal Agents Workflow**, phân nhóm theo từng giai đoạn trong vòng đời phát triển phần mềm.

---

## ⚡ 1. Lệnh Tự Động Hóa (Commands)

| Lệnh / Trigger                  | Bí Danh (Aliases)                      | Ý Nghĩa & Giá Trị Thực Tế                                                                                                | Khi Nào Sử Dụng?                                         |
| :------------------------------ | :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| **`/skill-setup`**              | `/setup`, `/setup-workspace`           | Quét manifest dự án, đối chiếu `catalog.json` và tự động nạp kỹ năng phù hợp.                                            | Khi mới tích hợp workflow vào dự án hoặc đổi tech stack. |
| **`/command-generate-backlog`** | `/generate-backlog`, `/create-roadmap` | Phỏng vấn nghiệp vụ 6 câu và tự sinh roadmap chuẩn schema v1.1 chống hallucination.                                      | Bắt đầu dự án mới hoặc khi có ý tưởng sản phẩm từ đầu.   |
| **`/command-continue-project`** | `/continue`, `/next`                   | Quét `PRODUCT_BACKLOG_ROADMAP.md`, phỏng vấn `grilling` gỡ blocker `[!]` và kích hoạt chu trình làm tính năng tiếp theo. | Trong dự án cá nhân/greenfield phát triển theo roadmap.  |
| **`/command-git-push`**         | `/push`, `/ship`                       | Kiểm tra cổng tài liệu, phân tách commit theo tầng (Modular Commit) và push an toàn.                                     | Khi hoàn thành tính năng hoặc sửa lỗi cần đẩy lên Git.   |
| **`/command-user-guide`**       | `/user-guide`, `/guide`                | Khởi chạy Playwright chụp ảnh giao diện thực tế và viết tài liệu hướng dẫn.                                              | Sau khi hoàn thiện giao diện người dùng.                 |
| **`/command-update`**           | `/update`, `/upgrade`                  | Cập nhật framework an toàn với động cơ 3-Way Hash; bảo vệ 100% dữ liệu dự án và giữ nguyên custom skill.                 | Khi có bản phát hành mới hoặc muốn đồng bộ framework.    |

---

## 🍉 2. Phân Tích Nghiệp Vụ (Phase 1: BA Skill Pack)

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

## 🏗️ 3. Đặc Tả Kỹ Thuật & Kiến Trúc (Phase 2-4: SpecKit Planning)

| Kỹ Năng                     | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                                        | Khi Nào Sử Dụng?                                                                |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------ |
| **`speckit-specify`**       | Chuyển đổi baseline nghiệp vụ đã ký duyệt thành đặc tả kỹ thuật chi tiết (`spec.md`).                                     | Phase 2: Xác định rõ ràng các API contracts và luồng dữ liệu.                   |
| **`speckit-plan`**          | Lập kế hoạch kiến trúc sâu (`plan.md` với **C4 diagrams + Module Boundary Map**), DTO contracts, data model.              | Phase 3: Thiết kế cấu trúc hệ thống và visual architecture trước khi code.      |
| **`speckit-tasks`**         | Phân rã kế hoạch thành danh sách tác vụ (`tasks.md`) theo thứ tự độc lập và ranh giới seam.                               | Phase 4: Lập danh sách công việc sẵn sàng để thực thi TDD.                      |
| **`scaffold-architecture`** | Dựng khung thư mục, seed base files, ghi ADR-ARCH-001, cập nhật Module Map. Luôn hỏi user chọn blueprint.                 | **Phase 3.5 (P3→P5 Bridge)**: Sau plan, trước code — tạo nền cho subagents.     |
| **`archify`**               | Biên dịch sơ đồ tương tác (Architecture, Workflow, Sequence, Dataflow, Lifecycle) và ảnh 1200×630 Share Cards từ JSON IR. | Phase 1 (FSM), Phase 2-4 (System Map), Phase 6A (Diff), Phase 6B (Share Cards). |
| **`speckit-analyze`**       | Đối chiếu chéo spec, plan và tasks để đảm bảo không sót yêu cầu nào từ baseline.                                          | Trước khi bắt đầu viết mã để loại bỏ rủi ro sai lệch.                           |

---

## ⚡ 4. Thực Thi Mã Nguồn, Kiến Trúc Sâu & Gỡ Lỗi (Phase 5: Implementation)

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

## 🎨 5. Thiết Kế UI/UX & Tiêu Chuẩn Anti-AI-Slop (Frontend Design)

| Kỹ Năng                     | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                         | Khi Nào Sử Dụng?                                            |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| **`ui-taste-pro`**          | Bộ quy chuẩn Anti-AI-Slop: cấm gradient neon tùy tiện, chỉ dùng viền hairline 1px, typography có phân cấp. | Bộ lọc bắt buộc cho mọi mã nguồn giao diện.                 |
| **`design-taste-frontend`** | Tiêu chuẩn thẩm mỹ thị giác hiện đại dành cho Landing Page, Marketing Page và Public Surfaces.             | Khi thiết kế trang công cộng cần gây ấn tượng mạnh.         |
| **`design-taste-product`**  | Tiêu chuẩn thiết kế giao diện ứng dụng chuyên sâu: Dashboard, Bảng dữ liệu, Form nhập liệu phức tạp.       | Khi xây dựng in-app UI, admin portal, ứng dụng web/desktop. |
| **`motion-design`**         | Tiêu chuẩn hiệu ứng chuyển động, easing curves, tương tác vi mô và hỗ trợ `prefers-reduced-motion`.        | Khi tạo animations, transitions mượt mà không gây giật lag. |
| **`frontend-a11y`**         | Tiêu chuẩn tiếp cận người dùng khuyết tật đạt chuẩn quốc tế WCAG 2.1 AA (ARIA, phím tắt, tương phản màu).  | Kiểm tra tính tiếp cận cho ứng dụng web/mobile.             |
| **`ui-design-review`**      | Quy trình phản biện giao diện kép (Pass A: Anti-Slop & Design System; Pass B: Spec & UX Fidelity).         | Phase 6A: Audit visual giao diện trước khi bàn giao.        |

---

## 📚 6. Phản Biện Chất Lượng, Tài Liệu & Đóng Gói (Phase 6: Delivery)

| Kỹ Năng                              | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                          | Khi Nào Sử Dụng?                                        |
| :----------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ |
| **`verification-before-completion`** | Thu thập bằng chứng kiểm thử thực tế (test output, log) chứng minh code hoạt động trước khi chốt task.      | Bước cuối cùng của Phase 6 trước khi tạo commit.        |
| **`technical-documentation`**        | Soạn thảo tài liệu kỹ thuật tính năng theo chuẩn 4 góc Diataxis (Tutorial, How-To, Reference, Explanation). | Phase 6B: Lưu vào `docs/features/<slug>/README.md`.     |
| **`user-guide-with-screenshots`**    | Khởi chạy Playwright chụp ảnh màn hình thật và viết tài liệu hướng dẫn cho người dùng cuối.                 | Phase 6B: Lưu vào `docs/user-guides/<slug>.md`.         |
| **`writing-for-agents`**             | Kỹ thuật viết tài liệu, rules và hướng dẫn được tối ưu hóa cho AI Agents dễ hiểu và làm theo.               | Khi bổ sung kỹ năng mới hoặc viết prompts cho subagent. |

---

## 🧠 7. Giao Tiếp, Phỏng Vấn & Năng Suất (Productivity & Collaboration)

| Kỹ Năng                | Ý Nghĩa Ngắn Gọn & Giá Trị Thực Tế                                                                           | Khi Nào Sử Dụng?                                                 |
| :--------------------- | :----------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| **`grilling`**         | Kỹ thuật phỏng vấn đào sâu, liên tục đặt câu hỏi sắc bén để lột trần mọi giả định ngầm.                      | Sử dụng trong Phase 1 Elicitation hoặc khi làm rõ yêu cầu mơ hồ. |
| **`wait-what`**        | Yêu cầu AI diễn giải lại các đề xuất hoặc thuật ngữ phức tạp bằng ngôn ngữ đời thường, dễ hiểu.              | Khi người dùng thấy AI dùng quá nhiều thuật ngữ khó hiểu.        |
| **`to-questionnaire`** | Chuyển đổi các thắc mắc nghiệp vụ thành bảng khảo sát có cấu trúc để gửi bất đồng bộ cho stakeholders.       | Khi cần ý kiến từ khách hàng, Product Owner hoặc bên thứ ba.     |
| **`route`**            | Trợ lý định hướng: gợi ý chính xác kỹ năng, lệnh hoặc giai đoạn tiếp theo cần chạy dựa trên tình huống.      | Khi không chắc chắn bước tiếp theo nên làm gì.                   |
| **`handoff`**          | Nén và tổng kết toàn bộ ngữ cảnh quan trọng của phiên làm việc để bàn giao cho phiên làm việc mới.           | Khi sắp hết context window hoặc kết thúc ca làm việc.            |
| **`retro`**            | Hồi cứu phiên làm việc, phân tích những điểm chưa tối ưu để tự động đề xuất tinh chỉnh rules và skills.      | Sau khi hoàn thành một milestone lớn.                            |
| **`wayfinder`**        | Phân rã mục tiêu lớn thành bản đồ quyết định (Decision Tickets) khi đối mặt với bài toán mơ hồ (Fog of War). | Khi bắt đầu một dự án lớn hoặc bài toán kiến trúc mới toanh.     |

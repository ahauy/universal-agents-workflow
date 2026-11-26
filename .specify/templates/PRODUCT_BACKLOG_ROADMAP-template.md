---
project: "<Tên dự án đã xác nhận>"
tech-stack:
  language: "<Đã xác nhận | unresolved | not applicable>"
  backend: "<Đã xác nhận | unresolved | not applicable>"
  frontend: "<Đã xác nhận | unresolved | not applicable>"
  database: "<Đã xác nhận | unresolved | not applicable>"
  infra: "<Đã xác nhận | unresolved | not applicable>"
  test: "<Đã xác nhận | unresolved | not applicable>"
git-mode: "<Đã xác nhận: team | local | stealth | hybrid; hoặc unresolved>"
schema-version: "1.2"
---

# Product Backlog & Execution Roadmap

> `[x]` xác nhận story DEV_COMPLETE theo AC, không xác nhận đã deploy. Khi có
> release, dẫn tới docs/releases/<version>.md để ghi RELEASE_READY và kết quả
> PRODUCTION_VERIFIED hoặc thất bại/phục hồi; không tạo hồ sơ release cho từng task.

> **Sản phẩm:** `<Tên và mô tả đã xác nhận>`
> **Cập nhật:** `<YYYY-MM-DD>`
> **Nguồn quyết định:** `<Câu trả lời, tài liệu hoặc bằng chứng đã xác nhận>`

Template chỉ cung cấp cấu trúc. Khi render, giữ nội dung có bằng chứng; không
biến placeholder thành scope, stack, điểm số hoặc cam kết. Tái sử dụng quyết định
đã xác nhận, ghi câu hỏi chưa rõ thành `ASM-` và đánh `[!]` cho story bị ảnh hưởng
bởi quyết định nghiệp vụ còn thiếu. Không đặt lại câu hỏi đã có câu trả lời.

**Trạng thái:** `[ ]` chưa làm; `[/]` đang làm; `[!]` bị chặn/cần quyết định;
`[~]` được xác nhận hoãn; `[x]` hoàn thành với bằng chứng đạt AC và gate áp dụng.
Công việc mới bắt đầu bằng `[ ]` hoặc `[!]`; chỉ giữ `[x]` có bằng chứng sẵn có.

## Scope và Won't-Have

| Phạm vi | Quyết định đã xác nhận | Nguồn / bằng chứng |
| --- | --- | --- |
| In scope | <Kết quả/hành vi được xác nhận> | <Nguồn> |
| Won't-Have | <Chỉ ghi giới hạn đã được xác nhận; chưa có thì unresolved> | <Nguồn hoặc ASM- id> |

Không suy ra giới hạn nền tảng, offline, auth, billing hay sản phẩm từ template.

## Ưu tiên MoSCoW và RICE

| Epic | Kết quả người dùng | MoSCoW | RICE inputs / bằng chứng | RICE Score | Priority | Sprint |
| --- | --- | --- | --- | --- | --- | --- |
| <Epic id> | <Kết quả đã xác nhận> | <Đã xác nhận / unresolved> | <Reach, Impact, Confidence, Effort và nguồn; hoặc unavailable> | <Tính từ inputs và cách tính có bằng chứng; hoặc unavailable> | <Đã xác nhận / unresolved> | <Đã thống nhất / unscheduled> |

Không tự đặt số, công thức hoặc lịch. Khi thiếu ước lượng, giữ `unavailable` và
nêu thông tin cần bổ sung; không biến ước lượng chưa rõ thành điểm ưu tiên.

## Release roadmap và dependency chain

```text
<Release / sprint đã thống nhất, hoặc unscheduled>
  └── <Story id đã xác nhận> — <Trạng thái có bằng chứng>
<Story id> -> <Story phụ thuộc đã xác nhận; chưa rõ thì ASM- id>
```

Chỉ render sprint, setup và release work có trong scope đã xác nhận. Không mặc
định dự án đã setup, có CI/CD, Docker, backend, frontend hoặc database.

## Setup / architecture tasks (nếu áp dụng)

- [ ] **SETUP-<id>**: `<Công việc setup đã xác nhận>`
  - **Bằng chứng cần đạt:** `<Kết quả quan sát được>`
  - **Depends-on:** `<Id đã xác nhận | none đã xác nhận | unresolved>`
  - **Nguồn / câu hỏi:** `<Bằng chứng hoặc ASM- id>`

Setup áp dụng checkpoint, lane và gates của UAW giống mọi implementation task.
Bỏ phần này nếu không có công việc setup trong scope.

## Sprint: `<Tên / mục tiêu đã xác nhận, hoặc unscheduled>`

> **Mục tiêu:** `<Kết quả nghiệp vụ đã xác nhận và nguồn>`

- [ ] **US-<MOD>-<id>**: `<Động từ + kết quả người dùng đã xác nhận>`
  - **Slug:** `<kebab-case-slug>`
  - **Effort:** `<S | M | L | XL có cơ sở, hoặc unresolved>`
  - **Context-budget:** `<single-session | multi-session có cơ sở, hoặc unresolved>`
  - **Priority:** `<MoSCoW / mức ưu tiên đã xác nhận, hoặc unresolved>`
  - **Depends-on:** `<Story ids | none đã xác nhận | unresolved>`
  - **Blocks:** `<Story ids | none đã xác nhận | unresolved>`
  - **Mô tả:** `<Giá trị nghiệp vụ, actor và hành vi đã xác nhận>`
  - **Nguồn / open decisions:** `<Bằng chứng và ASM- ids còn mở>`
  - **Acceptance Criteria (AC):**
    - [ ] `<Given / When / Then có thể quan sát và kiểm chứng>`
  - **Tasks (phạm vi sơ bộ; chỉ giữ các lớp áp dụng):**
    - [ ] **Backend:** `<Công việc đã có căn cứ, nếu có backend>`
    - [ ] **Frontend:** `<Công việc đã có căn cứ, nếu có frontend>`
    - [ ] **Khác:** `<Công việc áp dụng khác, nếu có>`
  - **Deliverables / bằng chứng khi [x]:**
    - `<Kết quả AC, kiểm chứng và self-check/review theo lane được chọn>`
    - `<Full: artifact/gate/docs theo AGENTS.md; Fast không tạo Full folder>`
    - `<User guide chỉ khi áp dụng cho thay đổi/release đã xác nhận>`

Nhân bản block story theo scope đã xác nhận. Tasks là scope notes, không phải
lệnh phân công subagent hay phê duyệt thiết kế. Effort và Context-budget mô tả
scope/ước lượng, không quyết định lane hoặc miễn checkpoint T1–T7.

## Deferred / future scope (nếu đã xác nhận)

- [~] **US-FUTURE-<id>**: `<Ý tưởng đã được xác nhận hoãn; nguồn quyết định>`

Không tự bổ sung ý tưởng tương lai. Khi được chọn lại, xác nhận hành vi/AC và
phụ thuộc còn thiếu qua checkpoint trước khi triển khai.

## Definition of Done

Chỉ chuyển story sang `[x]` khi AC đã xác nhận được đáp ứng, verification phù
hợp đã pass và không có Critical còn mở. Bằng chứng gồm `<Lệnh/check, kết quả,
đường dẫn liên quan>`. Áp dụng chuẩn và gate tại `AGENTS.md`:

- **Fast:** checkpoint/plan trong chat, một context, verification và self-check;
  không ép baseline, feature folder, subagent hoặc bộ docs Full.
- **Full:** Gate 1 và 2 trước implementation; scoped slices, review và feature
  documentation theo gates. User guide/screenshot chỉ khi thay đổi áp dụng.
- Git writes chỉ khi được user cho phép theo `AGENTS.md` §0.1.

## Release / go-live (chỉ khi nằm trong scope)

| Công việc đã xác nhận | Điều kiện áp dụng / bằng chứng | Phụ thuộc | Kiểm chứng cần đạt | Trạng thái |
| --- | --- | --- | --- | --- |
| <Release task id và nội dung> | <Bề mặt thực tế/rủi ro và nguồn> | <Ids / none đã xác nhận / unresolved> | <Kết quả quan sát được> | [ ] |

Chỉ thêm kiểm tra security, migration/rollback, routing, smoke test hoặc monitoring
phù hợp bề mặt thực tế. Không yêu cầu auth, database, cloud hay stack cụ thể.
Deployment không miễn checkpoint/lane/gates; đánh giá rủi ro theo cùng quy tắc UAW.

**Cấu hình release (nếu có):** `<Tên biến/config từ code hoặc quyết định đã xác
nhận; nguồn, môi trường và cách cung cấp an toàn>`. Không điền secrets hoặc tự
chọn token lifetime, port, URL, công nghệ hay policy chưa được xác nhận.

## Hướng dẫn tiếp tục cho AI

Quy trình chuẩn nằm tại `AGENTS.md` §2 và
`.agents/skills/engineering/command-continue-project/SKILL.md`; đọc và thực hiện
khi `/command-continue-project` chạy. Template không định nghĩa pipeline riêng.

Tái sử dụng AC/bằng chứng, kiểm tra trạng thái blocker và `Depends-on` trước khi
triển khai; không làm story khi dependency chưa hoàn thành hoặc business gap còn
mở. Dùng checkpoint và T1–T7 để chọn lane cho cả setup, story và deployment.
Chỉ Full mới có scoped delegation và Full artifacts sau approval gates. Không
suy lane từ Effort/Context-budget hoặc suy approval từ thứ tự roadmap.

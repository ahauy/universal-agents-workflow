# Kế hoạch kỹ thuật: UAW tự chủ, BA theo Fast/Full

**Status:** APPROVED — chủ dự án duyệt Gate 2 trong chat ngày 2026-11-26.
**Baseline:** [SIGNED-OFF v1.0](baseline.md).
**Spec:** [spec.md](spec.md). **Tasks:** [tasks.md](tasks.md).

## Kết quả triển khai

Một quy trình UAW file-based thống nhất: checkpoint hiểu yêu cầu trước triển
khai; Fast gọn cho hành vi đã rõ; Full cho nghiệp vụ mới/chưa rõ hoặc rủi ro.
Giữ SDD hữu ích bằng skill nội bộ, không cần runtime SpecKit.

## Thay đổi cụ thể

1. **Quy tắc chung:** sửa AGENTS.md, tài liệu pipeline/walkthrough/tra cứu, agent
   personas và common rules. Giữ T1..T6, thêm T7 cho nghiệp vụ mới/chưa xác nhận;
   bỏ roadmap bypass và nhãn Tier/Lean Task dùng thay cho lane.
2. **Điểm vào:** đồng bộ intake-classifier, /generate-backlog, /continue, root
   adapters và context hook. Sinh backlog từ phân tích domain đã xác nhận;
   tái sử dụng bằng chứng, không hỏi lại hoặc ép đủ một số câu cố định.
3. **Kỹ thuật UAW:** tạo bốn skill cold technical-spec, implementation-plan,
   task-breakdown, technical-consistency-review. Viết lại hợp đồng đầu vào/đầu ra
   và template theo spec.md; không đổi tên cơ học các prompt cũ.
4. **Tương thích:** thay mười skill speckit-* bằng stub chuyển hướng/thông báo
   nghỉ dùng theo bảng dưới; bỏ upstream workflow registration/YAML và references
   chỉ phục vụ runtime cũ. Không ép xóa file tùy chỉnh ở dự án đã cài.
5. **Tham chiếu:** cập nhật router, handover/scaffold/implementation skills,
   template/registry, catalog đôi, build-skill-index và script sync liên quan;
   sinh lại SKILLS.md. Giữ attribution, hồ sơ đã duyệt và ADR lịch sử.
6. **Kiểm chứng:** kiểm tra cấu trúc/tên/đường dẫn, các tình huống lane/BA/roadmap,
   hooks, installer và cài mới/cài lại. Review độc lập, viết báo cáo nghiệm thu
   và successor ADR; ghi rõ giới hạn đo chi phí và môi trường.

## Bảng tên cũ → hướng xử lý

| Tên cũ | Canonical UAW / hướng dẫn |
| --- | --- |
| speckit-specify | technical-spec |
| speckit-plan | implementation-plan |
| speckit-tasks | task-breakdown |
| speckit-analyze | technical-consistency-review |
| speckit-clarify | elicitation-interview theo lane và bằng chứng hiện có |
| speckit-checklist | spec-validator cho chất lượng yêu cầu |
| speckit-implement | Bước implementation của AGENTS; Full mới dùng implementation-orchestrator |
| speckit-converge | verification-before-completion và nghiệm thu/review UAW |
| speckit-constitution | Thông báo nghỉ dùng; AGENTS.md và local rules là nguồn quy tắc |
| speckit-taskstoissues | Thông báo nghỉ dùng; export issue ngoài lõi, cần yêu cầu riêng |

consistency-scan không được tạo thành một tầng trùng: dùng risk-contradiction-scanner
cho nghiệp vụ và technical-consistency-review cho spec/plan/tasks đúng giai đoạn.

## Phạm vi file và phân công

- **A — Governance/BA/roadmap:** AGENTS.md, README.md, root harness pointers,
  .agents/docs/*.md, common rules, business-analyst persona, các BA/handover/
  implementation skills và ba command intake/generate/continue; context hook.
- **B — Native planning/migration:** bốn skill cold mới, mười legacy stub và
  references, system-architect persona, .specify/templates/*, workflow registry,
  router/wayfinder/scaffold/user-guide routes, build-skill-index, sync scripts,
  hai catalog; successor ADR 0004 và ADR index.
- **Coordinator — Integration:** .agents/SKILLS.md chỉ sinh sau A+B, kiểm thử dưới
  .agents/scripts/test/, docs của tính năng và feature index; điều chỉnh code-reviewer
  persona nếu còn tên/nhãn quy trình cũ liên quan.

Danh sách file-family được giới hạn trong context-pack.md; không sửa lan sang
optional technology packs, billing integration, installer/update-engine hoặc hồ
sơ đã signed-off. Mọi sửa đổi phải giữ nội dung ngoài phạm vi đang chưa commit.

## Chi phí và chất lượng

A và B độc lập file, được làm song song sau Gate 2. Coordinator tích hợp sau cả
hai; reviewer chạy sau kiểm chứng. Không phân công agent cho việc Fast.
Hot set giữ 9 entry points; skill native/alias nằm cold và chỉ đọc khi cần.
Giữ budget hiện hành, không cam kết tiết kiệm tiền khi chưa có usage thực.
Chỉ viết artifact có đầu ra/người đọc rõ; reuse baseline và context pack ngắn.

Gate 1 và Gate 2 đã được duyệt; triển khai theo kế hoạch/tasks này.

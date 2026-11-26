# Baseline: Chỉ phân phối qua download/file-based

**Status:** SIGNED-OFF v1.0
**Version:** 1.0
**Date:** 2026-11-26
**Gate 1:** đạt — chủ dự án duyệt trong chat ngày 2026-11-26.
**Signed off by:** Chủ dự án — “duyệt, bạn hãy làm theo đề xuất và phải đảm bảo đáp ứng các tiêu chí nghiệm thu”.

## Mục tiêu đã xác nhận

Bỏ MCP của Universal Agents Workflow, giữ cài đặt bằng download/file-based,
đồng thời xử lý các bất nhất của validator và luồng khởi tạo.

## Phạm vi đã duyệt

1. Xóa package UAW MCP, mã server/tools/resources, lệnh init, templates cấu hình,
   tests, dependencies và đầu ra build chỉ phục vụ package này.
2. Dùng install.sh/install.ps1 làm điểm khởi tạo; giữ bảo vệ dữ liệu, phiên bản,
   manifest và nội dung tùy chỉnh đã sửa ở phần 1.
3. Giữ validator ở skill spec-validator hiện có: kiểm tra requirements.md cùng
   hồ sơ nghiệp vụ; thiếu đầu vào, assumptions chưa xác nhận hoặc liên kết
   BR/REQ/US bị đứt phải được báo rõ và không được coi là PASS.
   Không tạo validator CLI mới và không dùng regex để tuyên bố đạt chuẩn IEEE.
4. Đồng bộ README, AGENTS.md, adapter và hướng dẫn kiểm thử để không còn yêu cầu
   cài UAW MCP. Ghi ADR mới thay thế quyết định MCP đã ACCEPTED; giữ nguyên ADR cũ.
5. Không xóa các tích hợp MCP bên thứ ba, dữ liệu/spec dự án, hay thay đổi chưa
   commit ngoài phạm vi này. Không tự commit/push.

## Tiêu chí nghiệm thu

- Cài mới/cài lại theo download không cần package UAW MCP.
- Không còn mã server hoặc hướng dẫn vận hành đang hoạt động phụ thuộc UAW MCP;
  các nhắc đến trong hồ sơ lịch sử được ghi rõ là lịch sử.
- Validator không báo đạt khi thiếu hồ sơ, còn assumptions chưa xác nhận,
  thiếu acceptance criteria hoặc traceability của yêu cầu/user story.
- Bộ kiểm thử installer và hooks còn lại chạy được; giới hạn PowerShell khi
  thiếu pwsh được báo trung thực.
- Bản sửa phần 1 được giữ ở installer; không chuyển công cụ MCP sang một
  framework/CLI thay thế ngoài yêu cầu.

## Các quyết định đã duyệt

ASM-DOWNLOAD-001 đến ASM-DOWNLOAD-003 trong 01-elicitation.md đã được xác nhận.
Không có câu hỏi nghiệp vụ còn mở. requirements.md là nguồn yêu cầu đã chốt;
03-domain-model.md và 04-risk-register.md ghi quy tắc, phạm vi và rủi ro.

## Dev Handover Brief

- Baseline version: 1.0, signed off 2026-11-26.
- Requirements: requirements.md; traceability: traceability-matrix.md.
- Validation: validation-report.md (chất lượng yêu cầu; chưa phải nghiệm thu triển khai).
- Audience exports: none — tài liệu nội bộ, không có người đọc ngoài dự án.
- Scope exclusions and risks: 04-risk-register.md.
- Next: đặc tả kỹ thuật, plan.md và tasks.md; Gate 2 cần chủ dự án duyệt trước triển khai.

# Kế hoạch: Chỉ phân phối qua download/file-based

**Status:** APPROVED — Gate 2 được chủ dự án duyệt trong chat ngày 2026-11-26: “mình duyệt”.
**Date:** 2026-11-26.
**Baseline:** [SIGNED-OFF v1.0](baseline.md).
**Spec:** [spec.md](spec.md). **Tasks:** [tasks.md](tasks.md).

## Kết quả cần đạt

Xóa UAW MCP, dùng installer hiện có để khởi tạo, giữ kiểm tra yêu cầu trong skill
spec-validator và chứng minh các tiêu chí đã duyệt bằng bằng chứng phù hợp.

## Phạm vi file

| File/thư mục | Thay đổi |
| --- | --- |
| packages/mcp-server/** | Xóa package và các đầu ra/dependency chỉ phục vụ package, kể cả hai file đã sửa ở phần 1 trong package này |
| README.md | Bỏ quickstart UAW MCP; hướng dẫn download và khởi tạo file-based |
| AGENTS.md §7 | Thay danh sách tool UAW bằng quy trình đọc/ghi artifact cục bộ |
| .agents/scripts/sync-harnesses.mjs | Bỏ gợi ý đăng ký UAW MCP trong adapter WorkBuddy |
| .agents/skill-library/engineering/spec-validator/SKILL.md | Bổ sung điều kiện đầu vào và kết quả FAIL/BLOCKED theo spec.md |
| .agents/scripts/test/test-installers.py | Giữ hồi quy phần 1; bổ sung kiểm tra phân phối không cần UAW MCP nếu cần |
| test-plan.md | Bỏ lệnh npm test của package đã xóa; giữ hướng dẫn test còn hoạt động |
| adr/0003-download-only-distribution.md, adr/README.md | Ghi quyết định thay thế và lập chỉ mục, không sửa ADR cũ |
| .specify/features/download-only-distribution/* | Hồ sơ, tiêu chí kiểm thử, review và README hoàn tất |
| .specify/features/README.md | Chỉ mục README tính năng |

Giữ nguyên installer đã sửa, cấu hình/catalog MCP bên thứ ba và các thay đổi
chưa commit ngoài phạm vi. Nếu kiểm tra phát hiện cần mở rộng file/phạm vi thì
ghi nhận trước, không tự sửa lan sang các vấn đề khác của báo cáo ban đầu.

## Các lát triển khai

1. **A — Phân phối và tài liệu:** xóa package, sửa quickstart/AGENTS/adapter/
   hướng dẫn test; ghi ADR kế nhiệm. Một agent phụ trách các file này.
2. **B — Validator:** một agent khác sửa skill theo điều kiện đầu vào, traceability,
   acceptance criteria và giới hạn tuyên bố kết quả. A và B không chung file,
   có thể chạy song song sau khi Gate 2 được duyệt.
3. **C — Tích hợp/nghiệm thu:** agent chính chạy kiểm tra, đối chiếu từng tiêu chí,
   hoàn tất README/index. Phụ thuộc A và B.
4. **Review độc lập:** reviewer kiểm tra standards/security, spec fidelity và
   phần dư thừa vì diff xóa lớn; tối đa ba vòng theo quy tắc repo. Không giao khi
   còn Critical. Không commit hoặc push.

Mỗi agent chỉ đọc context-pack.md và tài liệu/vùng file liên quan; dùng model
kế thừa phiên chính. Không phân công trước Gate 2.

## Kiểm chứng

- Chạy hồi quy installer: cài mới, cài lại, thiếu Python/engine, engine thất bại,
  giữ manifest và stack pack tùy chỉnh. Báo riêng các case PowerShell bị skip.
- Smoke test installer bằng cây mã nguồn hiện tại trong thư mục tạm để kiểm tra
  local artifacts/skills và cài lại mà không cần package UAW MCP hay mạng.
- Chạy 21 kiểm tra hooks hiện có và kiểm tra cú pháp Bash.
- Kiểm tra inventory sau xóa, tham chiếu đang hoạt động và output adapter trong
  thư mục tạm. Giữ nguyên các nhắc đến trong lịch sử và MCP bên thứ ba.
- Đối chiếu skill validator với bộ tình huống dương/âm trong test-plan.md; ghi
  rõ đây là review quy trình prompt, không phải kiểm thử một validator executable.
- Đối chiếu diff, git diff --check và báo cáo review trước khi kết luận hoàn tất.

## Điều kiện duyệt

Gate 1 và Gate 2 đã được chủ dự án duyệt. Triển khai theo phạm vi và tasks đã chốt.

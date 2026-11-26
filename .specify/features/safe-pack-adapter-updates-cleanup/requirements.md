# Requirements: Safe pack/adapter updates and cleanup

## 1. Business context

Nguồn: baseline v1.0 SIGNED-OFF và ASM-UPD-001..004 được chủ dự án duyệt
ngày 2026-11-26. Mục tiêu là hoàn thiện cập nhật và giảm nội dung dư thừa mà
không mất dữ liệu tùy chỉnh. Không mở rộng sang runtime/dependency mới hoặc MCP.

## 2. Product behaviour and business rules

- BR-UPD-001: Chỉ cập nhật core và pack đã được chọn/xác minh; không tự thêm pack.
- BR-UPD-002: Chỉ tự thay nội dung có bằng chứng sở hữu và chưa sửa; giữ tùy chỉnh,
  nội dung chưa xác minh và dữ liệu dự án qua mọi bước hậu xử lý/lần chạy sau.
- BR-UPD-003: Metadata/path lỗi không được trở thành quyền ghi; kết quả phải phản
  ánh cả xung đột và bước thất bại/chưa chạy.
- BR-UPD-004: Dọn nguồn/phân phối, không purge bản cũ tại dự án khách. Giữ một
  nguồn nội dung có thẩm quyền và chức năng screenshot/Archify tổng quát.

## 3. Requirements and acceptance

| ID | Must-have requirement | Rule / AC |
| --- | --- | --- |
| REQ-UPD-001 | Lưu lựa chọn pack, mapping và hash; dùng cập nhật an toàn cho install/reinstall/update, không tự chọn thêm. | BR-001 / AC-01 |
| REQ-UPD-002 | Giữ file tùy chỉnh, user-added và dữ liệu được bảo vệ qua nhiều lần chạy; không nhận tùy chỉnh làm baseline mới. | BR-002 / AC-02 |
| REQ-UPD-003 | Đồng bộ index, adapter copy/symlink và hooks sau pack; bảo vệ nội dung tùy chỉnh và hot/cold trùng tên. | BR-002 / AC-03 |
| REQ-UPD-004 | Xử lý legacy, metadata lỗi, mapping nguy hiểm, nguồn pack thiếu và hậu xử lý lỗi một cách an toàn, báo đúng trạng thái. | BR-003 / AC-04 |
| REQ-UPD-005 | Loại 12 capture scripts ứng dụng riêng, helper extension và ví dụ riêng không cần; giữ workflow screenshot tổng quát. | BR-004 / AC-05 |
| REQ-UPD-006 | Bỏ năm HTML Archify examples đã render; giữ renderer/JSON, hợp nhất catalog và bản trùng, giữ mirror cần thiết. | BR-004 / AC-06 |
| REQ-UPD-007 | Ngừng ship session notes/cache và artifact dự án; giữ lịch sử được duyệt và không purge dữ liệu khách. | BR-002,004 / AC-07 |
| REQ-UPD-008 | Kiểm thử cập nhật, hồi quy, tham chiếu; review độc lập không còn Critical và báo giới hạn môi trường. | BR-003 / AC-08 |

BR-001..004 trong bảng là BR-UPD-001..004. Chi tiết quan sát AC-01..08
ở test-plan.md; các AC diễn giải tiêu chí đã duyệt, không thêm phạm vi nghiệp vụ.

## 4. User stories

- US-UPD-001: Là người dùng framework, tôi cập nhật core/pack đã chọn mà giữ
  tùy chỉnh và biết chính xác phần nào cập nhật, xung đột hoặc chưa chạy.
  AC-01..04, AC-07; REQ-UPD-001..004,007.
- US-UPD-002: Là người bảo trì, tôi phân phối nội dung gọn, tham chiếu đúng và
  giữ công cụ tổng quát hoạt động. AC-05..08; REQ-UPD-005..008.

Không có ASM nghiệp vụ còn mở; mọi thay đổi phạm vi cần quay lại BA và duyệt phiên bản mới.

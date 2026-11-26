# Baseline: UAW đặt BA trước triển khai

**Status:** SIGNED-OFF v1.0
**Version:** 1.0
**Date:** 2026-11-26
**Gate 1:** đạt — chủ dự án duyệt trong chat ngày 2026-11-26.
**Signed off by:** Chủ dự án — “Mình duyệt hướng UAW tự chủ, BA theo mức Fast/Full để tối ưu chi phí.”

## Mục tiêu

AI phải hiểu đúng mục tiêu, hành vi nghiệp vụ và tiêu chí thành công trước khi
thiết kế/lập kế hoạch kỹ thuật hay viết code. Độ sâu phân tích theo mức thiếu rõ
ràng và rủi ro, không theo việc story có sẵn trong roadmap hay chưa.

## Phạm vi đã duyệt

1. UAW làm chủ quy trình. Bỏ phụ thuộc thực thi SpecKit trong lõi; giữ các nguyên
   tắc đặc tả, kế hoạch, chia task và truy vết có ích, với attribution khi tái sử dụng.
2. Mọi yêu cầu triển khai qua bước hiểu nghiệp vụ. Fast có BA gọn khi hành vi đã
   rõ và không thay đổi nghiệp vụ; Full có BA sâu cho nghiệp vụ mới/chưa rõ hoặc
   trigger rủi ro. Câu hỏi nghiệp vụ còn ảnh hưởng triển khai phải được giải quyết.
3. BA hỏi theo đợt ngắn đến khi đủ thông tin; không ép tổng số câu hỏi cố định và
   không tự điền mặc định cho quy tắc, công thức, quyền, trạng thái hoặc lỗi nghiệp vụ.
4. Roadmap ghi nhận ưu tiên/phụ thuộc/phạm vi đã xác nhận. Sinh story/AC từ phân
   tích nghiệp vụ; /continue tái sử dụng bằng chứng và xử lý khoảng trống thay vì
   dùng roadmap làm đường bỏ qua BA hoặc trigger rủi ro.
5. Tách kiểm tra nhất quán nghiệp vụ trước baseline với kiểm tra spec–plan–tasks
   sau lập kế hoạch. Mọi tên skill được tham chiếu phải có file thực tế và đúng vai trò.
6. Đồng bộ AGENTS, adapters, hooks, agent personas, skills, catalog và templates.
   requirements.md là nguồn nghiệp vụ; spec.md là thiết kế kỹ thuật của UAW,
   không phải bản sao đặc tả hành vi của SpecKit. Không chỉ đổi tên các prompt cũ.

## Tiêu chí nghiệm thu

- Các tình huống việc nhỏ đã rõ, nghiệp vụ mới, yêu cầu mơ hồ, story roadmap và
  task auth/schema đều chọn luồng nhất quán, không bỏ qua quyết định nghiệp vụ.
- Không còn chỉ dẫn core gọi scripts SpecKit vắng mặt, dùng thư mục spec khác
  nhau hoặc cho phép suy đoán thay cho xác nhận nghiệp vụ.
- Các skill đang hoạt động có tên/đường dẫn và thứ tự đầu vào–đầu ra hợp lệ;
  không phân tích plan/tasks trước khi chúng tồn tại.
- Catalog, hợp đồng agent, hooks, installer và kiểm tra tham chiếu liên quan đạt;
  review độc lập không còn Critical. Các giới hạn kiểm tra được ghi rõ.
- Giữ kết quả phần 1/2, hồ sơ đã duyệt, ADR lịch sử và thay đổi ngoài phạm vi.
  Không tự commit/push hoặc cài thêm runtime.

## Quyết định đã xác nhận

ASM-BA-001..003 được chủ dự án xác nhận; không còn câu hỏi nghiệp vụ mở.
Không cam kết giảm tiền/tỷ lệ token khi chưa có dữ liệu sử dụng thực.

## Dev Handover Brief

Baseline v1.0, signed off 2026-11-26. requirements.md là nguồn nghiệp vụ;
03-domain-model.md, 04-risk-register.md ghi quy tắc/phạm vi/rủi ro.
validation-report.md xác nhận chất lượng yêu cầu, traceability-matrix.md ghi
liên kết; chưa phải bằng chứng triển khai. Audience exports: none (nội bộ).
Tiếp theo: đặc tả kỹ thuật, plan.md và tasks.md để duyệt Gate 2 hiện hành.

# Baseline: Cập nhật an toàn và dọn phần dư thừa

**Status:** SIGNED-OFF v1.0 — chủ dự án đã duyệt.
**Version:** 1.0
**Date:** 2026-11-26
**Gate 1:** đạt ngày 2026-11-26; Gate 2 chưa được duyệt.

## Phạm vi đã duyệt

1. Lưu lựa chọn pack, mapping nguồn–đích và manifest qua cài mới/cài lại/cập nhật.
   Dùng cùng cơ chế so sánh an toàn cho core và pack; không tự chọn thêm pack.
2. Sau update, đồng bộ index, adapter và hooks theo thứ tự thích hợp. Cả adapter
   copy và symlink phải được xử lý; marker đơn thuần không chứng minh file chưa sửa.
3. Giữ file/skill/config/hook tùy chỉnh. Không nhận bản user đã sửa làm baseline
   mới để lần cập nhật sau được phép ghi đè. Metadata cũ thiếu bằng chứng thì giữ
   và báo rõ; metadata lỗi hoặc mapping nguy hiểm phải dừng thao tác không an toàn.
4. Sửa bước dọn hot/cold để không xóa nội dung khác nhau chỉ vì trùng tên.
   Mọi bước sinh lại sau update phải giữ cùng cam kết bảo vệ dữ liệu.
5. Bỏ 12 capture-*-screenshots.mjs gắn ứng dụng riêng và verify-extension-live.mjs;
   bỏ ví dụ ứng dụng riêng nếu không còn caller cần thiết. Giữ capture-screenshots.mjs,
   kế hoạch screenshot mẫu và template hướng dẫn tổng quát.
6. Bỏ năm HTML đã render trong Archify examples, giữ runtime/template renderer
   và JSON nguồn. Hợp nhất catalog và các bản nội dung trùng theo một nguồn duy
   nhất; giữ bản sinh/copy phân phối nếu cần để chức năng còn hoạt động.
7. Ngừng phân phối session notes/cache và các artifact dự án không thuộc framework.
   Không xóa lịch sử/ADR/baseline đã duyệt hoặc tự purge các file đã có ở dự án khách.
8. Cập nhật tài liệu, tests và báo cáo nghiệm thu; không thêm runtime/dependency,
   ghi cấu hình global, commit/push hay thực hiện cập nhật từ xa lên dự án thật.

## Tiêu chí nghiệm thu

- Cài mới/cài lại/cập nhật core và pack đã chọn hoạt động; pack không chọn không
  tự xuất hiện. File chưa sửa được cập nhật; file tùy chỉnh và file user thêm được giữ.
- Tùy chỉnh một file trong pack/adapter không làm mất file đó hoặc cho phép lần
  sau ghi đè; các phần đủ bằng chứng vẫn cập nhật được và kết quả báo đúng.
- Copy/symlink, legacy manifest, thiếu/corrupt metadata, nguồn pack không còn,
  mapping nguy hiểm và lỗi hậu xử lý được kiểm tra; không báo hoàn tất bước chưa chạy.
- Custom hot/cold skills, hooks, config, domain data và signed-off artifacts được
  giữ qua nhiều lần update/reinstall; không xóa do trùng tên hoặc marker.
- Phần nguồn bị loại không còn được ship; dữ liệu cần cho chụp ảnh tổng quát và
  renderer vẫn có đường dẫn hợp lệ, hoạt động sau cài đặt. Dữ liệu khách không bị purge.
- Catalog một nguồn, mirror hợp lệ, tham chiếu và các hồi quy trước đạt; review
  độc lập không còn Critical. PowerShell hoặc runtime thiếu được báo là giới hạn.

## Bằng chứng phê duyệt

Chủ dự án: “Mình duyệt baseline gộp phần 4–5. Bạn tiếp tục lập kế hoạch và tasks ở Gate 2, đảm bảo giữ nguyên dữ liệu tùy chỉnh.”

ASM-UPD-001..004 trong 01-elicitation.md đã được xác nhận cùng phạm vi trên.
Phê duyệt này cho phép lập kế hoạch; chưa cho phép triển khai trước Gate 2.

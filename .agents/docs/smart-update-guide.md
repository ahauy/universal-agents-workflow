# Cập nhật framework an toàn

Cài mới, cài lại và cập nhật dùng cùng cơ chế so sánh nội dung cho core và các
pack đã được chọn rõ ràng. Mục tiêu là giữ dữ liệu tùy chỉnh; kết quả cập nhật
có thể còn xung đột hoặc bước chưa chạy, cần đọc báo cáo cuối lệnh.

## Cách chạy

Trong AI Editor dùng `/update`, hoặc từ thư mục dự án:

```bash
python3 .agents/scripts/update-engine.py --check
python3 .agents/scripts/update-engine.py --apply --target .
```

`--check` chỉ kiểm tra phiên bản. `--apply --yes` giữ xung đột, không phải quyền
ghi đè tùy chỉnh. Có thể dùng installer với `--update` (PowerShell: `-Update`).
Với bản nguồn cục bộ, chạy installer từ checkout đó và chỉ định thư mục đích.
Python cần cho so sánh an toàn; Node cần cho index, adapter và hooks. Thiếu công
cụ thì xem bước nào chưa chạy, cài công cụ rồi chạy lại; không dùng copy tay để
bỏ qua kiểm tra dữ liệu.

## Quy tắc giữ dữ liệu

| Trường hợp | Kết quả |
| --- | --- |
| Dữ liệu dự án thuộc protectedPaths | Giữ nguyên nội dung đã có. |
| File đích chưa có, mapping hợp lệ | Tạo và lưu hash nội dung thực sự đã ghi. |
| File framework có hash sở hữu hợp lệ, chưa sửa | Cập nhật theo nguồn. |
| File đã tùy chỉnh hoặc thiếu bằng chứng sở hữu | Giữ và báo xung đột/chưa xác minh; không nhận làm baseline mới. |
| File user thêm hoặc file nguồn không còn | Không tự xóa file đích. |
| Metadata lỗi, mapping/path không an toàn | Dừng thao tác không an toàn; không reset metadata để bỏ qua lỗi. |

Các đường dẫn dự án được giữ gồm `CONTEXT.md`, roadmap, changelog,
`adr/`, `docs/features/`, `docs/user-guides/`, `docs/architecture/`,
`.specify/features/`, `src/`, `.env*` và cấu hình local. Các ngoại lệ template
framework được liệt kê trong engine vẫn phải qua so sánh hash; không phải quyền
ngầm ghi đè. Có thể mở rộng protectedPaths trong metadata dự án.

## Pack, adapter và các bước sinh lại

`.agents/workflow-source.json` lưu pack đã chọn, mapping nguồn–đích và hash.
Update không chọn thêm pack dựa trên tên thư mục hoặc marker công nghệ mới.
Metadata legacy thiếu lựa chọn cần xác nhận lại; pack thiếu nguồn vẫn được giữ
ở dự án đích và báo chưa cập nhật.

Sau đồng bộ core/pack, các bước chạy theo thứ tự: tier/index → adapter → hooks.
Adapter copy được xét từng file; symlink được kiểm tra đích và quyền sở hữu.
Marker trong file không đủ để chứng minh chưa sửa. Hook/config tùy chỉnh, file
user thêm và hot/cold khác nội dung dù trùng tên đều được giữ. Lệnh clean cũng
phải kiểm tra quyền sở hữu; không xóa cả cây thư mục có nội dung user.

Một pha sau có thể lỗi khi pha trước đã ghi an toàn. Báo cáo phải chỉ rõ lỗi,
phần chưa chạy và xung đột; metadata không được ghi nhận phần chưa hoàn thành
là đã cập nhật. Chạy lại để tiếp tục; không xóa manifest để ép nhận lại baseline.

## Nguồn chuẩn và phạm vi dọn dẹp

`optional-stack-skills/catalog.json` là nguồn catalog chuẩn;
`.agents/catalog.json` là mirror sinh ra cho runtime của dự án đã cài. Mirror
không phải nơi bảo trì bản thứ hai. Tùy chỉnh mirror ở dự án đích vẫn được giữ.
Sơ đồ dùng Mermaid. Công cụ hoặc script đã bỏ khỏi nguồn không được tự xóa
khỏi dự án khách; bản tùy chỉnh cũ tiếp tục được giữ và báo nguồn không còn.

Bản phân phối không mang session notes/cache, metrics, feature artifacts và ADR
lịch sử của chính dự án framework. Các template dùng lại vẫn còn. Việc loại các
script ứng dụng riêng/HTML sinh sẵn khỏi nguồn không tự purge bản đã có ở dự án
khách. Không cần xóa lịch sử hoặc baseline đã duyệt để cập nhật.

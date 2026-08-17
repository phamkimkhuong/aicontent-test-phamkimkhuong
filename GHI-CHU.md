# Ghi chú bài làm — AI Content

## 1. Tiến độ hoàn thành

Đã hoàn thành vững chắc và kiểm thử toàn diện **Mốc 1** và **Mốc 2**:

- **Mốc 1 — Đề xuất ý tưởng (`/studio/de-xuat`)**:
  - Tệp [lib/studio/kieu.ts](lib/studio/kieu.ts): Khai báo đúng hợp đồng kiểu `YTuongDeXuat`, `BeMat`, `KetQuaStudio`, hỗ trợ `trendSignalId` và `nguonThamKhao`.
  - Tệp [lib/studio/de-xuat.ts](lib/studio/de-xuat.ts):
    - `TI_LE_KHAM_PHA = 0.2` (20% ý tưởng dò đường, khám phá tuyến mới).
    - `donKetQuaDeXuat()`: Dọn sạch kết quả AI, đối chiếu 1-1 với tên trụ cột và chân dung có thật trong CSDL; validate `trendSignalId` và `beMat` hợp lệ.
    - `raiTheoTruCot()`: Phân bổ ý tưởng theo Largest Remainder của từng trụ cột, ưu tiên chọn candidate `khamPha = true` từ pool để tiệm cận 20% mà KHÔNG mutate cờ (bảo vệ tính bất biến ngữ nghĩa - Semantic Immutability).
    - `deXuatYTuong()`: Đọc CSDL qua `createRepo()`, nạp bài theo dõi qua `repo.tinHieuXuHuong.theoNguoiDung()`, bóc tách công thức qua `trichThamKhao()`, đẩy job qua `chayNhiemVu()`, lưu `trendSignalId` vào bảng `ideas` và đánh dấu bài đã dùng qua `danhDauDaDung()`.
  - Giao diện [app/(dash)/studio/de-xuat](app/(dash)/studio/de-xuat): Chọn bề mặt (grid 4 card trực quan), số lượng (segmented control), hiển thị thẻ ý tưởng kèm badge xu hướng có link xem bài gốc và lưu ý tưởng vào bảng `ideas`.
  - Unit test [tests/studio-de-xuat.test.cjs](tests/studio-de-xuat.test.cjs): 12/12 test pass 100%.

- **Mốc 2 — Sinh nội dung bài viết (`/studio/bien-soan`)**:
  - Tệp [lib/studio/cong-dem-tu.ts](lib/studio/cong-dem-tu.ts): Cổng đếm từ và kiểm tra ngưỡng độ dài của 4 bề mặt (`fanpage`: 150–300 từ, `tiktok`: 60–120 từ, `ho_so_ca_nhan`: 120–250 từ, `zalo`: 40–100 từ), hỗ trợ kiểm tra chính xác ràng buộc `epDoDai`.
  - Tệp [lib/studio/bien-soan.ts](lib/studio/bien-soan.ts): Logic sinh bài viết hoàn chỉnh từ ý tưởng, tự động đọc `idea` từ CSDL để khóa chặt `beMat`, nạp đầy đủ thông tin `pillar`, `persona`, `hoSo` và hỗ trợ `epDoDai`, `mach`.
  - Prompt `viet-bai` trong [lib/model-runner/loi-nhac-theo-nhiem-vu.js](lib/model-runner/loi-nhac-theo-nhiem-vu.js): Giữ đúng giọng thương hiệu và định dạng JSON.
  - Giao diện [app/(dash)/studio/bien-soan](app/(dash)/studio/bien-soan): Trình soạn thảo hai cột, đo độ dài real-time (tương thích cả `epDoDai`), cảnh báo từ ngữ cấm kỵ thương hiệu bằng `quetQuyTacNgonNgu`, lưu vào bảng `contents` với `beMat` luôn khóa theo `yTuong.beMat`.
  - Unit test [tests/studio-bien-soan.test.cjs](tests/studio-bien-soan.test.cjs): 5/5 test pass 100%.

---

## 2. Quyết định kỹ thuật khó nhất & Lý do lựa chọn

### Quyết định: Bảo vệ Tính Bất biến Ngữ nghĩa (Semantic Immutability) trong `raiTheoTruCot`
- **Thách thức**: Hàm rải ý tưởng nhận một tập candidate từ AI và cần đảm bảo 20% ý tưởng khám phá. Nếu pool không đủ ý tưởng khám phá, việc tự ý đổi cờ một ý tưởng chủ lực (grounded) thành khám phá sẽ làm sai lệch bản chất ngữ nghĩa của nội dung.
- **Giải pháp**:
  - `raiTheoTruCot` hoạt động thuần túy như một **Bộ chọn và phân bổ (Selector & Allocator)**, không phải bộ sinh nội dung (Generator/Mutator).
  - Khi phân bổ số chỗ cho từng trụ cột theo Largest Remainder, thuật toán **ưu tiên nhặt các candidate `khamPha = true` trước** cho đến khi đạt ngân sách khám phá $20\%$, sau đó điền các candidate grounded.
  - Tuyệt đối không thay đổi giá trị thuộc tính `khamPha` của bất kỳ candidate nào, bảo đảm tính trung thực dữ liệu từ Model AI.

### Quyết định: Chiến lược "Học cách kể, không chép bài" và Ép ràng buộc ở tầng mã
- **Thách thức**: Người dùng theo dõi bài của đối thủ để học hỏi, nhưng đưa nguyên văn bài của đối thủ vào prompt sẽ khiến AI có xu hướng viết lại (paraphrase/xào bài) — gây rủi ro bản quyền và mất bản sắc thương hiệu của shop.
- **Giải pháp**:
  - Không bao giờ truyền nguyên văn nội dung bài gốc vào prompt sinh ý tưởng.
  - Tách quy trình thành 2 tầng: Bóc tách trước `kieuHook` (công thức mở đầu) và `chuDe` (từ khóa danh từ), sau đó chỉ truyền 2 trường này vào prompt `de-xuat-y-tuong`.
  - Giọng kể luôn được khóa cố định theo hồ sơ thương hiệu của chính shop.

### Quyết định: Xử lý Output bất định từ LLM
- **Thách thức**: LLM có thể trả về tên trụ cột/chân dung gần giống nhưng viết hoa hoặc bịa thêm tên mới.
- **Giải pháp**: Hàm `donKetQuaDeXuat()` chuẩn hóa chuỗi và đối chiếu so sánh không phân biệt hoa thường với CSDL; nếu không khớp thì gán `null` dứt khoát, không tạo mới vào CSDL.

---

## 3. Kiểm tra trước khi nộp

Cả 3 lệnh kiểm thử bắt buộc đều xanh 100%:
1. `npx tsc --noEmit` $\rightarrow$ Exit code 0 (Không có lỗi kiểu).
2. `node --test tests/` $\rightarrow$ Toàn bộ test suite xanh.
3. `npm run build` $\rightarrow$ Đóng gói Next.js 16 (Turbopack) thành công 16/16 routes.

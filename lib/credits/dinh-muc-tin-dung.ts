/**
 * Bảng định mức chi phí Tín dụng AI (AI Credits) cho các tính năng trong hệ thống.
 *
 * Mỗi hành động AI được gán một mức chi phí Credits chuẩn hóa:
 * - Đề xuất 5-10 ý tưởng: 10 Credits
 * - Biên soạn 1 bài viết chuẩn SEO & giọng điệu: 20 Credits
 * - Soạn 1 kịch bản video phân cảnh Storyboard: 25 Credits
 * - Bóc tách hồ sơ thương hiệu tự động: 30 Credits
 * - Bóc tách công thức & Hook kênh ngoài: 5 Credits
 * - Bóc phụ đề video (Speech-to-Text): 15 Credits
 *
 * Hạn ngạch miễn phí mặc định mỗi tháng cho tài khoản cá nhân: 1,500 Credits.
 */

export const HAN_MUC_MIEN_PHI_THANG = 1500;

export const DINH_MUC_TIN_DUNG = {
  'de-xuat-y-tuong': 10,
  'viet-bai': 20,
  'viet-kich-ban': 25,
  'sinh-hang-loat': 20, // Trên mỗi bài viết
  'sinh-chuoi-bai': 20, // Trên mỗi kỳ
  'boc-tach-ho-so': 30,
  'boc-cong-thuc': 5,
  'boc-phu-de': 15,
} as const;

export type LoaiHanhDongCredit = keyof typeof DINH_MUC_TIN_DUNG;

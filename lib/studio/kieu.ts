/**
 * Kieu du lieu dung chung cho toan bo module Studio.
 */

/**
 * Bốn bề mặt nội dung được hệ thống hỗ trợ.
 *
 * Phải khớp với enum `be_mat` trong database schema.
 */

export type BeMat = 'fanpage' | 'ho_so_ca_nhan' | 'tiktok' | 'zalo';

/**
 * Ý tưởng nội dung do máy đề xuất.
 *
 * Đây là domain model của Studio, không phải database model.
 * Các trường `truCot` và `chanDung` là tên hiển thị/giá trị semantic
 * mà model trả về; tầng nghiệp vụ sẽ đối chiếu chúng với dữ liệu thật
 * trong workspace trước khi lưu thành `pillarId` / `personaId`.
 */

export type YTuongDeXuat = {
   /** Tiêu đề/ngắn gọn mô tả ý tưởng. */
  tieuDe: string;
  /** Phai khop mot tru cot CO THAT trong ho so. Khong khop thi null. */
  truCot: string | null;
   /**
   * Tên chân dung khách hàng.
   *
   * Phải khớp với một persona thực tế trong workspace.
   * Nếu model bịa hoặc không khớp -> null.
   */
  chanDung: string | null;
   
  cauMoDau: string | null;
  /**
   * Giải thích tại sao hệ thống đề xuất ý tưởng này.
   *
   * Đây là phần "neo" ý tưởng vào context thực tế:
   * pillar, persona, insight, lịch sử nội dung hoặc tín hiệu xu hướng.
   */
  lyDoDeXuat: string | null;
   /** Bề mặt mà ý tưởng được tạo ra cho. */
  beMat: BeMat;
  /**
   * true  -> ý tưởng khám phá hướng mới.
   * false -> ý tưởng được neo vào các tuyến/dữ liệu đã có.
   */
  khamPha: boolean;
  /**
   * ID cua tin hieu xu huong da goi y cho y tuong nay. Day la truong mo rong
   * cua hop dong Mốc 1: co mat khi y tuong dung tham khao xu huong, con khong
   * dung thi la `null`. Nhờ do `ideas.trend_signal_id` luon truy nguoc duoc
   * dung bai nguon, thay vi chi luu mot nhan chung chung.
   */
  trendSignalId?: string | null;
};
/**
 * Tỷ lệ mục tiêu của một trụ cột nội dung.
 *
 * Ví dụ:
 * {
 *   ten: 'Kiến thức',
 *   tiLeMucTieu: 0.5
 * }
 */
export type TruCotMucTieu = {
  ten: string;
  tiLeMucTieu: number | null;
};
/**
 * Tham số đầu vào của luồng đề xuất ý tưởng.
 */
export type ThamSoDeXuat = {
  workspaceId: string;
  beMat: BeMat;
  soLuong: number;
};


// ---------------------------------------------------------------------------
// Ket qua chung cua moi thao tac trong Studio.
//
// Moi ham `async` trong `lib/studio/` deu tra ve kieu nay thay vi nem loi:
// man hinh can hien thi thong bao cho nguoi dung bang ngon ngu de hieu, khong
// phai ma loi ky thuat.
// ---------------------------------------------------------------------------

export type KetQuaStudio<T> = {
  trangThai: 'xong' | 'loi';
  ketQua: T | null;
  loi: string | null;
  canhBao: string[];
};

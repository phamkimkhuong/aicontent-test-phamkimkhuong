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

import type { NguoiDungTuPhien } from '@/lib/data-access/guard';

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
  /** Góc tiếp cận của ý tưởng. */
  gocTiepCan: string | null;
  /** Câu mở đầu / hook dự kiến. */
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
  /** ID tin hieu xu huong da tham khao tu mauNgoai (neu co). */
  trendSignalId?: string | null;
  /** Thong tin nguon tham khao de UI hien thi lien ket den bai goc. */
  nguonThamKhao?: {
    tenKenh?: string | null;
    lienKet?: string | null;
  } | null;
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
  nguoiDung?: NguoiDungTuPhien;
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

/**
 * Một phân cảnh trong kịch bản quay video (Storyboard).
 */
export type PhanCanhVideo = {
  thoiLuongGiay: number;
  hinhAnh: string;
  loiThoai: string;
};

/**
 * Kịch bản video hoàn chỉnh theo phân cảnh (Mốc 3).
 */
export type KichBanVideo = {
  tieuDe: string;
  phanCanh: PhanCanhVideo[];
  tongThoiLuongGiay: number;
  soTu: number;
  viPhamNgonNgu: Array<{
    cumTu: string;
    thayBang: string;
    boiCanh: string;
  }>;
};

export type ThamSoSinhKichBan = {
  workspaceId: string;
  beMat?: BeMat;
  tieuDe: string;
  gocTiepCan?: string | null;
  cauMoDau?: string | null;
  ideaId?: string | null;
  thoiLuongUocTinhGiay?: number | null;
};

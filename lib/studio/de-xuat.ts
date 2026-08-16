/**
 * De xuat y tuong noi dung — Moc 1 cua bai test.
 *
 * LUONG CHINH:
 *   1. Doc ho so thuong hieu, tru cot, chan dung, insight, bai da dang
 *   2. Doc tin hieu xu huong (bai kenh ngoai) — CHI lay chu de + cong thuc ke,
 *      KHONG truyen nguyen van noi dung bai goc (rang buoc 3 TEST-BRIEF)
 *   3. Goi mo hinh qua `chayNhiemVu()` (rang buoc 5: khong goi thang API)
 *   4. Don ket qua tho: doi chieu truCot/chanDung voi danh sach CO THAT,
 *      khong khop thi dat `null` (rang buoc 2)
 *   5. Rai y tuong theo ti le tru cot muc tieu, enforce TI_LE_KHAM_PHA
 *   6. Persist vao bang `ideas`, danh dau trend signals da dung
 *   7. Tra ve `KetQuaStudio<YTuongDeXuat[]>`
 *
 * TEN HAM VA KIEU LA HOP DONG — bo cham tu dong import dung ten nay.
 */

import { createRepo } from '@/lib/data-access';
import type { NguoiDungTuPhien } from '@/lib/data-access/guard';
import type { ChanDung } from '@/lib/data-access/personas';
import type { Insight } from '@/lib/data-access/insights';
import type { TruCot } from '@/lib/data-access/content-pillars';
import { chayNhiemVu } from '@/lib/model-runner';
import { daBocXong, type CongThuc } from './boc-cong-thuc';

import type { BeMat, KetQuaStudio, YTuongDeXuat } from './kieu';

// ---------------------------------------------------------------------------
// Hang so
// ---------------------------------------------------------------------------

/** Ti le y tuong kham pha (do duong, tuyen chua co du lieu). */
export const TI_LE_KHAM_PHA = 0.2;

const BE_MAT_HOP_LE: readonly BeMat[] = ['fanpage', 'ho_so_ca_nhan', 'tiktok', 'zalo'];

/** Gioi han bai kenh ngoai lay ve de trich xuat cong thuc ke. */
const GIOI_HAN_TIN_HIEU = 30;

/** Gioi han bai da dang lay ve de gom chu de. */
const GIOI_HAN_BAI_DA_DANG = 20;

// ---------------------------------------------------------------------------
// Kieu hop dong
// ---------------------------------------------------------------------------

export type ThamSoDeXuat = {
  workspaceId: string;
  beMat: BeMat;
  soLuong: number;
  /**
   * Nguoi dung hien tai — can cho truc co lap THU HAI khi doc trend_signals.
   * `theoNguoiDung()` can `NguoiDungTuPhien` de chi lay tin hieu cua cac kenh
   * nguoi nay THUC SU theo doi, khong phai moi kenh trong workspace.
   *
   * Tuy chon: khi khong truyen, bo qua trend signals (van sinh y tuong duoc,
   * nhung thieu nguon du lieu thu 5).
   */
  nguoiDung?: NguoiDungTuPhien;
};

export type TruCotMucTieu = { ten: string; tiLeMucTieu: number | null };

// ---------------------------------------------------------------------------
// Don ket qua tho cua mo hinh
// ---------------------------------------------------------------------------

type MucTho = {
  tieuDe?: unknown;
  truCot?: unknown;
  chanDung?: unknown;
  gocTiepCan?: unknown;
  cauMoDau?: unknown;
  lyDoDeXuat?: unknown;
  beMat?: unknown;
  kham_pha?: unknown;
  khamPha?: unknown;
  /** Mo hinh co the gan trendSignalId vao y tuong neu du lieu vao co mauNgoai. */
  trendSignalId?: unknown;
};

/** Chuan hoa mot chuoi tu mo hinh: cat khoang trang, tra null neu rong. */
function chuoi(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s === '' ? null : s;
}

/** Chuan hoa ten de doi chieu, nhung LUON tra ve dung cach viet trong CSDL. */
function chuanHoaTen(ten: string): string {
  return ten.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi-VN');
}

/**
 * Doi chieu ten mo hinh tra ve voi danh sach ten hop le.
 *
 * So sanh KHONG phan biet hoa thuong va bo khoang trang thua: mo hinh hay viet
 * hoa chu cai dau hoac them khoang trang, ma ten trong CSDL thi khong. Khong
 * khop thi tra `null` — KHONG bao gio tu bia ten moi.
 */
function doiChieu(ten: unknown, danhSachHopLe: string[]): string | null {
  const s = chuoi(ten);
  if (!s) return null;
  const chuanHoa = chuanHoaTen(s);
  return danhSachHopLe.find((t) => chuanHoaTen(t) === chuanHoa) ?? null;
}


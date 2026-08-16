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

/**
 * Don ket qua tho cua mo hinh ve dung hinh dang YTuongDeXuat[].
 *
 * Ham thuan, test duoc bang du lieu tay — khong goi mang, khong doc CSDL.
 *
 * @param tho - Ket qua tho tu mo hinh (doi tuong co truong `yTuong`)
 * @param dsTruCot - Danh sach ten tru cot CO THAT trong ho so
 * @param dsChanDung - Danh sach ten chan dung CO THAT trong ho so
 * @param beMat - Be mat mac dinh neu mo hinh khong tra ve
 */
export function donKetQuaDeXuat(
  tho: unknown,
  dsTruCot: string[] = [],
  dsChanDung: string[] = [],
  beMat: BeMat = 'fanpage',
): YTuongDeXuat[] {
  if (!tho || typeof tho !== 'object') return [];

  const mang = (tho as { yTuong?: unknown }).yTuong;
  if (!Array.isArray(mang)) return [];

  const ketQua: YTuongDeXuat[] = [];
  for (const m of mang as MucTho[]) {
    if (!m || typeof m !== 'object') continue;
    const tieuDe = chuoi(m.tieuDe);
    if (!tieuDe) continue; // y tuong khong co tieu de la khong dung duoc

    // Mo hinh co the tra `kham_pha` (snake_case) hoac `khamPha` (camelCase)
    const khamPhaRaw = m.kham_pha ?? m.khamPha;

    ketQua.push({
      tieuDe,
      truCot: doiChieu(m.truCot, dsTruCot),
      chanDung: doiChieu(m.chanDung, dsChanDung),
      gocTiepCan: chuoi(m.gocTiepCan),
      cauMoDau: chuoi(m.cauMoDau),
      lyDoDeXuat: chuoi(m.lyDoDeXuat),
      beMat,
      khamPha: khamPhaRaw === true || khamPhaRaw === 'true',
      trendSignalId: null,
    });
  }
  return ketQua;
}

// ---------------------------------------------------------------------------
// Rai y tuong theo ti le tru cot muc tieu — Largest Remainder Method
// ---------------------------------------------------------------------------

/**
 * Phan bo N cho vao cac tru cot theo ti le muc tieu.
 *
 * Dung Largest Remainder Method de dam bao tong LUON bang N:
 *   1. Tinh so cho tho = floor(tiLe * N)
 *   2. Tong floor < N → phan du = N - tong floor
 *   3. Sap xep theo phan le (fraction) giam dan, bo phan du vao
 */
function phanBoCho(
  truCotMucTieu: TruCotMucTieu[],
  soLuong: number,
): { ten: string; soCho: number }[] {
  if (truCotMucTieu.length === 0) return [];

  const tiLeNhap = truCotMucTieu.map((t) =>
    typeof t.tiLeMucTieu === 'number' && Number.isFinite(t.tiLeMucTieu)
      ? Math.max(0, t.tiLeMucTieu)
      : null,
  );
  const tongTiLe = tiLeNhap.reduce<number>((tong, tiLe) => tong + (tiLe ?? 0), 0);
  const soChuaDatTiLe = tiLeNhap.filter((tiLe) => tiLe === null).length;

  // Ho so luu ti le theo phan tram (60, 40), nhung van chap nhan ty le thap
  // phan (0.6, 0.4). Tru cot `null` nhan phan con lai; neu cac ty le da vuot
  // 100% thi chuan hoa cac ty le da khai bao va khong tu bia cho phan `null`.
  if (tongTiLe === 0) {
    return apDungLargestRemainder(
      truCotMucTieu.map((t) => ({ ten: t.ten, tiLe: 1 / truCotMucTieu.length })),
      soLuong,
    );
  }

  const donVi = tongTiLe <= 1 ? 1 : 100;
  const coPhanConLai = tongTiLe < donVi && soChuaDatTiLe > 0;
  const tiLeThuc = truCotMucTieu.map((t, chiSo) => {
    const tiLe = tiLeNhap[chiSo];
    if (tiLe !== null) {
      return { ten: t.ten, tiLe: coPhanConLai ? tiLe / donVi : tiLe / tongTiLe };
    }
    return {
      ten: t.ten,
      tiLe: coPhanConLai ? (donVi - tongTiLe) / donVi / soChuaDatTiLe : 0,
    };
  });

  return apDungLargestRemainder(tiLeThuc, soLuong);
}

function apDungLargestRemainder(
  tiLeThuc: { ten: string; tiLe: number }[],
  soLuong: number,
): { ten: string; soCho: number }[] {
  const raw = tiLeThuc.map((t, chiSo) => ({
    ten: t.ten,
    chiSo,
    choTho: t.tiLe * soLuong,
    choFloor: Math.floor(t.tiLe * soLuong),
    phanLe: (t.tiLe * soLuong) % 1,
  }));

  const tongFloor = raw.reduce((s, r) => s + r.choFloor, 0);
  let conLai = soLuong - tongFloor;

  // Sap xep theo phan le giam dan, bo con lai vao
  const sapXep = [...raw].sort((a, b) => b.phanLe - a.phanLe || a.chiSo - b.chiSo);
  for (const muc of sapXep) {
    if (conLai <= 0) break;
    muc.choFloor += 1;
    conLai -= 1;
  }

  return raw.map((r) => ({ ten: r.ten, soCho: r.choFloor }));
}

/**
 * Rai N y tuong theo ti le tru cot muc tieu + enforce TI_LE_KHAM_PHA.
 *
 * Thuat toan:
 *   1. Phan bo so cho cua tung tru cot bang Largest Remainder Method
 *   2. Chon y tuong co `truCot` khop, uu tien y tuong khong kham pha
 *   3. Cho trong con lai: dien bang y tuong chua duoc chon
 *   4. Enforce ti le kham pha: dam bao dung soKhamPha y tuong co khamPha=true
 */
export function raiTheoTruCot(
  yTuongTho: YTuongDeXuat[],
  truCotMucTieu: TruCotMucTieu[],
  soLuong: number,
): YTuongDeXuat[] {
  if (!Number.isSafeInteger(soLuong) || soLuong <= 0 || yTuongTho.length === 0) return [];
  if (truCotMucTieu.length === 0) return yTuongTho.slice(0, soLuong);

  const choTheoTruCot = phanBoCho(truCotMucTieu, soLuong);
  const daChon = new Set<number>();
  const ketQua: YTuongDeXuat[] = [];

  // Buoc 1: Dien theo tru cot
  for (const { ten, soCho } of choTheoTruCot) {
    let daDien = 0;
    const tenThuong = ten.toLowerCase().trim();
    for (let i = 0; i < yTuongTho.length && daDien < soCho; i++) {
      if (daChon.has(i)) continue;
      const tc = yTuongTho[i].truCot;
      if (tc && tc.toLowerCase().trim() === tenThuong) {
        ketQua.push(yTuongTho[i]);
        daChon.add(i);
        daDien++;
      }
    }
  }

  // Buoc 2: Cho trong con lai — dien bang y tuong chua chon
  for (let i = 0; i < yTuongTho.length && ketQua.length < soLuong; i++) {
    if (!daChon.has(i)) {
      ketQua.push(yTuongTho[i]);
      daChon.add(i);
    }
  }

  // Buoc 3: Enforce TI_LE_KHAM_PHA
  const daRai = ketQua.slice(0, soLuong);
  // Mo hinh co the tra it hon N y tuong hop le. Khi do chi co the ep ti le
  // tren so y tuong that su tra ve, khong tao ban sao de du so luong.
  const soKhamPhaMucTieu = Math.round(daRai.length * TI_LE_KHAM_PHA);
  const soKhamPhaHienTai = daRai.filter((y) => y.khamPha).length;

  if (soKhamPhaHienTai < soKhamPhaMucTieu) {
    // Thieu kham pha: danh dau them y tuong cuoi danh sach la kham pha
    let canThem = soKhamPhaMucTieu - soKhamPhaHienTai;
    for (let i = daRai.length - 1; i >= 0 && canThem > 0; i--) {
      if (!daRai[i].khamPha) {
        daRai[i] = { ...daRai[i], khamPha: true };
        canThem--;
      }
    }
  } else if (soKhamPhaHienTai > soKhamPhaMucTieu) {
    // Thua kham pha: bo co kham pha o nhung y tuong co tru cot & chan dung thuc
    let canBo = soKhamPhaHienTai - soKhamPhaMucTieu;
    for (let i = 0; i < daRai.length && canBo > 0; i++) {
      if (daRai[i].khamPha && daRai[i].truCot && daRai[i].chanDung) {
        daRai[i] = { ...daRai[i], khamPha: false };
        canBo--;
      }
    }
  }

  return daRai;
}

// ---------------------------------------------------------------------------
// Trich xuat thong tin tham khao tu tin hieu xu huong
//
// RANG BUOC 3 (TEST-BRIEF muc 5.3): chi lay CHU DE va CONG THUC KE,
// KHONG truyen nguyen van noi dung bai goc vao loi nhac.
// Ham nay la cho duy nhat ep rang buoc do o TANG MA.
// ---------------------------------------------------------------------------

type ThamKhaoXuHuong = {
  id: string;
  chuDe: string[];
  kieuHook: string | null;
  soChu: number;
  dangBai: string | null;
  tenKenh: string | null;
};

/**
 * Trich xuat cong thuc ke tu cac tin hieu xu huong da boc.
 *
 * CHI lay chu de + cong thuc, KHONG lay noi dung bai goc. Rang buoc nay duoc
 * ep o tang ma: ham nay KHONG nhan tham so `noiDung`, nen du nguoi goi muon
 * truyen vao cung khong co cach nao.
 */
function trichThamKhao(
  tinHieu: Array<{
    id: string;
    congThuc: unknown;
    dangBai: string | null;
    tenKenh: string | null;
  }>,
): ThamKhaoXuHuong[] {
  const ketQua: ThamKhaoXuHuong[] = [];
  for (const th of tinHieu) {
    if (!daBocXong(th.congThuc)) continue;
    const ct = th.congThuc as CongThuc;
    ketQua.push({
      id: th.id,
      chuDe: ct.chuDe ?? [],
      kieuHook: ct.kieuHook ?? null,
      soChu: ct.soChu ?? 0,
      dangBai: th.dangBai,
      tenKenh: th.tenKenh,
    });
  }
  return ketQua;
}
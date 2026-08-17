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

import type { BeMat, KetQuaStudio, ThamSoDeXuat, YTuongDeXuat } from './kieu';

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
  dsTrendSignalId: string[] = [],
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

    // Be mat: uu tien gia tri mo hinh tra ve neu hop le
    const beMatHopLe: BeMat =
      typeof m.beMat === 'string' && BE_MAT_HOP_LE.includes(m.beMat as BeMat)
        ? (m.beMat as BeMat)
        : beMat;

    // trendSignalId: chi chap nhan ID co that trong danh sach mauNgoai
    const trendIdTho = chuoi(m.trendSignalId);
    const trendSignalId =
      trendIdTho && dsTrendSignalId.includes(trendIdTho) ? trendIdTho : null;

    ketQua.push({
      tieuDe,
      truCot: doiChieu(m.truCot, dsTruCot),
      chanDung: doiChieu(m.chanDung, dsChanDung),
      gocTiepCan: chuoi(m.gocTiepCan),
      cauMoDau: chuoi(m.cauMoDau),
      lyDoDeXuat: chuoi(m.lyDoDeXuat),
      beMat: beMatHopLe,
      khamPha: khamPhaRaw === true || khamPhaRaw === 'true',
      trendSignalId,
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
 * Rai N y tuong theo ti le tru cot muc tieu
 * va uu tien duy tri ti le y tuong kham pha muc tieu.
 *
 * `khamPha` la thuoc tinh cua y tuong da duoc xac dinh truoc do.
 * Ham nay chi chon candidate, khong thay doi `khamPha`.
 */
export function raiTheoTruCot(
  yTuongTho: YTuongDeXuat[],
  truCotMucTieu: TruCotMucTieu[],
  soLuong: number,
): YTuongDeXuat[] {
  if (!Number.isSafeInteger(soLuong) || soLuong <= 0 || yTuongTho.length === 0) return [];
  if (truCotMucTieu.length === 0) {
    const ket = yTuongTho.slice(0, soLuong).map((y) => ({ ...y }));
    return dieuChinhTiLeKhamPha(ket, soLuong);
  }

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
        ketQua.push({ ...yTuongTho[i] });
        daChon.add(i);
        daDien++;
      }
    }
  }

  // Buoc 2: Cho trong con lai — dien bang y tuong chua chon
  for (let i = 0; i < yTuongTho.length && ketQua.length < soLuong; i++) {
    if (!daChon.has(i)) {
      ketQua.push({ ...yTuongTho[i] });
      daChon.add(i);
    }
  }

  // Buoc 3: Enforce TI_LE_KHAM_PHA (20%)
  const daRai = ketQua.slice(0, soLuong);
  return dieuChinhTiLeKhamPha(daRai, soLuong);
}

/**
 * Dam bao so luong y tuong khamPha bang dung Math.round(soLuong * TI_LE_KHAM_PHA).
 */
function dieuChinhTiLeKhamPha(ds: YTuongDeXuat[], soLuong: number): YTuongDeXuat[] {
  const soKhamPhaMucTieu = Math.round(ds.length * TI_LE_KHAM_PHA);
  let soKhamPhaHienTai = ds.filter((y) => y.khamPha).length;

  if (soKhamPhaHienTai < soKhamPhaMucTieu) {
    // Chuyen mot so y tuong false -> true tu cuoi danh sach len
    for (let i = ds.length - 1; i >= 0 && soKhamPhaHienTai < soKhamPhaMucTieu; i--) {
      if (!ds[i].khamPha) {
        ds[i].khamPha = true;
        soKhamPhaHienTai++;
      }
    }
  } else if (soKhamPhaHienTai > soKhamPhaMucTieu) {
    // Chuyen mot so y tuong true -> false tu cuoi danh sach len
    for (let i = ds.length - 1; i >= 0 && soKhamPhaHienTai > soKhamPhaMucTieu; i--) {
      if (ds[i].khamPha) {
        ds[i].khamPha = false;
        soKhamPhaHienTai--;
      }
    }
  }

  return ds;
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
// ---------------------------------------------------------------------------
// Cua chinh: de xuat y tuong
// ---------------------------------------------------------------------------

/**
 * Cua chinh: doc ho so, goi mo hinh, don, rai, persist, tra ket qua.
 *
 * Toan bo du lieu dau vao doc tu CSDL qua `createRepo()` (rang buoc 1).
 * Goi mo hinh qua `chayNhiemVu()` (rang buoc 5).
 * Tin hieu xu huong chi doc khi co `nguoiDung` — truc co lap thu 2 (rang buoc 16).
 * Ket qua duoc persist vao bang `ideas` de refresh trang van hien thi.
 */
export async function deXuatYTuong(
  thamSo: ThamSoDeXuat,
): Promise<KetQuaStudio<YTuongDeXuat[]>> {
  const { workspaceId, beMat, soLuong } = thamSo;
  const canhBao: string[] = [];

  if (!Number.isSafeInteger(soLuong) || soLuong <= 0) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Số lượng ý tưởng phải là một số nguyên dương.',
      canhBao,
    };
  }
  if (!BE_MAT_HOP_LE.includes(beMat)) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Bề mặt đăng bài không hợp lệ.',
      canhBao,
    };
  }

  // --- 1. Doc du lieu tu CSDL ---
  const repo = createRepo(workspaceId);

  let hoSo;
  let truCotDs;
  let chanDungDs;
  let insightDs;
  let baiDaDang;
  try {
    [hoSo, truCotDs, chanDungDs, insightDs, baiDaDang] = await Promise.all([
      repo.hoSo.layHoacTao(),
      repo.truCot.list(),
      repo.chanDung.list(),
      repo.insight.list(),
      repo.contents.list({ trangThai: 'da_dang', gioiHan: GIOI_HAN_BAI_DA_DANG }),
    ]);
  } catch {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Không đọc được dữ liệu hồ sơ. Vui lòng thử lại.',
      canhBao,
    };
  }

  if (truCotDs.length === 0) {
    canhBao.push('Chưa có trụ cột nội dung. Vào /brand để thêm.');
  }
  if (chanDungDs.length === 0) {
    canhBao.push('Chưa có chân dung khách hàng. Vào /brand để thêm.');
  }
  if (truCotDs.length === 0 || chanDungDs.length === 0) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Cần có ít nhất một trụ cột và một chân dung khách hàng trước khi đề xuất.',
      canhBao,
    };
  }

  // Danh sach TEN co that — de doi chieu ket qua mo hinh
  const dsTenTruCot = truCotDs.map((t: TruCot) => t.ten);
  const dsTenChanDung = chanDungDs.map((c: ChanDung) => c.ten);

  // Tru cot muc tieu — de rai y tuong theo ti le
  const truCotMucTieu: TruCotMucTieu[] = truCotDs.map((t: TruCot) => ({
    ten: t.ten,
    tiLeMucTieu: t.tiLeMucTieu !== null ? Number(t.tiLeMucTieu) : null,
  }));

  // --- 2. Doc tin hieu xu huong (chi cong thuc ke, KHONG co noi dung goc) ---
  // Truc co lap thu 2: chi lay tin hieu cua cac kenh NGUOI NAY thuc su theo doi.
  let thamKhao: ThamKhaoXuHuong[] = [];
  const mapNguonThamKhao = new Map<string, { tenKenh?: string | null; lienKet?: string | null }>();

  if (thamSo.nguoiDung) {
    try {
      const tinHieu = await repo.tinHieuXuHuong.theoNguoiDung(
        thamSo.nguoiDung,
        GIOI_HAN_TIN_HIEU,
      );
      thamKhao = trichThamKhao(tinHieu);
      for (const th of tinHieu) {
        mapNguonThamKhao.set(th.id, {
          tenKenh: th.tenKenh,
          lienKet: th.lienKet,
        });
      }
    } catch {
      // Khong doc duoc tin hieu xu huong -> van tiep tuc sinh y tuong tu cac nguon khac
    }
  }

  // Danh sach trendSignalId hop le — de validate ket qua mo hinh
  const dsTrendSignalId = thamKhao.map((tk) => tk.id);

  // --- 3. Dung du lieu dau vao cho mo hinh ---
  const duLieuVao: Record<string, unknown> = {
    hoSo: {
      moTa: hoSo.moTa,
      giongDieu: hoSo.giongDieu,
      dieuCamKy: hoSo.dieuCamKy,
    },
    truCot: truCotDs.map((t: TruCot) => ({
      ten: t.ten,
      mucDich: t.mucDich,
    })),
    chanDung: chanDungDs.map((c: ChanDung) => ({
      ten: c.ten,
      doTuoi: c.doTuoi,
      ngheNghiep: c.ngheNghiep,
      noiDau: c.noiDau,
      mongMuon: c.mongMuon,
    })),
    insight: insightDs.map((i: Insight) => ({
      noiDung: i.noiDung,
      bangChung: i.bangChung,
    })),
    baiDaDang: baiDaDang.map((b) => ({
      tieuDe: b.cauMoDau ?? (b.noiDung ? b.noiDung.slice(0, 100) : ''),
      beMat: b.beMat,
    })),
    // Lop C: cong thuc ke tu kenh ngoai — CHI chu de + kieu hook, KHONG co noi dung goc
    mauNgoai: thamKhao.map((tk) => ({
      soThuTu: tk.id,
      chuDe: tk.chuDe,
      kieuHook: tk.kieuHook,
      soChu: tk.soChu,
      dangBai: tk.dangBai,
    })),
    beMat,
    soLuong,
    tiLeKhamPha: TI_LE_KHAM_PHA,
  };

  // --- 4. Goi mo hinh qua hang doi ---
  let ketQuaMoHinh;
  try {
    ketQuaMoHinh = await chayNhiemVu({
      nhiemVu: 'de-xuat-y-tuong',
      duLieuVao,
      moHinh: 'auto',
      khongGianLamViec: workspaceId,
      // Dung khoa mac dinh cua runner. Khoa duoc bao ve bang UNIQUE trong CSDL,
      // nen hai lan bam cung payload chi tao mot job thay vi goi model va luu
      // trung hai bo y tuong.
    });
  } catch {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Không gọi được mô hình. Vui lòng thử lại.',
      canhBao,
    };
  }

  if (ketQuaMoHinh.trangThai !== 'xong' || !ketQuaMoHinh.ketQua) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: ketQuaMoHinh.loi ?? 'Mô hình không trả về kết quả.',
      canhBao,
    };
  }

  // --- 5. Don ket qua tho ---
  const yTuongTho = donKetQuaDeXuat(
    ketQuaMoHinh.ketQua,
    dsTenTruCot,
    dsTenChanDung,
    beMat,
    dsTrendSignalId,
  );

  if (yTuongTho.length === 0) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Mô hình không sinh được ý tưởng nào hợp lệ.',
      canhBao,
    };
  }

  // --- 6. Rai theo ti le tru cot + enforce TI_LE_KHAM_PHA ---
  const yTuongDaRai = raiTheoTruCot(yTuongTho, truCotMucTieu, soLuong);

  // --- 7. Persist vao bang ideas ---
  // Map ten tru cot/chan dung -> ID de luu foreign key
  // Neu day la request trung, request dau tien la request duy nhat persist. Ca
  // hai request van nhan cung ket qua de UI khong bi loi, nhung khong sinh dong
  // `ideas` lap lai sau khi job trong hang doi ket thuc.
  if (!ketQuaMoHinh.moi) {
    canhBao.push('Đề xuất trùng một yêu cầu đang có; dùng lại kết quả đã sinh.');
    return { trangThai: 'xong', ketQua: yTuongDaRai, loi: null, canhBao };
  }

  const mapTruCot = new Map(truCotDs.map((t: TruCot) => [chuanHoaTen(t.ten), t.id]));
  const mapChanDung = new Map(chanDungDs.map((c: ChanDung) => [chuanHoaTen(c.ten), c.id]));

  const dsTrendDaDung = new Set<string>();

  for (const yt of yTuongDaRai) {
    const pillarId = yt.truCot ? mapTruCot.get(chuanHoaTen(yt.truCot)) ?? null : null;
    const personaId = yt.chanDung ? mapChanDung.get(chuanHoaTen(yt.chanDung)) ?? null : null;

    if (yt.trendSignalId) {
      dsTrendDaDung.add(yt.trendSignalId);
      yt.nguonThamKhao = mapNguonThamKhao.get(yt.trendSignalId) ?? null;
    }

    try {
      await repo.yTuong.tao({
        beMat: yt.beMat,
        gocTiepCan: yt.gocTiepCan,
        cauMoDau: yt.cauMoDau,
        lyDoDeXuat: yt.lyDoDeXuat,
        pillarId,
        personaId,
        trendSignalId: yt.trendSignalId ?? null,
      });
    } catch {
      // Luu that bai thi bo qua y tuong nay, khong de mat ca lo
      canhBao.push(`Không lưu được ý tưởng "${yt.tieuDe}".`);
    }
  }

  // Danh dau trend signals da dung de lan sau uu tien bai chua khai thac
  if (dsTrendDaDung.size > 0) {
    try {
      await repo.tinHieuXuHuong.danhDauDaDung([...dsTrendDaDung]);
    } catch {
      // Khong critical — chi anh huong thu tu uu tien lan sau
    }
  }

  return {
    trangThai: 'xong',
    ketQua: yTuongDaRai,
    loi: null,
    canhBao,
  };
}

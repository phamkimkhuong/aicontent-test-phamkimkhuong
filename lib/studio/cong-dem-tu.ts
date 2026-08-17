/**
 * Cong dem tu va kiem tra tran do dai cua tung be mat.
 *
 * Dung chung cho ca giao dien trinh duyet va tien trinh may chu.
 */

import { KHOANG_TU_BE_MAT } from '@/lib/model-runner/khoang-tu-be-mat';
import type { BeMat } from './kieu';

export { KHOANG_TU_BE_MAT };

/**
 * Dem so tieng (tu) trong van ban cach nhau boi khoang trang.
 */
export function demTu(vanBan: string): number {
  const sach = vanBan.trim();
  return sach === '' ? 0 : sach.split(/\s+/).length;
}

export type KetQuaDoDai = {
  soTu: number;
  toiThieu: number;
  toiDa: number;
  trangThai: 'dat' | 'ngan' | 'dai';
  dat: boolean;
  moTa: string;
};

/**
 * Kiem tra do dai van ban co nam trong khoang cho phep cua be mat hoac theo yeu cau ep do dai khong.
 */
export function kiemDoDai(
  beMat: BeMat,
  vanBan: string,
  epDoDai?: number | null,
): KetQuaDoDai {
  const soTu = demTu(vanBan);
  let toiThieu: number;
  let toiDa: number;
  let tenQuyChuan: string;

  if (typeof epDoDai === 'number' && epDoDai > 0) {
    // Ep do dai co dinh: cho phep dung sai nho +-10% quanh so tu ep
    toiThieu = Math.max(1, Math.round(epDoDai * 0.9));
    toiDa = Math.round(epDoDai * 1.1);
    tenQuyChuan = `ép ${epDoDai} từ (${toiThieu}–${toiDa} từ)`;
  } else {
    const nguong = KHOANG_TU_BE_MAT[beMat] ?? { toiThieu: 0, toiDa: 9999 };
    toiThieu = nguong.toiThieu;
    toiDa = nguong.toiDa;
    tenQuyChuan = `${toiThieu}–${toiDa} từ`;
  }

  let trangThai: 'dat' | 'ngan' | 'dai' = 'dat';
  let moTa = `Đạt chuẩn (${tenQuyChuan})`;

  if (soTu < toiThieu) {
    trangThai = 'ngan';
    moTa = `Quá ngắn (cần thêm ${toiThieu - soTu} từ để đạt ${tenQuyChuan})`;
  } else if (soTu > toiDa) {
    trangThai = 'dai';
    moTa = `Quá dài (vượt ${soTu - toiDa} từ so với ${tenQuyChuan})`;
  }

  return {
    soTu,
    toiThieu,
    toiDa,
    trangThai,
    dat: trangThai === 'dat',
    moTa,
  };
}

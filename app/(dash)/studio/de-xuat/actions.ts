'use server';

/**
 * Server Actions cho man hinh De xuat y tuong (/studio/de-xuat).
 *
 * `workspaceId` LUON doc tu `workspaceHienTai()` — tuan thu bo quet bao ve DAL.
 * `nguoiDung` doc tu `nguoiDungHienTai()` — truc co lap thu 2 cho trend_signals.
 */

import { revalidatePath } from 'next/cache';

import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { nguoiDungHienTai } from '@/lib/auth/nguoi-dung-tu-phien';
import { deXuatYTuong } from '@/lib/studio/de-xuat';
import type { BeMat, KetQuaStudio, YTuongDeXuat } from '@/lib/studio/kieu';

/**
 * Sinh danh sach y tuong de xuat cho be mat duoc chon.
 *
 * Y tuong duoc TU DONG LUU vao bang `ideas` trong `deXuatYTuong()`.
 * Refresh trang se thay lai y tuong da sinh.
 */
export async function sinhDeXuatAction(
  beMat: BeMat,
  soLuong = 5,
): Promise<KetQuaStudio<YTuongDeXuat[]>> {
  const workspaceId = await workspaceHienTai();

  // Truc co lap thu 2: chi lay trend signals cua cac kenh NGUOI NAY thuc su theo doi
  let nguoiDung;
  try {
    nguoiDung = await nguoiDungHienTai();
  } catch {
    // Khong lay duoc userId — van sinh y tuong duoc, chi thieu trend signals
    nguoiDung = undefined;
  }

  const ketQua = await deXuatYTuong({
    workspaceId,
    beMat,
    soLuong: Math.max(1, Math.min(20, soLuong)),
    nguoiDung,
  });

  // Revalidate de man hinh cap nhat danh sach y tuong da luu
  if (ketQua.trangThai === 'xong') {
    revalidatePath('/studio/de-xuat');
  }

  return ketQua;
}

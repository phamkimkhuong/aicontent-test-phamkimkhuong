'use server';

/**
 * Server Actions cho man hinh Chuoi bai noi mach (/studio/chuoi-bai).
 *
 * `workspaceId` LUON doc tu `workspaceHienTai()` — tuan thu bo quet bao ve DAL.
 */

import { revalidatePath } from 'next/cache';

import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import {
  sinhChuoiBai,
  type KetQuaChuoiBai,
  type ThamSoSinhChuoiBai,
} from '@/lib/studio/chuoi-bai';
import type { BeMat, KetQuaStudio } from '@/lib/studio/kieu';

/**
 * Sinh chuoi bai viet noi tiep mach bang AI.
 */
export async function sinhChuoiBaiAction(thamSo: {
  tieuDeChuoi: string;
  beMat: BeMat;
  soLuongKy?: number;
  danYTuyChon?: string[];
  luuNgay?: boolean;
  trangThaiLuu?: 'ban_nhap' | 'san_sang';
}): Promise<KetQuaStudio<KetQuaChuoiBai>> {
  const workspaceId = await workspaceHienTai();
  const res = await sinhChuoiBai({
    workspaceId,
    ...thamSo,
  });

  if (res.trangThai === 'xong') {
    revalidatePath('/studio/chuoi-bai');
    revalidatePath('/bai-da-dang');
  }

  return res;
}

/**
 * Luu toan bo cac ky trong chuoi bai vao bang `contents`.
 */
export async function luuChuoiBaiAction(thamSo: {
  tieuDeChuoi: string;
  beMat: BeMat;
  cacKy: Array<{
    kySo: number;
    tieuDeKy: string;
    noiDung: string;
    gocTiepCan?: string | null;
    trangThai: 'ban_nhap' | 'san_sang';
  }>;
}): Promise<{ ok: boolean; soLuongLuu: number; loi?: string }> {
  const workspaceId = await workspaceHienTai();
  const repo = createRepo(workspaceId);

  let soLuongLuu = 0;
  try {
    for (const ky of thamSo.cacKy) {
      if (!ky.noiDung.trim()) continue;

      await repo.contents.tao({
        beMat: thamSo.beMat,
        noiDung: ky.noiDung,
        cauMoDau: `[Kỳ ${ky.kySo}]`,
        gocTiepCan: ky.gocTiepCan ?? null,
        moHinhDaSinh: 'viet-bai',
        trangThai: ky.trangThai,
        nguonYTuong: 'nguoi-tu-nhap',
      });
      soLuongLuu++;
    }

    revalidatePath('/studio/chuoi-bai');
    revalidatePath('/bai-da-dang');
    return { ok: true, soLuongLuu };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi khi lưu chuỗi bài.';
    return { ok: false, soLuongLuu, loi: msg };
  }
}

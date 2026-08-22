'use server';

/**
 * Server Actions cho man hinh Bien soan bai viet (/studio/bien-soan).
 *
 * `workspaceId` LUON doc tu `workspaceHienTai()` — tuan thu bo quet bao ve DAL.
 */

import { revalidatePath } from 'next/cache';

import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import { sinhBaiViet, type KetQuaSinhBai } from '@/lib/studio/bien-soan';
import { sinhKichBanVideo } from '@/lib/studio/kich-ban';
import type { BeMat, KetQuaStudio, KichBanVideo } from '@/lib/studio/kieu';

export type KetQuaLuuBai =
  | { ok: true; contentId: string }
  | { ok: false; loi: string };

/**
 * Sinh kịch bản video phân cảnh bằng AI (Mốc 3).
 */
export async function sinhKichBanAction(thamSo: {
  beMat?: BeMat;
  tieuDe: string;
  gocTiepCan?: string | null;
  cauMoDau?: string | null;
  ideaId?: string | null;
  thoiLuongUocTinhGiay?: number | null;
}): Promise<KetQuaStudio<KichBanVideo>> {
  const workspaceId = await workspaceHienTai();
  return sinhKichBanVideo({
    workspaceId,
    ...thamSo,
  });
}

/**
 * Sinh noi dung bai viet bang AI.
 */
export async function sinhBaiAction(thamSo: {
  beMat: BeMat;
  tieuDe: string;
  gocTiepCan?: string | null;
  cauMoDau?: string | null;
  ideaId?: string | null;
  epDoDai?: number | null;
  mach?: string[] | null;
}): Promise<KetQuaStudio<KetQuaSinhBai>> {
  const workspaceId = await workspaceHienTai();
  return sinhBaiViet({
    workspaceId,
    ...thamSo,
  });
}

/**
 * Luu bai viet vao bang `contents`.
 */
export async function luuBaiAction(thamSo: {
  tieuDe?: string | null;
  noiDung: string;
  beMat: BeMat;
  ideaId?: string | null;
  cauMoDau?: string | null;
  gocTiepCan?: string | null;
  trangThai?: 'ban_nhap' | 'san_sang';
}): Promise<KetQuaLuuBai> {
  const workspaceId = await workspaceHienTai();
  const repo = createRepo(workspaceId);

  try {
    let finalBeMat: BeMat = thamSo.beMat;
    let pillarId: string | null = null;
    let personaId: string | null = null;

    if (thamSo.ideaId) {
      const yTuong = await repo.yTuong.layTheoId(thamSo.ideaId);
      if (yTuong) {
        if (yTuong.beMat && ['fanpage', 'ho_so_ca_nhan', 'tiktok', 'zalo'].includes(yTuong.beMat)) {
          finalBeMat = yTuong.beMat as BeMat;
        }
        pillarId = yTuong.pillarId ?? null;
        personaId = yTuong.personaId ?? null;
      }
    }

    const dong = await repo.contents.tao({
      beMat: finalBeMat,
      noiDung: thamSo.noiDung,
      cauMoDau: thamSo.cauMoDau ?? null,
      gocTiepCan: thamSo.gocTiepCan ?? null,
      ideaId: thamSo.ideaId ?? null,
      pillarId,
      personaId,
      moHinhDaSinh: 'viet-bai',
      trangThai: thamSo.trangThai ?? 'ban_nhap',
      nguonYTuong: thamSo.ideaId ? 'may-de-xuat' : 'nguoi-tu-nhap',
    });

    revalidatePath('/studio/bien-soan');
    revalidatePath('/bai-da-dang');
    return { ok: true, contentId: dong.id };
  } catch (loi) {
    const thongBao = loi instanceof Error ? loi.message : 'Không thể lưu bài viết.';
    return { ok: false, loi: thongBao };
  }
}

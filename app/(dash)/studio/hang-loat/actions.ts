'use server';

/**
 * Server Actions cho man hinh Sinh hang loat (/studio/hang-loat) — Moc 4.
 *
 * `workspaceId` LUON doc tu `workspaceHienTai()` — tuan thu bo quet bao ve DAL.
 */

import { revalidatePath } from 'next/cache';

import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import type { TruCot } from '@/lib/data-access/content-pillars';
import type { Idea } from '@/lib/data-access/ideas';
import type { ChanDung } from '@/lib/data-access/personas';
import {
  sinhHangLoat,
  type KetQuaMucHangLoat,
  type MucYTuongHangLoat,
} from '@/lib/studio/hang-loat';
import type { BeMat, KetQuaStudio } from '@/lib/studio/kieu';

export type YTuongChuaDung = {
  id: string;
  beMat: BeMat;
  gocTiepCan: string | null;
  cauMoDau: string | null;
  lyDoDeXuat: string | null;
  tenTruCot: string | null;
  tenChanDung: string | null;
  daDung: boolean;
  ngayTao: string;
};

/**
 * Lay danh sach y tuong co san trong he thong de chon sinh hang loat.
 */
export async function layDanhSachYTuongAction(): Promise<YTuongChuaDung[]> {
  const workspaceId = await workspaceHienTai();
  const repo = createRepo(workspaceId);

  try {
    const [dsYTuong, dsTruCot, dsChanDung] = await Promise.all([
      repo.yTuong.list(50),
      repo.truCot.list(),
      repo.chanDung.list(),
    ]);

    const mapTruCot = new Map(dsTruCot.map((t: TruCot) => [t.id, t.ten]));
    const mapChanDung = new Map(dsChanDung.map((c: ChanDung) => [c.id, c.ten]));

    return dsYTuong.map((y: Idea) => ({
      id: y.id,
      beMat: y.beMat as BeMat,
      gocTiepCan: y.gocTiepCan,
      cauMoDau: y.cauMoDau,
      lyDoDeXuat: y.lyDoDeXuat,
      tenTruCot: y.pillarId ? mapTruCot.get(y.pillarId) ?? null : null,
      tenChanDung: y.personaId ? mapChanDung.get(y.personaId) ?? null : null,
      daDung: y.daDung,
      ngayTao: y.ngayTao ? new Date(y.ngayTao).toISOString() : new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

/**
 * Sinh hang loat bai viet / kich ban bang AI (Moc 4).
 */
export async function sinhHangLoatAction(thamSo: {
  danhSach: MucYTuongHangLoat[];
  luuNgay?: boolean;
  trangThaiLuu?: 'ban_nhap' | 'san_sang';
}): Promise<KetQuaStudio<KetQuaMucHangLoat[]>> {
  const workspaceId = await workspaceHienTai();
  const res = await sinhHangLoat({
    workspaceId,
    danhSach: thamSo.danhSach,
    luuNgay: thamSo.luuNgay,
    trangThaiLuu: thamSo.trangThaiLuu,
  });

  if (res.trangThai === 'xong') {
    revalidatePath('/studio/hang-loat');
    revalidatePath('/bai-da-dang');
  }

  return res;
}

/**
 * Luu hang loat cac bai da sinh vao bang `contents`.
 */
export async function luuHangLoatAction(
  danhSach: Array<{
    tieuDe?: string | null;
    noiDung: string;
    beMat: BeMat;
    ideaId?: string | null;
    cauMoDau?: string | null;
    gocTiepCan?: string | null;
    dinhDang?: 'bai_viet' | 'kich_ban';
    trangThai: 'ban_nhap' | 'san_sang';
  }>,
): Promise<{ ok: boolean; soLuongLuu: number; loi?: string }> {
  const workspaceId = await workspaceHienTai();
  const repo = createRepo(workspaceId);

  let soLuongLuu = 0;
  try {
    for (const item of danhSach) {
      if (!item.noiDung.trim()) continue;

      let pillarId: string | null = null;
      let personaId: string | null = null;

      if (item.ideaId) {
        const yTuong = await repo.yTuong.layTheoId(item.ideaId);
        if (yTuong) {
          pillarId = yTuong.pillarId ?? null;
          personaId = yTuong.personaId ?? null;
        }
      }

      await repo.contents.tao({
        beMat: item.beMat,
        noiDung: item.noiDung,
        cauMoDau: item.cauMoDau ?? null,
        gocTiepCan: item.gocTiepCan ?? null,
        ideaId: item.ideaId ?? null,
        pillarId,
        personaId,
        moHinhDaSinh: item.dinhDang === 'kich_ban' ? 'viet-kich-ban' : 'viet-bai',
        trangThai: item.trangThai,
        nguonYTuong: item.ideaId ? 'may-de-xuat' : 'nguoi-tu-nhap',
      });
      soLuongLuu++;
    }

    revalidatePath('/studio/hang-loat');
    revalidatePath('/bai-da-dang');
    return { ok: true, soLuongLuu };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi khi lưu hàng loạt.';
    return { ok: false, soLuongLuu, loi: msg };
  }
}

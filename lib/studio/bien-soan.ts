/**
 * Module bien soan bai viet — Moc 2 cua bai test.
 *
 * Tu mot y tuong (tieu de, goc tiep can, cau mo dau) -> goi mo hinh sinh bai
 * dang hoan chinh, dung giong be mat va giong thuong hieu.
 */

import { createRepo } from '@/lib/data-access';
import { chayNhiemVu } from '@/lib/model-runner';
import { quetQuyTacNgonNgu, type ViPhamNgonNgu } from '@/lib/brand/quy-tac-ngon-ngu';
import { kiemDoDai } from './cong-dem-tu';
import type { BeMat, KetQuaStudio } from './kieu';

export type ThamSoSinhBai = {
  workspaceId: string;
  beMat: BeMat;
  tieuDe: string;
  gocTiepCan?: string | null;
  cauMoDau?: string | null;
  ideaId?: string | null;
  epDoDai?: number | null;
  mach?: string[] | null;
};

export type KetQuaSinhBai = {
  tieuDe: string;
  noiDung: string;
  hashtag: string[];
  soTu: number;
  doDaiDat: boolean;
  canhBaoDoDai: string;
  viPhamNgonNgu: Array<{
    cumTu: string;
    thayBang: string;
    boiCanh: string;
  }>;
};

/**
 * Sinh bai viet hoan chinh tu y tuong.
 */
export async function sinhBaiViet(
  thamSo: ThamSoSinhBai,
): Promise<KetQuaStudio<KetQuaSinhBai>> {
  const { workspaceId, epDoDai, mach } = thamSo;
  const canhBao: string[] = [];

  const repo = createRepo(workspaceId);
  const hoSo = await repo.hoSo.layHoacTao();

  let finalBeMat = thamSo.beMat;
  let finalTieuDe = thamSo.tieuDe;
  let finalGocTiepCan = thamSo.gocTiepCan ?? null;
  let finalCauMoDau = thamSo.cauMoDau ?? null;
  let tenTruCot: string | null = null;
  let thongTinChanDung: Record<string, unknown> | null = null;

  // Doc truc tiep tu DB neu co ideaId (khong tin du lieu client tuy tien)
  if (thamSo.ideaId) {
    const yTuong = await repo.yTuong.layTheoId(thamSo.ideaId);
    if (yTuong) {
      if (yTuong.beMat && ['fanpage', 'ho_so_ca_nhan', 'tiktok', 'zalo'].includes(yTuong.beMat)) {
        finalBeMat = yTuong.beMat as BeMat;
      }
      finalGocTiepCan = yTuong.gocTiepCan ?? finalGocTiepCan;
      finalCauMoDau = yTuong.cauMoDau ?? finalCauMoDau;
      if (!finalTieuDe) {
        finalTieuDe = yTuong.cauMoDau ?? yTuong.gocTiepCan ?? '(Chưa đặt tiêu đề)';
      }

      if (yTuong.pillarId) {
        const pillar = await repo.truCot.layTheoId(yTuong.pillarId);
        if (pillar) {
          tenTruCot = pillar.ten;
        }
      }

      if (yTuong.personaId) {
        const persona = await repo.chanDung.layTheoId(yTuong.personaId);
        if (persona) {
          thongTinChanDung = {
            ten: persona.ten,
            noiDau: persona.noiDau,
            mongMuon: persona.mongMuon,
          };
        }
      }
    }
  }

  const duLieuVao: Record<string, unknown> = {
    tieuDe: finalTieuDe,
    gocTiepCan: finalGocTiepCan,
    cauMoDau: finalCauMoDau,
    truCot: tenTruCot,
    chanDung: thongTinChanDung,
    hoSo: {
      moTa: hoSo.moTa,
      giongDieu: hoSo.giongDieu,
      dieuCamKy: hoSo.dieuCamKy,
    },
    bienThe: finalBeMat,
  };

  if (typeof epDoDai === 'number' && epDoDai > 0) {
    duLieuVao.epDoDai = epDoDai;
  }
  if (Array.isArray(mach) && mach.length > 0) {
    duLieuVao.mach = mach;
  }

  let ketQuaMoHinh;
  try {
    ketQuaMoHinh = await chayNhiemVu({
      nhiemVu: 'viet-bai',
      duLieuVao,
      moHinh: 'auto',
      khongGianLamViec: workspaceId,
      khoaChongTrung: null,
    });
  } catch (loi) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Không thể kết nối với mô hình để viết bài.',
      canhBao,
    };
  }

  if (ketQuaMoHinh.trangThai !== 'xong' || !ketQuaMoHinh.ketQua) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: ketQuaMoHinh.loi ?? 'Mô hình không trả về nội dung bài viết.',
      canhBao,
    };
  }

  const traVe = ketQuaMoHinh.ketQua as {
    tieuDe?: string;
    noiDung?: string;
    hashtag?: string[];
  };

  const tieuDeKet = (traVe.tieuDe ?? finalTieuDe ?? '').trim();
  const noiDungKet = (traVe.noiDung ?? '').trim();
  const hashtagKet = Array.isArray(traVe.hashtag)
    ? traVe.hashtag.filter((h): h is string => typeof h === 'string' && h.trim() !== '')
    : [];

  if (!noiDungKet) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Mô hình trả về nội dung rỗng.',
      canhBao,
    };
  }

  // Kiem tra do dai theo chuan be mat
  const doDai = kiemDoDai(finalBeMat, noiDungKet);
  if (!doDai.dat) {
    canhBao.push(`Độ dài bài viết: ${doDai.moTa}`);
  }

  // Kiem tra quy tac ngon ngu thuong hieu
  const viPham = quetQuyTacNgonNgu(noiDungKet);
  if (viPham.length > 0) {
    canhBao.push(`Phát hiện ${viPham.length} cụm từ vi phạm quy tắc thương hiệu.`);
  }

  return {
    trangThai: 'xong',
    ketQua: {
      tieuDe: tieuDeKet,
      noiDung: noiDungKet,
      hashtag: hashtagKet,
      soTu: doDai.soTu,
      doDaiDat: doDai.dat,
      canhBaoDoDai: doDai.moTa,
      viPhamNgonNgu: viPham.map((v: ViPhamNgonNgu) => ({
        cumTu: v.cumTu,
        thayBang: v.thayBang,
        boiCanh: v.boiCanh,
      })),
    },
    loi: null,
    canhBao,
  };
}

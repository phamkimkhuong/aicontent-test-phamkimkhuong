/**
 * Module bien soan bai viet — Moc 2 cua bai test.
 *
 * Tu mot y tuong (tieu de, goc tiep can, cau mo dau) -> goi mo hinh sinh bai
 * dang hoan chinh, dung giong be mat va giong thuong hieu.
 */

import { createRepo } from '@/lib/data-access';
import { chayNhiemVu } from '@/lib/model-runner';
import { quetQuyTacNgonNgu, type ViPhamNgonNgu } from '@/lib/brand/quy-tac-ngon-ngu';
import { DINH_MUC_TIN_DUNG } from '@/lib/credits/dinh-muc-tin-dung';
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

  // Kiem tra han muc Tin dung AI
  const chiPhiCredit = DINH_MUC_TIN_DUNG['viet-bai'];
  try {
    const kiemTraCredit = await repo.credits.kiemTraDuCredit(chiPhiCredit);
    if (!kiemTraCredit.du) {
      return {
        trangThai: 'loi',
        ketQua: null,
        loi: `Bạn đã sử dụng hết hạn mức tín dụng tháng này (còn ${kiemTraCredit.soDuHienTai} Credits, cần ${chiPhiCredit} Credits). Vui lòng nâng cấp gói cước để tiếp tục.`,
        canhBao,
      };
    }
  } catch {
    // Bo qua neu khong doc duoc credit
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

  let tieuDeKet = (traVe.tieuDe ?? finalTieuDe ?? '').trim();
  let noiDungKet = (traVe.noiDung ?? '').trim();
  let hashtagKet = Array.isArray(traVe.hashtag)
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

  // Kiem tra do dai theo chuan be mat hoac epDoDai
  let doDai = kiemDoDai(finalBeMat, noiDungKet, typeof epDoDai === 'number' ? epDoDai : null);

  // Neu co rang buoc epDoDai ma lan dau chua dat -> thu retry 1 lan voi nhac nho cu the
  if (typeof epDoDai === 'number' && epDoDai > 0 && !doDai.dat) {
    try {
      const duLieuVaoRetry = {
        ...duLieuVao,
        yeuCauBoSung: `Lần viết trước sinh ${doDai.soTu} từ, chưa đạt ràng buộc ép ${epDoDai} từ. Hãy viết lại chính xác khoảng ${epDoDai} từ.`,
      };
      const retryRes = await chayNhiemVu({
        nhiemVu: 'viet-bai',
        duLieuVao: duLieuVaoRetry,
        moHinh: 'auto',
        khongGianLamViec: workspaceId,
        khoaChongTrung: null,
      });

      if (retryRes.trangThai === 'xong' && retryRes.ketQua) {
        const retryTraVe = retryRes.ketQua as {
          tieuDe?: string;
          noiDung?: string;
          hashtag?: string[];
        };
        const retryNoiDung = (retryTraVe.noiDung ?? '').trim();
        if (retryNoiDung) {
          const retryDoDai = kiemDoDai(finalBeMat, retryNoiDung, epDoDai);
          if (retryDoDai.dat || Math.abs(retryDoDai.soTu - epDoDai) < Math.abs(doDai.soTu - epDoDai)) {
            noiDungKet = retryNoiDung;
            tieuDeKet = (retryTraVe.tieuDe ?? tieuDeKet).trim();
            if (Array.isArray(retryTraVe.hashtag)) {
              hashtagKet = retryTraVe.hashtag.filter((h): h is string => typeof h === 'string' && h.trim() !== '');
            }
            doDai = retryDoDai;
          }
        }
      }
    } catch {
      // Bo qua loi network cua retry de tiep tuc danh gia
    }

    // Neu sau retry van khong dat rang buoc ep do dai BAT BUOC -> tra ve loi
    if (!doDai.dat) {
      return {
        trangThai: 'loi',
        ketQua: null,
        loi: `Không đạt ràng buộc ép độ dài bắt buộc: ${doDai.moTa}`,
        canhBao,
      };
    }
  } else if (!doDai.dat) {
    canhBao.push(`Độ dài bài viết: ${doDai.moTa}`);
  }

  // Kiem tra quy tac ngon ngu thuong hieu
  const viPham = quetQuyTacNgonNgu(noiDungKet);
  if (viPham.length > 0) {
    canhBao.push(`Phát hiện ${viPham.length} cụm từ vi phạm quy tắc thương hiệu.`);
  }

  // Tru tin dung khi bien soan bai viet thanh cong
  try {
    await repo.credits.ghiBienDong(
      -chiPhiCredit,
      `Biên soạn bài viết "${tieuDeKet.slice(0, 40)}" (${finalBeMat})`,
    );
  } catch {
    // Khong chan luong neu ghi nhat ky credit loi
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

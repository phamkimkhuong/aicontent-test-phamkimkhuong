/**
 * Module sinh kịch bản video phân cảnh — Mốc 3 của bài test.
 *
 * Từ 1 ý tưởng (hoặc tiêu đề, câu mở đầu, góc tiếp cận) -> gọi mô hình sinh
 * kịch bản phân cảnh (Storyboard: thời lượng giây, mô tả hình ảnh, lời thoại).
 */

import { createRepo } from '@/lib/data-access';
import { chayNhiemVu } from '@/lib/model-runner';
import { quetQuyTacNgonNgu, type ViPhamNgonNgu } from '@/lib/brand/quy-tac-ngon-ngu';
import { DINH_MUC_TIN_DUNG } from '@/lib/credits/dinh-muc-tin-dung';
import { demTu } from './cong-dem-tu';
import type {
  BeMat,
  KetQuaStudio,
  KichBanVideo,
  PhanCanhVideo,
  ThamSoSinhKichBan,
} from './kieu';

/**
 * Dọn kết quả thô của mô hình về đúng định dạng PhanCanhVideo[].
 */
export function donKetQuaKichBan(tho: unknown): {
  tieuDe: string;
  phanCanh: PhanCanhVideo[];
} {
  if (!tho || typeof tho !== 'object') {
    return { tieuDe: '', phanCanh: [] };
  }

  const obj = tho as Record<string, unknown>;
  const tieuDe = typeof obj.tieuDe === 'string' ? obj.tieuDe.trim() : '';

  const danhSachTho = Array.isArray(obj.phanCanh) ? obj.phanCanh : [];
  const phanCanh: PhanCanhVideo[] = [];

  for (const item of danhSachTho) {
    if (!item || typeof item !== 'object') continue;
    const p = item as Record<string, unknown>;

    let thoiLuong = Number(p.thoiLuongGiay);
    if (isNaN(thoiLuong) || thoiLuong <= 0) thoiLuong = 3;
    thoiLuong = Math.round(thoiLuong);

    const hinhAnh = typeof p.hinhAnh === 'string' ? p.hinhAnh.trim() : '';
    const loiThoai = typeof p.loiThoai === 'string' ? p.loiThoai.trim() : '';

    if (hinhAnh || loiThoai) {
      phanCanh.push({
        thoiLuongGiay: thoiLuong,
        hinhAnh,
        loiThoai,
      });
    }
  }

  return { tieuDe, phanCanh };
}

/**
 * Sinh kịch bản video phân cảnh từ ý tưởng.
 */
export async function sinhKichBanVideo(
  thamSo: ThamSoSinhKichBan,
): Promise<KetQuaStudio<KichBanVideo>> {
  const { workspaceId, thoiLuongUocTinhGiay } = thamSo;
  const canhBao: string[] = [];

  const repo = createRepo(workspaceId);
  const hoSo = await repo.hoSo.layHoacTao();

  let finalBeMat: BeMat = thamSo.beMat ?? 'tiktok';
  let finalTieuDe = thamSo.tieuDe;
  let finalGocTiepCan = thamSo.gocTiepCan ?? null;
  let finalCauMoDau = thamSo.cauMoDau ?? null;
  let tenTruCot: string | null = null;
  let thongTinChanDung: Record<string, unknown> | null = null;

  // Đọc từ DB nếu có ideaId (không tin dữ liệu client tùy tiện)
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
    thoiLuongUocTinhGiay: thoiLuongUocTinhGiay ?? 45,
    hoSo: {
      moTa: hoSo.moTa,
      giongDieu: hoSo.giongDieu,
      dieuCamKy: hoSo.dieuCamKy,
    },
  };

  // Kiem tra han muc Tin dung AI
  const chiPhiCredit = DINH_MUC_TIN_DUNG['viet-kich-ban'];
  try {
    const kiemTraCredit = await repo.credits.kiemTraDuCredit(chiPhiCredit);
    if (!kiemTraCredit.du) {
      return {
        trangThai: 'loi',
        ketQua: null,
        loi: `Bạn đã sử dụng hết hạn mức tín dụng tháng này (còn ${kiemTraCredit.soDuHienTai} Credits, cần ${chiPhiCredit} Credits). Vui lòng nâng cấp gói cước để tiếp tục.`,
        canhBao: [],
      };
    }
  } catch {
    // Bo qua neu khong doc duoc credit
  }

  try {
    const res = await chayNhiemVu({
      nhiemVu: 'viet-kich-ban',
      duLieuVao,
      moHinh: 'auto',
      khongGianLamViec: workspaceId,
      khoaChongTrung: null,
    });

    if (res.trangThai === 'loi' || !res.ketQua) {
      return {
        trangThai: 'loi',
        ketQua: null,
        loi: res.loi ?? 'Không thể sinh kịch bản video lúc này.',
        canhBao: [],
      };
    }

    const { tieuDe, phanCanh } = donKetQuaKichBan(res.ketQua);

    if (phanCanh.length === 0) {
      return {
        trangThai: 'loi',
        ketQua: null,
        loi: 'Mô hình không trả về phân cảnh nào.',
        canhBao,
      };
    }

    // Tính tổng thời lượng và số từ
    const tongThoiLuongGiay = phanCanh.reduce((acc, c) => acc + c.thoiLuongGiay, 0);
    const toanBoLoiThoai = phanCanh.map((c) => c.loiThoai).join(' ');
    const soTu = demTu(toanBoLoiThoai);

    // Quét quy tắc ngôn ngữ cấm kỵ
    const viPhamMap = quetQuyTacNgonNgu(toanBoLoiThoai);
    const viPhamNgonNgu: Array<{ cumTu: string; thayBang: string; boiCanh: string }> = viPhamMap.map(
      (v: ViPhamNgonNgu) => ({
        cumTu: v.cumTu,
        thayBang: v.thayBang,
        boiCanh: v.boiCanh,
      }),
    );

    // Tru tin dung khi sinh kich ban video thanh cong
    try {
      await repo.credits.ghiBienDong(
        -chiPhiCredit,
        `Viết kịch bản video "${(tieuDe || finalTieuDe).slice(0, 40)}"`,
      );
    } catch {
      // Khong chan luong neu ghi nhat ky credit loi
    }

    return {
      trangThai: 'xong',
      ketQua: {
        tieuDe: tieuDe || finalTieuDe,
        phanCanh,
        tongThoiLuongGiay,
        soTu,
        viPhamNgonNgu,
      },
      loi: null,
      canhBao,
    };
  } catch (err: any) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: err?.message || 'Lỗi hệ thống khi sinh kịch bản video.',
      canhBao,
    };
  }
}

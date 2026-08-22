/**
 * Module sinh noi dung hang loat — Moc 4 cua bai test (Phuc vu KPI 10 bai/ngay).
 *
 * Cho phep nguoi dung chon hoac nhap hang loat y tuong, sau do sinh song song
 * toan bo bai viet / kich ban video va tu dong luu hoac xem lai truoc khi luu.
 */

import { createRepo } from '@/lib/data-access';
import { sinhBaiViet, type KetQuaSinhBai } from './bien-soan';
import { sinhKichBanVideo } from './kich-ban';
import type { BeMat, KetQuaStudio, PhanCanhVideo } from './kieu';

export type MucYTuongHangLoat = {
  id: string;
  tieuDe: string;
  beMat: BeMat;
  gocTiepCan?: string | null;
  cauMoDau?: string | null;
  ideaId?: string | null;
  dinhDang?: 'bai_viet' | 'kich_ban';
  thoiLuongVideo?: number | null;
  epDoDai?: number | null;
};

export type KetQuaMucHangLoat = {
  id: string;
  tieuDe: string;
  beMat: BeMat;
  dinhDang: 'bai_viet' | 'kich_ban';
  trangThai: 'thanh_cong' | 'loi';
  noiDung: string;
  hashtag: string[];
  phanCanh?: PhanCanhVideo[];
  soTu: number;
  doDaiDat: boolean;
  canhBaoDoDai?: string;
  viPhamNgonNgu: Array<{
    cumTu: string;
    thayBang: string;
    boiCanh: string;
  }>;
  contentId?: string | null;
  loi?: string | null;
};

export type ThamSoSinhHangLoat = {
  workspaceId: string;
  danhSach: MucYTuongHangLoat[];
  luuNgay?: boolean;
  trangThaiLuu?: 'ban_nhap' | 'san_sang';
};

/**
 * Sinh hang loat noi dung song song tu danh sach y tuong.
 */
export async function sinhHangLoat(
  thamSo: ThamSoSinhHangLoat,
): Promise<KetQuaStudio<KetQuaMucHangLoat[]>> {
  const { workspaceId, danhSach, luuNgay = false, trangThaiLuu = 'ban_nhap' } = thamSo;
  const canhBao: string[] = [];

  if (!Array.isArray(danhSach) || danhSach.length === 0) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Danh sách ý tưởng sinh hàng loạt đang trống.',
      canhBao,
    };
  }

  const repo = createRepo(workspaceId);

  // Sinh song song tat ca cac muc trong danh sach
  const tienTrinh = danhSach.map(async (muc): Promise<KetQuaMucHangLoat> => {
    const dinhDang = muc.dinhDang ?? 'bai_viet';

    try {
      if (dinhDang === 'kich_ban') {
        const res = await sinhKichBanVideo({
          workspaceId,
          beMat: muc.beMat,
          tieuDe: muc.tieuDe,
          gocTiepCan: muc.gocTiepCan,
          cauMoDau: muc.cauMoDau,
          ideaId: muc.ideaId,
          thoiLuongUocTinhGiay: muc.thoiLuongVideo ?? 45,
        });

        if (res.trangThai === 'loi' || !res.ketQua) {
          return {
            id: muc.id,
            tieuDe: muc.tieuDe,
            beMat: muc.beMat,
            dinhDang: 'kich_ban',
            trangThai: 'loi',
            noiDung: '',
            hashtag: [],
            soTu: 0,
            doDaiDat: false,
            viPhamNgonNgu: [],
            loi: res.loi ?? 'Không thể sinh kịch bản video.',
          };
        }

        const kb = res.ketQua;
        const noiDungFormat = kb.phanCanh
          .map(
            (c, idx) =>
              `[Cảnh ${idx + 1} - ${c.thoiLuongGiay}s]\n🎬 Hình ảnh: ${c.hinhAnh}\n🗣️ Lời thoại: ${c.loiThoai}`,
          )
          .join('\n\n');

        let contentId: string | null = null;
        if (luuNgay) {
          try {
            const dong = await repo.contents.tao({
              beMat: muc.beMat,
              noiDung: noiDungFormat,
              cauMoDau: muc.cauMoDau ?? null,
              gocTiepCan: muc.gocTiepCan ?? null,
              ideaId: muc.ideaId ?? null,
              moHinhDaSinh: 'viet-kich-ban',
              trangThai: trangThaiLuu,
              nguonYTuong: muc.ideaId ? 'may-de-xuat' : 'nguoi-tu-nhap',
            });
            contentId = dong.id;
          } catch {
            // Bo qua loi luu
          }
        }

        return {
          id: muc.id,
          tieuDe: kb.tieuDe || muc.tieuDe,
          beMat: muc.beMat,
          dinhDang: 'kich_ban',
          trangThai: 'thanh_cong',
          noiDung: noiDungFormat,
          hashtag: [],
          phanCanh: kb.phanCanh,
          soTu: kb.soTu,
          doDaiDat: true,
          viPhamNgonNgu: kb.viPhamNgonNgu,
          contentId,
        };
      } else {
        // Sinh bai viet thuong
        const res = await sinhBaiViet({
          workspaceId,
          beMat: muc.beMat,
          tieuDe: muc.tieuDe,
          gocTiepCan: muc.gocTiepCan,
          cauMoDau: muc.cauMoDau,
          ideaId: muc.ideaId,
          epDoDai: muc.epDoDai,
        });

        if (res.trangThai === 'loi' || !res.ketQua) {
          return {
            id: muc.id,
            tieuDe: muc.tieuDe,
            beMat: muc.beMat,
            dinhDang: 'bai_viet',
            trangThai: 'loi',
            noiDung: '',
            hashtag: [],
            soTu: 0,
            doDaiDat: false,
            viPhamNgonNgu: [],
            loi: res.loi ?? 'Không thể sinh bài viết.',
          };
        }

        const bv: KetQuaSinhBai = res.ketQua;
        let contentId: string | null = null;
        if (luuNgay) {
          try {
            const dong = await repo.contents.tao({
              beMat: muc.beMat,
              noiDung: bv.noiDung,
              cauMoDau: muc.cauMoDau ?? null,
              gocTiepCan: muc.gocTiepCan ?? null,
              ideaId: muc.ideaId ?? null,
              moHinhDaSinh: 'viet-bai',
              trangThai: trangThaiLuu,
              nguonYTuong: muc.ideaId ? 'may-de-xuat' : 'nguoi-tu-nhap',
            });
            contentId = dong.id;
          } catch {
            // Bo qua loi luu
          }
        }

        return {
          id: muc.id,
          tieuDe: bv.tieuDe || muc.tieuDe,
          beMat: muc.beMat,
          dinhDang: 'bai_viet',
          trangThai: 'thanh_cong',
          noiDung: bv.noiDung,
          hashtag: bv.hashtag,
          soTu: bv.soTu,
          doDaiDat: bv.doDaiDat,
          canhBaoDoDai: bv.canhBaoDoDai,
          viPhamNgonNgu: bv.viPhamNgonNgu,
          contentId,
        };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi sinh bài.';
      return {
        id: muc.id,
        tieuDe: muc.tieuDe,
        beMat: muc.beMat,
        dinhDang,
        trangThai: 'loi',
        noiDung: '',
        hashtag: [],
        soTu: 0,
        doDaiDat: false,
        viPhamNgonNgu: [],
        loi: msg,
      };
    }
  });

  const ketQuaDanhSach = await Promise.all(tienTrinh);
  const soThanhCong = ketQuaDanhSach.filter((k) => k.trangThai === 'thanh_cong').length;

  if (soThanhCong === 0) {
    return {
      trangThai: 'loi',
      ketQua: ketQuaDanhSach,
      loi: 'Tất cả các bài trong lượt sinh hàng loạt đều gặp lỗi.',
      canhBao,
    };
  }

  if (soThanhCong < ketQuaDanhSach.length) {
    canhBao.push(
      `Đã sinh thành công ${soThanhCong}/${ketQuaDanhSach.length} bài. Một số bài gặp lỗi.`,
    );
  }

  return {
    trangThai: 'xong',
    ketQua: ketQuaDanhSach,
    loi: null,
    canhBao,
  };
}

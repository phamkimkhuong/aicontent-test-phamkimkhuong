/**
 * Module Chuoi bai noi mach — /studio/chuoi-bai.
 *
 * Sinh series bai viet noi tiep mach ke chuyen, khong lap y bai truoc
 * bang cach tich luy tham so `mach: string[]` qua tung ky.
 */

import { createRepo } from '@/lib/data-access';
import { sinhBaiViet, type KetQuaSinhBai } from './bien-soan';
import type { BeMat, KetQuaStudio } from './kieu';

export type KyChuoiBai = {
  kySo: number;
  tieuDeKy: string;
  vaiTroKy: string;
  gocTiepCan: string;
  noiDung: string;
  hashtag: string[];
  soTu: number;
  doDaiDat: boolean;
  canhBaoDoDai?: string;
  viPhamNgonNgu: Array<{
    cumTu: string;
    thayBang: string;
    boiCanh: string;
  }>;
  contentId?: string | null;
};

export type KetQuaChuoiBai = {
  tieuDeChuoi: string;
  beMat: BeMat;
  tongSoKy: number;
  cacKy: KyChuoiBai[];
};

export type ThamSoSinhChuoiBai = {
  workspaceId: string;
  tieuDeChuoi: string;
  beMat: BeMat;
  soLuongKy?: number;
  danYTuyChon?: string[];
  luuNgay?: boolean;
  trangThaiLuu?: 'ban_nhap' | 'san_sang';
};

/**
 * Tao dan y mac dinh phan bo mach ke chuyen theo so luong ky.
 */
export function taoDanYMacDinh(
  tieuDeChuoi: string,
  soKy = 3,
): Array<{ vaiTro: string; gocTiepCan: string }> {
  if (soKy === 5) {
    return [
      {
        vaiTro: 'Kỳ 1: Khởi động & Nhận diện vấn đề',
        gocTiepCan: `Mở đầu chuỗi "${tieuDeChuoi}": Đặt vấn đề trực diện, chỉ ra thực trạng và vì sao người xem thường gặp khó khăn ở giai đoạn đầu.`,
      },
      {
        vaiTro: 'Kỳ 2: Bóc trần 3 sai lầm phổ biến nhất',
        gocTiepCan: `Nối tiếp kỳ 1 của chuỗi "${tieuDeChuoi}": Chỉ ra các sai lầm khiến người ta mất tiền/thời gian mà không hiệu quả.`,
      },
      {
        vaiTro: 'Kỳ 3: Giải pháp & Các bước thực thi cốt lõi',
        gocTiepCan: `Nối tiếp kỳ 2 của chuỗi "${tieuDeChuoi}": Hướng dẫn chi tiết phương pháp làm đúng, các bước thực thi cụ thể từ kinh nghiệm thực tế.`,
      },
      {
        vaiTro: 'Kỳ 4: Kỹ thuật tối ưu & Case study thực chiến',
        gocTiepCan: `Nối tiếp kỳ 3 của chuỗi "${tieuDeChuoi}": Chia sẻ mẹo tối ưu và câu chuyện áp dụng thành công.`,
      },
      {
        vaiTro: 'Kỳ 5: Tổng kết lộ trình & Kêu gọi hành động (CTA)',
        gocTiepCan: `Kỳ cuối chuỗi "${tieuDeChuoi}": Đúc kết toàn bộ hành trình, trao lời khuyên quyết định và 1 lời kêu gọi hành động dứt khoát.`,
      },
    ];
  }

  // Mac dinh 3 ky (Chuan pho bien nhat)
  return [
    {
      vaiTro: 'Kỳ 1: Thực trạng & Bóc trần vấn đề',
      gocTiepCan: `Mở đầu chuỗi "${tieuDeChuoi}": Đặt vấn đề đánh trúng nỗi đau, phân tích nguyên nhân gốc rễ khiến người nghe chưa đạt kết quả.`,
    },
    {
      vaiTro: 'Kỳ 2: Hướng dẫn giải pháp & Kỹ thuật cốt lõi',
      gocTiepCan: `Nối tiếp kỳ 1 của chuỗi "${tieuDeChuoi}": Đi thẳng vào phương pháp giải quyết cụ thể, hướng dẫn từng bước rõ ràng.`,
    },
    {
      vaiTro: 'Kỳ 3: Bài học thực chiến, đúc kết & Kêu gọi hành động (CTA)',
      gocTiepCan: `Kỳ cuối chuỗi "${tieuDeChuoi}": Đúc kết kinh nghiệm then chốt, tổng kết bài học và đưa ra lời kêu gọi hành động rõ ràng.`,
    },
  ];
}

/**
 * Sinh chuoi bai viet tuan tu noi tiep mach.
 */
export async function sinhChuoiBai(
  thamSo: ThamSoSinhChuoiBai,
): Promise<KetQuaStudio<KetQuaChuoiBai>> {
  const {
    workspaceId,
    tieuDeChuoi,
    beMat,
    soLuongKy = 3,
    danYTuyChon,
    luuNgay = false,
    trangThaiLuu = 'ban_nhap',
  } = thamSo;

  const canhBao: string[] = [];

  if (!tieuDeChuoi || !tieuDeChuoi.trim()) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Vui lòng nhập chủ đề chính của chuỗi bài.',
      canhBao,
    };
  }

  const repo = createRepo(workspaceId);

  const soKyThucTe = Math.max(2, Math.min(5, soLuongKy));
  const danY =
    Array.isArray(danYTuyChon) && danYTuyChon.length >= soKyThucTe
      ? danYTuyChon.slice(0, soKyThucTe).map((goc, idx) => ({
          vaiTro: `Kỳ ${idx + 1}`,
          gocTiepCan: goc,
        }))
      : taoDanYMacDinh(tieuDeChuoi, soKyThucTe);

  const machTichLuy: string[] = [];
  const cacKyDaSinh: KyChuoiBai[] = [];

  for (let i = 0; i < danY.length; i++) {
    const muc = danY[i];
    const kySo = i + 1;
    const tieuDeKy = `${tieuDeChuoi.trim()} [Kỳ ${kySo}/${danY.length}]`;

    try {
      const res = await sinhBaiViet({
        workspaceId,
        beMat,
        tieuDe: tieuDeKy,
        gocTiepCan: muc.gocTiepCan,
        cauMoDau: `[Kỳ ${kySo}/${danY.length}]`,
        mach: machTichLuy.length > 0 ? [...machTichLuy] : null,
      });

      if (res.trangThai === 'loi' || !res.ketQua) {
        canhBao.push(`Kỳ ${kySo} gặp lỗi: ${res.loi}`);
        continue;
      }

      const bv: KetQuaSinhBai = res.ketQua;
      let contentId: string | null = null;

      if (luuNgay) {
        try {
          const dong = await repo.contents.tao({
            beMat,
            noiDung: bv.noiDung,
            cauMoDau: `[Kỳ ${kySo}/${danY.length}]`,
            gocTiepCan: muc.gocTiepCan,
            moHinhDaSinh: 'viet-bai',
            trangThai: trangThaiLuu,
            nguonYTuong: 'nguoi-tu-nhap',
          });
          contentId = dong.id;
        } catch {
          // Bo qua loi luu
        }
      }

      cacKyDaSinh.push({
        kySo,
        tieuDeKy: bv.tieuDe || tieuDeKy,
        vaiTroKy: muc.vaiTro,
        gocTiepCan: muc.gocTiepCan,
        noiDung: bv.noiDung,
        hashtag: bv.hashtag,
        soTu: bv.soTu,
        doDaiDat: bv.doDaiDat,
        canhBaoDoDai: bv.canhBaoDoDai,
        viPhamNgonNgu: bv.viPhamNgonNgu,
        contentId,
      });

      // Tich luy noi dung de ky tiep theo doc hieu mach ke chuyen
      machTichLuy.push(bv.noiDung);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi sinh kỳ này.';
      canhBao.push(`Kỳ ${kySo} gặp lỗi: ${msg}`);
    }
  }

  if (cacKyDaSinh.length === 0) {
    return {
      trangThai: 'loi',
      ketQua: null,
      loi: 'Không thể sinh chuỗi bài viết lúc này. Vui lòng kiểm tra lại kết nối mô hình.',
      canhBao,
    };
  }

  return {
    trangThai: 'xong',
    ketQua: {
      tieuDeChuoi: tieuDeChuoi.trim(),
      beMat,
      tongSoKy: cacKyDaSinh.length,
      cacKy: cacKyDaSinh,
    },
    loi: null,
    canhBao,
  };
}

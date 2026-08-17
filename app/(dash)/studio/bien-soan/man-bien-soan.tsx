'use client';

import { useEffect, useState, useTransition } from 'react';

import { Icon } from '@/app/sprite-icon';
import { quetQuyTacNgonNgu, type ViPhamNgonNgu } from '@/lib/brand/quy-tac-ngon-ngu';
import { kiemDoDai, type KetQuaDoDai } from '@/lib/studio/cong-dem-tu';
import type { BeMat } from '@/lib/studio/kieu';

import { luuBaiAction, sinhBaiAction } from './actions';

type Props = {
  khoiTaoBeMat?: BeMat;
  khoiTaoTieuDe?: string;
  khoiTaoCauMoDau?: string;
  khoiTaoGocTiepCan?: string;
  ideaId?: string;
};

const DANH_SACH_BE_MAT: { id: BeMat; ten: string; khoangTu: string }[] = [
  { id: 'fanpage', ten: 'Fanpage Facebook', khoangTu: '150–300 từ' },
  { id: 'tiktok', ten: 'TikTok', khoangTu: '60–120 từ' },
  { id: 'ho_so_ca_nhan', ten: 'Trang cá nhân', khoangTu: '120–250 từ' },
  { id: 'zalo', ten: 'Zalo cá nhân', khoangTu: '40–100 từ' },
];

export function ManBienSoan({
  khoiTaoBeMat = 'fanpage',
  khoiTaoTieuDe = '',
  khoiTaoCauMoDau = '',
  khoiTaoGocTiepCan = '',
  ideaId,
}: Props) {
  const [beMat, setBeMat] = useState<BeMat>(khoiTaoBeMat);
  const [tieuDe, setTieuDe] = useState<string>(khoiTaoTieuDe);
  const [gocTiepCan, setGocTiepCan] = useState<string>(khoiTaoGocTiepCan);
  const [cauMoDau, setCauMoDau] = useState<string>(khoiTaoCauMoDau);
  const [epDoDai, setEpDoDai] = useState<string>('');

  const [noiDung, setNoiDung] = useState<string>('');
  const [hashtag, setHashtag] = useState<string[]>([]);
  const [dangSinh, startSinhTransition] = useTransition();
  const [dangLuu, startLuuTransition] = useTransition();

  const [thongBaoLuu, setThongBaoLuu] = useState<string | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  // Kiem tra do dai va quy tac ngon ngu realtime khi go noi dung
  const [doDai, setDoDai] = useState<KetQuaDoDai>(kiemDoDai(beMat, noiDung));
  const [viPham, setViPham] = useState<ViPhamNgonNgu[]>([]);

  useEffect(() => {
    const epSoTu = epDoDai.trim() !== '' ? Number(epDoDai) : null;
    setDoDai(kiemDoDai(beMat, noiDung, epSoTu && !isNaN(epSoTu) ? epSoTu : null));
    setViPham(quetQuyTacNgonNgu(noiDung));
  }, [beMat, noiDung, epDoDai]);

  function handleSinhBai() {
    if (!tieuDe.trim()) {
      setLoi('Vui lòng nhập tiêu đề hoặc chủ đề bài viết.');
      return;
    }

    setLoi(null);
    setThongBaoLuu(null);

    const epSoTu = epDoDai.trim() !== '' ? Number(epDoDai) : null;

    startSinhTransition(async () => {
      const res = await sinhBaiAction({
        beMat,
        tieuDe,
        gocTiepCan: gocTiepCan || null,
        cauMoDau: cauMoDau || null,
        ideaId: ideaId || null,
        epDoDai: epSoTu && !isNaN(epSoTu) ? epSoTu : null,
      });

      if (res.trangThai === 'loi' || !res.ketQua) {
        setLoi(res.loi ?? 'Không thể sinh bài viết lúc này.');
      } else {
        setNoiDung(res.ketQua.noiDung);
        setHashtag(res.ketQua.hashtag);
      }
    });
  }

  function handleLuuBai(trangThai: 'ban_nhap' | 'san_sang') {
    if (!noiDung.trim()) {
      setLoi('Nội dung bài viết chưa có gì để lưu.');
      return;
    }

    setLoi(null);
    startLuuTransition(async () => {
      const res = await luuBaiAction({
        tieuDe: tieuDe || null,
        noiDung,
        beMat,
        ideaId: ideaId || null,
        cauMoDau: cauMoDau || null,
        gocTiepCan: gocTiepCan || null,
        trangThai,
      });

      if (res.ok) {
        setThongBaoLuu(
          trangThai === 'san_sang'
            ? 'Đã lưu và chuyển trạng thái "Sẵn sàng đăng"!'
            : 'Đã lưu bản nháp thành công!',
        );
      } else {
        setLoi(`Lỗi khi lưu: ${res.loi}`);
      }
    });
  }

  return (
    <div className="studio-bien-soan">
      {loi && (
        <div
          className="panel"
          style={{
            borderColor: 'var(--clay)',
            background: 'rgba(239, 68, 68, 0.08)',
            marginBottom: 20,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--clay)' }}>
            <Icon name="i-alert" size={18} />
            <b>{loi}</b>
          </div>
        </div>
      )}

      {thongBaoLuu && (
        <div
          className="panel"
          style={{
            borderColor: 'var(--sage)',
            background: 'rgba(16, 185, 129, 0.08)',
            marginBottom: 20,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669' }}>
            <Icon name="i-check" size={18} />
            <b>{thongBaoLuu}</b>
          </div>
        </div>
      )}

      <div className="hai-cot">
        {/* CỘT TRÁI: THIẾT LẬP ĐẦU VÀO */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="i-gear" size={16} />
            1. Ý tưởng &amp; Thiết lập
          </h2>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Bề mặt đăng bài
            </label>
            <div className="chon-be-mat">
              {DANH_SACH_BE_MAT.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`btn btn--sm ${beMat === b.id ? 'btn--primary' : ''}`}
                  onClick={() => setBeMat(b.id)}
                >
                  {b.ten}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--ink-2)', display: 'block', marginTop: 4 }}>
              Chuẩn độ dài: <b>{DANH_SACH_BE_MAT.find((b) => b.id === beMat)?.khoangTu}</b>
            </span>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Chủ đề / Tiêu đề ý tưởng *
            </label>
            <input
              type="text"
              className="input"
              value={tieuDe}
              onChange={(e) => setTieuDe(e.target.value)}
              placeholder="VD: Bí quyết quay video triệu view bằng điện thoại..."
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Góc tiếp cận (Tùy chọn)
            </label>
            <input
              type="text"
              className="input"
              value={gocTiepCan}
              onChange={(e) => setGocTiepCan(e.target.value)}
              placeholder="VD: Đứng ở góc nhìn người mới bắt đầu..."
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Câu mở đầu / Hook gợi ý (Tùy chọn)
            </label>
            <textarea
              className="input"
              value={cauMoDau}
              onChange={(e) => setCauMoDau(e.target.value)}
              placeholder="VD: Đừng vội mua máy quay đắt tiền nếu bạn chưa biết điều này..."
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Ép độ dài cố định (Số từ - Tùy chọn)
            </label>
            <input
              type="number"
              className="input"
              value={epDoDai}
              onChange={(e) => setEpDoDai(e.target.value)}
              placeholder="Để trống sẽ dùng khoảng từ của bề mặt"
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSinhBai}
            disabled={dangSinh}
            style={{ marginTop: 8, padding: '12px' }}
          >
            <Icon name="i-sparkle" size={16} />
            {dangSinh ? 'Đang viết bài...' : 'Sinh bài viết hoàn chỉnh'}
          </button>
        </div>

        {/* CỘT PHẢI: SOẠN THẢO VÀ KIỂM ĐỊNH */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="i-text" size={16} />
              2. Nội dung bài viết
            </h2>

            {/* Thanh đo độ dài */}
            <div className="soan__do">
              <span
                className={
                  doDai.trangThai === 'dat'
                    ? 'soan__dem--dat'
                    : doDai.trangThai === 'ngan'
                      ? 'soan__dem--ngan'
                      : 'soan__dem--dai'
                }
              >
                <b>{doDai.soTu} từ</b> ({doDai.moTa})
              </span>
            </div>
          </div>

          <div className="soan">
            <textarea
              className="soan__o input"
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              placeholder="Nội dung bài viết sẽ hiển thị ở đây. Bạn có thể tự do chỉnh sửa trực tiếp..."
              rows={12}
              style={{ width: '100%', lineHeight: 1.6, fontSize: 14 }}
            />
          </div>

          {/* Hashtags */}
          {hashtag.length > 0 && (
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginRight: 8 }}>
                Hashtag gợi ý:
              </span>
              <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
                {hashtag.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 12,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#2563eb',
                    }}
                  >
                    #{tag.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cảnh báo vi phạm ngôn ngữ thương hiệu */}
          {viPham.length > 0 && (
            <div
              style={{
                padding: 12,
                borderRadius: 6,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--clay)', marginBottom: 6 }}>
                <Icon name="i-alert" size={16} />
                <b style={{ fontSize: 13 }}>Cảnh báo từ ngữ cấm kỵ thương hiệu ({viPham.length}):</b>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--ink)' }}>
                {viPham.map((v, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    Cụm từ <b>&ldquo;{v.cumTu}&rdquo;</b> $\rightarrow$ Nên thay bằng: <i>&ldquo;{v.thayBang}&rdquo;</i>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nút lưu */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--line)' }}>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => handleLuuBai('ban_nhap')}
              disabled={dangLuu || !noiDung.trim()}
            >
              <Icon name="i-folder" size={14} />
              {dangLuu ? 'Đang lưu...' : 'Lưu bản nháp'}
            </button>

            <button
              type="button"
              className="btn btn--sm btn--primary"
              onClick={() => handleLuuBai('san_sang')}
              disabled={dangLuu || !noiDung.trim()}
            >
              <Icon name="i-check" size={14} />
              Sẵn sàng đăng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

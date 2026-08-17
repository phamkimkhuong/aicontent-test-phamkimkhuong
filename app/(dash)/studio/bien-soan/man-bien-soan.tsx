'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';

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
  tenTruCot?: string | null;
  tenChanDung?: string | null;
  khamPha?: boolean;
};

const DANH_SACH_BE_MAT: { id: BeMat; ten: string; moTa: string; khoangTu: string; icon: string }[] = [
  { id: 'fanpage', ten: 'Fanpage Facebook', moTa: 'Bài viết chia sẻ, có cấu trúc', khoangTu: '150–300 từ', icon: 'i-card' },
  { id: 'tiktok', ten: 'TikTok Short Video', moTa: 'Kịch bản ngắn, trực diện, hook mạnh', khoangTu: '60–120 từ', icon: 'i-film' },
  { id: 'ho_so_ca_nhan', ten: 'Trang cá nhân', moTa: 'Giọng thân mật, chuyện thực tế', khoangTu: '120–250 từ', icon: 'i-person' },
  { id: 'zalo', ten: 'Zalo cá nhân', moTa: 'Thông điệp cô đọng, tâm tình', khoangTu: '40–100 từ', icon: 'i-text' },
];

export function ManBienSoan({
  khoiTaoBeMat = 'fanpage',
  khoiTaoTieuDe = '',
  khoiTaoCauMoDau = '',
  khoiTaoGocTiepCan = '',
  ideaId,
  tenTruCot,
  tenChanDung,
  khamPha,
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
  const [daCopy, setDaCopy] = useState<boolean>(false);

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

  function handleSaoChep() {
    if (!noiDung.trim()) return;
    navigator.clipboard.writeText(noiDung);
    setDaCopy(true);
    setTimeout(() => setDaCopy(false), 2000);
  }

  function handleChenHashtag() {
    if (hashtag.length === 0) return;
    const tagString = hashtag.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');
    setNoiDung((prev) => (prev.trim() ? `${prev.trim()}\n\n${tagString}` : tagString));
  }

  function handleThayTheTuCam(cumTu: string, thayBang: string) {
    const regex = new RegExp(cumTu, 'gi');
    setNoiDung((prev) => prev.replace(regex, thayBang));
  }

  // Tinh ty le phan tram tien do do dai
  const mucTieuMax = doDai.toiDa > 0 ? doDai.toiDa : 300;
  const phanTramDoDai = Math.min(100, Math.round((doDai.soTu / mucTieuMax) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Thong bao loi & thanh cong */}
      {loi && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--r-lg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'var(--clay)',
            fontSize: 13.5,
          }}
        >
          <Icon name="i-alert" size={18} />
          <b>{loi}</b>
        </div>
      )}

      {thongBaoLuu && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--r-lg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#059669',
            fontSize: 13.5,
          }}
        >
          <Icon name="i-check" size={18} />
          <b>{thongBaoLuu}</b>
        </div>
      )}

      {/* Bố cục 2 cột Studio */}
      <div className="bien-soan-layout">
        {/* CỘT TRÁI: THIẾT LẬP VÀ ĐẦU VÀO */}
        <div className="bien-soan-panel">
          <div className="bien-soan-panel__head">
            <h2 className="bien-soan-panel__title">
              <span className="bien-soan-badge-step">1</span>
              Ý tưởng &amp; Thiết lập
            </h2>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Định hình bài viết</span>
          </div>

          {/* Thẻ ngữ cảnh ý tưởng gốc từ Mốc 1 (nếu có) */}
          {ideaId && (
            <div className="idea-context-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--brand-600)' }}>
                  💡 Ý tưởng đã chọn từ Đề xuất
                </span>
                <Link
                  href="/studio/de-xuat"
                  style={{ fontSize: 11.5, color: 'var(--ink-2)', textDecoration: 'none' }}
                >
                  ← Đổi ý tưởng
                </Link>
              </div>

              <div className="idea-context-card__tags">
                {tenTruCot && (
                  <span className="ytuong-tag ytuong-tag--trucot">
                    <Icon name="i-pillars" size={11} /> {tenTruCot}
                  </span>
                )}
                {tenChanDung && (
                  <span className="ytuong-tag ytuong-tag--chandung">
                    <Icon name="i-person" size={11} /> {tenChanDung}
                  </span>
                )}
                {khamPha && (
                  <span className="ytuong-tag ytuong-tag--khampha">
                    <Icon name="i-sparkle" size={11} /> Khám phá
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Chọn bề mặt (Platform Grid 2x2) */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Bề mặt đăng bài</span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 400 }}>
                Chuẩn: <b>{DANH_SACH_BE_MAT.find((b) => b.id === beMat)?.khoangTu}</b>
              </span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DANH_SACH_BE_MAT.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBeMat(b.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px 12px',
                    borderRadius: 'var(--r-md)',
                    border: beMat === b.id ? '1.5px solid var(--brand-500)' : '1px solid var(--line)',
                    background: beMat === b.id ? 'var(--brand-050)' : 'var(--surface-2)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name={b.icon} size={13} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: beMat === b.id ? 'var(--brand-700)' : 'var(--ink)' }}>
                        {b.ten}
                      </span>
                    </div>
                    {beMat === b.id && (
                      <span style={{ color: 'var(--brand-500)' }}>
                        <Icon name="i-check" size={12} />
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 10.5, color: 'var(--ink-2)' }}>{b.khoangTu}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nhập Tiêu đề */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Chủ đề / Tiêu đề ý tưởng *</span>
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

          {/* Nhập Góc tiếp cận */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Góc tiếp cận (Tùy chọn)</span>
            </label>
            <input
              type="text"
              className="input"
              value={gocTiepCan}
              onChange={(e) => setGocTiepCan(e.target.value)}
              placeholder="VD: Đứng ở góc nhìn người mới bắt đầu, ngân sách 0đ..."
              style={{ width: '100%' }}
            />
          </div>

          {/* Nhập Câu mở đầu / Hook */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Câu mở đầu / Hook gợi ý (Tùy chọn)</span>
            </label>
            <textarea
              className="input"
              value={cauMoDau}
              onChange={(e) => setCauMoDau(e.target.value)}
              placeholder="VD: Đừng vội mua máy quay đắt tiền nếu bạn chưa biết điều này..."
              rows={2}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Ép độ dài cố định */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Ép độ dài cố định (Số từ)</span>
              <span className="form-field__hint">Để trống = theo chuẩn bề mặt</span>
            </label>
            <input
              type="number"
              className="input"
              value={epDoDai}
              onChange={(e) => setEpDoDai(e.target.value)}
              placeholder="VD: 200 (Ràng buộc cứng số từ)"
              style={{ width: '100%' }}
            />
          </div>

          {/* CTA Button Sinh bài */}
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSinhBai}
            disabled={dangSinh}
            style={{
              padding: '13px 18px',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 6,
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)',
            }}
          >
            <Icon name="i-sparkle" size={16} />
            {dangSinh ? 'Đang soạn bài theo giọng thương hiệu...' : 'Sinh bài viết hoàn chỉnh'}
          </button>
        </div>

        {/* CỘT PHẢI: TRÌNH SOẠN THẢO VÀ THANH CÔNG CỤ THÔNG MINH */}
        <div className="bien-soan-panel">
          <div className="bien-soan-panel__head">
            <h2 className="bien-soan-panel__title">
              <span className="bien-soan-badge-step" style={{ background: 'var(--ink-2)' }}>2</span>
              Trình soạn thảo &amp; Kiểm duyệt
            </h2>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Tự do chỉnh sửa trực tiếp</span>
          </div>

          {/* Thanh đo độ dài visual progress meter */}
          <div className="length-inspector">
            <div className="length-inspector__head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="i-text" size={14} />
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Độ dài bài viết:</span>
                <span style={{ fontWeight: 700, color: doDai.dat ? '#059669' : doDai.trangThai === 'ngan' ? '#d97706' : '#dc2626' }}>
                  {doDai.soTu} từ
                </span>
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--r-pill)',
                  background: doDai.dat ? 'rgba(16, 185, 129, 0.12)' : doDai.trangThai === 'ngan' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  color: doDai.dat ? '#059669' : doDai.trangThai === 'ngan' ? '#b45309' : '#dc2626',
                }}
              >
                {doDai.moTa}
              </span>
            </div>

            <div className="length-meter-track">
              <div
                className={`length-meter-fill ${
                  doDai.dat
                    ? 'length-meter-fill--dat'
                    : doDai.trangThai === 'ngan'
                      ? 'length-meter-fill--ngan'
                      : 'length-meter-fill--dai'
                }`}
                style={{ width: `${phanTramDoDai}%` }}
              />
            </div>
          </div>

          {/* Editor Shell */}
          <div className="editor-shell">
            <div className="editor-toolbar">
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)' }}>
                Văn bản bài đăng ({beMat.toUpperCase()})
              </span>

              <div className="editor-toolbar__actions">
                {hashtag.length > 0 && (
                  <button
                    type="button"
                    className="editor-btn"
                    onClick={handleChenHashtag}
                    title="Chèn toàn bộ hashtag vào cuối bài"
                  >
                    <Icon name="i-plus" size={12} /> Chèn Hashtags
                  </button>
                )}

                <button
                  type="button"
                  className="editor-btn"
                  onClick={handleSaoChep}
                  disabled={!noiDung.trim()}
                  title="Sao chép nội dung"
                >
                  <Icon name={daCopy ? 'i-check' : 'i-copy'} size={12} />
                  {daCopy ? 'Đã sao chép!' : 'Sao chép'}
                </button>

                <button
                  type="button"
                  className="editor-btn"
                  onClick={() => setNoiDung('')}
                  disabled={!noiDung.trim()}
                  title="Xóa trắng bài viết"
                >
                  Xóa
                </button>
              </div>
            </div>

            <textarea
              className="editor-textarea"
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              placeholder="Nội dung bài viết hoàn chỉnh sẽ xuất hiện ở đây sau khi AI sinh xong. Bạn có thể tự do gõ phím để thêm, bớt, căn chỉnh trực tiếp..."
            />
          </div>

          {/* Hashtags gợi ý */}
          {hashtag.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)' }}>
                Hashtags đề xuất (bấm để thêm vào bài):
              </span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {hashtag.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="hashtag-pill"
                    onClick={() => {
                      const formatted = tag.startsWith('#') ? tag : `#${tag}`;
                      setNoiDung((prev) => (prev.trim() ? `${prev.trim()} ${formatted}` : formatted));
                    }}
                  >
                    #{tag.replace(/^#/, '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cảnh báo vi phạm quy tắc ngôn ngữ thương hiệu */}
          {viPham.length > 0 && (
            <div className="taboo-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626' }}>
                <Icon name="i-alert" size={16} />
                <b style={{ fontSize: 13 }}>Phát hiện {viPham.length} từ cấm kỵ thương hiệu (Brand Bible):</b>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {viPham.map((v, idx) => (
                  <div key={idx} className="taboo-item">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span>
                        Từ cấm: <b style={{ color: '#dc2626' }}>&ldquo;{v.cumTu}&rdquo;</b> $\rightarrow$ Nên đổi thành: <i style={{ color: '#059669', fontWeight: 600 }}>&ldquo;{v.thayBang}&rdquo;</i>
                      </span>
                      <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
                        Ngữ cảnh: {v.boiCanh}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="taboo-replace-btn"
                      onClick={() => handleThayTheTuCam(v.cumTu, v.thayBang)}
                    >
                      Thay thế tự động
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thanh Action lưu bài */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 14,
              borderTop: '1px solid var(--line)',
              marginTop: 'auto',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              Trạng thái: <b>{noiDung.trim() ? 'Chưa lưu thay đổi' : 'Trống'}</b>
            </span>

            <div style={{ display: 'flex', gap: 10 }}>
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
    </div>
  );
}

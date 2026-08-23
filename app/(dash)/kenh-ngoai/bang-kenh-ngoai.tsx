'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Icon } from '../../sprite-icon';
import { giay, ngayViet, so, tenDang } from './dinh-dang-va-loc';

export type DongKenhNgoai = {
  id: string;
  thoiDiem: string | null;
  tenKenh: string;
  urlKenh: string;
  noiDung: string;
  soKyTu: number;
  dangBai: string | null;
  lienKet: string | null;
  soThich: number | null;
  soBinhLuan: number | null;
  soChiaSe: number | null;
  thoiLuongVideoMs: number | null;
};

type DinhDangLoc = 'tat_ca' | 'video' | 'chu' | 'top_viral';

export function BangKenhNgoai({ dong }: { dong: DongKenhNgoai[] }) {
  const [tuKhoa, setTuKhoa] = useState<string>('');
  const [tabDinhDang, setTabDinhDang] = useState<DinhDangLoc>('tat_ca');
  const [moRongId, setMoRongId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Thống kê nhanh từ dữ liệu
  const tongSoBai = dong.length;
  const dsKenhDuyNhat = Array.from(new Set(dong.map((b) => b.tenKenh)));
  const soKenh = dsKenhDuyNhat.length;
  const soVideo = dong.filter((b) => b.dangBai === 'kich_ban_quay' || (b.thoiLuongVideoMs ?? 0) > 0).length;

  // Tìm bài có lượt thích cao nhất
  const baiTopLike = useMemo(() => {
    if (dong.length === 0) return null;
    return [...dong].sort((a, b) => (b.soThich ?? 0) - (a.soThich ?? 0))[0];
  }, [dong]);

  // Lọc dữ liệu
  const danhSachHienThi = useMemo(() => {
    return dong.filter((b) => {
      // Tab định dạng
      if (tabDinhDang === 'video' && b.dangBai !== 'kich_ban_quay' && (b.thoiLuongVideoMs ?? 0) === 0) {
        return false;
      }
      if (tabDinhDang === 'chu' && (b.dangBai === 'kich_ban_quay' || (b.thoiLuongVideoMs ?? 0) > 0)) {
        return false;
      }
      if (tabDinhDang === 'top_viral' && (b.soThich ?? 0) < 1000) {
        return false;
      }

      // Từ khóa tìm kiếm
      if (tuKhoa.trim()) {
        const q = tuKhoa.toLowerCase().trim();
        const khopNoiDung = b.noiDung.toLowerCase().includes(q);
        const khopKenh = b.tenKenh.toLowerCase().includes(q);
        const khopNgay = ngayViet(b.thoiDiem).includes(q);
        if (!khopNoiDung && !khopKenh && !khopNgay) return false;
      }

      return true;
    });
  }, [dong, tabDinhDang, tuKhoa]);

  if (dong.length === 0) {
    return (
      <div className="post-empty-state">
        <Icon name="i-trend" size={40} />
        <h3 style={{ margin: '12px 0 6px', fontSize: 16, color: 'var(--ink)' }}>
          Chưa có bài nào từ kênh bạn theo dõi
        </h3>
        <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 13.5 }}>
          Vào <Link href="/cai-dat/kenh" style={{ color: 'var(--brand-600)', fontWeight: 600 }}>Quản lý kênh theo dõi</Link> để thêm kênh đối thủ và cào dữ liệu về.
        </p>
      </div>
    );
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      {/* ─── 1. Thẻ chỉ số Intelligence ─── */}
      <div className="trend-metrics-bar">
        <div className="trend-metric-card">
          <div className="trend-metric-icon trend-metric-icon--orange">
            <Icon name="i-link" size={20} />
          </div>
          <div>
            <div className="trend-metric-val">{soKenh} kênh</div>
            <div className="trend-metric-label">Đối thủ &amp; thị trường</div>
          </div>
        </div>

        <div className="trend-metric-card">
          <div className="trend-metric-icon trend-metric-icon--sage">
            <Icon name="i-folder" size={20} />
          </div>
          <div>
            <div className="trend-metric-val">{tongSoBai} bài</div>
            <div className="trend-metric-label">Bài viết cào về học hỏi</div>
          </div>
        </div>

        <div className="trend-metric-card">
          <div className="trend-metric-icon trend-metric-icon--plum">
            <Icon name="i-film" size={20} />
          </div>
          <div>
            <div className="trend-metric-val">{soVideo} video</div>
            <div className="trend-metric-label">Mẫu kịch bản ngắn</div>
          </div>
        </div>

        <div className="trend-metric-card">
          <div className="trend-metric-icon trend-metric-icon--clay">
            <Icon name="i-sparkle" size={20} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div className="trend-metric-val" style={{ color: '#dc2626' }}>
              🔥 {baiTopLike ? `${baiTopLike.soThich?.toLocaleString()} Like` : '—'}
            </div>
            <div className="trend-metric-label" title={baiTopLike?.tenKenh}>
              Top tương tác: {baiTopLike?.tenKenh || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Thanh công cụ tìm kiếm & lọc thông minh ─── */}
      <div className="trend-toolbar">
        {/* Ô tìm kiếm */}
        <div className="trend-search-box">
          <div className="trend-search-icon">
            <Icon name="i-search" size={15} />
          </div>
          <input
            type="text"
            className="trend-search-input"
            placeholder="Tìm kiếm ý tưởng, từ khóa hoặc tên kênh theo dõi..."
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
          />
          {tuKhoa && (
            <button
              type="button"
              onClick={() => setTuKhoa('')}
              style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab phân loại */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="trend-filter-pills">
            <button
              type="button"
              className={`trend-filter-pill ${tabDinhDang === 'tat_ca' ? 'trend-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('tat_ca')}
            >
              Tất cả ({tongSoBai})
            </button>
            <button
              type="button"
              className={`trend-filter-pill ${tabDinhDang === 'video' ? 'trend-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('video')}
            >
              Video ({soVideo})
            </button>
            <button
              type="button"
              className={`trend-filter-pill ${tabDinhDang === 'chu' ? 'trend-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('chu')}
            >
              Bài chữ ({tongSoBai - soVideo})
            </button>
            <button
              type="button"
              className={`trend-filter-pill ${tabDinhDang === 'top_viral' ? 'trend-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('top_viral')}
            >
              🔥 Top Viral (&gt;1K Like)
            </button>
          </div>

          <span style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 500 }}>
            Hiển thị <strong>{danhSachHienThi.length}</strong> bài
          </span>
        </div>
      </div>

      {/* ─── 3. Bảng dữ liệu hiện đại ─── */}
      <div className="trend-table-container">
        <table className="trend-table">
          <thead>
            <tr>
              <th className="trend-col-date">Ngày</th>
              <th className="trend-col-channel">Kênh nguồn</th>
              <th className="trend-col-format">Dạng bài</th>
              <th className="trend-col-content">Nội dung &amp; Hook tham khảo</th>
              <th className="trend-col-metrics">Độ dài</th>
              <th className="trend-col-metrics">Tương tác</th>
              <th className="trend-col-actions">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachHienThi.map((b) => {
              const isLong = (b.noiDung ?? '').length > 140;
              const isExpanded = moRongId === b.id;
              const isVideo = b.dangBai === 'kich_ban_quay' || (b.thoiLuongVideoMs ?? 0) > 0;
              const isViral = (b.soThich ?? 0) >= 1000;

              return (
                <tr key={b.id}>
                  {/* Ngày */}
                  <td className="trend-col-date">
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{ngayViet(b.thoiDiem)}</span>
                  </td>

                  {/* Kênh */}
                  <td className="trend-col-channel">
                    <a
                      href={b.urlKenh}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="trend-channel-badge"
                      title={`Mở kênh ${b.tenKenh}`}
                    >
                      <Icon name="i-trend" size={13} />
                      <span>{b.tenKenh}</span>
                    </a>
                  </td>

                  {/* Dạng bài */}
                  <td className="trend-col-format">
                    {isVideo ? (
                      <span className="format-badge format-badge--video">
                        <Icon name="i-film" size={12} />
                        Video
                      </span>
                    ) : (
                      <span className="format-badge format-badge--text">
                        <Icon name="i-text" size={12} />
                        {tenDang(b.dangBai)}
                      </span>
                    )}
                  </td>

                  {/* Nội dung: Hiển thị tự nhiên, nếu dài mới cho bung ra in-place */}
                  <td className="trend-col-content">
                    <div style={{ lineHeight: 1.6, color: 'var(--ink)', fontSize: 13 }}>
                      <span className={isLong && !isExpanded ? 'trend-text-btn--collapsed' : ''} style={{ display: 'block' }}>
                        {b.noiDung || <em style={{ color: 'var(--ink-3)' }}>(Bài video/ảnh không có chú thích chữ)</em>}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => setMoRongId(isExpanded ? null : b.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: 'var(--brand-600)',
                          }}
                        >
                          {isExpanded ? '▲ Thu gọn' : '▼ Đọc thêm'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopy(b.id, b.noiDung)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          fontSize: 11.5,
                          color: 'var(--ink-3)',
                        }}
                        title="Sao chép toàn bộ văn bản bài viết"
                      >
                        {copiedId === b.id ? '✓ Đã sao chép' : '📋 Sao chép'}
                      </button>
                    </div>
                  </td>

                  {/* Độ dài */}
                  <td className="trend-col-metrics">
                    <div className="trend-metric-chips">
                      <span className="trend-chip">
                        📏 <strong>{b.soKyTu}</strong> ký tự
                      </span>
                      {b.thoiLuongVideoMs ? (
                        <span className="trend-chip">
                          ⏱️ <strong>{giay(b.thoiLuongVideoMs)}</strong>
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Tương tác */}
                  <td className="trend-col-metrics">
                    <div className="trend-metric-chips">
                      <span className={`trend-chip ${isViral ? 'trend-chip--viral' : ''}`} title="Lượt thích">
                        ❤️ {so(b.soThich)}
                      </span>
                      <span className="trend-chip" title="Bình luận">
                        💬 {so(b.soBinhLuan)}
                      </span>
                      <span className="trend-chip" title="Chia sẻ">
                        🔄 {so(b.soChiaSe)}
                      </span>
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="trend-col-actions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                      {b.lienKet ? (
                        <a
                          href={b.lienKet}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="trend-action-btn"
                        >
                          Mở bài ↗
                        </a>
                      ) : (
                        <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>—</span>
                      )}

                      <Link
                        href={`/studio/de-xuat?trendSignalId=${b.id}&tenKenh=${encodeURIComponent(b.tenKenh)}&hook=${encodeURIComponent(b.noiDung.slice(0, 140))}&dang=${b.dangBai ?? (b.thoiLuongVideoMs ? 'kich_ban_quay' : 'chu')}`}
                        className="trend-action-btn"
                        style={{ background: 'var(--surface-2)', borderColor: 'var(--line)', color: 'var(--ink-2)', fontSize: 11 }}
                        title="Đến Studio để AI lấy cảm hứng từ chủ đề này đề xuất ý tưởng cho bạn"
                      >
                        ⚡ Học cách kể
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {danhSachHienThi.length === 0 && (
          <div className="post-empty-state">
            <Icon name="i-search" size={32} />
            <p style={{ margin: '8px 0 0' }}>Không tìm thấy bài viết nào khớp với &ldquo;{tuKhoa}&rdquo;.</p>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => { setTuKhoa(''); setTabDinhDang('tat_ca'); }}
              style={{ marginTop: 10 }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

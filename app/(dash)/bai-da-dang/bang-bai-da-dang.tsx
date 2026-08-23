'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';

import { Icon } from '../../sprite-icon';
import { bocPhuDeVideo } from '../cai-dat/kenh/actions';

export type AnhBai = { id: string; duongDan: string | null; urlNgoai: string | null };
export type VideoBai = { id: string; urlNgoai: string | null; phuDe: string | null };

export type DongBai = {
  id: string;
  ngayDang: string | null;
  noiDung: string;
  soKyTu: number;
  lienKetGoc: string | null;
  dangBai: string | null;
  soThich: number | null;
  soBinhLuan: number | null;
  soChiaSe: number | null;
  thoiLuongVideoMs: number | null;
  anh: AnhBai[];
  video: VideoBai[];
};

type DinhDangLoc = 'tat_ca' | 'chu' | 'video' | 'co_media';

function ngayViet(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function giay(ms: number | null): string {
  if (ms === null) return '—';
  const t = Math.round(ms / 1000);
  return t >= 60 ? `${Math.floor(t / 60)}p${String(t % 60).padStart(2, '0')}` : `${t}s`;
}

function so(v: number | null): string {
  return v === null ? '—' : String(v);
}

export function BangBaiDaDang({ dong }: { dong: DongBai[] }) {
  const [tuKhoa, setTuKhoa] = useState<string>('');
  const [tabDinhDang, setTabDinhDang] = useState<DinhDangLoc>('tat_ca');
  const [moRongId, setMoRongId] = useState<string | null>(null);
  const [phuDeMoi, setPhuDeMoi] = useState<Record<string, string>>({});
  const [loi, setLoi] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dangChay, batDau] = useTransition();

  // Thống kê nhanh tổng quan
  const tongSoBai = dong.length;
  const soBaiVideo = dong.filter((b) => b.dangBai === 'kich_ban_quay' || b.video.length > 0).length;
  const soBaiChu = tongSoBai - soBaiVideo;
  const tongMedia = dong.reduce((sum, b) => sum + b.anh.length + b.video.length, 0);

  // Lọc dữ liệu theo từ khóa và định dạng
  const danhSachHienThi = useMemo(() => {
    return dong.filter((b) => {
      // Lọc theo định dạng tab
      if (tabDinhDang === 'chu' && (b.dangBai === 'kich_ban_quay' || b.video.length > 0)) {
        return false;
      }
      if (tabDinhDang === 'video' && b.dangBai !== 'kich_ban_quay' && b.video.length === 0) {
        return false;
      }
      if (tabDinhDang === 'co_media' && b.anh.length === 0 && b.video.length === 0) {
        return false;
      }

      // Lọc theo từ khóa tìm kiếm
      if (tuKhoa.trim()) {
        const query = tuKhoa.toLowerCase().trim();
        const khopNoiDung = b.noiDung.toLowerCase().includes(query);
        const khopNgay = ngayViet(b.ngayDang).includes(query);
        if (!khopNoiDung && !khopNgay) return false;
      }

      return true;
    });
  }, [dong, tabDinhDang, tuKhoa]);

  if (dong.length === 0) {
    return (
      <div className="post-empty-state">
        <Icon name="i-folder" size={40} />
        <h3 style={{ margin: '12px 0 6px', fontSize: 16, color: 'var(--ink)' }}>Chưa có bài nào được đồng bộ</h3>
        <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 13.5 }}>
          Vào <Link href="/cai-dat/kenh" style={{ color: 'var(--brand-600)', fontWeight: 600 }}>Cài đặt kết nối kênh</Link> để dán link và kéo bài về.
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
      {/* ─── 1. Thẻ chỉ số tổng quan (Summary Metrics Bar) ─── */}
      <div className="post-metrics-bar">
        <div className="post-metric-card">
          <div className="post-metric-icon post-metric-icon--orange">
            <Icon name="i-folder" size={20} />
          </div>
          <div>
            <div className="post-metric-val">{tongSoBai}</div>
            <div className="post-metric-label">Tổng bài đã đồng bộ</div>
          </div>
        </div>

        <div className="post-metric-card">
          <div className="post-metric-icon post-metric-icon--sage">
            <Icon name="i-text" size={20} />
          </div>
          <div>
            <div className="post-metric-val">{soBaiChu}</div>
            <div className="post-metric-label">Bài viết dạng Chữ</div>
          </div>
        </div>

        <div className="post-metric-card">
          <div className="post-metric-icon post-metric-icon--plum">
            <Icon name="i-film" size={20} />
          </div>
          <div>
            <div className="post-metric-val">{soBaiVideo}</div>
            <div className="post-metric-label">Video &amp; Kịch bản</div>
          </div>
        </div>

        <div className="post-metric-card">
          <div className="post-metric-icon post-metric-icon--clay">
            <Icon name="i-sparkle" size={20} />
          </div>
          <div>
            <div className="post-metric-val">{tongMedia}</div>
            <div className="post-metric-label">Hình ảnh &amp; Video Media</div>
          </div>
        </div>
      </div>

      {/* ─── 2. Thanh công cụ tìm kiếm & lọc thông minh (Toolbar) ─── */}
      <div className="post-toolbar">
        {/* Ô tìm kiếm từ khóa */}
        <div className="post-search-box">
          <div className="post-search-icon">
            <Icon name="i-search" size={15} />
          </div>
          <input
            type="text"
            className="post-search-input"
            placeholder="Tìm kiếm nội dung bài viết hoặc ngày đăng..."
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

        {/* Các nút Tab phân loại */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="post-filter-pills">
            <button
              type="button"
              className={`post-filter-pill ${tabDinhDang === 'tat_ca' ? 'post-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('tat_ca')}
            >
              Tất cả ({tongSoBai})
            </button>
            <button
              type="button"
              className={`post-filter-pill ${tabDinhDang === 'chu' ? 'post-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('chu')}
            >
              Bài chữ ({soBaiChu})
            </button>
            <button
              type="button"
              className={`post-filter-pill ${tabDinhDang === 'video' ? 'post-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('video')}
            >
              Video ({soBaiVideo})
            </button>
            <button
              type="button"
              className={`post-filter-pill ${tabDinhDang === 'co_media' ? 'post-filter-pill--active' : ''}`}
              onClick={() => setTabDinhDang('co_media')}
            >
              Có Media
            </button>
          </div>

          <span style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 500 }}>
            Hiển thị <strong>{danhSachHienThi.length}</strong> bài
          </span>
        </div>
      </div>

      {/* ─── 3. Bảng dữ liệu hiện đại (Modern Post Table) ─── */}
      <div className="post-table-container">
        <table className="post-table">
          <thead>
            <tr>
              <th className="col-date">Ngày đăng</th>
              <th className="col-format">Định dạng</th>
              <th className="col-content">Nội dung bài viết</th>
              <th className="col-metrics">Độ dài &amp; Media</th>
              <th className="col-metrics">Tương tác</th>
              <th className="col-actions">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachHienThi.map((b) => {
              const isExpanded = moRongId === b.id;
              const isVideo = b.dangBai === 'kich_ban_quay' || b.video.length > 0;
              const coPhuDe = b.video.some((v) => v.phuDe || phuDeMoi[v.id]);

              return (
                <tr key={b.id}>
                  {/* Cột 1: Ngày đăng */}
                  <td className="col-date">
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{ngayViet(b.ngayDang)}</div>
                  </td>

                  {/* Cột 2: Định dạng */}
                  <td className="col-format">
                    {isVideo ? (
                      <span className="format-badge format-badge--video">
                        <Icon name="i-film" size={12} />
                        Video
                      </span>
                    ) : (
                      <span className="format-badge format-badge--text">
                        <Icon name="i-text" size={12} />
                        Bài chữ
                      </span>
                    )}
                  </td>

                  {/* Cột 3: Nội dung & Mở rộng */}
                  <td className="col-content">
                    <button
                      type="button"
                      className={`post-text-btn ${isExpanded ? '' : 'post-text-btn--collapsed'}`}
                      onClick={() => setMoRongId(isExpanded ? null : b.id)}
                      title={isExpanded ? 'Bấm để thu gọn' : 'Bấm để xem đầy đủ'}
                    >
                      {b.noiDung || <em style={{ color: 'var(--ink-3)' }}>(Bài đăng video/ảnh không có chú thích chữ)</em>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => setMoRongId(isExpanded ? null : b.id)}
                        className="post-expand-indicator"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        {isExpanded ? '▲ Thu gọn' : '▼ Chi tiết & Media'}
                      </button>

                      {isExpanded && (
                        <button
                          type="button"
                          onClick={() => handleCopy(b.id, b.noiDung)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 11.5, color: 'var(--ink-2)' }}
                        >
                          {copiedId === b.id ? '✓ Đã sao chép!' : '📋 Sao chép text'}
                        </button>
                      )}
                    </div>

                    {/* Vùng mở rộng xem chi tiết Ảnh / Video / Phụ đề */}
                    {isExpanded && (
                      <div className="post-expanded-box">
                        {b.anh.length > 0 && (
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6 }}>
                              📸 Hình ảnh đính kèm ({b.anh.length}):
                            </div>
                            <div className="post-media-grid">
                              {b.anh.map((a) => (
                                <img
                                  key={a.id}
                                  src={a.duongDan ? `/api/media/${a.duongDan}` : (a.urlNgoai ?? '')}
                                  alt="Media"
                                  className="post-media-thumb"
                                  loading="lazy"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {b.video.length > 0 && (
                          <div style={{ marginTop: b.anh.length > 0 ? 12 : 0 }}>
                            {b.video.map((v) => {
                              const pd = phuDeMoi[v.id] ?? v.phuDe;
                              const co = Boolean(pd);
                              const loiVideo = loi[v.id];

                              return (
                                <div key={v.id}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
                                      🎬 Video kịch bản ({giay(b.thoiLuongVideoMs)}):
                                    </span>

                                    {!co && v.urlNgoai && (
                                      <button
                                        type="button"
                                        className="btn btn--sm"
                                        disabled={dangChay}
                                        onClick={() => {
                                          batDau(async () => {
                                            const res = await bocPhuDeVideo(v.id);
                                            if (res.ok) {
                                              setPhuDeMoi((cu) => ({ ...cu, [v.id]: res.phuDe }));
                                            } else {
                                              setLoi((cu) => ({ ...cu, [v.id]: res.loi ?? 'Bóc phụ đề thất bại' }));
                                            }
                                          });
                                        }}
                                      >
                                        <Icon name="i-sparkle" size={13} />
                                        {dangChay ? 'Đang bóc phụ đề...' : 'Bóc phụ đề bằng AI'}
                                      </button>
                                    )}
                                  </div>

                                  {pd ? (
                                    <div className="post-subtitle-box">
                                      <strong>Lời thoại bóc tách:</strong>
                                      <p style={{ margin: '4px 0 0' }}>{pd}</p>
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Chưa có phụ đề bóc tách.</span>
                                  )}

                                  {loiVideo && (
                                    <p style={{ color: 'var(--clay)', fontSize: 12, marginTop: 4 }}>
                                      {loiVideo}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Cột 4: Độ dài & Media chips */}
                  <td className="col-metrics">
                    <div className="post-metric-chips">
                      <span className="metric-chip">
                        📏 <strong>{b.soKyTu}</strong> ký tự
                      </span>
                      {b.anh.length > 0 && (
                        <span className="metric-chip">
                          🖼️ <strong>{b.anh.length}</strong> ảnh
                        </span>
                      )}
                      {b.video.length > 0 && (
                        <span className="metric-chip">
                          🎥 <strong>{giay(b.thoiLuongVideoMs)}</strong>
                        </span>
                      )}
                      {coPhuDe && (
                        <span className="metric-chip" style={{ color: '#059669', fontWeight: 600 }}>
                          ✓ Có phụ đề
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Cột 5: Tương tác */}
                  <td className="col-metrics">
                    <div className="post-metric-chips">
                      <span className="metric-chip" title="Lượt thích">
                        ❤️ {so(b.soThich)}
                      </span>
                      <span className="metric-chip" title="Bình luận">
                        💬 {so(b.soBinhLuan)}
                      </span>
                      <span className="metric-chip" title="Chia sẻ">
                        🔄 {so(b.soChiaSe)}
                      </span>
                    </div>
                  </td>

                  {/* Cột 6: Thao tác & Link */}
                  <td className="col-actions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                      {b.lienKetGoc ? (
                        <a
                          href={b.lienKetGoc}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="post-link-btn"
                        >
                          Mở bài ↗
                        </a>
                      ) : (
                        <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>—</span>
                      )}

                      <Link
                        href={`/studio/bien-soan`}
                        className="post-link-btn"
                        style={{ background: 'var(--surface-2)', borderColor: 'var(--line)', color: 'var(--ink-2)', fontSize: 11 }}
                        title="Dùng ý tưởng này để viết bài mới trong Studio"
                      >
                        ⚡ Viết lại
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

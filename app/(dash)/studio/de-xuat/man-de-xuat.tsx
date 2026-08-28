'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

import { Icon } from '@/app/sprite-icon';
import type { BeMat, YTuongDeXuat } from '@/lib/studio/kieu';
import type { KetQuaDoDayDu } from '@/lib/brand/do-day-du';

import { sinhDeXuatAction } from './actions';

type YTuongDaLuu = {
  id: string;
  beMat: string;
  gocTiepCan: string | null;
  cauMoDau: string | null;
  lyDoDeXuat: string | null;
  tenTruCot: string | null;
  tenChanDung: string | null;
  ngayTao: string;
};

type TrendContext = {
  id: string;
  tenKenh: string | null;
  hook: string | null;
  dang: string | null;
};

type Props = {
  dsTruCot: string[];
  dsChanDung: string[];
  yTuongDaLuu: YTuongDaLuu[];
  trendContext?: TrendContext | null;
  doDayDu?: KetQuaDoDayDu;
};

const DANH_SACH_BE_MAT: {
  id: BeMat;
  ten: string;
  moTa: string;
  soTu: string;
  icon: string;
}[] = [
  {
    id: 'fanpage',
    ten: 'Fanpage Facebook',
    moTa: 'Nuôi dưỡng niềm tin, demo chuyên sâu',
    soTu: '150–300 từ',
    icon: 'i-layers',
  },
  {
    id: 'tiktok',
    ten: 'TikTok Video',
    moTa: 'Hook nhanh 1–2s, chứng minh trực quan',
    soTu: '60–120 từ',
    icon: 'i-sparkle',
  },
  {
    id: 'ho_so_ca_nhan',
    ten: 'Trang cá nhân',
    moTa: 'Người thật kể chuyện, trải nghiệm thực tế',
    soTu: '120–250 từ',
    icon: 'i-person',
  },
  {
    id: 'zalo',
    ten: 'Zalo cá nhân',
    moTa: 'Thân mật như nhắn tin, kết thúc câu hỏi mở',
    soTu: '40–100 từ',
    icon: 'i-text',
  },
];

export function ManDeXuat({ dsTruCot, dsChanDung, yTuongDaLuu, trendContext, doDayDu }: Props) {
  const [moModalCanhBao, setMoModalCanhBao] = useState(false);
  const [trendNguon, setTrendNguon] = useState<TrendContext | null>(trendContext ?? null);
  const [beMat, setBeMat] = useState<BeMat>(
    trendContext?.dang === 'kich_ban_quay' ? 'tiktok' : 'fanpage',
  );
  const [soLuong, setSoLuong] = useState<number>(5);
  const [danhSachYTuong, setDanhSachYTuong] = useState<YTuongDeXuat[]>([]);
  const [canhBao, setCanhBao] = useState<string[]>([]);
  const [loi, setLoi] = useState<string | null>(null);
  const [dangSinh, startSinhTransition] = useTransition();

  // Trạng thái tiến trình chạy nhiều bước sống động
  const [buocHienTai, setBuocHienTai] = useState<number>(0);
  const [tienDoPhanTram, setTienDoPhanTram] = useState<number>(15);

  const CAC_BUOC_SINH = [
    { stt: 1, ten: 'Đọc Brand DNA & Chân dung', moTa: `Đối chiếu ${dsTruCot.length} trụ cột và ${dsChanDung.length} chân dung khách hàng` },
    {
      stt: 2,
      ten: trendNguon ? `Học công thức từ ${trendNguon.tenKenh || 'Kênh ngoài'}` : 'Phân tích Trend & Quota 80/20',
      moTa: trendNguon ? `Trích xuất Hook và cấu trúc kể chuyện của bài mẫu tham khảo` : 'Tính toán tỷ lệ trụ cột và tín hiệu thị trường',
    },
    { stt: 3, ten: 'AI sáng tạo ý tưởng', moTa: `Mô hình đang sinh ${soLuong} ý tưởng chuẩn ${DANH_SACH_BE_MAT.find(b => b.id === beMat)?.ten || beMat}` },
    { stt: 4, ten: 'Rải Quota & Khám phá 20%', moTa: 'Áp dụng thuật toán Largest Remainder cân bằng chiến lược' },
  ];

  function handleSinhDeXuat() {
    setLoi(null);
    setCanhBao([]);
    setBuocHienTai(0);
    setTienDoPhanTram(20);

    // Chuỗi timer mô phỏng tiến trình phân tích nhiều giai đoạn
    const t1 = setTimeout(() => { setBuocHienTai(1); setTienDoPhanTram(45); }, 700);
    const t2 = setTimeout(() => { setBuocHienTai(2); setTienDoPhanTram(75); }, 1600);
    const t3 = setTimeout(() => { setBuocHienTai(3); setTienDoPhanTram(92); }, 2500);

    startSinhTransition(async () => {
      try {
        const res = await sinhDeXuatAction(beMat, soLuong, trendNguon?.id);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        setTienDoPhanTram(100);

        if (res.trangThai === 'loi' || !res.ketQua) {
          setLoi(res.loi ?? 'Không thể sinh ý tưởng lúc này.');
          if (res.canhBao.length) setCanhBao(res.canhBao);
        } else {
          setDanhSachYTuong(res.ketQua);
          if (res.canhBao.length) setCanhBao(res.canhBao);
        }
      } catch {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        setLoi('Lỗi kết nối khi gọi mô hình đề xuất.');
      }
    });
  }

  return (
    <div className="studio-container">
      {/* Banner Chế độ Học cách kể nếu được kích hoạt từ Kênh ngoài */}
      {trendNguon && (
        <div className="trend-context-banner">
          <div className="trend-context-banner__content">
            <div className="trend-context-banner__tag">
              <Icon name="i-trend" size={14} />
              Chế độ đặc biệt: Học cách kể từ Xu hướng đối thủ
            </div>
            <h3 className="trend-context-banner__title">
              📡 Đang lấy cảm hứng từ kênh: <strong style={{ color: 'var(--brand-700)' }}>{trendNguon.tenKenh || 'Kênh ngoài'}</strong>
            </h3>
            {trendNguon.hook && (
              <div className="trend-context-banner__quote">
                &ldquo;{trendNguon.hook}&rdquo;
              </div>
            )}
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ink-3)' }}>
              AI sẽ phân tích cấu trúc, câu mở đầu và cách giữ chân người xem của bài này, sau đó kết hợp với Chân dung khách hàng &amp; Trụ cột của bạn để sinh ý tưởng mới.
            </p>
          </div>
          <button
            type="button"
            className="trend-context-banner__close"
            onClick={() => setTrendNguon(null)}
            title="Thoát chế độ học cách kể để về đề xuất tự động"
          >
            ✕ Bỏ chọn bài mẫu
          </button>
        </div>
      )}

      {/* 1. Bảng điều khiển bộ sinh ý tưởng */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em' }}>
                1. Chọn bề mặt đăng bài mục tiêu
              </label>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                Định dạng &amp; độ dài được tối ưu tự động
              </span>
            </div>

            <div className="chon-be-mat-grid">
              {DANH_SACH_BE_MAT.map((b) => {
                const isActive = beMat === b.id;
                return (
                  <div
                    key={b.id}
                    role="button"
                    tabIndex={0}
                    className={`be-mat-card ${isActive ? 'be-mat-card--active' : ''}`}
                    onClick={() => setBeMat(b.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setBeMat(b.id);
                      }
                    }}
                  >
                    <div className="be-mat-card__head">
                      <div className="be-mat-card__icon">
                        <Icon name={b.icon} size={16} />
                      </div>
                      <span className="be-mat-card__badge">{b.soTu}</span>
                    </div>
                    <div className="be-mat-card__ten">{b.ten}</div>
                    <div className="be-mat-card__mota">{b.moTa}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Thanh điều khiển số lượng + nút sinh */}
          <div className="dieu-khien-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
                2. Số lượng ý tưởng:
              </span>
              <div className="segmented-group">
                {[3, 5, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`segmented-btn ${soLuong === n ? 'segmented-btn--active' : ''}`}
                    onClick={() => setSoLuong(n)}
                  >
                    {n} ý tưởng
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {doDayDu ? (
                doDayDu.phanTram >= 60 ? (
                  <Link href="/brand" className="ho-so-badge ho-so-badge--ok" title="Hồ sơ đã đạt chuẩn để đề xuất tối ưu">
                    <Icon name="i-check" size={13} />
                    Hồ sơ {doDayDu.phanTram}% (Đạt chuẩn)
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMoModalCanhBao(true)}
                    className="ho-so-badge ho-so-badge--warn"
                    title="Hồ sơ dưới 60% — Bấm để xem chi tiết"
                  >
                    <Icon name="i-alert" size={13} />
                    Hồ sơ {doDayDu.phanTram}% (Chưa tối ưu)
                  </button>
                )
              ) : null}
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (doDayDu && doDayDu.phanTram < 60) {
                    setMoModalCanhBao(true);
                  } else {
                    handleSinhDeXuat();
                  }
                }}
                disabled={dangSinh}
                style={{
                  padding: '10px 22px',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: dangSinh ? 'none' : 'var(--shadow-brand)',
                }}
              >
                <Icon name="i-sparkle" size={16} />
                {dangSinh
                  ? `Đang sáng tạo ${soLuong} ý tưởng (${tienDoPhanTram}%)...`
                  : trendNguon
                  ? '⚡ Sinh ý tưởng học từ bài mẫu này'
                  : 'Sinh đề xuất hôm nay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi nếu có */}
      {loi && (
        <div
          className="panel"
          style={{
            borderColor: 'var(--clay)',
            background: 'rgba(239, 68, 68, 0.08)',
            marginBottom: 20,
            padding: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--clay)' }}>
            <Icon name="i-alert" size={18} />
            <b>{loi}</b>
          </div>
        </div>
      )}

      {/* Cảnh báo nếu có */}
      {canhBao.map((cb, idx) => (
        <div
          key={idx}
          className="panel"
          style={{
            borderColor: '#f59e0b',
            background: 'rgba(245, 158, 11, 0.08)',
            marginBottom: 16,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b45309' }}>
            <Icon name="i-alert" size={16} />
            <span>{cb}</span>
          </div>
        </div>
      ))}

      {/* Trạng thái đang tải cao cấp (Rich Loading Animation & Skeleton) */}
      {dangSinh && (
        <div className="idea-loading-wrapper">
          {/* Header tiến trình */}
          <div className="idea-loading-header">
            <div className="idea-loading-status">
              <div className="idea-loading-spinner" />
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                  {CAC_BUOC_SINH[buocHienTai]?.ten || 'Đang chuẩn bị dữ liệu...'}
                </h3>
                <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 13 }}>
                  {CAC_BUOC_SINH[buocHienTai]?.moTa}
                </p>
              </div>
            </div>

            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-600)' }}>
              {tienDoPhanTram}%
            </span>
          </div>

          {/* Thanh tiến trình phát sáng */}
          <div className="loading-progress-bar-container">
            <div
              className="loading-progress-bar-fill"
              style={{ width: `${tienDoPhanTram}%` }}
            />
          </div>

          {/* 4 Nút bước tiến trình */}
          <div className="loading-step-timeline">
            {CAC_BUOC_SINH.map((b, idx) => {
              const isDone = buocHienTai > idx;
              const isActive = buocHienTai === idx;
              return (
                <div
                  key={b.stt}
                  className={`loading-step-node ${isDone ? 'loading-step-node--done' : ''} ${isActive ? 'loading-step-node--active' : ''}`}
                >
                  <div className="loading-step-badge">
                    {isDone ? '✓' : b.stt}
                  </div>
                  <span>{b.ten}</span>
                </div>
              );
            })}
          </div>

          {/* Mô phỏng khung thẻ bài đang hình thành (Shimmer Skeletons) */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 10 }}>
              Đang dựng cấu trúc {soLuong} thẻ ý tưởng...
            </div>
            <div className="skeleton-grid">
              {Array.from({ length: Math.min(3, soLuong) }).map((_, idx) => (
                <div key={idx} className="skeleton-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="skeleton-shimmer" style={{ width: 80, height: 20 }} />
                    <div className="skeleton-shimmer" style={{ width: 100, height: 16 }} />
                  </div>
                  <div className="skeleton-shimmer" style={{ width: '90%', height: 18, margin: '6px 0' }} />
                  <div className="skeleton-shimmer" style={{ width: '100%', height: 44 }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <div className="skeleton-shimmer" style={{ width: 70, height: 28 }} />
                    <div className="skeleton-shimmer" style={{ width: 90, height: 28 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Danh sách ý tưởng đề xuất vừa sinh */}
      {!dangSinh && danhSachYTuong.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
              <Icon name="i-sparkle" size={20} />
              Ý tưởng đề xuất hôm nay ({danhSachYTuong.length})
            </h2>
            <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
              Đã tự động lưu vào kho ý tưởng
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {danhSachYTuong.map((yt, idx) => (
              <div key={idx} className="ytuong-card">
                {/* Header thẻ */}
                <div className="ytuong-card__head">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                    <span className="ytuong-card__index">#{String(idx + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1 }}>
                      <h3 className="ytuong-card__tieu-de">{yt.tieuDe}</h3>
                      <div className="ytuong-card__tags" style={{ marginTop: 8 }}>
                        {yt.truCot && (
                          <span className="ytuong-tag ytuong-tag--pillar">
                            Trụ cột: {yt.truCot}
                          </span>
                        )}
                        {yt.chanDung && (
                          <span className="ytuong-tag ytuong-tag--persona">
                            Chân dung: {yt.chanDung}
                          </span>
                        )}
                        {yt.khamPha && (
                          <span className="ytuong-tag ytuong-tag--khampha">
                            ⚡ Dò đường (Khám phá)
                          </span>
                        )}
                        {yt.trendSignalId && (
                          <span className="ytuong-tag ytuong-tag--trend">
                            📡 Từ xu hướng{yt.nguonThamKhao?.tenKenh ? ` (${yt.nguonThamKhao.tenKenh})` : ''}
                            {yt.nguonThamKhao?.lienKet && (
                              <a
                                href={yt.nguonThamKhao.lienKet}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#7c3aed',
                                  textDecoration: 'underline',
                                  fontWeight: 600,
                                  marginLeft: 4,
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Xem bài gốc ↗
                              </a>
                            )}
                          </span>
                        )}
                        <span className="ytuong-tag ytuong-tag--surface">
                          {yt.beMat}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hook câu mở đầu */}
                {yt.cauMoDau && (
                  <div className="ytuong-card__hook">
                    <span style={{ fontWeight: 600, color: 'var(--brand-600)', fontStyle: 'normal', marginRight: 6 }}>
                      Hook mở đầu:
                    </span>
                    &ldquo;{yt.cauMoDau}&rdquo;
                  </div>
                )}

                {/* Góc tiếp cận */}
                {yt.gocTiepCan && (
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--ink)' }}>Góc tiếp cận:</strong> {yt.gocTiepCan}
                  </p>
                )}

                {/* Lý do đề xuất */}
                {yt.lyDoDeXuat && (
                  <div className="ytuong-card__ly-do">
                    <span>💡</span>
                    <span><em>Lý do: {yt.lyDoDeXuat}</em></span>
                  </div>
                )}

                {/* Footer action */}
                <div className="ytuong-card__foot">
                  <Link
                    className="btn btn--sm btn--primary"
                    href={`/studio/bien-soan?tieuDe=${encodeURIComponent(yt.tieuDe)}&beMat=${yt.beMat}${yt.cauMoDau ? `&cauMoDau=${encodeURIComponent(yt.cauMoDau)}` : ''}`}
                    style={{ fontWeight: 600, padding: '6px 14px' }}
                  >
                    <Icon name="i-text" size={14} />
                    Biên soạn bài này →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Danh sách ý tưởng đã lưu (từ CSDL) */}
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <Icon name="i-folder" size={16} />
            Ý tưởng đã lưu gần đây ({yTuongDaLuu.length})
          </h2>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Tự động lưu từ CSDL</span>
        </div>

        {yTuongDaLuu.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--ink-3)' }}>
            <p style={{ fontSize: 13.5, margin: 0 }}>
              Chưa có ý tưởng nào được lưu. Hãy bấm nút <strong>Sinh đề xuất hôm nay</strong> ở trên để bắt đầu.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {yTuongDaLuu.map((y) => (
              <div
                key={y.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                  gap: 12,
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--ink-2)',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--line)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        textTransform: 'capitalize',
                      }}
                    >
                      {y.beMat}
                    </span>
                    {y.tenTruCot && (
                      <span style={{ fontSize: 11.5, color: '#2563eb', fontWeight: 500 }}>
                        • {y.tenTruCot}
                      </span>
                    )}
                    {y.tenChanDung && (
                      <span style={{ fontSize: 11.5, color: '#059669', fontWeight: 500 }}>
                        • {y.tenChanDung}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'var(--ink)',
                    }}
                  >
                    {y.cauMoDau ?? y.gocTiepCan ?? y.lyDoDeXuat ?? '(Ý tưởng)'}
                  </p>
                </div>

                <Link
                  className="btn btn--sm"
                  href={`/studio/bien-soan?ideaId=${y.id}`}
                  style={{ whiteSpace: 'nowrap', fontSize: 12.5 }}
                >
                  <Icon name="i-text" size={13} />
                  Biên soạn
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    
      {/* Modal Cảnh báo mềm (Soft Warning) khi hồ sơ < 60% */}
      {moModalCanhBao && doDayDu && (() => {
        const MAP_SLUG_NHOM: Record<string, string> = {
          truCot: 'tru-cot',
          chanDung: 'chan-dung',
          sanPham: 'san-pham',
          giongDieu: 'giong-dieu',
          insight: 'insight',
        };
        const nhomCanNhat = doDayDu.conThieu?.[0] ?? null;

        return (
          <div className="soft-modal-backdrop" onClick={() => setMoModalCanhBao(false)}>
            <div className="soft-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <button
                type="button"
                className="soft-modal__close"
                onClick={() => setMoModalCanhBao(false)}
                aria-label="Đóng"
              >
                ✕
              </button>

              <div className="soft-modal__header">
                <div className="soft-modal__icon-wrap">
                  <Icon name="i-sparkle" size={22} />
                </div>
                <div>
                  <h3 className="soft-modal__title">Hồ sơ thương hiệu chưa đầy đủ</h3>
                  <span className="soft-modal__badge">
                    Đạt {doDayDu.phanTram}% (Ngưỡng đề xuất tối ưu là 60%)
                  </span>
                </div>
              </div>

              <p className="soft-modal__desc">
                Hồ sơ thương hiệu của bạn mới đạt <strong>{doDayDu.phanTram}%</strong>. Ý tưởng sinh ra có thể sẽ còn chung chung.
                {nhomCanNhat ? (
                  <> Bạn có muốn bổ sung thêm <strong>{nhomCanNhat.ten} (+{nhomCanNhat.trongSo}%)</strong> để nội dung sắc sảo và bám sát khách hàng hơn không?</>
                ) : null}
              </p>

              <div className="soft-modal__progress-box">
                <div className="soft-modal__progress-head">
                  <span>Độ hoàn thiện hồ sơ</span>
                  <span style={{ color: 'var(--brand-600)' }}>{doDayDu.phanTram}%</span>
                </div>
                <div className="soft-modal__progress-track">
                  <div
                    className="soft-modal__progress-bar"
                    style={{ width: `${Math.max(4, doDayDu.phanTram)}%` }}
                  />
                </div>
                <div className="soft-modal__progress-sub">
                  <span>0%</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Ngưỡng tối ưu: 60%</span>
                  <span>100%</span>
                </div>
              </div>

              {doDayDu.conThieu.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', margin: '0 0 8px 0' }}>
                    GỢI Ý BỔ SUNG NHANH:
                  </p>
                  <div className="soft-modal__missing-list">
                    {doDayDu.conThieu.slice(0, 3).map((item) => (
                      <Link
                        key={item.nhom}
                        href={`/brand/${MAP_SLUG_NHOM[item.nhom] || 'san-pham'}`}
                        className="soft-modal__missing-item"
                        title={item.yeuCau}
                      >
                        <span>
                          <strong>{item.ten}</strong>{' '}
                          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>— {item.yeuCau}</span>
                        </span>
                        <span className="soft-modal__missing-tag">+{item.trongSo}%</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="soft-modal__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setMoModalCanhBao(false);
                    handleSinhDeXuat();
                  }}
                  disabled={dangSinh}
                >
                  Vẫn muốn sinh thử
                </button>

                {nhomCanNhat ? (
                  <Link
                    href={`/brand/${MAP_SLUG_NHOM[nhomCanNhat.nhom] || 'san-pham'}`}
                    className="btn btn--primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Icon name="i-plus" size={15} />
                    Điền thêm {nhomCanNhat.ten} (+{nhomCanNhat.trongSo}%)
                  </Link>
                ) : (
                  <Link href="/brand" className="btn btn--primary">
                    Hoàn thiện hồ sơ
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
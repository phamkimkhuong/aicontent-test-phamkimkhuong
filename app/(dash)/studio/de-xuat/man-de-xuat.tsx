'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

import { Icon } from '@/app/sprite-icon';
import type { BeMat, YTuongDeXuat } from '@/lib/studio/kieu';

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

type Props = {
  dsTruCot: string[];
  dsChanDung: string[];
  yTuongDaLuu: YTuongDaLuu[];
};

const DANH_SACH_BE_MAT: { id: BeMat; ten: string; moTa: string }[] = [
  { id: 'fanpage', ten: 'Fanpage Facebook', moTa: 'Nuôi dưỡng niềm tin, demo chuyên sâu (150–300 từ)' },
  { id: 'tiktok', ten: 'TikTok', moTa: 'Hook nhanh 1–2s, chứng minh trực quan (60–120 từ)' },
  { id: 'ho_so_ca_nhan', ten: 'Trang cá nhân', moTa: 'Người thật kể chuyện, trải nghiệm thực tế (120–250 từ)' },
  { id: 'zalo', ten: 'Zalo cá nhân', moTa: 'Thân mật như nhắn tin, kết thúc bằng câu hỏi mở (40–100 từ)' },
];

export function ManDeXuat({ dsTruCot, dsChanDung, yTuongDaLuu }: Props) {
  const [beMat, setBeMat] = useState<BeMat>('fanpage');
  const [soLuong, setSoLuong] = useState<number>(5);
  const [danhSachYTuong, setDanhSachYTuong] = useState<YTuongDeXuat[]>([]);
  const [canhBao, setCanhBao] = useState<string[]>([]);
  const [loi, setLoi] = useState<string | null>(null);
  const [dangSinh, startSinhTransition] = useTransition();

  function handleSinhDeXuat() {
    setLoi(null);
    setCanhBao([]);

    startSinhTransition(async () => {
      const res = await sinhDeXuatAction(beMat, soLuong);
      if (res.trangThai === 'loi' || !res.ketQua) {
        setLoi(res.loi ?? 'Không thể sinh ý tưởng lúc này.');
        if (res.canhBao.length) setCanhBao(res.canhBao);
      } else {
        setDanhSachYTuong(res.ketQua);
        if (res.canhBao.length) setCanhBao(res.canhBao);
      }
    });
  }

  return (
    <div className="studio-de-xuat">
      {/* 1. Bảng điều khiển bộ sinh */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
              1. Chọn bề mặt đăng bài
            </label>
            <div className="chon-be-mat">
              {DANH_SACH_BE_MAT.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`btn ${beMat === b.id ? 'btn--primary' : ''}`}
                  onClick={() => setBeMat(b.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 14px',
                    textAlign: 'left',
                    minWidth: 180,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{b.ten}</span>
                  <span style={{ fontSize: 11, opacity: 0.8 }}>{b.moTa}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
                2. Số lượng ý tưởng
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[3, 5, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`btn btn--sm ${soLuong === n ? 'btn--primary' : ''}`}
                    onClick={() => setSoLuong(n)}
                  >
                    {n} ý tưởng
                  </button>
                ))}
              </div>
            </div>

            <div style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleSinhDeXuat}
                disabled={dangSinh}
                style={{ padding: '10px 20px', fontSize: 14 }}
              >
                <Icon name="i-sparkle" size={16} />
                {dangSinh ? 'Đang suy nghĩ đề xuất...' : 'Sinh đề xuất hôm nay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi & Cảnh báo */}
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

      {/* 2. Danh sách ý tưởng đề xuất vừa sinh */}
      {dangSinh && (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 20px', marginBottom: 24 }}>
          <div style={{ display: 'inline-block', marginBottom: 12 }}>
            <Icon name="i-sparkle" size={32} />
          </div>
          <h3 style={{ margin: '0 0 6px' }}>Đang tổng hợp dữ liệu và sinh ý tưởng...</h3>
          <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 14 }}>
            Đang phân tích {dsTruCot.length} trụ cột, {dsChanDung.length} chân dung và tín hiệu thị trường.
          </p>
        </div>
      )}

      {!dangSinh && danhSachYTuong.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="i-sparkle" size={18} />
              Ý tưởng đề xuất ({danhSachYTuong.length})
            </h2>
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              Đã lưu tự động · Rải theo trụ cột · Khám phá 20%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {danhSachYTuong.map((yt, idx) => (
              <div
                key={idx}
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  borderLeft: yt.khamPha ? '4px solid #f59e0b' : '4px solid var(--sage)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {yt.truCot && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#2563eb',
                      }}
                    >
                      Trụ cột: {yt.truCot}
                    </span>
                  )}
                  {yt.chanDung && (
                    <span
                      style={{
                        fontSize: 12,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#059669',
                      }}
                    >
                      Chân dung: {yt.chanDung}
                    </span>
                  )}
                  {yt.khamPha && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#b45309',
                      }}
                    >
                      ⚡ Dò đường (Khám phá)
                    </span>
                  )}
                  {yt.trendSignalId && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#7c3aed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>📡 Từ xu hướng{yt.nguonThamKhao?.tenKenh ? ` (${yt.nguonThamKhao.tenKenh})` : ''}</span>
                      {yt.nguonThamKhao?.lienKet && (
                        <a
                          href={yt.nguonThamKhao.lienKet}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#7c3aed',
                            textDecoration: 'underline',
                            fontWeight: 600,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Xem bài gốc ↗
                        </a>
                      )}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'var(--line)',
                      color: 'var(--ink-2)',
                      marginLeft: 'auto',
                    }}
                  >
                    {yt.beMat}
                  </span>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--ink)' }}>
                    {yt.tieuDe}
                  </h3>
                  {yt.gocTiepCan && (
                    <p style={{ margin: '0 0 6px', fontSize: 14, color: 'var(--ink-2)' }}>
                      <b>Góc tiếp cận:</b> {yt.gocTiepCan}
                    </p>
                  )}
                  {yt.cauMoDau && (
                    <div
                      style={{
                        padding: '8px 12px',
                        background: 'var(--line)',
                        borderRadius: 6,
                        fontSize: 13,
                        fontStyle: 'italic',
                        margin: '6px 0',
                      }}
                    >
                      &ldquo;{yt.cauMoDau}&rdquo;
                    </div>
                  )}
                  {yt.lyDoDeXuat && (
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--ink-2)' }}>
                      💡 <i>Lý do: {yt.lyDoDeXuat}</i>
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                  <Link
                    className="btn btn--sm btn--primary"
                    href={`/studio/bien-soan?tieuDe=${encodeURIComponent(yt.tieuDe)}&beMat=${yt.beMat}${yt.cauMoDau ? `&cauMoDau=${encodeURIComponent(yt.cauMoDau)}` : ''}`}
                  >
                    <Icon name="i-text" size={14} />
                    Biên soạn bài này
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Danh sách ý tưởng đã lưu (từ DB — refresh vẫn thấy) */}
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="i-folder" size={16} />
            Ý tưởng đã lưu gần đây ({yTuongDaLuu.length})
          </h2>
        </div>

        {yTuongDaLuu.length === 0 ? (
          <p style={{ color: 'var(--ink-2)', fontSize: 14, margin: 0 }}>
            Chưa có ý tưởng nào được lưu. Hãy bấm nút sinh đề xuất ở trên để bắt đầu.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {yTuongDaLuu.map((y) => (
              <div
                key={y.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--line)',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', background: 'var(--line)', padding: '2px 6px', borderRadius: 4 }}>
                      {y.beMat}
                    </span>
                    {y.tenTruCot && (
                      <span style={{ fontSize: 11, color: '#2563eb' }}>
                        • {y.tenTruCot}
                      </span>
                    )}
                    {y.tenChanDung && (
                      <span style={{ fontSize: 11, color: '#059669' }}>
                        • {y.tenChanDung}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {y.cauMoDau ?? y.gocTiepCan ?? y.lyDoDeXuat ?? '(Ý tưởng)'}
                  </p>
                </div>

                <Link
                  className="btn btn--sm"
                  href={`/studio/bien-soan?ideaId=${y.id}`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Icon name="i-text" size={14} />
                  Biên soạn
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

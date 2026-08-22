'use client';

import { useState, useTransition } from 'react';

import { Icon } from '@/app/sprite-icon';
import type { KetQuaChuoiBai, KyChuoiBai } from '@/lib/studio/chuoi-bai';
import type { BeMat } from '@/lib/studio/kieu';

import { luuChuoiBaiAction, sinhChuoiBaiAction } from './actions';

const DANH_SACH_BE_MAT: { id: BeMat; ten: string; icon: string }[] = [
  { id: 'fanpage', ten: 'Fanpage Facebook', icon: 'i-card' },
  { id: 'tiktok', ten: 'TikTok Short Video', icon: 'i-film' },
  { id: 'ho_so_ca_nhan', ten: 'Trang cá nhân', icon: 'i-person' },
  { id: 'zalo', ten: 'Zalo cá nhân', icon: 'i-text' },
];

export function ManChuoiBai() {
  const [tieuDeChuoi, setTieuDeChuoi] = useState<string>(
    'Lộ trình 3 ngày xây dựng kênh TikTok bán hàng từ con số 0',
  );
  const [soLuongKy, setSoLuongKy] = useState<number>(3);
  const [beMat, setBeMat] = useState<BeMat>('fanpage');

  const [dangSinh, startSinhTransition] = useTransition();
  const [dangLuu, startLuuTransition] = useTransition();
  const [loi, setLoi] = useState<string | null>(null);
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [daCopyTatCa, setDaCopyTatCa] = useState<boolean>(false);

  const [ketQua, setKetQua] = useState<KetQuaChuoiBai | null>(null);

  function handleSinhChuoiBai() {
    if (!tieuDeChuoi.trim()) {
      setLoi('Vui lòng nhập chủ đề chính của chuỗi bài.');
      return;
    }

    setLoi(null);
    setThongBao(null);

    startSinhTransition(async () => {
      const res = await sinhChuoiBaiAction({
        tieuDeChuoi,
        beMat,
        soLuongKy,
      });

      if (res.trangThai === 'loi' || !res.ketQua) {
        setLoi(res.loi ?? 'Không thể sinh chuỗi bài lúc này.');
      } else {
        setKetQua(res.ketQua);
        setThongBao(
          `🎉 Đã sinh thành công trọn bộ chuỗi ${res.ketQua.tongSoKy} kỳ nối mạch mượt mà!`,
        );
      }
    });
  }

  function handleCapNhatNoiDungKy(kySo: number, noiDungMoi: string) {
    if (!ketQua) return;
    setKetQua((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cacKy: prev.cacKy.map((k) => (k.kySo === kySo ? { ...k, noiDung: noiDungMoi } : k)),
      };
    });
  }

  function handleLuuChuoi(trangThai: 'ban_nhap' | 'san_sang') {
    if (!ketQua || ketQua.cacKy.length === 0) {
      setLoi('Chưa có nội dung chuỗi bài để lưu.');
      return;
    }

    setLoi(null);
    startLuuTransition(async () => {
      const res = await luuChuoiBaiAction({
        tieuDeChuoi: ketQua.tieuDeChuoi,
        beMat: ketQua.beMat,
        cacKy: ketQua.cacKy.map((k) => ({
          kySo: k.kySo,
          tieuDeKy: k.tieuDeKy,
          noiDung: k.noiDung,
          gocTiepCan: k.gocTiepCan,
          trangThai,
        })),
      });

      if (res.ok) {
        setThongBao(
          `✅ Đã lưu toàn bộ ${res.soLuongLuu} kỳ vào kho bài với trạng thái "${trangThai === 'san_sang' ? 'Sẵn sàng đăng' : 'Bản nháp'
          }"!`,
        );
      } else {
        setLoi(`Lỗi khi lưu: ${res.loi}`);
      }
    });
  }

  function handleSaoChepTatCa() {
    if (!ketQua || ketQua.cacKy.length === 0) return;
    const textAll = ketQua.cacKy
      .map(
        (k) =>
          `========================================\n📌 ${k.tieuDeKy.toUpperCase()}\n(${k.vaiTroKy})\n========================================\n\n${k.noiDung}\n\n${k.hashtag && k.hashtag.length > 0
            ? k.hashtag.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')
            : ''
          }`,
      )
      .join('\n\n\n');

    navigator.clipboard.writeText(textAll);
    setDaCopyTatCa(true);
    setTimeout(() => setDaCopyTatCa(false), 2500);
  }

  function handleTaiFileMarkdown() {
    if (!ketQua || ketQua.cacKy.length === 0) return;
    const textAll = [
      `# Chuỗi bài: ${ketQua.tieuDeChuoi}`,
      `- **Bề mặt:** ${ketQua.beMat}`,
      `- **Tổng số kỳ:** ${ketQua.tongSoKy}`,
      '',
      '---',
      '',
      ...ketQua.cacKy.map(
        (k) =>
          `## ${k.tieuDeKy}\n*${k.vaiTroKy}* (${k.soTu} từ)\n\n${k.noiDung}\n\n${k.hashtag && k.hashtag.length > 0
            ? k.hashtag.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')
            : ''
          }`,
      ),
    ].join('\n\n');

    const blob = new Blob([textAll], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chuoi-bai-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const tongSoTu = ketQua?.cacKy.reduce((acc, k) => acc + (k.soTu || 0), 0) || 0;

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

      {thongBao && (
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
          <b>{thongBao}</b>
        </div>
      )}

      {/* Bố cục 2 cột: Cấu hình chuỗi vs Dòng thời gian nối mạch */}
      <div className="series-layout">
        {/* CỘT TRÁI: THIẾT LẬP CHUỖI BÀI */}
        <div className="bulk-config-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
              1. Thiết lập chuỗi bài
            </h2>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--brand-600)',
                background: 'var(--brand-050)',
                padding: '2px 8px',
                borderRadius: 'var(--r-pill)',
              }}
            >
              Series {soLuongKy} kỳ
            </span>
          </div>

          {/* Nhập Chủ đề chuỗi */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Chủ đề / Mục tiêu lớn của chuỗi *</span>
            </label>
            <textarea
              className="input"
              rows={3}
              value={tieuDeChuoi}
              onChange={(e) => setTieuDeChuoi(e.target.value)}
              placeholder="VD: Lộ trình 3 ngày xây dựng kênh TikTok bán hàng từ con số 0..."
              style={{ width: '100%', resize: 'vertical', fontSize: 13, lineHeight: 1.5 }}
            />
          </div>

          {/* Chọn số lượng kỳ */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Độ dài chuỗi bài</span>
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`btn btn--sm ${soLuongKy === 3 ? 'btn--primary' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setSoLuongKy(3)}
              >
                🔥 3 Kỳ (Tiêu chuẩn)
              </button>
              <button
                type="button"
                className={`btn btn--sm ${soLuongKy === 5 ? 'btn--primary' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setSoLuongKy(5)}
              >
                🚀 5 Kỳ (Chuyên sâu)
              </button>
            </div>
          </div>

          {/* Chọn bề mặt */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Bề mặt đăng bài</span>
            </label>
            <div className="be-mat-tabs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {DANH_SACH_BE_MAT.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBeMat(b.id)}
                  className={`be-mat-tab ${beMat === b.id ? 'be-mat-tab--active' : ''}`}
                  style={{ padding: '8px 10px', fontSize: 12 }}
                >
                  <Icon name={b.icon} size={14} />
                  <span className="be-mat-tab__ten">{b.ten.replace(' Facebook', '').replace(' Short Video', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quy tắc nối mạch thông minh */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--r-md)',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: 12,
              color: 'var(--ink-2)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="i-sparkle" size={14} /> Cơ chế nối mạch tuần tự:
            </div>
            <div>• Kỳ 1: Khởi động, thực trạng &amp; khơi gợi nỗi đau</div>
            <div>• Kỳ 2: Đọc hiểu Kỳ 1, đi sâu vào kỹ thuật giải pháp</div>
            <div>• Kỳ 3: Đọc hiểu Kỳ 1+2, đúc kết kinh nghiệm &amp; CTA</div>
          </div>

          {/* CTA Sinh chuỗi bài */}
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSinhChuoiBai}
            disabled={dangSinh}
            style={{
              padding: '13px 20px',
              fontSize: 14.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-brand)',
            }}
          >
            <Icon name="i-sparkle" size={16} />
            {dangSinh
              ? `Đang viết tuần tự chuỗi ${soLuongKy} kỳ...`
              : `Sinh chuỗi ${soLuongKy} bài nối mạch`}
          </button>
        </div>

        {/* CỘT PHẢI: TIMELINE NỐI MẠCH LIỀN NHAU */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!ketQua ? (
            <div
              style={{
                padding: '70px 24px',
                textAlign: 'center',
                border: '1.5px dashed var(--line)',
                borderRadius: 'var(--r-lg)',
                background: 'var(--surface)',
                color: 'var(--ink-2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--brand-050)',
                  color: 'var(--brand-600)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon name="i-layers" size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                  Chưa có chuỗi bài nào
                </h3>
                <p style={{ fontSize: 13.5, maxWidth: 440 }}>
                  Nhập chủ đề lớn ở cột bên trái và bấm <strong>&ldquo;Sinh chuỗi bài nối mạch&rdquo;</strong>. AI sẽ tự động tạo một series liền mạch không bị lặp ý.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Thanh thao tác chuỗi bài */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: 'var(--surface)',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--line)',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                    {ketQua.tieuDeChuoi}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                    Trọn bộ {ketQua.tongSoKy} kỳ · Tổng {tongSoTu.toLocaleString()} từ
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={handleSaoChepTatCa}
                    title="Sao chép toàn bộ chuỗi bài"
                  >
                    <Icon name={daCopyTatCa ? 'i-check' : 'i-copy'} size={13} />
                    {daCopyTatCa ? 'Đã sao chép!' : 'Sao chép chuỗi'}
                  </button>

                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={handleTaiFileMarkdown}
                    title="Tải về file .md"
                  >
                    <Icon name="i-download" size={13} /> Tải .md
                  </button>

                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={() => handleLuuChuoi('ban_nhap')}
                    disabled={dangLuu}
                  >
                    <Icon name="i-folder" size={13} />
                    {dangLuu ? 'Đang lưu...' : 'Lưu bản nháp'}
                  </button>

                  <button
                    type="button"
                    className="btn btn--sm btn--primary"
                    onClick={() => handleLuuChuoi('san_sang')}
                    disabled={dangLuu}
                  >
                    <Icon name="i-check" size={13} />
                    Sẵn sàng đăng cả chuỗi
                  </button>
                </div>
              </div>

              {/* Dòng thời gian nối mạch (Connected Timeline) */}
              <div className="series-timeline">
                {ketQua.cacKy.map((ky: KyChuoiBai) => (
                  <article key={ky.kySo} className="series-card muc--trong-chuoi">
                    <div className="series-card__head">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="series-card__badge">Kỳ {ky.kySo}</span>
                        <span className="series-card__role">{ky.vaiTroKy}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                        <span
                          style={{
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--r-pill)',
                            background: ky.doDaiDat
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(245, 158, 11, 0.12)',
                            color: ky.doDaiDat ? '#059669' : '#b45309',
                          }}
                        >
                          {ky.soTu} từ
                        </span>

                        {ky.kySo > 1 && (
                          <span
                            style={{
                              color: 'var(--brand-700)',
                              background: 'var(--brand-050)',
                              padding: '2px 7px',
                              borderRadius: 'var(--r-pill)',
                              fontWeight: 600,
                            }}
                          >
                            🔗 Đã nối tiếp Kỳ {ky.kySo - 1}
                          </span>
                        )}
                      </div>
                    </div>

                    <textarea
                      className="series-card__textarea"
                      value={ky.noiDung}
                      onChange={(e) => handleCapNhatNoiDungKy(ky.kySo, e.target.value)}
                      rows={6}
                    />

                    {ky.hashtag && ky.hashtag.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {ky.hashtag.map((tag, tIdx) => (
                          <span key={tIdx} className="hashtag-pill" style={{ fontSize: 11 }}>
                            #{tag.replace(/^#/, '')}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

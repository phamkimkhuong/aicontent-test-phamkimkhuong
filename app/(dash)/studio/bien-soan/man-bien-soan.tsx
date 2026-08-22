'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';

import { Icon } from '@/app/sprite-icon';
import { quetQuyTacNgonNgu, type ViPhamNgonNgu } from '@/lib/brand/quy-tac-ngon-ngu';
import { kiemDoDai, type KetQuaDoDai } from '@/lib/studio/cong-dem-tu';
import type { BeMat, PhanCanhVideo } from '@/lib/studio/kieu';

import { luuBaiAction, sinhBaiAction, sinhKichBanAction } from './actions';

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

type DinhDangBienSoan = 'bai_viet' | 'kich_ban';

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
  const [dinhDang, setDinhDang] = useState<DinhDangBienSoan>('bai_viet');
  const [beMat, setBeMat] = useState<BeMat>(khoiTaoBeMat);
  const [tieuDe, setTieuDe] = useState<string>(khoiTaoTieuDe);
  const [gocTiepCan, setGocTiepCan] = useState<string>(khoiTaoGocTiepCan);
  const [cauMoDau, setCauMoDau] = useState<string>(khoiTaoCauMoDau);
  const [epDoDai, setEpDoDai] = useState<string>('');
  const [thoiLuongVideo, setThoiLuongVideo] = useState<number>(45);

  const [noiDung, setNoiDung] = useState<string>('');
  const [hashtag, setHashtag] = useState<string[]>([]);
  const [phanCanh, setPhanCanh] = useState<PhanCanhVideo[]>([]);
  const [dangSinh, startSinhTransition] = useTransition();
  const [dangLuu, startLuuTransition] = useTransition();

  const [thongBaoLuu, setThongBaoLuu] = useState<string | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [daCopy, setDaCopy] = useState<boolean>(false);

  // Kiem tra do dai va quy tac ngon ngu realtime khi go noi dung
  const [doDai, setDoDai] = useState<KetQuaDoDai>(kiemDoDai(beMat, noiDung));
  const [viPham, setViPham] = useState<ViPhamNgonNgu[]>([]);

  useEffect(() => {
    if (dinhDang === 'bai_viet') {
      const epSoTu = epDoDai.trim() !== '' ? Number(epDoDai) : null;
      setDoDai(kiemDoDai(beMat, noiDung, epSoTu && !isNaN(epSoTu) ? epSoTu : null));
      setViPham(quetQuyTacNgonNgu(noiDung));
    } else {
      const toanBoThoai = phanCanh.map((c) => c.loiThoai).join(' ');
      setViPham(quetQuyTacNgonNgu(toanBoThoai));
    }
  }, [beMat, noiDung, epDoDai, dinhDang, phanCanh]);

  function handleSinhBai() {
    if (!tieuDe.trim()) {
      setLoi('Vui lòng nhập tiêu đề hoặc chủ đề bài viết.');
      return;
    }

    setLoi(null);
    setThongBaoLuu(null);

    const epSoTu = epDoDai.trim() !== '' ? Number(epDoDai) : null;

    startSinhTransition(async () => {
      if (dinhDang === 'bai_viet') {
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
      } else {
        // Sinh kịch bản video phân cảnh (Mốc 3)
        const res = await sinhKichBanAction({
          beMat,
          tieuDe,
          gocTiepCan: gocTiepCan || null,
          cauMoDau: cauMoDau || null,
          ideaId: ideaId || null,
          thoiLuongUocTinhGiay: thoiLuongVideo,
        });

        if (res.trangThai === 'loi' || !res.ketQua) {
          setLoi(res.loi ?? 'Không thể sinh kịch bản video lúc này.');
        } else {
          setPhanCanh(res.ketQua.phanCanh);
        }
      }
    });
  }

  function handleLuuBai(trangThai: 'ban_nhap' | 'san_sang') {
    let finalNoiDung = noiDung;
    if (dinhDang === 'kich_ban') {
      if (phanCanh.length === 0) {
        setLoi('Kịch bản video chưa có phân cảnh nào để lưu.');
        return;
      }
      finalNoiDung = phanCanh
        .map(
          (c, idx) =>
            `[Cảnh ${idx + 1} - ${c.thoiLuongGiay}s]\n🎬 Hình ảnh: ${c.hinhAnh}\n🗣️ Lời thoại: ${c.loiThoai}`,
        )
        .join('\n\n');
    } else {
      if (!noiDung.trim()) {
        setLoi('Nội dung bài viết chưa có gì để lưu.');
        return;
      }
    }

    setLoi(null);
    startLuuTransition(async () => {
      const res = await luuBaiAction({
        tieuDe: tieuDe || null,
        noiDung: finalNoiDung,
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

  function handleSaoChepKichBan() {
    if (phanCanh.length === 0) return;
    const textKichBan = phanCanh
      .map(
        (c, idx) =>
          `=== CẢNH ${idx + 1} (${c.thoiLuongGiay} giây) ===\n🎥 HÌNH ẢNH: ${c.hinhAnh}\n🎙️ LỜI THOẠI: ${c.loiThoai}`,
      )
      .join('\n\n');
    navigator.clipboard.writeText(textKichBan);
    setDaCopy(true);
    setTimeout(() => setDaCopy(false), 2000);
  }

  function handleCapNhatPhanCanh(idx: number, truong: keyof PhanCanhVideo, giaTri: any) {
    setPhanCanh((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], [truong]: giaTri };
      return clone;
    });
  }

  function handleThemPhanCanh() {
    setPhanCanh((prev) => [
      ...prev,
      {
        thoiLuongGiay: 4,
        hinhAnh: 'Góc máy và bối cảnh tiếp theo...',
        loiThoai: 'Lời thoại hoặc voiceover...',
      },
    ]);
  }

  function handleXoaPhanCanh(idx: number) {
    setPhanCanh((prev) => prev.filter((_, i) => i !== idx));
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
    if (dinhDang === 'bai_viet') {
      setNoiDung((prev) => prev.replace(regex, thayBang));
    } else {
      setPhanCanh((prev) =>
        prev.map((c) => ({
          ...c,
          loiThoai: c.loiThoai.replace(regex, thayBang),
          hinhAnh: c.hinhAnh.replace(regex, thayBang),
        })),
      );
    }
  }

  // Tinh tong thoi luong video
  const tongGiayVideo = phanCanh.reduce((acc, c) => acc + (Number(c.thoiLuongGiay) || 0), 0);

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

      {/* Bố cục 2 cột Studio thoáng đãng */}
      <div className="bien-soan-layout">
        {/* CỘT TRÁI: THIẾT LẬP VÀ ĐẦU VÀO */}
        <div className="bien-soan-panel">
          <div className="bien-soan-panel__head">
            <h2 className="bien-soan-panel__title">
              <span className="bien-soan-badge-step">1</span>
              Ý tưởng &amp; Định dạng
            </h2>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Chọn định dạng đầu ra</span>
          </div>

          {/* Chọn định dạng đầu ra (Bài viết vs Kịch bản Video) */}
          <div className="format-mode-nav" role="tablist">
            <button
              type="button"
              className={`format-mode-btn ${dinhDang === 'bai_viet' ? 'format-mode-btn--active' : ''}`}
              onClick={() => setDinhDang('bai_viet')}
            >
              <Icon name="i-text" size={15} />
              <span>Bài viết (Post/Caption)</span>
            </button>
            <button
              type="button"
              className={`format-mode-btn ${dinhDang === 'kich_ban' ? 'format-mode-btn--active' : ''}`}
              onClick={() => {
                setDinhDang('kich_ban');
                if (beMat !== 'tiktok') setBeMat('tiktok');
              }}
            >
              <Icon name="i-film" size={15} />
              <span>Kịch bản Video</span>
            </button>
          </div>

          {/* Thẻ ngữ cảnh ý tưởng gốc từ Mốc 1 (nếu có) */}
          {ideaId && (
            <div className="idea-context-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--brand-600)' }}>
                  💡 Ý tưởng đã chọn
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

          {/* Chọn bề mặt (Platform Tabs ngang thanh thoát) */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Bề mặt đăng bài mục tiêu</span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 400 }}>
                Chuẩn: <b>{DANH_SACH_BE_MAT.find((b) => b.id === beMat)?.khoangTu}</b>
              </span>
            </label>

            <div className="be-mat-tabs">
              {DANH_SACH_BE_MAT.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBeMat(b.id)}
                  className={`be-mat-tab ${beMat === b.id ? 'be-mat-tab--active' : ''}`}
                >
                  <Icon name={b.icon} size={15} />
                  <span className="be-mat-tab__ten">{b.ten.replace(' Facebook', '').replace(' Short Video', '')}</span>
                  <span className="be-mat-tab__badge">{b.khoangTu}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nhập Tiêu đề */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Chủ đề / Tiêu đề ý tưởng *</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={tieuDe}
              onChange={(e) => setTieuDe(e.target.value)}
              placeholder="VD: Bí quyết quay video triệu view bằng điện thoại..."
              style={{ width: '100%', resize: 'vertical', minHeight: 64, lineHeight: 1.5 }}
            />
          </div>

          {/* Nhập Góc tiếp cận */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Góc tiếp cận (Tùy chọn)</span>
            </label>
            <textarea
              className="input"
              rows={2}
              value={gocTiepCan}
              onChange={(e) => setGocTiepCan(e.target.value)}
              placeholder="VD: Đứng ở góc nhìn người mới bắt đầu, ngân sách 0đ..."
              style={{ width: '100%', resize: 'vertical', minHeight: 60, lineHeight: 1.5 }}
            />
          </div>

          {/* Nhập Câu mở đầu / Hook */}
          <div className="form-field">
            <label className="form-field__label">
              <span>Câu mở đầu / Hook gợi ý (Tùy chọn)</span>
            </label>
            <textarea
              className="input"
              rows={3}
              value={cauMoDau}
              onChange={(e) => setCauMoDau(e.target.value)}
              placeholder="VD: Đừng vội mua máy quay đắt tiền nếu bạn chưa biết điều này..."
              style={{ width: '100%', resize: 'vertical', minHeight: 76, lineHeight: 1.5 }}
            />
          </div>

          {/* Tùy chỉnh theo định dạng (Ép độ dài từ HOẶC Thời lượng video) */}
          {dinhDang === 'bai_viet' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--surface-2)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Ép độ dài cố định</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>Để trống = theo chuẩn bề mặt</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number"
                  className="input"
                  value={epDoDai}
                  onChange={(e) => setEpDoDai(e.target.value)}
                  placeholder="Số từ..."
                  style={{ width: 100, padding: '6px 10px', fontSize: 13, textAlign: 'center' }}
                />
                <span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500 }}>từ</span>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--surface-2)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Thời lượng mục tiêu</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>Khoảng 20–60 giây</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <select
                  className="input"
                  value={thoiLuongVideo}
                  onChange={(e) => setThoiLuongVideo(Number(e.target.value))}
                  style={{ padding: '6px 12px', fontSize: 13 }}
                >
                  <option value={30}>30 giây (Ngắn)</option>
                  <option value={45}>45 giây (Chuẩn TikTok)</option>
                  <option value={60}>60 giây (Chuyên sâu)</option>
                </select>
              </div>
            </div>
          )}

          {/* CTA Button Sinh bài */}
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSinhBai}
            disabled={dangSinh}
            style={{
              padding: '13px 20px',
              fontSize: 14.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
              boxShadow: 'var(--shadow-brand)',
            }}
          >
            <Icon name={dinhDang === 'kich_ban' ? '' : 'i-sparkle'} size={16} />
            {dangSinh
              ? dinhDang === 'kich_ban'
                ? 'Đang viết kịch bản phân cảnh...'
                : 'Đang soạn bài theo giọng thương hiệu...'
              : dinhDang === 'kich_ban'
                ? '🎬 Sinh kịch bản video phân cảnh'
                : 'Sinh bài viết hoàn chỉnh'}
          </button>
        </div>

        {/* CỘT PHẢI: TRÌNH SOẠN THẢO VÀ THANH CÔNG CỤ THÔNG MINH */}
        <div className="bien-soan-panel" style={{ minHeight: 640 }}>
          <div className="bien-soan-panel__head">
            <h2 className="bien-soan-panel__title">
              <span className="bien-soan-badge-step" style={{ background: 'var(--ink-2)' }}>2</span>
              {dinhDang === 'kich_ban' ? 'Phòng Storyboard phân cảnh' : 'Trình soạn thảo & Kiểm duyệt'}
            </h2>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              {dinhDang === 'kich_ban' ? 'Phân cảnh chi tiết' : 'Tự do chỉnh sửa trực tiếp'}
            </span>
          </div>

          {/* NỘI DUNG CHẾ ĐỘ KỊCH BẢN VIDEO (MỐC 3) */}
          {dinhDang === 'kich_ban' ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="storyboard-summary-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="i-film" size={17} />
                  <span>Tổng thời lượng: <strong>{tongGiayVideo} giây</strong> · <strong>{phanCanh.length} phân cảnh</strong></span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="editor-btn"
                    onClick={handleThemPhanCanh}
                    title="Thêm cảnh mới vào cuối kịch bản"
                  >
                    <Icon name="i-plus" size={13} /> Thêm cảnh
                  </button>
                  <button
                    type="button"
                    className="editor-btn"
                    onClick={handleSaoChepKichBan}
                    disabled={phanCanh.length === 0}
                    title="Sao chép kịch bản đầy đủ"
                  >
                    <Icon name={daCopy ? 'i-check' : 'i-copy'} size={13} />
                    {daCopy ? 'Đã sao chép!' : 'Sao chép kịch bản'}
                  </button>
                </div>
              </div>

              {phanCanh.length === 0 ? (
                <div
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    border: '1.5px dashed var(--line)',
                    borderRadius: 'var(--r-lg)',
                    background: 'var(--surface-2)',
                    color: 'var(--ink-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    margin: 'auto 0',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--brand-050)',
                      color: 'var(--brand-600)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icon name="i-film" size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
                      Chưa có kịch bản video nào
                    </h3>
                    <p style={{ fontSize: 13, maxWidth: 360 }}>
                      Nhập tiêu đề ý tưởng ở cột bên trái và bấm <strong>&ldquo;Sinh kịch bản video phân cảnh&rdquo;</strong> để AI tự động xây dựng kịch bản chi tiết.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="storyboard-timeline">
                  {phanCanh.map((c, idx) => (
                    <article key={idx} className="scene-card">
                      <div className="scene-card__head">
                        <span className="scene-card__badge">
                          Cảnh {idx + 1} {idx === 0 ? '(Hook 1-3s)' : idx === phanCanh.length - 1 ? '(Kêu gọi - CTA)' : ''}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="scene-card__duration-ctrl">
                            <span>Thời lượng:</span>
                            <input
                              type="number"
                              className="input"
                              min={1}
                              max={30}
                              value={c.thoiLuongGiay}
                              onChange={(e) =>
                                handleCapNhatPhanCanh(idx, 'thoiLuongGiay', Number(e.target.value) || 1)
                              }
                              style={{ width: 54, padding: '3px 6px', textAlign: 'center', fontSize: 12 }}
                            />
                            <span>giây</span>
                          </div>

                          <button
                            type="button"
                            className="editor-btn"
                            onClick={() => handleXoaPhanCanh(idx)}
                            title="Xóa phân cảnh này"
                            style={{ color: '#dc2626' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="scene-card__grid">
                        <div>
                          <label className="scene-field-label">
                            <Icon name="i-eye" size={13} />
                            Mô tả hình ảnh, góc máy &amp; diễn xuất
                          </label>
                          <textarea
                            className="input"
                            rows={3}
                            value={c.hinhAnh}
                            onChange={(e) => handleCapNhatPhanCanh(idx, 'hinhAnh', e.target.value)}
                            placeholder="Góc máy (Cận cảnh, POV...), hành động của nhân vật, text overlay..."
                            style={{ width: '100%', resize: 'vertical', fontSize: 13, lineHeight: 1.5 }}
                          />
                        </div>

                        <div>
                          <label className="scene-field-label">
                            <Icon name="i-text" size={13} />
                            Lời thoại / Âm thanh / Voiceover
                          </label>
                          <textarea
                            className="input"
                            rows={3}
                            value={c.loiThoai}
                            onChange={(e) => handleCapNhatPhanCanh(idx, 'loiThoai', e.target.value)}
                            placeholder="Lời nhân vật nói trực tiếp hoặc giọng đọc lồng tiếng..."
                            style={{ width: '100%', resize: 'vertical', fontSize: 13, lineHeight: 1.5 }}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* NỘI DUNG CHẾ ĐỘ BÀI VIẾT THƯỜNG (CAPTION) */
            <>
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
                    className={`length-meter-fill ${doDai.dat
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
                    Văn bản bài đăng ({DANH_SACH_BE_MAT.find((b) => b.id === beMat)?.ten})
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
            </>
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
              Trạng thái: <b>{dinhDang === 'kich_ban' ? (phanCanh.length > 0 ? 'Đã có phân cảnh' : 'Trống') : noiDung.trim() ? 'Chưa lưu thay đổi' : 'Trống'}</b>
            </span>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => handleLuuBai('ban_nhap')}
                disabled={dangLuu || (dinhDang === 'kich_ban' ? phanCanh.length === 0 : !noiDung.trim())}
              >
                <Icon name="i-folder" size={14} />
                {dangLuu ? 'Đang lưu...' : 'Lưu bản nháp'}
              </button>

              <button
                type="button"
                className="btn btn--sm btn--primary"
                onClick={() => handleLuuBai('san_sang')}
                disabled={dangLuu || (dinhDang === 'kich_ban' ? phanCanh.length === 0 : !noiDung.trim())}
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

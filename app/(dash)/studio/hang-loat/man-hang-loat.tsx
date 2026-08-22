'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';

import { Icon } from '@/app/sprite-icon';
import type { KetQuaMucHangLoat, MucYTuongHangLoat } from '@/lib/studio/hang-loat';
import type { BeMat } from '@/lib/studio/kieu';

import {
  luuHangLoatAction,
  sinhHangLoatAction,
  type YTuongChuaDung,
} from './actions';

type Props = {
  dsYTuongBanDau: YTuongChuaDung[];
};

type CheDoNhap = 'y_tuong_co_san' | 'nhap_nhanh';

const DANH_SACH_BE_MAT: { id: BeMat; ten: string; icon: string }[] = [
  { id: 'fanpage', ten: 'Fanpage Facebook', icon: 'i-card' },
  { id: 'tiktok', ten: 'TikTok Video', icon: 'i-film' },
  { id: 'ho_so_ca_nhan', ten: 'Trang cá nhân', icon: 'i-person' },
  { id: 'zalo', ten: 'Zalo', icon: 'i-text' },
];

export function ManHangLoat({ dsYTuongBanDau }: Props) {
  const [cheDo, setCheDo] = useState<CheDoNhap>(
    dsYTuongBanDau.length > 0 ? 'y_tuong_co_san' : 'nhap_nhanh',
  );
  const [dinhDangChung, setDinhDangChung] = useState<'bai_viet' | 'kich_ban'>('bai_viet');
  const [beMatGhiDe, setBeMatGhiDe] = useState<BeMat | 'tu_dong'>('tu_dong');
  const [luuTuDong, setLuuTuDong] = useState<boolean>(false);

  // Danh sach y tuong duoc chon tu DB
  const [idDaChon, setIdDaChon] = useState<Set<string>>(
    new Set(dsYTuongBanDau.slice(0, 5).map((y) => y.id)),
  );

  // Nhap nhanh bang text nhieu dong
  const [vanBanNhanh, setVanBanNhanh] = useState<string>(
    'Bí quyết tiết kiệm 50% chi phí vận hành cửa hàng\n3 sai lầm khiến video TikTok không cắn đề xuất\nCách chăm sóc khách hàng cũ quay lại mua lần 2\nLàm sao để chốt đơn Zalo không bị khách seen bỏ đi\nQuy trình đóng gói 100 đơn/ngày cho shop nhỏ',
  );

  const [dangSinh, startSinhTransition] = useTransition();
  const [dangLuu, startLuuTransition] = useTransition();
  const [loi, setLoi] = useState<string | null>(null);
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [daCopyTatCa, setDaCopyTatCa] = useState<boolean>(false);

  const [ketQua, setKetQua] = useState<KetQuaMucHangLoat[]>([]);

  // Tinh tong so muc can sinh
  const soLuongDuKien =
    cheDo === 'y_tuong_co_san'
      ? idDaChon.size
      : vanBanNhanh
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean).length;

  function handleChonTatCa(soLuong?: number) {
    if (soLuong) {
      const topN = dsYTuongBanDau.slice(0, soLuong).map((y) => y.id);
      setIdDaChon(new Set(topN));
    } else {
      if (idDaChon.size === dsYTuongBanDau.length) {
        setIdDaChon(new Set());
      } else {
        setIdDaChon(new Set(dsYTuongBanDau.map((y) => y.id)));
      }
    }
  }

  function handleToggleChon(id: string) {
    setIdDaChon((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSinhHangLoat() {
    let danhSachMuc: MucYTuongHangLoat[] = [];

    if (cheDo === 'y_tuong_co_san') {
      const cacYTuong = dsYTuongBanDau.filter((y) => idDaChon.has(y.id));
      if (cacYTuong.length === 0) {
        setLoi('Vui lòng chọn ít nhất 1 ý tưởng để sinh bài.');
        return;
      }

      danhSachMuc = cacYTuong.map((y) => ({
        id: y.id,
        tieuDe: y.cauMoDau || y.gocTiepCan || 'Ý tưởng nội dung',
        beMat: beMatGhiDe === 'tu_dong' ? y.beMat : beMatGhiDe,
        gocTiepCan: y.gocTiepCan,
        cauMoDau: y.cauMoDau,
        ideaId: y.id,
        dinhDang: dinhDangChung,
      }));
    } else {
      const lines = vanBanNhanh
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        setLoi('Vui lòng nhập danh sách chủ đề (mỗi dòng một chủ đề).');
        return;
      }

      danhSachMuc = lines.map((line, idx) => ({
        id: `nhanh-${idx + 1}-${Date.now()}`,
        tieuDe: line,
        beMat: beMatGhiDe === 'tu_dong' ? 'fanpage' : beMatGhiDe,
        dinhDang: dinhDangChung,
      }));
    }

    setLoi(null);
    setThongBao(null);

    startSinhTransition(async () => {
      const res = await sinhHangLoatAction({
        danhSach: danhSachMuc,
        luuNgay: luuTuDong,
        trangThaiLuu: 'ban_nhap',
      });

      if (res.trangThai === 'loi' || !res.ketQua) {
        setLoi(res.loi ?? 'Có lỗi xảy ra khi sinh hàng loạt.');
        if (res.ketQua) setKetQua(res.ketQua);
      } else {
        setKetQua(res.ketQua);
        const soOk = res.ketQua.filter((k) => k.trangThai === 'thanh_cong').length;
        setThongBao(
          `🎉 Đã sinh thành công ${soOk}/${res.ketQua.length} bài viết! ${luuTuDong ? 'Đã tự động lưu vào kho bản nháp.' : 'Hãy xem lại và lưu bên dưới.'
          }`,
        );
      }
    });
  }

  function handleCapNhatNoiDungItem(id: string, noiDungMoi: string) {
    setKetQua((prev) =>
      prev.map((item) => (item.id === id ? { ...item, noiDung: noiDungMoi } : item)),
    );
  }

  function handleLuuTatCa(trangThai: 'ban_nhap' | 'san_sang') {
    const cacBaiHopLe = ketQua.filter((k) => k.trangThai === 'thanh_cong' && k.noiDung.trim());
    if (cacBaiHopLe.length === 0) {
      setLoi('Chưa có bài viết hợp lệ nào để lưu.');
      return;
    }

    setLoi(null);
    startLuuTransition(async () => {
      const payload = cacBaiHopLe.map((b) => ({
        tieuDe: b.tieuDe,
        noiDung: b.noiDung,
        beMat: b.beMat,
        dinhDang: b.dinhDang,
        trangThai,
      }));

      const res = await luuHangLoatAction(payload);
      if (res.ok) {
        setThongBao(
          `✅ Đã lưu ${res.soLuongLuu} bài vào kho với trạng thái "${trangThai === 'san_sang' ? 'Sẵn sàng đăng' : 'Bản nháp'
          }"!`,
        );
      } else {
        setLoi(`Lỗi khi lưu: ${res.loi}`);
      }
    });
  }

  function handleSaoChepTatCa() {
    if (ketQua.length === 0) return;
    const textAll = ketQua
      .filter((k) => k.trangThai === 'thanh_cong')
      .map(
        (k, idx) =>
          `========================================\nBÀI ${idx + 1}: ${k.tieuDe.toUpperCase()}\nBỀ MẶT: ${k.beMat} | ĐỊNH DẠNG: ${k.dinhDang}\n========================================\n\n${k.noiDung}\n\n${k.hashtag ? k.hashtag.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ') : ''}`,
      )
      .join('\n\n\n');

    navigator.clipboard.writeText(textAll);
    setDaCopyTatCa(true);
    setTimeout(() => setDaCopyTatCa(false), 2500);
  }

  function handleTaiFileMarkdown() {
    if (ketQua.length === 0) return;
    const textAll = ketQua
      .filter((k) => k.trangThai === 'thanh_cong')
      .map(
        (k, idx) =>
          `# Bài ${idx + 1}: ${k.tieuDe}\n- **Bề mặt:** ${k.beMat}\n- **Định dạng:** ${k.dinhDang}\n- **Số từ:** ${k.soTu}\n\n${k.noiDung}\n\n${k.hashtag ? k.hashtag.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ') : ''}`,
      )
      .join('\n\n---\n\n');

    const blob = new Blob([textAll], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aicontent-hang-loat-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Thong ke ket qua
  const tongSoBaiThanhCong = ketQua.filter((k) => k.trangThai === 'thanh_cong').length;
  const tongSoTu = ketQua.reduce((acc, k) => acc + (k.soTu || 0), 0);
  const tongViPham = ketQua.reduce((acc, k) => acc + (k.viPhamNgonNgu?.length || 0), 0);

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

      {/* Bố cục 2 cột: Cấu hình hàng loạt vs Bảng kết quả */}
      <div className="bulk-layout">
        {/* CỘT TRÁI: CẤU HÌNH & CHỌN Ý TƯỞNG */}
        <div className="bulk-config-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
              1. Cấu hình đợt sinh
            </h2>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-600)', background: 'var(--brand-050)', padding: '2px 8px', borderRadius: 'var(--r-pill)' }}>
              Mục tiêu: {soLuongDuKien} bài
            </span>
          </div>

          {/* Chọn phương thức nạp ý tưởng */}
          <div className="format-mode-nav">
            <button
              type="button"
              className={`format-mode-btn ${cheDo === 'y_tuong_co_san' ? 'format-mode-btn--active' : ''}`}
              onClick={() => setCheDo('y_tuong_co_san')}
            >
              <Icon name="i-pillars" size={14} />
              <span>Từ ý tưởng đã lưu ({dsYTuongBanDau.length})</span>
            </button>
            <button
              type="button"
              className={`format-mode-btn ${cheDo === 'nhap_nhanh' ? 'format-mode-btn--active' : ''}`}
              onClick={() => setCheDo('nhap_nhanh')}
            >
              <Icon name="i-text" size={14} />
              <span>Nhập nhanh (List)</span>
            </button>
          </div>

          {/* Nội dung theo từng chế độ */}
          {cheDo === 'y_tuong_co_san' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--ink-2)' }}>Đã chọn <b>{idDaChon.size}</b> ý tưởng</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn--sm"
                    style={{ padding: '2px 8px', fontSize: 11.5 }}
                    onClick={() => handleChonTatCa(5)}
                  >
                    5 bài
                  </button>
                  <button
                    type="button"
                    className="btn btn--sm"
                    style={{ padding: '2px 8px', fontSize: 11.5 }}
                    onClick={() => handleChonTatCa(10)}
                  >
                    10 bài
                  </button>
                  <button
                    type="button"
                    className="btn btn--sm"
                    style={{ padding: '2px 8px', fontSize: 11.5 }}
                    onClick={() => handleChonTatCa()}
                  >
                    {idDaChon.size === dsYTuongBanDau.length ? 'Bỏ chọn' : 'Tất cả'}
                  </button>
                </div>
              </div>

              {dsYTuongBanDau.length === 0 ? (
                <div style={{ padding: '20px 14px', textAlign: 'center', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 12.5, color: 'var(--ink-2)' }}>
                  Chưa có ý tưởng nào được lưu. Hãy sang <Link href="/studio/de-xuat" style={{ color: 'var(--brand-600)', fontWeight: 600 }}>Đề xuất ý tưởng</Link> để sinh trước hoặc dùng tab &ldquo;Nhập nhanh&rdquo;.
                </div>
              ) : (
                <div className="bulk-idea-selector">
                  {dsYTuongBanDau.map((y) => {
                    const selected = idDaChon.has(y.id);
                    return (
                      <div
                        key={y.id}
                        className={`bulk-idea-item ${selected ? 'bulk-idea-item--selected' : ''}`}
                        onClick={() => handleToggleChon(y.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => { }}
                          style={{ marginTop: 2, cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                            {y.cauMoDau || y.gocTiepCan || 'Ý tưởng không có tiêu đề'}
                          </span>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 11 }}>
                            <span style={{ color: 'var(--brand-700)', background: 'var(--brand-100)', padding: '1px 6px', borderRadius: 'var(--r-pill)' }}>
                              {y.beMat}
                            </span>
                            {y.tenTruCot && (
                              <span style={{ color: 'var(--ink-2)', background: 'var(--line)', padding: '1px 6px', borderRadius: 'var(--r-pill)' }}>
                                {y.tenTruCot}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>
                Danh sách chủ đề (Mỗi dòng 1 bài):
              </label>
              <textarea
                className="input"
                rows={8}
                value={vanBanNhanh}
                onChange={(e) => setVanBanNhanh(e.target.value)}
                placeholder="Nhập mỗi tiêu đề hoặc chủ đề trên 1 dòng..."
                style={{ width: '100%', fontSize: 12.5, lineHeight: 1.6, resize: 'vertical' }}
              />
              <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
                Nhận diện được <b>{soLuongDuKien}</b> chủ đề hợp lệ.
              </span>
            </div>
          )}

          {/* Tùy chọn định dạng & Bề mặt */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            <div className="form-field">
              <label className="form-field__label">
                <span>Định dạng đầu ra</span>
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className={`btn btn--sm ${dinhDangChung === 'bai_viet' ? 'btn--primary' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setDinhDangChung('bai_viet')}
                >
                  <Icon name="i-text" size={13} /> Bài viết (Post)
                </button>
                <button
                  type="button"
                  className={`btn btn--sm ${dinhDangChung === 'kich_ban' ? 'btn--primary' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setDinhDangChung('kich_ban')}
                >
                  <Icon name="i-film" size={13} /> Kịch bản Video
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label">
                <span>Bề mặt mục tiêu</span>
              </label>
              <select
                className="input"
                value={beMatGhiDe}
                onChange={(e) => setBeMatGhiDe(e.target.value as any)}
                style={{ fontSize: 13 }}
              >
                <option value="tu_dong">⚡ Tự động theo từng ý tưởng</option>
                {DANH_SACH_BE_MAT.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.ten}
                  </option>
                ))}
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, cursor: 'pointer', color: 'var(--ink)' }}>
              <input
                type="checkbox"
                checked={luuTuDong}
                onChange={(e) => setLuuTuDong(e.target.checked)}
              />
              <span>Tự động lưu vào Bản nháp sau khi sinh</span>
            </label>
          </div>

          {/* CTA Button Sinh hàng loạt */}
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSinhHangLoat}
            disabled={dangSinh || soLuongDuKien === 0}
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
              ? `Đang sinh đồng thời ${soLuongDuKien} bài...`
              : `Sinh ${soLuongDuKien} bài hàng loạt`}
          </button>
        </div>

        {/* CỘT PHẢI: KẾT QUẢ ĐỢT SINH HÀNG LOẠT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Thanh thống kê đợt sinh */}
          <div className="bulk-stat-grid">
            <div className="bulk-stat-pill">
              <div className="bulk-stat-icon">
                <Icon name="i-copy" size={18} />
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500 }}>Đã hoàn thành</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                  {tongSoBaiThanhCong} / {ketQua.length > 0 ? ketQua.length : soLuongDuKien} bài
                </div>
              </div>
            </div>

            <div className="bulk-stat-pill">
              <div className="bulk-stat-icon">
                <Icon name="i-text" size={18} />
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500 }}>Tổng số từ</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                  {tongSoTu.toLocaleString()} từ
                </div>
              </div>
            </div>

            <div className="bulk-stat-pill">
              <div className="bulk-stat-icon" style={{ color: tongViPham > 0 ? '#dc2626' : '#059669', background: tongViPham > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)' }}>
                <Icon name={tongViPham > 0 ? 'i-alert' : 'i-check'} size={18} />
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500 }}>Chuẩn Brand Bible</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: tongViPham > 0 ? '#dc2626' : '#059669' }}>
                  {tongViPham > 0 ? `${tongViPham} từ cấm` : '100% Đạt'}
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách thẻ bài viết kết quả */}
          {ketQua.length === 0 ? (
            <div
              style={{
                padding: '60px 24px',
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
                <Icon name="i-copy" size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                  Chưa có đợt sinh hàng loạt nào
                </h3>
                <p style={{ fontSize: 13.5, maxWidth: 420 }}>
                  Chọn các ý tưởng ở cột bên trái và bấm <strong>&ldquo;Sinh hàng loạt&rdquo;</strong> để tạo đồng thời 5–10 bài viết phục vụ mục tiêu đăng bài hàng ngày.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Thanh thao tác hàng loạt */}
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
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                  Đã sinh xong <strong>{tongSoBaiThanhCong}</strong> bài viết hoàn chỉnh
                </span>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={handleSaoChepTatCa}
                    title="Sao chép toàn bộ nội dung"
                  >
                    <Icon name={daCopyTatCa ? 'i-check' : 'i-copy'} size={13} />
                    {daCopyTatCa ? 'Đã sao chép tất cả!' : 'Sao chép tất cả'}
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
                    onClick={() => handleLuuTatCa('ban_nhap')}
                    disabled={dangLuu || tongSoBaiThanhCong === 0}
                  >
                    <Icon name="i-folder" size={13} />
                    {dangLuu ? 'Đang lưu...' : 'Lưu tất cả vào Bản nháp'}
                  </button>

                  <button
                    type="button"
                    className="btn btn--sm btn--primary"
                    onClick={() => handleLuuTatCa('san_sang')}
                    disabled={dangLuu || tongSoBaiThanhCong === 0}
                  >
                    <Icon name="i-check" size={13} />
                    Sẵn sàng đăng tất cả
                  </button>
                </div>
              </div>

              {/* Grid các thẻ bài viết */}
              <div className="bulk-results-grid">
                {ketQua.map((item, idx) => (
                  <article key={item.id || idx} className="bulk-result-card">
                    <div className="bulk-result-card__header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: 'var(--brand-100)',
                            color: 'var(--brand-700)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                          {item.tieuDe}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="ytuong-tag ytuong-tag--trucot" style={{ fontSize: 11 }}>
                          {item.beMat}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--r-pill)',
                            background:
                              item.trangThai === 'thanh_cong'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(239, 68, 68, 0.12)',
                            color: item.trangThai === 'thanh_cong' ? '#059669' : '#dc2626',
                          }}
                        >
                          {item.trangThai === 'thanh_cong' ? `${item.soTu} từ` : 'Lỗi'}
                        </span>
                      </div>
                    </div>

                    {item.trangThai === 'thanh_cong' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <textarea
                          className="bulk-result-card__content"
                          value={item.noiDung}
                          onChange={(e) => handleCapNhatNoiDungItem(item.id, e.target.value)}
                          rows={6}
                        />

                        {item.hashtag && item.hashtag.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {item.hashtag.map((tag, tIdx) => (
                              <span key={tIdx} className="hashtag-pill" style={{ fontSize: 11 }}>
                                #{tag.replace(/^#/, '')}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.viPhamNgonNgu && item.viPhamNgonNgu.length > 0 && (
                          <div style={{ fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon name="i-alert" size={13} />
                            <span>Có {item.viPhamNgonNgu.length} từ cấm kỵ thương hiệu cần xem lại.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#dc2626', fontSize: 13, background: 'rgba(239,68,68,0.06)', padding: 12, borderRadius: 'var(--r-md)' }}>
                        ⚠️ {item.loi ?? 'Không thể sinh bài viết này.'}
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

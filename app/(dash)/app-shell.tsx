'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '../sprite-icon';
import { dangXuatAction } from './dang-xuat-action';
import './app-shell.css';

type Theme = 'light' | 'dark';

type UserInfo = {
  name: string;
  email: string;
  image?: string | null;
};

type AppShellProps = {
  children: React.ReactNode;
  user?: UserInfo;
  soDuCredit?: number;
  tongCredit?: number;
  tenWorkspace?: string;
};

export function AppShell({
  children,
  user,
  soDuCredit = 1500,
  tongCredit = 1500,
  tenWorkspace = 'Khuong DEMO STUDIO',
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  // Khởi tạo 'light' cho khớp HTML server dựng ra; giá trị thật do script trong
  // <head> đặt lên <html data-theme> trước khi hydrate, đọc lại ở effect dưới.
  const [theme, setTheme] = useState<Theme>('light');

  const avatarLetters = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AI';

  const phanTramCredit = Math.min(100, Math.max(0, Math.round((soDuCredit / tongCredit) * 100)));

  function isActive(href: string) {
    if (!pathname || href === '#' || href === '') return false;
    if (pathname === href) return true;
    if (href !== '/' && href !== '/brand' && href !== '/studio' && pathname.startsWith(href)) return true;
    return false;
  }

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem('aicontent-theme', next);
    } catch {
      // Chế độ riêng tư chặn localStorage — vẫn đổi được theme cho phiên hiện tại.
    }
  }

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="app" data-drawer={drawerOpen ? 'open' : 'closed'}>
      <aside className="sidebar" id="sidebar">
        <div className="biz">
          <div className="biz__mark" aria-hidden="true">
            {tenWorkspace.slice(0, 2).toUpperCase()}
          </div>
          <div className="biz__text">
            <div className="biz__eyebrow">Kênh đang quản lý</div>
            <div className="biz__name">{tenWorkspace}</div>
          </div>
          <button className="icon-btn" type="button" aria-label="Đổi kênh"><Icon name="i-chevron" size={18} /></button>
          <button className="icon-btn" type="button" aria-label="Cài đặt kênh"><Icon name="i-gear" size={18} /></button>
        </div>

        <nav className="nav" aria-label="Điều hướng chính">
          <p className="nav__group">Hồ sơ kênh</p>
          <Link className="nav__link" href="/brand" aria-current={pathname === '/brand' ? 'page' : undefined}><Icon name="i-layers" size={18} />Tổng quan hồ sơ</Link>
          <Link className="nav__link" href="/brand/chan-dung" aria-current={isActive('/brand/chan-dung') ? 'page' : undefined}><Icon name="i-person" size={18} />Chân dung khách hàng</Link>
          <Link className="nav__link" href="/brand/san-pham" aria-current={isActive('/brand/san-pham') ? 'page' : undefined}><Icon name="i-box" size={18} />Sản phẩm &amp; dịch vụ</Link>
          <Link className="nav__link" href="/brand/tru-cot" aria-current={isActive('/brand/tru-cot') ? 'page' : undefined}><Icon name="i-pillars" size={18} />Trụ cột nội dung</Link>
          <Link className="nav__link" href="/brand/insight" aria-current={isActive('/brand/insight') ? 'page' : undefined}><Icon name="i-sparkle" size={18} />Insight</Link>
          <Link className="nav__link" href="/brand/giong-dieu" aria-current={isActive('/brand/giong-dieu') ? 'page' : undefined}><Icon name="i-text" size={18} />Giọng điệu &amp; cấm kỵ</Link>

          <p className="nav__group">Nội dung</p>
          <Link className="nav__link" href="/studio/de-xuat" aria-current={isActive('/studio/de-xuat') ? 'page' : undefined}><Icon name="i-sparkle" size={18} />Đề xuất hôm nay</Link>
          <Link className="nav__link" href="/studio/bien-soan" aria-current={isActive('/studio/bien-soan') ? 'page' : undefined}><Icon name="i-text" size={18} />Biên soạn</Link>
          <Link className="nav__link" href="/studio/chuoi-bai" aria-current={isActive('/studio/chuoi-bai') ? 'page' : undefined}><Icon name="i-layers" size={18} />Chuỗi bài</Link>
          <Link className="nav__link" href="/studio/hang-loat" aria-current={isActive('/studio/hang-loat') ? 'page' : undefined}><Icon name="i-copy" size={18} />Sinh hàng loạt</Link>
          <Link className="nav__link" href="/studio/so-giong" aria-current={isActive('/studio/so-giong') ? 'page' : undefined}><Icon name="i-eye" size={18} />So 4 giọng</Link>
          <Link className="nav__link" href="/templates" aria-current={isActive('/templates') ? 'page' : undefined}><Icon name="i-file" size={18} />Mẫu nội dung</Link>
          <a className="nav__link" href="#"><Icon name="i-folder" size={18} />Bài đã tạo</a>
          <Link className="nav__link" href="/bai-da-dang" aria-current={isActive('/bai-da-dang') ? 'page' : undefined}><Icon name="i-file" size={18} />Bài đã đăng</Link>
          <Link className="nav__link" href="/kenh-ngoai" aria-current={isActive('/kenh-ngoai') ? 'page' : undefined}><Icon name="i-trend" size={18} />Kênh ngoài kia</Link>
          <span className="nav__link nav__link--soon"><Icon name="i-calendar" size={18} />Lịch đăng<span className="nav__soon">SẮP CÓ</span></span>

          <p className="nav__group">Khám phá</p>
          <a className="nav__link" href="#"><Icon name="i-trend" size={18} />Trend &amp; sự kiện</a>

          <p className="nav__group">Hệ thống</p>
          <Link className="nav__link" href="/cai-dat/kenh" aria-current={isActive('/cai-dat/kenh') ? 'page' : undefined}><Icon name="i-link" size={18} />Kết nối kênh</Link>
          <Link className="nav__link" href="/goi-cuoc" aria-current={isActive('/goi-cuoc') ? 'page' : undefined}><Icon name="i-card" size={18} />Gói cước</Link>
          <Link className="nav__link" href="/huong-dan" aria-current={isActive('/huong-dan') ? 'page' : undefined}><Icon name="i-help" size={18} />Hướng dẫn</Link>
        </nav>

        <div className="side-foot" style={{ position: 'relative' }}>
          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 12,
                right: 12,
                marginBottom: 8,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '6px',
                zIndex: 50,
              }}
            >
              <button
                type="button"
                onClick={async () => {
                  await dangXuatAction();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--clay)',
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '8px 12px',
                  borderRadius: 'var(--r-sm)',
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                ✕ Đăng xuất tài khoản
              </button>
            </div>
          )}

          <div className="user">
            <div className="user__avatar" aria-hidden="true">{avatarLetters}</div>
            <div className="user__text">
              <div className="user__name">{user?.name ?? 'Nhân sự nội dung'}</div>
              <div className="user__mail">{user?.email ?? 'seed@aicontent.local'}</div>
            </div>
            <button
              className="icon-btn"
              type="button"
              aria-label="Tuỳ chọn tài khoản"
              onClick={() => setUserMenuOpen((v) => !v)}
            >
              <Icon name="i-dots" size={18} />
            </button>
          </div>

          <Link href="/goi-cuoc" className="credit" style={{ textDecoration: 'none', display: 'block' }} title="Xem chi tiết gói cước và hạn ngạch">
            <div className="credit__row">
              <span className="credit__label">Tín dụng AI tháng này</span>
              <span className="credit__value"><b>{soDuCredit.toLocaleString('vi-VN')}</b>/{tongCredit.toLocaleString('vi-VN')}</span>
            </div>
            <div className="credit__bar"><div className="credit__fill" style={{ width: `${phanTramCredit}%` }} /></div>
          </Link>
        </div>
      </aside>

      <button className="scrim" type="button" aria-label="Đóng menu" tabIndex={-1} onClick={() => setDrawerOpen(false)} />

      <div className="main">
        <header className="topbar">
          <button
            className="icon-btn topbar__burger"
            type="button"
            aria-controls="sidebar"
            aria-expanded={drawerOpen}
            aria-label="Mở menu"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <Icon name="i-menu" size={20} />
          </button>

          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              <span>Bản v1 — module quét trend đang chạy thử, dữ liệu cập nhật 2 lần mỗi ngày. Mẫu mới cho nhóm kịch bản video sẽ bổ sung trong tuần này.</span>
              <span>Bản v1 — module quét trend đang chạy thử, dữ liệu cập nhật 2 lần mỗi ngày. Mẫu mới cho nhóm kịch bản video sẽ bổ sung trong tuần này.</span>
            </div>
          </div>

          <span className="chip-note"><Icon name="i-alert" size={14} />Bản v1 · đang hoàn thiện</span>
          <button className="icon-btn icon-btn--dot" type="button" aria-label="Thông báo"><Icon name="i-bell" size={19} /></button>
          <button
            className="icon-btn"
            type="button"
            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            onClick={toggleTheme}
          >
            <Icon name="i-moon" size={19} />
          </button>
        </header>

        <div className="notice">
          <div className="notice__text">
            <div className="notice__title">Gói dùng thử còn 5 ngày</div>
            <p className="notice__sub">Hết hạn thì đề xuất nội dung hằng ngày sẽ tạm dừng, mẫu đã lưu vẫn giữ nguyên.</p>
          </div>
          <Link className="btn btn--primary btn--sm" href="/goi-cuoc">Xem các gói</Link>
        </div>

        <main className="canvas">{children}</main>
      </div>
    </div>
  );
}

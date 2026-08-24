'use client';

import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLoginGoogle: () => Promise<void>;
};

export function AuthModal({ isOpen, onClose, onLoginGoogle }: Props) {
  const [dangXuLy, setDangXuLy] = useState(false);

  if (!isOpen) return null;

  async function handleGoogleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDangXuLy(true);
    try {
      await onLoginGoogle();
    } catch {
      setDangXuLy(false);
    }
  }

  return (
    <div
      className="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="auth-modal-card" role="dialog" aria-modal="true">
        {/* Nut dong popup */}
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ✕
        </button>

        <div className="auth-modal-head">
          <div className="lp-logo__mark" style={{ width: 44, height: 44, fontSize: 18, margin: '0 auto 12px' }}>
            Ai
          </div>
          <h3 className="auth-modal-title">Đăng nhập vào AI Content</h3>
          <p className="auth-modal-sub">
            Chọn tài khoản Google của bạn để truy cập không gian làm việc thương hiệu.
          </p>
        </div>

        {/* Form dang nhap Google */}
        <form onSubmit={handleGoogleSubmit} style={{ width: '100%' }}>
          <button
            type="submit"
            className="auth-modal-google-btn"
            disabled={dangXuLy}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l-.1.3 6.5 5 .5.1c4.1-3.8 6.6-9.5 6.6-15.7"
              />
              <path
                fill="#34A853"
                d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.8 1.3-4.3 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-.3.1-6.7 5.2-.1.3C7.9 40.9 15.4 46 24 46"
              />
              <path
                fill="#FBBC05"
                d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-.3l-6.8-5.3-.2.1a22 22 0 0 0 0 19.8z"
              />
              <path
                fill="#EA4335"
                d="M24 10.1c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.9 29.9 2 24 2 15.4 2 7.9 7.1 4.5 14.1l7 5.5C13.3 14.3 18.2 10.1 24 10.1"
              />
            </svg>
            <span>{dangXuLy ? 'Đang kết nối với Google...' : 'Tiếp tục với Google'}</span>
          </button>
        </form>

        <div className="auth-modal-divider">
          <span>hoặc trải nghiệm nhanh</span>
        </div>

        <a
          href="/api/dev-login"
          className="auth-modal-demo-btn"
        >
          ⚡ Vào thẳng chế độ Demo (Không cần tài khoản) →
        </a>

        <div className="auth-modal-footer">
          Đăng nhập mở tự do bằng Google · Tự động cấp 1.500 Tín dụng AI miễn phí mỗi tháng.
        </div>
      </div>
    </div>
  );
}

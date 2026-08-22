import type { Metadata } from 'next';
import Link from 'next/link';

import './home-page.css';

export const metadata: Metadata = {
  title: 'AI Content — Trợ lý sản xuất nội dung chuẩn chiến lược thương hiệu',
  description:
    'Hệ thống AI chuyên biệt giúp đội ngũ content xây dựng hồ sơ thương hiệu, đề xuất ý tưởng bài viết theo trụ cột nội dung, và biên soạn bài đăng đa nền tảng — tất cả trong một không gian làm việc duy nhất.',
};

export default function TrangChu() {
  return (
    <div className="lp">
      <div className="lp__inner">
        {/* ─── Header ─── */}
        <header className="lp-header">
          <span className="lp-logo">
            <span className="lp-logo__mark" aria-hidden="true">Ai</span>
            <span className="lp-logo__text">AI Content</span>
          </span>
          <div className="lp-header__actions">
            <Link className="lp-link" href="/dang-nhap">Đăng nhập</Link>
            <a className="hero__btn hero__btn--primary" href="/api/dev-login" style={{ padding: '9px 18px', fontSize: '13px' }}>
              Dùng thử ngay
            </a>
          </div>
        </header>

        {/* ─── Hero ─── */}
        <section className="hero">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Phiên bản v1 — đang vận hành
          </div>

          <h1 className="hero__title">
            Biến <em>chiến lược thương hiệu</em> thành bài đăng mỗi ngày — không cần nghĩ, không cần viết từ đầu
          </h1>

          <p className="hero__sub">
            Hệ thống AI chuyên biệt cho đội ngũ content: từ hồ sơ thương hiệu, phân bổ trụ cột nội dung, đến bài viết hoàn chỉnh cho từng nền tảng — tất cả được dẫn dắt bởi dữ liệu và chiến lược, không phải cảm tính.
          </p>

          <div className="hero__cta">
            <a className="hero__btn hero__btn--primary" href="/api/dev-login">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Trải nghiệm Demo ngay
            </a>
            <Link className="hero__btn hero__btn--ghost" href="/dang-nhap">
              Đăng nhập với Google
            </Link>
          </div>
          <p className="hero__note">Không cần đăng ký · Vào thẳng không gian làm việc có sẵn dữ liệu mẫu</p>
        </section>

        {/* ─── App Preview ─── */}
        <div className="preview">
          <div className="preview__bar">
            <span className="preview__dot" />
            <span className="preview__dot" />
            <span className="preview__dot" />
          </div>
          <div className="preview__body">
            <div className="preview__skeleton preview__skeleton--wide" />
            <div className="preview__skeleton preview__skeleton--mid" />
            <div className="preview__skeleton preview__skeleton--sm" />
            <div className="preview__card-row">
              <div className="preview__card" />
              <div className="preview__card" />
              <div className="preview__card" />
            </div>
          </div>
        </div>

        {/* ─── Features ─── */}
        <section className="features">
          <div className="section-head">
            <div className="section-head__label">Bộ công cụ lõi</div>
            <h2 className="section-head__title">Mọi thứ đội content cần, trong một nơi duy nhất</h2>
            <p className="section-head__sub">
              Không phải ChatGPT gõ prompt tay. Đây là hệ thống được thiết kế riêng cho quy trình sản xuất nội dung thương hiệu.
            </p>
          </div>

          <div className="feat-grid">
            <div className="feat">
              <div className="feat__icon feat__icon--orange" aria-hidden="true">🏢</div>
              <h3 className="feat__title">Hồ sơ thương hiệu chuẩn hóa</h3>
              <p className="feat__desc">
                Chân dung khách hàng, sản phẩm, trụ cột nội dung, insight, giọng điệu &amp; từ cấm kỵ — AI đọc hiểu toàn bộ trước khi viết bất kỳ dòng nào.
              </p>
            </div>

            <div className="feat">
              <div className="feat__icon feat__icon--sage" aria-hidden="true">🎯</div>
              <h3 className="feat__title">Đề xuất ý tưởng chuẩn chiến lược</h3>
              <p className="feat__desc">
                Thuật toán phân bổ theo trụ cột nội dung (quota 80/20), kết hợp tín hiệu xu hướng từ kênh đối thủ để đề xuất ý tưởng bài viết mỗi ngày — không bao giờ lệch hướng.
              </p>
            </div>

            <div className="feat">
              <div className="feat__icon feat__icon--plum" aria-hidden="true">✍️</div>
              <h3 className="feat__title">Biên soạn đa nền tảng</h3>
              <p className="feat__desc">
                Từ một ý tưởng, AI biên soạn thành bài hoàn chỉnh cho Facebook, TikTok, Instagram — đúng format, đúng giọng, đúng độ dài, tự động quét từ cấm kỵ trước khi xuất bản.
              </p>
            </div>

            <div className="feat">
              <div className="feat__icon feat__icon--clay" aria-hidden="true">📡</div>
              <h3 className="feat__title">Theo dõi &amp; bắt xu hướng</h3>
              <p className="feat__desc">
                Tự động cào bài viết từ Fanpage và TikTok đối thủ, phân tích lượt tương tác, trích xuất công thức Hook — biến trend của thị trường thành ý tưởng của riêng bạn.
              </p>
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section className="steps">
          <div className="section-head">
            <div className="section-head__label">Quy trình</div>
            <h2 className="section-head__title">3 bước, từ chiến lược đến bài đăng</h2>
          </div>

          <div className="step-grid">
            <div className="step">
              <div className="step__num">1</div>
              <h3 className="step__title">Xây hồ sơ thương hiệu</h3>
              <p className="step__desc">
                Nhập thông tin sản phẩm, chân dung khách hàng, insight — hệ thống tổng hợp thành Brand DNA để AI hiểu đúng ngữ cảnh kinh doanh.
              </p>
            </div>
            <div className="step">
              <div className="step__num">2</div>
              <h3 className="step__title">AI đề xuất ý tưởng mỗi ngày</h3>
              <p className="step__desc">
                Dựa trên trụ cột nội dung và quota phân bổ, AI tự động đề xuất ý tưởng bài viết — cân bằng giữa nội dung cốt lõi và khám phá xu hướng mới.
              </p>
            </div>
            <div className="step">
              <div className="step__num">3</div>
              <h3 className="step__title">Biên soạn &amp; xuất bản</h3>
              <p className="step__desc">
                Chọn ý tưởng, AI biên soạn thành bài viết hoàn chỉnh. Kiểm soát số từ, quét từ cấm kỵ, so sánh 4 phong cách giọng điệu — chọn bài tốt nhất, xuất bản.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="cta-banner">
          <h2 className="cta-banner__title">Sẵn sàng trải nghiệm?</h2>
          <p className="cta-banner__sub">
            Không cần đăng ký, không cần cấu hình. Bấm một nút để vào thẳng không gian làm việc thật với đầy đủ dữ liệu mẫu — tự do khám phá toàn bộ tính năng.
          </p>
          <a className="hero__btn hero__btn--primary" href="/api/dev-login">
            Trải nghiệm Demo ngay →
          </a>
        </section>

        {/* ─── Footer ─── */}
        <footer className="lp-footer">
          <span className="lp-footer__copy">© 2026 AI Content · Bài test kỹ thuật</span>
          <div className="lp-footer__links">
            <a className="lp-footer__link" href="https://github.com/phamkimkhuong/aicontent-test-phamkimkhuong" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

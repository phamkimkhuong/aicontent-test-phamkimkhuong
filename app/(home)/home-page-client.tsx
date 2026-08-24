'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { dangNhapGoogleAction } from './actions';
import { AuthModal } from './auth-modal';

export function TrangChuClient() {
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('login') === '1') {
      setModalOpen(true);
    }
  }, [searchParams]);

  async function handleLoginGoogle() {
    await dangNhapGoogleAction();
  }

  return (
    <div className="lp">
      <div className="lp__inner">
        {/* ─── Header ─── */}
        <header className="lp-header">
          <Link href="/" className="lp-logo">
            <span className="lp-logo__mark" aria-hidden="true">Ai</span>
            <span className="lp-logo__text">AI Content</span>
          </Link>

          <nav className="lp-header__nav">
            <a href="#loi-ich" className="lp-link">Lợi ích</a>
            <a href="#tinh-nang" className="lp-link">Tính năng</a>
            <a href="#so-sanh" className="lp-link">So sánh</a>
            <a href="#quy-trinh" className="lp-link">Quy trình</a>
            <Link href="/goi-cuoc" className="lp-link">Gói cước</Link>
          </nav>

          <div className="lp-header__actions">
            {/* Nút Đăng nhập mở trực tiếp Popup Google thay vì chuyển trang */}
            <button
              type="button"
              className="lp-link"
              onClick={() => setModalOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Đăng nhập
            </button>
            <a
              className="hero__btn hero__btn--primary"
              href="/api/dev-login"
              style={{ padding: '9px 18px', fontSize: '13px' }}
            >
              Dùng thử ngay
            </a>
          </div>
        </header>

        {/* ─── Hero ─── */}
        <section className="hero">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Giải pháp Content AI cho Chủ shop &amp; Doanh nghiệp vừa/nhỏ
          </div>

          <h1 className="hero__title">
            Đăng đều đặn <em>10 bài Facebook &amp; TikTok</em> mỗi ngày — Không tốn tiền thuê ngoài, không mất 2 tiếng bí ý tưởng
          </h1>

          <p className="hero__sub">
            Hệ thống AI chuyên biệt tự động đọc hiểu sản phẩm &amp; khách hàng của bạn, đề xuất ý tưởng hot trend mỗi sáng và biên soạn bài viết hoàn chỉnh chỉ trong 30 giây.
          </p>

          <div className="hero__cta">
            <button
              type="button"
              className="hero__btn hero__btn--primary"
              onClick={() => setModalOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Đăng nhập bằng Google
            </button>
            <a className="hero__btn hero__btn--ghost" href="/api/dev-login">
              ⚡ Trải nghiệm Demo ngay (Miễn phí)
            </a>
          </div>

          <div className="hero__trust-points">
            <span className="hero__trust-item">✓ Không cần thẻ tín dụng</span>
            <span className="hero__trust-item">✓ Dữ liệu mẫu sẵn sàng trải nghiệm</span>
            <span className="hero__trust-item">✓ Vào thẳng không gian làm việc thật</span>
          </div>
        </section>

        {/* ─── Key Metrics Bar ─── */}
        <div className="metrics-bar">
          <div className="metric-item">
            <div className="metric-number">10 Bài/Ngày</div>
            <div className="metric-label">Tốc độ sản xuất</div>
            <div className="metric-sub">Gấp 10x người viết thường</div>
          </div>

          <div className="metric-item">
            <div className="metric-number">15 Phút</div>
            <div className="metric-label">Chuẩn bị nội dung</div>
            <div className="metric-sub">Đủ lịch đăng cho cả tuần</div>
          </div>

          <div className="metric-item">
            <div className="metric-number">Tiết kiệm 80%</div>
            <div className="metric-label">Chi phí nhân sự</div>
            <div className="metric-sub">Không cần thuê Agency ngoài</div>
          </div>

          <div className="metric-item">
            <div className="metric-number">100% Brand Safe</div>
            <div className="metric-label">Kiểm duyệt tự động</div>
            <div className="metric-sub">Không văn dịch bot, không từ cấm</div>
          </div>
        </div>

        {/* ─── Visual Mockup Showcase ─── */}
        <div className="showcase-wrapper">
          <div className="showcase-topbar">
            <div className="showcase-dots">
              <span className="showcase-dot showcase-dot--red" />
              <span className="showcase-dot showcase-dot--amber" />
              <span className="showcase-dot showcase-dot--green" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)' }}>
              AI Content Studio — Giao diện làm việc thực tế
            </span>
            <span style={{ fontSize: 11, background: 'var(--brand-050)', color: 'var(--brand-700)', padding: '2px 8px', borderRadius: 'var(--r-pill)', fontWeight: 700 }}>
              Live Demo
            </span>
          </div>

          <div className="showcase-grid">
            {/* Cột trái: Ý tưởng đề xuất */}
            <div className="showcase-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="showcase-tag" style={{ background: 'var(--brand-050)', color: 'var(--brand-700)' }}>
                  💡 Ý tưởng sáng nay
                </span>
                <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>Khớp 100% Brand</span>
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 700, margin: '4px 0', color: 'var(--ink)' }}>
                3 Sai lầm khiến video TikTok bán hàng không cắn đề xuất
              </h4>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, padding: '2px 6px', background: 'var(--surface-2)', borderRadius: 4, color: 'var(--ink-2)' }}>
                  Trụ cột: Chia sẻ kinh nghiệm
                </span>
                <span style={{ fontSize: 11, padding: '2px 6px', background: 'var(--surface-2)', borderRadius: 4, color: 'var(--ink-2)' }}>
                  Target: Chủ shop online
                </span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, background: 'var(--surface-2)', padding: 10, borderRadius: 6 }}>
                <strong>Lý do AI chọn:</strong> Tín hiệu trend từ TikTok đang quan tâm chủ đề giữ chân 3s đầu. Khớp nỗi đau của nhóm khách hàng mục tiêu.
              </p>
            </div>

            {/* Cột phải: Bài viết & Kịch bản đã sinh */}
            <div className="showcase-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Bài đăng Fanpage hoàn chỉnh</span>
                  <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '2px 8px', borderRadius: 'var(--r-pill)', fontWeight: 600 }}>
                    ✓ 215 từ (Đạt chuẩn)
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>🛡️ 0 từ cấm thương hiệu</span>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink)', background: 'var(--surface-2)', padding: 12, borderRadius: 6 }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600 }}>
                  Bạn có bao giờ tự hỏi: Tại sao cùng một sản phẩm, đối thủ đăng video triệu view còn bạn đăng mãi không ai xem?
                </p>
                <p style={{ margin: '0 0 6px' }}>
                  Đây là 3 sai lầm chí mạng mà 90% chủ shop mới làm video ngắn đang mắc phải:
                </p>
                <p style={{ margin: '0 0 6px' }}>
                  1. Mở đầu bằng lời chào rườm rà thay vì đánh thẳng vào nỗi đau trong 3 giây đầu.<br />
                  2. Khoe tính năng sản phẩm thay vì cho khách thấy kết quả họ nhận được.<br />
                  3. Quên gắn 1 lời kêu gọi hành động (CTA) dứt khoát ở cuối video.
                </p>
                <p style={{ margin: 0, color: 'var(--brand-700)', fontWeight: 600 }}>
                  #kinhdoanhonline #meoxaykenh #chushop #contentmarketing
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)' }}>
                <span>🎬 Đã có sẵn <strong>Kịch bản video TikTok 45s</strong> phân cảnh</span>
                <span style={{ color: 'var(--brand-600)', fontWeight: 600 }}>Sẵn sàng xuất bản →</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3 Pain Points Section ─── */}
        <section id="loi-ich" className="pain-section">
          <div className="section-head">
            <div className="section-head__label">Vấn đề &amp; Giải pháp</div>
            <h2 className="section-head__title">Tại sao các chủ shop thường bỏ cuộc khi làm Content?</h2>
            <p className="section-head__sub">
              Sản xuất nội dung đều đặn là chìa khóa ra đơn hàng, nhưng cách làm thủ công cũ đang vắt kiệt thời gian của bạn.
            </p>
          </div>

          <div className="pain-grid">
            <div className="pain-card">
              <span className="pain-badge">❌ Nỗi đau 1: Bí ý tưởng mỗi sáng</span>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Mỗi sáng ngồi 1–2 tiếng nhìn màn hình trắng không biết viết gì, đăng được vài ngày thì cạn kiệt ý tưởng rồi bỏ bẵng cả tuần.
              </p>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <span className="sol-badge">✓ AI Content giải quyết:</span>
                <p style={{ fontSize: 13, color: 'var(--ink)', marginTop: 6, lineHeight: 1.5 }}>
                  Tự động quét sản phẩm và xu hướng đối thủ mỗi sáng để đề xuất sẵn 5–10 chủ đề trúng tâm lý khách mua.
                </p>
              </div>
            </div>

            <div className="pain-card">
              <span className="pain-badge">❌ Nỗi đau 2: Dùng ChatGPT văn phong sáo rỗng</span>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                ChatGPT thông thường hay dùng văn dịch bot ngô nghê (&ldquo;đột phá&rdquo;, &ldquo;cách mạng&rdquo;), không nhớ giá sản phẩm và hay bịa chuyện sai thực tế.
              </p>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <span className="sol-badge">✓ AI Content giải quyết:</span>
                <p style={{ fontSize: 13, color: 'var(--ink)', marginTop: 6, lineHeight: 1.5 }}>
                  Lưu giữ Brand DNA: sản phẩm, giá bán, chân dung khách và bộ từ cấm kỵ — viết tự nhiên chuẩn giọng thương hiệu.
                </p>
              </div>
            </div>

            <div className="pain-card">
              <span className="pain-badge">❌ Nỗi đau 3: Quá tải vì phải quản lý đa kênh</span>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Muốn vừa có bài Fanpage, vừa có video TikTok, vừa có bài Zalo nhưng không đủ nhân sự để sản xuất từng kênh.
              </p>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <span className="sol-badge">✓ AI Content giải quyết:</span>
                <p style={{ fontSize: 13, color: 'var(--ink)', marginTop: 6, lineHeight: 1.5 }}>
                  Từ 1 ý tưởng, hệ thống tự động biên soạn thành bài Fanpage, Storyboard TikTok 45s và bài Zalo chỉ với 1 click.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Core Modules ─── */}
        <section id="tinh-nang" className="features">
          <div className="section-head">
            <div className="section-head__label">Bộ công cụ cốt lõi</div>
            <h2 className="section-head__title">Mọi vũ khí sản xuất nội dung bạn cần</h2>
            <p className="section-head__sub">
              Hệ thống khép kín từ chiến lược, ý tưởng, viết bài, dựng video đến quản lý xuất bản.
            </p>
          </div>

          <div className="feat-grid">
            <div className="feat">
              <div className="feat__icon feat__icon--orange" aria-hidden="true">🏢</div>
              <h3 className="feat__title">Hồ sơ thương hiệu chuẩn hóa</h3>
              <p className="feat__desc">
                Lưu giữ chân dung khách hàng, sản phẩm, bảng giá, trụ cột nội dung và bộ quy tắc cấm kỵ — AI luôn viết đúng sự thật.
              </p>
            </div>

            <div className="feat">
              <div className="feat__icon feat__icon--sage" aria-hidden="true">🎯</div>
              <h3 className="feat__title">Đề xuất ý tưởng chuẩn chiến lược</h3>
              <p className="feat__desc">
                Thuật toán phân bổ quota 80/20 (80% nội dung cốt lõi ra đơn, 20% bắt trend mở rộng tệp) — không bao giờ lệch hướng.
              </p>
            </div>

            <div className="feat">
              <div className="feat__icon feat__icon--plum" aria-hidden="true">🎬</div>
              <h3 className="feat__title">Kịch bản Video ngắn (Storyboard)</h3>
              <p className="feat__desc">
                Tự động chia phân cảnh theo từng giây: Hook giữ chân 3s đầu, phân tích vấn đề, demo sản phẩm và lời kêu gọi CTA chốt đơn.
              </p>
            </div>

            <div className="feat">
              <div className="feat__icon feat__icon--clay" aria-hidden="true">🚀</div>
              <h3 className="feat__title">Sinh hàng loạt &amp; Chuỗi bài nối mạch</h3>
              <p className="feat__desc">
                Sinh đồng thời 10 bài viết trong 1 lượt hoặc tạo chuỗi bài nhiều kỳ nối mạch liền cảm xúc, giải quyết dứt điểm KPI 10 bài/ngày.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Comparison Table ─── */}
        <section id="so-sanh" className="comparison-section">
          <div className="section-head">
            <div className="section-head__label">Tại sao chọn chúng tôi?</div>
            <h2 className="section-head__title">AI Content Studio vs. ChatGPT thông thường</h2>
            <p className="section-head__sub">
              Sự khác biệt giữa một công cụ trò chuyện chung chung và một hệ thống sản xuất nội dung thương hiệu chuyên nghiệp.
            </p>
          </div>

          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Tiêu chí</th>
                  <th style={{ width: '35%' }}>ChatGPT thông thường</th>
                  <th className="compare-highlight" style={{ width: '35%' }}>AI Content Studio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Hiểu về sản phẩm &amp; Shop</strong></td>
                  <td>Quên sau vài câu chat, phải copy prompt lại liên tục</td>
                  <td className="compare-highlight">Lưu giữ Brand DNA vĩnh viễn, hiểu tường tận giá và đặc tính</td>
                </tr>
                <tr>
                  <td><strong>Định dạng từng mạng xã hội</strong></td>
                  <td>Văn bản tự do, thường quá dài hoặc không đúng chuẩn</td>
                  <td className="compare-highlight">Kiểm soát chuẩn số từ (Fanpage 150-300 từ, TikTok 60-120 từ)</td>
                </tr>
                <tr>
                  <td><strong>Kịch bản quay video</strong></td>
                  <td>Viết một đoạn văn chung chung, khó quay dựng</td>
                  <td className="compare-highlight">Phân cảnh chi tiết (Góc máy, Hành động, Voiceover, Số giây)</td>
                </tr>
                <tr>
                  <td><strong>Kiểm duyệt từ cấm &amp; An toàn</strong></td>
                  <td>Không có, dễ vi phạm chính sách quảng cáo/Facebook</td>
                  <td className="compare-highlight">Bộ lọc Brand Safety tự động quét và gợi ý thay thế từ cấm</td>
                </tr>
                <tr>
                  <td><strong>Sản xuất số lượng lớn</strong></td>
                  <td>Gõ tay từng bài mất hàng giờ</td>
                  <td className="compare-highlight">Sinh hàng loạt 10 bài / Chuỗi bài nhiều kỳ với 1 click</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section id="quy-trinh" className="steps">
          <div className="section-head">
            <div className="section-head__label">Quy trình vận hành</div>
            <h2 className="section-head__title">3 bước từ chiến lược đến bài đăng ra đơn</h2>
            <p className="section-head__sub">Đơn giản đến mức bất kỳ ai cũng có thể làm chủ sau 5 phút.</p>
          </div>

          <div className="step-grid">
            <div className="step">
              <div className="step__num">1</div>
              <h3 className="step__title">Xây hồ sơ thương hiệu (5 phút)</h3>
              <p className="step__desc">
                Nhập sản phẩm, giá bán, chân dung khách hàng 1 lần duy nhất để AI ghi nhớ ngữ cảnh kinh doanh của bạn.
              </p>
            </div>

            <div className="step">
              <div className="step__num">2</div>
              <h3 className="step__title">Nhận 10 ý tưởng &amp; Biên soạn</h3>
              <p className="step__desc">
                Mỗi sáng AI gợi ý danh sách ý tưởng hot trend. Chọn ý tưởng bạn thích và bấm sinh bài hoàn chỉnh trong 30 giây.
              </p>
            </div>

            <div className="step">
              <div className="step__num">3</div>
              <h3 className="step__title">Duyệt nhanh &amp; Xuất bản</h3>
              <p className="step__desc">
                Kiểm tra nhanh số từ, quét từ cấm, copy bài viết hoặc chuyển sang kịch bản video để đăng tải lên kênh.
              </p>
            </div>
          </div>
        </section>

        {/* ─── FAQ Section ─── */}
        <section className="faq-section">
          <div className="section-head">
            <div className="section-head__label">Câu hỏi thường gặp</div>
            <h2 className="section-head__title">Giải đáp thắc mắc của bạn</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-card">
              <div className="faq-q">❓ Tôi không rành công nghệ có dùng được không?</div>
              <div className="faq-a">
                Hoàn toàn được. Giao diện được thiết kế trực quan bằng tiếng Việt 100%, không cần học các câu lệnh prompt phức tạp, chỉ cần bấm nút là có bài.
              </div>
            </div>

            <div className="faq-card">
              <div className="faq-q">❓ Dữ liệu sản phẩm của tôi có bị lộ sang shop khác không?</div>
              <div className="faq-a">
                Tuyệt đối không. Hệ thống được bảo vệ bằng cơ chế Data Access Guard (DAL Guard) cô lập dữ liệu theo từng không gian làm việc (Workspace Isolation).
              </div>
            </div>

            <div className="faq-card">
              <div className="faq-q">❓ Bài viết do AI sinh có bị Facebook bóp tương tác không?</div>
              <div className="faq-a">
                Không. AI Content được huấn luyện để viết theo giọng người thật, cấu trúc ngắt nhịp tự nhiên và không dùng các từ ngữ spam, giúp giữ chân người đọc cao.
              </div>
            </div>

            <div className="faq-card">
              <div className="faq-q">❓ Tôi có thể thử nghiệm miễn phí trước không?</div>
              <div className="faq-a">
                Có. Bạn có thể bấm nút &ldquo;Trải nghiệm Demo ngay&rdquo; để vào thẳng hệ thống với đầy đủ dữ liệu mẫu mà không cần đăng ký hay nhập thẻ tín dụng.
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="cta-banner">
          <h2 className="cta-banner__title">Đừng để đối thủ cướp khách hàng chỉ vì bạn đăng bài không đều!</h2>
          <p className="cta-banner__sub">
            Bắt đầu giải phóng 80% thời gian làm content ngay hôm nay. Trải nghiệm hệ thống thật với dữ liệu mẫu hoàn toàn miễn phí.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="hero__btn hero__btn--primary"
              onClick={() => setModalOpen(true)}
              style={{ padding: '16px 36px', fontSize: '16px' }}
            >
              🚀 Đăng nhập bằng Google ngay →
            </button>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="lp-footer">
          <span className="lp-footer__copy">© 2026 AI Content Studio · Hệ thống sản xuất nội dung tự động</span>
          <div className="lp-footer__links">
            <Link className="lp-footer__link" href="/huong-dan">Hướng dẫn</Link>
            <Link className="lp-footer__link" href="/goi-cuoc">Gói cước</Link>
            <a className="lp-footer__link" href="https://github.com/phamkimkhuong/aicontent-test-phamkimkhuong" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </footer>
      </div>

      {/* ─── Popup Đăng nhập Google Modal ─── */}
      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoginGoogle={handleLoginGoogle}
      />
    </div>
  );
}

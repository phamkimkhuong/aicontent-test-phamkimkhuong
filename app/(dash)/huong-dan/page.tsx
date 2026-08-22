import type { Metadata } from 'next';
import Link from 'next/link';

import { Icon } from '../../sprite-icon';
import './huong-dan-page.css';

export const metadata: Metadata = {
  title: 'Hướng dẫn sử dụng — AI Content',
  description:
    'Cẩm nang vận hành và hướng dẫn khai thác toàn diện hệ thống AI Content: xây dựng Brand DNA, phân bổ ý tưởng theo trụ cột, và biên soạn bài đăng chuẩn chiến lược.',
};

export default function HuongDanPage() {
  return (
    <div className="guide-container">
      {/* ─── Page Head ─── */}
      <div className="page-head">
        <div className="page-head__text">
          <span className="eyebrow">
            <Icon name="i-help" size={13} />
            Hệ thống &amp; Hướng dẫn
          </span>
          <h1 className="page-title">Cẩm nang vận hành AI Content</h1>
          <p className="page-sub">
            Tài liệu chi tiết giúp bạn khai thác 100% sức mạnh của hệ thống: từ thiết lập hồ sơ thương hiệu đến đề xuất ý tưởng theo quota và biên soạn đa nền tảng.
          </p>
        </div>
      </div>

      {/* ─── Quick Nav ─── */}
      <nav className="guide-nav" aria-label="Mục lục nhanh">
        <a className="guide-nav__item" href="#quy-trinh">
          <Icon name="i-sparkle" size={14} />
          1. Quy trình 3 bước
        </a>
        <a className="guide-nav__item" href="#ho-so-thuong-hieu">
          <Icon name="i-layers" size={14} />
          2. Hồ sơ thương hiệu
        </a>
        <a className="guide-nav__item" href="#de-xuat-y-tuong">
          <Icon name="i-sparkle" size={14} />
          3. Đề xuất ý tưởng
        </a>
        <a className="guide-nav__item" href="#bien-soan">
          <Icon name="i-text" size={14} />
          4. Biên soạn bài đăng
        </a>
        <a className="guide-nav__item" href="#kenh-ngoai">
          <Icon name="i-trend" size={14} />
          5. Kênh ngoài &amp; Bắt trend
        </a>
        <a className="guide-nav__item" href="#faq">
          <Icon name="i-help" size={14} />
          6. Câu hỏi thường gặp
        </a>
      </nav>

      {/* ─── Section 1: Workflow ─── */}
      <section id="quy-trinh" className="panel guide-section">
        <div className="guide-section__head">
          <div className="guide-section__icon guide-section__icon--orange" aria-hidden="true">
            <Icon name="i-sparkle" size={20} />
          </div>
          <h2 className="guide-section__title">1. Quy trình sản xuất nội dung 3 bước</h2>
        </div>

        <div className="guide-content">
          <p>
            Hệ thống AI Content được thiết kế khác biệt hoàn toàn với việc gõ prompt thông thường. Thay vì để AI tự đoán mò, hệ thống vận hành theo quy trình khép kín:
          </p>

          <div className="workflow-grid">
            <article className="workflow-card">
              <span className="workflow-card__step">1</span>
              <h3 className="workflow-card__title">Nạp Brand DNA (1 lần)</h3>
              <p className="workflow-card__desc">
                Khai báo chân dung khách hàng, sản phẩm, trụ cột nội dung và từ cấm kỵ. Đây là “neo chiến lược” để mọi bài viết sau này luôn đúng bản sắc thương hiệu.
              </p>
            </article>

            <article className="workflow-card">
              <span className="workflow-card__step">2</span>
              <h3 className="workflow-card__title">AI Đề xuất theo Quota</h3>
              <p className="workflow-card__desc">
                Hệ thống tự động phân bổ 80% ý tưởng theo tỷ lệ trụ cột nội dung và 20% bắt trend từ bài hot của đối thủ. Không lo bí ý tưởng hay lệch định hướng.
              </p>
            </article>

            <article className="workflow-card">
              <span className="workflow-card__step">3</span>
              <h3 className="workflow-card__title">Biên soạn &amp; Kiểm duyệt</h3>
              <p className="workflow-card__desc">
                AI sinh bài viết theo đúng format từng nền tảng (Facebook, TikTok, Instagram), tự động quét lọc từ cấm, tối ưu độ dài và so sánh 4 giọng điệu.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Brand Profile ─── */}
      <section id="ho-so-thuong-hieu" className="panel guide-section">
        <div className="guide-section__head">
          <div className="guide-section__icon guide-section__icon--sage" aria-hidden="true">
            <Icon name="i-layers" size={20} />
          </div>
          <h2 className="guide-section__title">2. Thiết lập Hồ sơ thương hiệu (Brand Profile)</h2>
        </div>

        <div className="guide-content">
          <p>
            Truy cập <Link href="/brand" className="code-badge">/brand</Link> để quản lý 5 thành phần cốt lõi của thương hiệu. Độ đầy đủ của hồ sơ (Completeness Score) càng cao, bài viết sinh ra càng sắc sảo:
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-person" size={17} />
                Chân dung khách hàng (Personas)
              </div>
              <p className="feature-item__desc">
                Mô tả nhân khẩu học, nỗi đau (pain points), rào cản tâm lý và mục tiêu của từng nhóm khách hàng mục tiêu để AI chọn đúng góc chạm cảm xúc.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-box" size={17} />
                Sản phẩm &amp; Dịch vụ
              </div>
              <p className="feature-item__desc">
                Danh mục sản phẩm, tính năng nổi bật, giá bán và ưu thế khác biệt (USP) để AI lồng ghép khéo léo vào bài viết mà không bị lộ liễu hay thô kệch.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-pillars" size={17} />
                Trụ cột nội dung (Content Pillars)
              </div>
              <p className="feature-item__desc">
                Tỷ lệ phân bổ nội dung mong muốn (ví dụ: 30% Giáo dục, 25% Bán hàng, 20% Giải trí, 15% Uy tín thương hiệu, 10% Câu chuyện khách hàng).
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-text" size={17} />
                Giọng điệu &amp; Từ cấm kỵ
              </div>
              <p className="feature-item__desc">
                Xác định tone of voice (Gần gũi, Chuyên gia, Truyền cảm hứng...) và danh sách từ ngữ nhạy cảm / cấm kỵ (ví dụ: cấm dùng từ cam kết quá đà, biệt ngữ gây hiểu lầm).
              </p>
            </div>
          </div>

          <div className="callout callout--brand">
            <span className="callout__icon"><Icon name="i-sparkle" size={18} /></span>
            <div>
              <strong>Mẹo tối ưu:</strong> Bạn có thể sử dụng nút <em>"Dán văn bản để bóc tách"</em> tại trang Hồ sơ. AI sẽ tự động đọc tài liệu giới thiệu công ty hoặc link web của bạn để tự trích xuất toàn bộ 5 nhóm dữ liệu trên chỉ trong 10 giây!
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Idea Generation ─── */}
      <section id="de-xuat-y-tuong" className="panel guide-section">
        <div className="guide-section__head">
          <div className="guide-section__icon guide-section__icon--plum" aria-hidden="true">
            <Icon name="i-sparkle" size={20} />
          </div>
          <h2 className="guide-section__title">3. Đề xuất ý tưởng thông minh (/studio/de-xuat)</h2>
        </div>

        <div className="guide-content">
          <p>
            Mỗi sáng khi mở trang Đề xuất ý tưởng, bạn chỉ cần bấm <strong>"Đề xuất ý tưởng hôm nay"</strong>. Hệ thống chạy thuật toán phân bổ thông minh:
          </p>

          <ul>
            <li><strong>Thuật toán chia Quota (Largest Remainder)</strong>: Đảm bảo số lượng ý tưởng sinh ra phản ánh chính xác tỷ lệ phần trăm của từng trụ cột nội dung.</li>
            <li><strong>20% Khám phá &amp; Bắt Trend</strong>: Tự động trích xuất các chủ đề đang viral từ các kênh đối thủ bạn đang theo dõi để đề xuất góc nhìn mới.</li>
            <li><strong>Chống trùng lặp (Anti-Repetition Engine)</strong>: AI kiểm tra với lịch sử bài đã đăng gần nhất để không bao giờ gợi ý lại ý tưởng tương tự.</li>
          </ul>

          <div className="callout callout--sage">
            <span className="callout__icon"><Icon name="i-check" size={18} /></span>
            <div>
              Từ bất kỳ ý tưởng nào trong danh sách đề xuất, bạn chỉ cần bấm nút <strong>"Biên soạn bài này"</strong> để chuyển ngay sang phòng Studio viết bài hoàn chỉnh!
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Studio Drafting ─── */}
      <section id="bien-soan" className="panel guide-section">
        <div className="guide-section__head">
          <div className="guide-section__icon guide-section__icon--clay" aria-hidden="true">
            <Icon name="i-text" size={20} />
          </div>
          <h2 className="guide-section__title">4. Biên soạn &amp; Tối ưu bài viết (/studio/bien-soan)</h2>
        </div>

        <div className="guide-content">
          <p>
            Phòng Studio hỗ trợ biên soạn nội dung chuyên sâu với các chế độ mạnh mẽ:
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-text" size={17} />
                Bài đăng Facebook / Fanpage
              </div>
              <p className="feature-item__desc">
                Tạo mở đầu (Hook) giật tương tác, thân bài theo cấu trúc ngắt dòng chuẩn di động, lời kêu gọi hành động (CTA) và bộ hashtag liên quan.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-film" size={17} />
                Kịch bản quay Video ngắn (TikTok/Reels)
              </div>
              <p className="feature-item__desc">
                Cấu trúc phân cảnh chi tiết (Scene by Scene): Thời lượng giây, Lời thoại nhân vật (Audio), Góc máy &amp; Hành động diễn xuất (Visual cues).
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-eye" size={17} />
                Chế độ So sánh 4 giọng điệu (/studio/so-giong)
              </div>
              <p className="feature-item__desc">
                Sinh cùng 1 chủ đề dưới 4 tone giọng khác nhau (Hài hước, Nghiêm túc, Kể chuyện, Trực diện) để bạn chọn phiên bản ưng ý nhất.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-item__title">
                <Icon name="i-alert" size={17} />
                Bộ lọc từ cấm kỵ thời gian thực
              </div>
              <p className="feature-item__desc">
                Hệ thống tự động đối chiếu nội dung với danh sách từ cấm của hồ sơ thương hiệu và chính sách mạng xã hội để cảnh báo ngay trên màn hình soạn thảo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Competitor Tracking ─── */}
      <section id="kenh-ngoai" className="panel guide-section">
        <div className="guide-section__head">
          <div className="guide-section__icon guide-section__icon--orange" aria-hidden="true">
            <Icon name="i-trend" size={20} />
          </div>
          <h2 className="guide-section__title">5. Theo dõi Kênh ngoài &amp; Bắt trend (/kenh-ngoai)</h2>
        </div>

        <div className="guide-content">
          <p>
            Tính năng giúp bạn nắm bắt đối thủ và thị trường đang nói về chủ đề gì mà không cần tốn thời gian lướt mạng xã hội:
          </p>

          <ol>
            <li>Vào <Link href="/cai-dat/kenh" className="code-badge">/cai-dat/kenh</Link> và dán link Fanpage / TikTok của đối thủ hoặc kênh cùng ngành.</li>
            <li>Hệ thống tự động cào các bài viết có tương tác cao nhất, tải ảnh về lưu trữ an toàn chống lỗi link.</li>
            <li>Tại <Link href="/kenh-ngoai" className="code-badge">/kenh-ngoai</Link>, bạn có thể xem lại bài viết, lượt Like/Comment và cấu trúc Hook để áp dụng cho kênh của mình.</li>
          </ol>
        </div>
      </section>

      {/* ─── Section 6: FAQ ─── */}
      <section id="faq" className="panel guide-section">
        <div className="guide-section__head">
          <div className="guide-section__icon guide-section__icon--plum" aria-hidden="true">
            <Icon name="i-help" size={20} />
          </div>
          <h2 className="guide-section__title">6. Câu hỏi thường gặp (FAQ)</h2>
        </div>

        <div className="faq-grid">
          <article className="faq-card">
            <h3 className="faq-card__q">
              <Icon name="i-help" size={16} />
              Làm sao để bài viết AI viết không bị cảm giác "máy móc"?
            </h3>
            <p className="faq-card__a">
              Bí quyết nằm ở <strong>Hồ sơ thương hiệu (`/brand`)</strong>. Hãy điền chi tiết phần <em>Giọng điệu &amp; Cấm kỵ</em> (ví dụ: xưng hô "mình - bạn", cấm dùng các từ sáo rỗng như "trong thời đại 4.0", "giải pháp đột phá"). Càng có nhiều từ cấm và mẫu câu thực tế, AI viết càng tự nhiên và sát với con người.
            </p>
          </article>

          <article className="faq-card">
            <h3 className="faq-card__q">
              <Icon name="i-help" size={16} />
              Tín dụng AI (Credits) tính như thế nào?
            </h3>
            <p className="faq-card__a">
              Mỗi lượt sinh ý tưởng tiêu tốn khoảng 5–10 credits. Mỗi lượt biên soạn bài viết hoàn chỉnh tiêu tốn 15–20 credits. Hạn mức tháng được hiển thị trực tiếp ở góc dưới của thanh Menu bên trái màn hình.
            </p>
          </article>

          <article className="faq-card">
            <h3 className="faq-card__q">
              <Icon name="i-help" size={16} />
              Dữ liệu kênh và thương hiệu của tôi có được bảo mật không?
            </h3>
            <p className="faq-card__a">
              Toàn bộ dữ liệu được cô lập tuyệt đối theo từng Không gian làm việc (Workspace Isolation). Hệ thống phân quyền chặt chẽ ở cấp cơ sở dữ liệu (PostgreSQL Row-level isolation), đảm bảo người dùng của workspace này không bao giờ xem được dữ liệu của workspace khác.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

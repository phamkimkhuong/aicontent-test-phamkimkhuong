'use client';

import { useState } from 'react';
import { Icon } from '../../sprite-icon';
import './goi-cuoc-page.css';

type BillingCycle = 'monthly' | 'yearly';

type Props = {
  soDuCredit: number;
  tongCredit: number;
  tenWorkspace: string;
};

export function BangGoiCuoc({ soDuCredit, tongCredit, tenWorkspace }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="pricing-container">
      {/* ─── Page Head ─── */}
      <div className="page-head">
        <div className="page-head__text">
          <span className="eyebrow">
            <Icon name="i-card" size={13} />
            Gói cước &amp; Hạn ngạch
          </span>
          <h1 className="page-title">Bảng giá dịch vụ AI Content</h1>
          <p className="page-sub">
            Chọn gói cước phù hợp với quy mô sản xuất nội dung của bạn. Nâng cấp hoặc hạ cấp linh hoạt bất kỳ lúc nào mà không gián đoạn dữ liệu.
          </p>
        </div>
      </div>

      {/* ─── Current Subscription Status ─── */}
      <section className="current-plan-card" aria-label="Tình trạng gói hiện tại">
        <div className="current-plan-card__info">
          <div className="current-plan-card__badge" aria-hidden="true">
            <Icon name="i-sparkle" size={22} />
          </div>
          <div>
            <h2 className="current-plan-card__title">Gói Dùng thử &amp; Miễn phí (Starter / Free)</h2>
            <p className="current-plan-card__sub">
              Hạn mức cấp tự động mỗi tháng · Không gian làm việc: <strong>{tenWorkspace}</strong>
            </p>
          </div>
        </div>

        <div className="current-plan-card__stats">
          <div className="plan-stat">
            <div className="plan-stat__label">Tín dụng hiện có</div>
            <div className="plan-stat__val">
              <strong style={{ color: 'var(--brand-700)' }}>{soDuCredit.toLocaleString('vi-VN')}</strong> / {tongCredit.toLocaleString('vi-VN')}
            </div>
          </div>
          <div className="plan-stat">
            <div className="plan-stat__label">Trạng thái</div>
            <div className="plan-stat__val" style={{ color: 'var(--sage)' }}>Đang hoạt động</div>
          </div>
        </div>
      </section>

      {/* ─── Billing Cycle Toggle ─── */}
      <div className="billing-toggle-wrap">
        <div className="billing-toggle" role="group" aria-label="Chu kỳ thanh toán">
          <button
            type="button"
            className={`billing-toggle__btn ${cycle === 'monthly' ? 'billing-toggle__btn--active' : ''}`}
            onClick={() => setCycle('monthly')}
          >
            Thanh toán theo tháng
          </button>
          <button
            type="button"
            className={`billing-toggle__btn ${cycle === 'yearly' ? 'billing-toggle__btn--active' : ''}`}
            onClick={() => setCycle('yearly')}
          >
            Thanh toán theo năm
          </button>
        </div>
        <span className="discount-tag">Tiết kiệm 20%</span>
      </div>

      {/* ─── Pricing Grid ─── */}
      <section className="pricing-grid" aria-label="Danh sách các gói cước">
        {/* Tier 1: Starter */}
        <article className="plan-card">
          <div className="plan-card__header">
            <h3 className="plan-card__name">Cá nhân (Starter)</h3>
            <p className="plan-card__desc">
              Dành cho Content Creator hoặc cá nhân quản lý 1 kênh mạng xã hội duy nhất.
            </p>
            <div className="plan-card__price-row">
              <span className="plan-card__price">
                {cycle === 'monthly' ? '490.000 đ' : '390.000 đ'}
              </span>
              <span className="plan-card__period">/ tháng</span>
            </div>
          </div>

          <div className="plan-features">
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span><strong>1.500 Tín dụng AI</strong> mỗi tháng</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span><strong>1 Hồ sơ thương hiệu</strong> (Brand DNA)</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Đề xuất <strong>5 ý tưởng / ngày</strong></span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Biên soạn bài viết Facebook &amp; TikTok</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Theo dõi <strong>2 kênh đối thủ</strong></span>
            </div>
            <div className="plan-feature-item plan-feature-item--disabled">
              <span className="plan-feature-item__icon plan-feature-item__icon--dim">—</span>
              <span>Chế độ so sánh 4 giọng điệu</span>
            </div>
          </div>

          <button type="button" className="btn btn--ghost" style={{ width: '100%' }}>
            Chọn gói Cá nhân
          </button>
        </article>

        {/* Tier 2: Pro (Featured) */}
        <article className="plan-card plan-card--featured">
          <span className="plan-card__badge">Phổ biến nhất</span>
          <div className="plan-card__header">
            <h3 className="plan-card__name">Chuyên nghiệp (Pro)</h3>
            <p className="plan-card__desc">
              Dành cho Chủ shop kinh doanh online và đội ngũ Marketing (1–3 nhân sự).
            </p>
            <div className="plan-card__price-row">
              <span className="plan-card__price">
                {cycle === 'monthly' ? '990.000 đ' : '790.000 đ'}
              </span>
              <span className="plan-card__period">/ tháng</span>
            </div>
          </div>

          <div className="plan-features">
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span><strong>5.000 Tín dụng AI</strong> mỗi tháng</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span><strong>3 Hồ sơ thương hiệu</strong> độc lập</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Đề xuất <strong>15 ý tưởng / ngày</strong> (Quota 80/20)</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>So sánh <strong>4 phong cách giọng điệu</strong></span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Kịch bản video phân cảnh (Scene-by-scene)</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Theo dõi <strong>10 kênh đối thủ</strong> &amp; Bắt trend AI</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Sinh bài hàng loạt &amp; Quét từ cấm kỵ</span>
            </div>
          </div>

          <button type="button" className="btn btn--primary" style={{ width: '100%' }}>
            Nâng cấp lên Pro
          </button>
        </article>

        {/* Tier 3: Enterprise / Agency */}
        <article className="plan-card">
          <div className="plan-card__header">
            <h3 className="plan-card__name">Doanh nghiệp (Agency)</h3>
            <p className="plan-card__desc">
              Dành cho Agency truyền thông và Doanh nghiệp quản lý nhiều thương hiệu lớn.
            </p>
            <div className="plan-card__price-row">
              <span className="plan-card__price">
                {cycle === 'monthly' ? '2.490.000 đ' : '1.990.000 đ'}
              </span>
              <span className="plan-card__period">/ tháng</span>
            </div>
          </div>

          <div className="plan-features">
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span><strong>20.000 Tín dụng AI</strong> mỗi tháng</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span><strong>Không giới hạn</strong> Hồ sơ thương hiệu</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Đề xuất <strong>Không giới hạn ý tưởng</strong></span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Theo dõi <strong>Không giới hạn kênh đối thủ</strong></span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Phân quyền thành viên theo vai trò</span>
            </div>
            <div className="plan-feature-item">
              <span className="plan-feature-item__icon"><Icon name="i-check" size={17} /></span>
              <span>Hỗ trợ kỹ thuật ưu tiên 24/7 &amp; Onboarding 1-1</span>
            </div>
          </div>

          <button type="button" className="btn btn--ghost" style={{ width: '100%' }}>
            Liên hệ tư vấn Doanh nghiệp
          </button>
        </article>
      </section>

      {/* ─── Feature Comparison Table ─── */}
      <section className="panel comparison-section" aria-label="Bảng so sánh chi tiết">
        <h2 className="guide-section__title" style={{ fontSize: '20px' }}>So sánh chi tiết tính năng</h2>
        
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '40%' }}>Tính năng</th>
                <th scope="col" style={{ width: '20%' }}>Cá nhân</th>
                <th scope="col" style={{ width: '20%' }}>Chuyên nghiệp</th>
                <th scope="col" style={{ width: '20%' }}>Doanh nghiệp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tín dụng AI hàng tháng</td>
                <td>1.500</td>
                <td><strong>5.000</strong></td>
                <td><strong>20.000</strong></td>
              </tr>
              <tr>
                <td>Số lượng Hồ sơ thương hiệu (Workspace)</td>
                <td>1</td>
                <td>3</td>
                <td>Không giới hạn</td>
              </tr>
              <tr>
                <td>Đề xuất ý tưởng Quota 80/20 hằng ngày</td>
                <td>5 ý tưởng</td>
                <td>15 ý tưởng</td>
                <td>Tùy chỉnh</td>
              </tr>
              <tr>
                <td>Biên soạn bài viết Facebook / Instagram</td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Kịch bản video TikTok phân cảnh</td>
                <td><span className="cross-icon">—</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Chế độ so sánh 4 phong cách giọng điệu</td>
                <td><span className="cross-icon">—</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Cào và bắt trend Fanpage / TikTok đối thủ</td>
                <td>2 kênh</td>
                <td>10 kênh</td>
                <td>Không giới hạn</td>
              </tr>
              <tr>
                <td>Sinh bài hàng loạt (10 bài / lượt)</td>
                <td><span className="cross-icon">—</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Quét từ ngữ cấm kỵ thương hiệu</td>
                <td>Cơ bản</td>
                <td>Nâng cao</td>
                <td>Tùy chỉnh Regex</td>
              </tr>
              <tr>
                <td>Hỗ trợ kỹ thuật</td>
                <td>Email (48h)</td>
                <td>Ưu tiên (12h)</td>
                <td>1-1 Hotline &amp; Zalo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

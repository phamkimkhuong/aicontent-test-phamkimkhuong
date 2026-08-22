import type { Metadata } from 'next';

import { Icon } from '@/app/sprite-icon';
import { ManChuoiBai } from './man-chuoi-bai';
import '../studio.css';
import '../../brand/brand.css';

export const metadata: Metadata = {
  title: 'Chuỗi bài nối mạch — AI Content',
};

export default function TrangChuoiBai() {
  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <span className="eyebrow">
            <Icon name="i-layers" size={13} />
            Studio sáng tạo
          </span>
          <h1 className="page-title">Chuỗi bài nối mạch</h1>
          <p className="page-sub">
            Tạo chuỗi bài viết nhiều kỳ theo một mạch kể chuyện xuyên suốt, tự động nối tiếp logic và không lặp lại ý bài trước.
          </p>
        </div>
      </div>

      <ManChuoiBai />
    </>
  );
}

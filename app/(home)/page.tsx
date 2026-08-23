import type { Metadata } from 'next';

import { TrangChuClient } from './home-page-client';
import './home-page.css';

export const metadata: Metadata = {
  title: 'AI Content — Tự động sản xuất 10 bài Facebook & TikTok mỗi ngày cho Chủ shop',
  description:
    'Hệ thống AI chuyên biệt cho Chủ shop & Doanh nghiệp vừa/nhỏ: Tự động học Brand DNA, đề xuất ý tưởng hot trend mỗi sáng, sinh bài viết & kịch bản video phân cảnh trong 30 giây.',
};

export default function TrangChu() {
  return <TrangChuClient />;
}

import type { Metadata } from 'next';

import { Icon } from '@/app/sprite-icon';
import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import type { TruCot } from '@/lib/data-access/content-pillars';
import type { Idea } from '@/lib/data-access/ideas';
import type { ChanDung } from '@/lib/data-access/personas';
import type { BeMat } from '@/lib/studio/kieu';

import { ManHangLoat } from './man-hang-loat';
import '../studio.css';
import '../../brand/brand.css';

export const metadata: Metadata = {
  title: 'Sinh nội dung hàng loạt (10 bài/ngày) — AI Content',
};

export default async function TrangSinhHangLoat() {
  const workspaceId = await workspaceHienTai();
  const repo = createRepo(workspaceId);

  const [truCotDs, chanDungDs, yTuongList] = await Promise.all([
    repo.truCot.list(),
    repo.chanDung.list(),
    repo.yTuong.list(50),
  ]);

  const mapTruCot = new Map(truCotDs.map((t: TruCot) => [t.id, t.ten]));
  const mapChanDung = new Map(chanDungDs.map((c: ChanDung) => [c.id, c.ten]));

  const dsYTuongBanDau = yTuongList.map((y: Idea) => ({
    id: y.id,
    beMat: y.beMat as BeMat,
    gocTiepCan: y.gocTiepCan,
    cauMoDau: y.cauMoDau,
    lyDoDeXuat: y.lyDoDeXuat,
    tenTruCot: y.pillarId ? mapTruCot.get(y.pillarId) ?? null : null,
    tenChanDung: y.personaId ? mapChanDung.get(y.personaId) ?? null : null,
    daDung: y.daDung,
    ngayTao: y.ngayTao ? y.ngayTao.toISOString() : new Date().toISOString(),
  }));

  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <span className="eyebrow">
            <Icon name="i-copy" size={13} />
            Studio sáng tạo
          </span>
          <h1 className="page-title">Sinh nội dung hàng loạt</h1>
          <p className="page-sub">
            Tạo đồng thời 5–10 bài viết hoặc kịch bản video từ danh sách ý tưởng chỉ với một lần bấm máy, phục vụ mục tiêu đăng bài hàng ngày.
          </p>
        </div>
      </div>

      <ManHangLoat dsYTuongBanDau={dsYTuongBanDau} />
    </>
  );
}

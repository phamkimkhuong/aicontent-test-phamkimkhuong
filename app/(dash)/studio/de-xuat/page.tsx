import type { Metadata } from 'next';

import { Icon } from '@/app/sprite-icon';
import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import type { ChanDung } from '@/lib/data-access/personas';
import type { TruCot } from '@/lib/data-access/content-pillars';
import type { Idea } from '@/lib/data-access/ideas';
import { tinhDoDayDu, type KetQuaDoDayDu } from '@/lib/brand/do-day-du';

import { ManDeXuat } from './man-de-xuat';
import '../studio.css';
import '../../brand/brand.css';

export const metadata: Metadata = {
  title: 'Đề xuất hôm nay — AI Content',
};

export default async function TrangDeXuat(props: {
  searchParams: Promise<{
    trendSignalId?: string;
    tenKenh?: string;
    hook?: string;
    dang?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const trendContext = searchParams.trendSignalId
    ? {
        id: searchParams.trendSignalId,
        tenKenh: searchParams.tenKenh ?? null,
        hook: searchParams.hook ?? null,
        dang: searchParams.dang ?? null,
      }
    : null;

  const workspaceId = await workspaceHienTai();
  const repo = createRepo(workspaceId);

  const [truCotDs, chanDungDs, yTuongList, sanPhamDs, insightDs, hoSo] = await Promise.all([
    repo.truCot.list(),
    repo.chanDung.list(),
    repo.yTuong.list(20),
    repo.sanPham.list(),
    repo.insight.list(),
    repo.hoSo.layHoacTao(),
  ]);

  const doDayDu: KetQuaDoDayDu = tinhDoDayDu({
    truCot: truCotDs,
    chanDung: chanDungDs,
    sanPham: sanPhamDs,
    insight: insightDs,
    hoSo,
  });

  const dsTenTruCot = truCotDs.map((t: TruCot) => t.ten);
  const dsTenChanDung = chanDungDs.map((c: ChanDung) => c.ten);

  const mapTruCot = new Map(truCotDs.map((t: TruCot) => [t.id, t.ten]));
  const mapChanDung = new Map(chanDungDs.map((c: ChanDung) => [c.id, c.ten]));

  const yTuongDaLuu = yTuongList.map((y: Idea) => ({
    id: y.id,
    beMat: y.beMat,
    gocTiepCan: y.gocTiepCan,
    cauMoDau: y.cauMoDau,
    lyDoDeXuat: y.lyDoDeXuat,
    tenTruCot: y.pillarId ? mapTruCot.get(y.pillarId) ?? null : null,
    tenChanDung: y.personaId ? mapChanDung.get(y.personaId) ?? null : null,
    ngayTao: y.ngayTao ? y.ngayTao.toISOString() : new Date().toISOString(),
  }));

  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <span className="eyebrow">
            <Icon name="i-sparkle" size={13} />
            Studio sáng tạo
          </span>
          <h1 className="page-title">Đề xuất hôm nay</h1>
          <p className="page-sub">
            Máy đề xuất ý tưởng dựa trên 4 nguồn: Hồ sơ thương hiệu, Chân dung khách hàng, Trụ cột nội dung và Tín hiệu thị trường.
          </p>
        </div>
      </div>

      <ManDeXuat
        dsTruCot={dsTenTruCot}
        dsChanDung={dsTenChanDung}
        yTuongDaLuu={yTuongDaLuu}
        trendContext={trendContext}
        doDayDu={doDayDu}
      />
    </>
  );
}

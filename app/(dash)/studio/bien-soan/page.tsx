import type { Metadata } from 'next';

import { Icon } from '@/app/sprite-icon';
import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import type { BeMat } from '@/lib/studio/kieu';

import { ManBienSoan } from './man-bien-soan';
import '../studio.css';
import '../../brand/brand.css';

export const metadata: Metadata = {
  title: 'Biên soạn bài viết — AI Content',
};

type Props = {
  searchParams: Promise<{
    ideaId?: string;
    tieuDe?: string;
    beMat?: string;
    cauMoDau?: string;
    gocTiepCan?: string;
  }>;
};

export default async function TrangBienSoan(props: Props) {
  const searchParams = await props.searchParams;
  const workspaceId = await workspaceHienTai();
  const repo = createRepo(workspaceId);

  let tieuDe = searchParams.tieuDe ?? '';
  let cauMoDau = searchParams.cauMoDau ?? '';
  let gocTiepCan = searchParams.gocTiepCan ?? '';
  let beMat: BeMat =
    searchParams.beMat && ['fanpage', 'ho_so_ca_nhan', 'tiktok', 'zalo'].includes(searchParams.beMat)
      ? (searchParams.beMat as BeMat)
      : 'fanpage';

  if (searchParams.ideaId) {
    const yTuong = await repo.yTuong.layTheoId(searchParams.ideaId);
    if (yTuong) {
      beMat = yTuong.beMat as BeMat;
      gocTiepCan = yTuong.gocTiepCan ?? gocTiepCan;
      cauMoDau = yTuong.cauMoDau ?? cauMoDau;
      if (!tieuDe) {
        tieuDe = yTuong.cauMoDau ?? yTuong.gocTiepCan ?? '';
      }
    }
  }

  return (
    <>
      <div className="page-head">
        <div className="page-head__text">
          <span className="eyebrow">
            <Icon name="i-text" size={13} />
            Studio sáng tạo
          </span>
          <h1 className="page-title">Biên soạn bài viết</h1>
          <p className="page-sub">
            Sinh nội dung bài đăng hoàn chỉnh từ ý tưởng, tự động căn chỉnh giọng điệu và kiểm soát độ dài theo từng bề mặt.
          </p>
        </div>
      </div>

      <ManBienSoan
        khoiTaoBeMat={beMat}
        khoiTaoTieuDe={tieuDe}
        khoiTaoCauMoDau={cauMoDau}
        khoiTaoGocTiepCan={gocTiepCan}
        ideaId={searchParams.ideaId}
      />
    </>
  );
}

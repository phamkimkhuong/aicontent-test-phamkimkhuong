import type { Metadata } from 'next';

import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import { HAN_MUC_MIEN_PHI_THANG } from '@/lib/credits/dinh-muc-tin-dung';
import { BangGoiCuoc } from './bang-goi-cuoc';
import './goi-cuoc-page.css';

export const metadata: Metadata = {
  title: 'Gói cước & Hạn ngạch — AI Content',
};

export default async function GoiCuocPage() {
  let soDuCredit = HAN_MUC_MIEN_PHI_THANG;
  let tenWorkspace = 'Khuong DEMO STUDIO';

  try {
    const workspaceId = await workspaceHienTai();
    const repo = createRepo(workspaceId);
    soDuCredit = await repo.credits.laySoDu();
    const ws = await repo.workspaces.layHienTai();
    if (ws?.ten) {
      tenWorkspace = ws.ten;
    }
  } catch {
    // Fallback neu chua co workspace
  }

  return (
    <BangGoiCuoc
      soDuCredit={soDuCredit}
      tongCredit={HAN_MUC_MIEN_PHI_THANG}
      tenWorkspace={tenWorkspace}
    />
  );
}

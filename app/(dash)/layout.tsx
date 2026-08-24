import { auth } from '@/auth';
import { workspaceHienTai } from '@/lib/auth/current-workspace';
import { createRepo } from '@/lib/data-access';
import { HAN_MUC_MIEN_PHI_THANG } from '@/lib/credits/dinh-muc-tin-dung';
import { AppShell } from './app-shell';
import { IconSprite } from './icon-sprite';

// Khung chung của mọi trang trong dashboard: sidebar + topbar + vùng nội dung.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
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
    // Fallback neu chua co session/workspace
  }

  const user = {
    name: session?.user?.name ?? 'Nhân sự nội dung',
    email: session?.user?.email ?? 'seed@aicontent.local',
    image: session?.user?.image ?? null,
  };

  return (
    <>
      <IconSprite />
      <AppShell
        user={user}
        soDuCredit={soDuCredit}
        tongCredit={HAN_MUC_MIEN_PHI_THANG}
        tenWorkspace={tenWorkspace}
      >
        {children}
      </AppShell>
    </>
  );
}

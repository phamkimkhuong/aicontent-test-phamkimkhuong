/**
 * Tầng truy cập dữ liệu cho sổ cái tín dụng (credit_ledger).
 *
 * Mọi truy vấn BẮT BUỘC có điều kiện `workspaceId` để bảo đảm cô lập dữ liệu.
 */

import { desc, eq, sql } from 'drizzle-orm';

import { creditLedger } from '@/db/schema/ops';
import { HAN_MUC_MIEN_PHI_THANG } from '@/lib/credits/dinh-muc-tin-dung';
import type { KetNoiDrizzle } from './guard';

export type BanGhiCredit = typeof creditLedger.$inferSelect;

export function creditLedgerRepo(ketNoi: KetNoiDrizzle, workspaceId: string) {
  return {
    /**
     * Lấy số dư tín dụng hiện tại của workspace.
     *
     * Đọc bản ghi mới nhất trong `credit_ledger`. Nếu chưa có bản ghi nào thì mặc định
     * là hạn mức miễn phí ban đầu.
     */
    async laySoDu(): Promise<number> {
      const [banGhiMoiNhat] = await ketNoi
        .select({ soDuSau: creditLedger.soDuSau })
        .from(creditLedger)
        .where(eq(creditLedger.workspaceId, workspaceId))
        .orderBy(desc(creditLedger.ngayTao))
        .limit(1);

      if (!banGhiMoiNhat) {
        return HAN_MUC_MIEN_PHI_THANG;
      }

      return banGhiMoiNhat.soDuSau;
    },

    /**
     * Kiểm tra workspace có đủ tín dụng để thực hiện tác vụ không.
     */
    async kiemTraDuCredit(chiPhiYeuCau: number): Promise<{ du: boolean; soDuHienTai: number }> {
      const soDuHienTai = await this.laySoDu();
      return {
        du: soDuHienTai >= chiPhiYeuCau,
        soDuHienTai,
      };
    },

    /**
     * Ghi nhận một biến động tín dụng (nạp hoặc trừ).
     *
     * @param bienDongLuot Số âm nếu trừ, số dương nếu nạp/hoàn tiền.
     * @param lyDo Lý do biến động (vd: "Đề xuất 5 ý tưởng", "Biên soạn bài viết").
     */
    async ghiBienDong(bienDongLuot: number, lyDo: string): Promise<BanGhiCredit> {
      const soDuHienTai = await this.laySoDu();
      const soDuSau = Math.max(0, soDuHienTai + bienDongLuot);

      const [banGhiMoi] = await ketNoi
        .insert(creditLedger)
        .values({
          workspaceId,
          bienDongLuot,
          lyDo,
          soDuSau,
        })
        .returning();

      return banGhiMoi;
    },

    /**
     * Lấy lịch sử giao dịch tín dụng gần nhất của workspace.
     */
    async layLichSu(gioiHan = 20): Promise<BanGhiCredit[]> {
      return ketNoi
        .select()
        .from(creditLedger)
        .where(eq(creditLedger.workspaceId, workspaceId))
        .orderBy(desc(creditLedger.ngayTao))
        .limit(Math.max(1, Math.min(100, gioiHan)));
    },
  };
}

/**
 * Cau hinh dang nhap Google (Auth.js v5) — goc cua moi thu co `workspace_id`.
 *
 * Day la file DUY NHAT cua Phase 6 duoc import `db` truc tiep: DrizzleAdapter
 * bat buoc nhan mot ket noi Drizzle. Bon bang Auth.js (`users`,
 * `oauth_accounts`, `sessions`, `verification_tokens`) khong co cot
 * `workspace_id` nen khong co gi de ro cheo giua cac khong gian lam viec. Moi
 * truy van nghiep vu khac phai di qua tang truy cap du lieu cua Phase 5.
 */

import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { db } from '@/db/client';
import {
  oauthAccounts,
  sessions,
  users,
  verificationTokens,
  workspaceMembers,
  workspaces,
} from '@/db/schema/auth';
import { creditLedger } from '@/db/schema/ops';
import { HAN_MUC_MIEN_PHI_THANG } from '@/lib/credits/dinh-muc-tin-dung';

declare module '@auth/core/types' {
  interface Session {
    /** Khong gian lam viec cua nguoi dung. `null` khi phien hong (khong nen xay ra). */
    workspaceId: string | null;
  }
}

/** Hinh dang luoc do ma DrizzleAdapter nhan. Lay tu chinh chu ky ham vi goi
 *  `@auth/drizzle-adapter` chi mo duong dan goc, khong mo `./lib/pg`. */
type LuocDoAuth = NonNullable<Parameters<typeof DrizzleAdapter<typeof db>>[1]>;

/**
 * Lech kieu da biet, KHONG phai lech cot.
 *
 * Adapter khai bao `sessions.sessionToken` la khoa chinh; schema Phase 3 (da
 * dong bang) dat khoa chinh o `id` va rang buoc DUY NHAT o `session_token`.
 * Ten cot, kieu cot, tinh not-null deu khop; ma chay cua adapter chi dung
 * `eq(sessionsTable.sessionToken, ...)` nen no khong quan tam do la khoa chinh
 * hay khoa duy nhat — hai cach deu tra ve toi da mot dong. Chi ep kieu rieng
 * bang nay, khong ep ca cum, de con phat hien lech that o ba bang kia.
 */
const bangPhien = sessions as unknown as LuocDoAuth['sessionsTable'];

/** 30 ngay — bang mac dinh cua Auth.js, ghi ra day de doi cho nay khong phai doan. */
const HAN_PHIEN_GIAY = 30 * 24 * 60 * 60;

/**
 * Tim khong gian lam viec cua nguoi dung, tao neu chua co.
 *
 * Chay trong mot giao tac va khoa dong `users` truoc khi kiem tra: mo hai tab
 * roi dang nhap cung luc thi hai lan kiem tra deu thay "chua co" va tao ra hai
 * khong gian lam viec cho mot nguoi — hong am tham, vi tu do moi truy van sau
 * chi thay mot nua du lieu.
 */
async function baoDamCoKhongGianLamViec(
  userId: string,
  ten: string | null | undefined,
  email: string | null | undefined,
): Promise<string> {
  return db.transaction(async (tx) => {
    await tx.select({ id: users.id }).from(users).where(eq(users.id, userId)).for('update');

    const daCo = await tx
      .select({ workspaceId: workspaceMembers.workspaceId })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, userId))
      .limit(1);
    if (daCo.length > 0) return daCo[0].workspaceId;

    const tenChu = ten?.trim() || email?.split('@')[0] || 'toi';
    const [moi] = await tx
      .insert(workspaces)
      .values({ ten: `Khong gian cua ${tenChu}`, chuSoHuuId: userId })
      .returning({ id: workspaces.id });

    await tx
      .insert(workspaceMembers)
      .values({ workspaceId: moi.id, userId, vaiTro: 'chu_so_huu' });

    // Cấp ngay hạn ngạch tín dụng khởi tạo ban đầu cho người dùng mới
    await tx.insert(creditLedger).values({
      workspaceId: moi.id,
      bienDongLuot: HAN_MUC_MIEN_PHI_THANG,
      lyDo: 'Hạn mức miễn phí khởi tạo tài khoản',
      soDuSau: HAN_MUC_MIEN_PHI_THANG,
    });

    return moi.id;
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: oauthAccounts,
    sessionsTable: bangPhien,
    verificationTokensTable: verificationTokens,
  }),

  // Dat tuong minh du adapter da keo mac dinh ve 'database': roi ve JWT la phien
  // KHONG THU HOI DUOC — khoa tai khoan xong nguoi do van dung tiep toi khi het han.
  session: { strategy: 'database', maxAge: HAN_PHIEN_GIAY },

  // Chay sau Nginx. Khong bat thi Auth.js dung sai URL goi nguoc, dang nhap loi.
  trustHost: true,

  providers: [
    Google({
      // CHI xin openid/email/profile. Xin them Drive/Sheets "de danh" keo theo
      // quy trinh xac minh nang cua Google cho mot thu chua dung den.
      authorization: { params: { scope: 'openid email profile' } },
    }),
  ],

  pages: {
    signIn: '/dang-nhap',
    // Tra loi ve chinh trang dang nhap kem ?error=... thay vi trang loi mac dinh
    // cua Auth.js — nguoi bi tu choi can thay thong bao tieng Viet.
    error: '/dang-nhap',
  },

  callbacks: {
    /**
     * Cho phép tất cả tài khoản Google đăng nhập công khai vào hệ thống.
     */
    signIn({ user }) {
      return Boolean(user?.email);
    },

    /**
     * Chi tra ve dung nhung truong can dung. KHONG duoc tra `{ ...session }`:
     * `session` o day la nguyen dong bang `sessions`, ke ca `session_token` —
     * do la gia tri cua cookie httpOnly, dua no ra `/api/auth/session` cho
     * JavaScript doc duoc thi httpOnly con lai vo nghia.
     */
    async session({ session, user }) {
      let workspaceId: string | null = null;
      if (user?.id) {
        workspaceId = await baoDamCoKhongGianLamViec(user.id, user.name, user.email);
      }

      return {
        user: { id: user.id, name: user.name, email: user.email, image: user.image },
        expires: session.expires.toISOString(),
        workspaceId,
      };
    },
  },

  events: {
    /**
     * Tao khong gian lam viec o day chu khong o callback `signIn`: luc callback
     * `signIn` chay, nguoi dung moi chua co dong nao trong `users` nen chua co
     * id de gan `chu_so_huu_id`. Event nay chay sau khi Auth.js da ghi
     * users + oauth_accounts + sessions.
     */
    async signIn({ user }) {
      if (!user.id) return;
      await baoDamCoKhongGianLamViec(user.id, user.name, user.email);
      await db
        .update(users)
        .set({ lanDangNhapCuoi: new Date() })
        .where(eq(users.id, user.id));
    },

    /**
     * Bảo vệ chống nuốt tài khoản: Nếu trình duyệt đang có cookie của tài khoản Demo
     * mà người dùng đăng nhập bằng Google, Auth.js mặc định sẽ "Link Account" vào Demo.
     * Handler này sẽ tự động tách Google account sang User thật tương ứng.
     */
    async linkAccount({ user, account, profile }) {
      if (user.id === '00000000-0000-4000-8000-000000000001' && (profile as any)?.email) {
        const p = profile as any;
        const email = p.email as string;
        const name = (p.name as string) || (p.given_name as string) || email.split('@')[0];
        const image = (p.picture as string) || user.image || null;

        const [newUser] = await db
          .insert(users)
          .values({ name, email, image })
          .onConflictDoUpdate({
            target: users.email,
            set: { lanDangNhapCuoi: new Date() },
          })
          .returning({ id: users.id });

        if (newUser?.id) {
          await db
            .update(oauthAccounts)
            .set({ userId: newUser.id })
            .where(eq(oauthAccounts.providerAccountId, account.providerAccountId));
          await baoDamCoKhongGianLamViec(newUser.id, name, email);
        }
      }
    },
  },
});

import { NextResponse } from 'next/server';

import { auth } from '@/auth';

// Auth.js doc phien tu bang `sessions` qua Drizzle + `pg`.
// Proxy trong Next.js 16 luon chay tren Node.js runtime.

// Kiem tra phien THAT o day (mot truy van xuong `sessions`) chu khong chi ngo
// xem cookie co ton tai: chi nhin cookie thi xoa dong `sessions` trong CSDL van
// khong da duoc nguoi dung ra, tuc phien coi nhu khong thu hoi duoc.
export default auth((req) => {
  if (req.auth) return;
  return NextResponse.redirect(new URL('/dang-nhap', req.nextUrl.origin));
});

export const config = {
  // Chan tat ca, tru danh sach duoi. Lam nguoc lai (liet ke duong can chan) thi
  // moi man hinh moi cua cac phase sau mac dinh la mo — quen mot dong la ro.
  //
  // `healthz` PHAI nam trong danh sach loai tru. Middleware nuot /healthz thi no
  // tra 307 sang trang dang nhap, ma `scripts/auto-deploy.sh` dung `curl -fsS`
  // coi 307 la THANH CONG -> health check xanh vinh vien ke ca khi app da chet.
  //
  // `api/dev-login` la cua tat danh rieng cho bai test (xem file do). No phai
  // nam ngoai vong chan, neu khong middleware day no ve /dang-nhap truoc khi no
  // kip tao phien — thanh vong tron khong bao gio dang nhap duoc.
  //
  // Landing page `/` cung nam ngoai: khach vang lai va nha tuyen dung can xem
  // gioi thieu truoc khi quyet dinh dang nhap hay bam "Trai nghiem Demo".
  matcher: [
    '/((?!api/auth|api/dev-login|healthz|dang-nhap|_next|favicon.ico|robots.txt).+)',
  ],
};

'use server';

import { signIn } from '@/auth';

/**
 * Server action de kich hoat luong dang nhap Google tu client component.
 */
export async function dangNhapGoogleAction() {
  await signIn('google', { redirectTo: '/studio/de-xuat' });
}

'use server';

import { signOut } from '@/auth';

export async function dangXuatAction() {
  await signOut({ redirectTo: '/' });
}

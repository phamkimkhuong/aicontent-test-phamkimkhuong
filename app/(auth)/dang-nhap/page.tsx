import { redirect } from 'next/navigation';

export default async function TrangDangNhap({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (error) {
    redirect(`/?login=1&error=${encodeURIComponent(error)}`);
  }
  redirect('/?login=1');
}

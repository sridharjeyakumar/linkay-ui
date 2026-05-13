'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks/useAppDispatch';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) router.replace('/login');
  }, [accessToken, router]);

  if (!accessToken) return null;
  return <>{children}</>;
}

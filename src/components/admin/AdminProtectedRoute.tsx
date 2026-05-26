'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks/useAppDispatch';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, user } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/admin/login');
      return;
    }
    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.replace('/admin/login');
    }
  }, [accessToken, user, router]);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  if (!accessToken || (user && !isAdmin)) return null;
  return <>{children}</>;
}

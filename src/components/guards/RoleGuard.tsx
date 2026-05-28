'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector } from '@/store/hooks/useAppDispatch';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  loginPath?: string;
}

const ROLE_DASHBOARD: Record<string, string> = {
  INVESTOR:    '/user-dashboard',
  MUSEUM_ADMIN: '/museum-dashboard',
  ADMIN:       '/admin/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
};

function correctDashboard(role: string): string {
  return ROLE_DASHBOARD[role] ?? '/';
}

export default function RoleGuard({ children, allowedRoles, loginPath = '/' }: RoleGuardProps) {
  const router = useRouter();
  const { authReady, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      router.replace(loginPath);
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(correctDashboard(user.role));
    }
  }, [authReady, user, router, loginPath, allowedRoles]);

  if (!authReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}

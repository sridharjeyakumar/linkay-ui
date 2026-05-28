'use client';

import { usePathname } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import RoleGuard from '@/components/guards/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <main>{children}</main>;
  }

  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']} loginPath="/admin/login">
      <AdminNavbar />
      <main>{children}</main>
    </RoleGuard>
  );
}

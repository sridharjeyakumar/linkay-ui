'use client';

import { usePathname } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <>
      {!isLoginPage && <AdminNavbar />}
      <main>{children}</main>
    </>
  );
}

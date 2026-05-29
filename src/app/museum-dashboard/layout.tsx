import { Box } from '@mui/material';
import MuseumAdminHeader from '@/components/museum-admin/MuseumAdminHeader';
import WalletProviders from '@/components/providers/WalletProviders';
import KycStatusWatcher from '@/components/user-dashboard/KycStatusWatcher';
import RoleGuard from '@/components/guards/RoleGuard';

export default function MuseumDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProviders>
      <RoleGuard allowedRoles={['MUSEUM_ADMIN']}>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <KycStatusWatcher />
          <MuseumAdminHeader />
          <Box component="main" sx={{ width: '100%', pt: 3, pb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            {children}
          </Box>
        </div>
      </RoleGuard>
    </WalletProviders>
  );
}

import { Box } from '@mui/material';
import UserDashboardHeader from '@/components/user-dashboard/UserDashboardHeader';
import KycStatusWatcher from '@/components/user-dashboard/KycStatusWatcher';
import WalletProviders from '@/components/providers/WalletProviders';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProviders>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <KycStatusWatcher />
        <UserDashboardHeader />
        <Box
          component="main"
          sx={{ width: '100%', pt: 3, pb: 6, px: { xs: 2, sm: 3, md: 4 } }}
        >
          {children}
        </Box>
      </div>
    </WalletProviders>
  );
}

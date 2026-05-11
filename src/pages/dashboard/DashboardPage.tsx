import { useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Chip, CircularProgress, Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { getKycStatusThunk } from '../../features/ekyc/ekycThunks';
import { getMeThunk, logoutThunk } from '../../features/auth/authThunks';

const KYC_STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' | 'info' }> = {
  NOT_STARTED:        { label: 'Not Started',        color: 'default' },
  PENDING:            { label: 'Under Review',        color: 'info' },
  APPROVED:           { label: 'Verified',            color: 'success' },
  REJECTED:           { label: 'Rejected',            color: 'error' },
  RESUBMIT_REQUIRED:  { label: 'Resubmission Needed', color: 'warning' },
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { kycStatus, loading, error } = useAppSelector((s) => s.ekyc);

useEffect(() => {
  if (!user) {
    dispatch(getMeThunk()).unwrap().catch(() => navigate('/login'));
  }
  dispatch(getKycStatusThunk());
}, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  const statusConfig = KYC_STATUS_CONFIG[kycStatus ?? 'NOT_STARTED'];
  const needsKyc = !kycStatus || kycStatus === 'NOT_STARTED' || kycStatus === 'RESUBMIT_REQUIRED';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* Welcome */}
        <Paper elevation={4} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Welcome, {user?.firstName || user?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {user?.role}
          </Typography>
        </Paper>

        {/* KYC Status */}
        <Paper elevation={4} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Identity Verification (KYC)</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={statusConfig.label}
                color={statusConfig.color}
                variant="filled"
              />

              {kycStatus === 'PENDING' && (
                <Typography variant="body2" color="text.secondary">
                  Your documents are under review. We'll notify you by email.
                </Typography>
              )}

              {kycStatus === 'APPROVED' && (
                <Typography variant="body2" color="success.main">
                  Your identity has been successfully verified.
                </Typography>
              )}

              {kycStatus === 'REJECTED' && (
                <Typography variant="body2" color="error.main">
                  Your verification was rejected. Please contact support.
                </Typography>
              )}

              {needsKyc && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/kyc')}
                  sx={{ ml: 'auto' }}
                >
                  {kycStatus === 'RESUBMIT_REQUIRED' ? 'Resubmit Documents' : 'Start Verification'}
                </Button>
              )}
            </Box>
          )}
        </Paper>

      </Box>
    </Box>
  );
}

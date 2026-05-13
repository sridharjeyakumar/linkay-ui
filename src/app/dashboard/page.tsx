'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, IconButton, Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import SumsubWebSdk from '@sumsub/websdk-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getKycStatusThunk, initKycThunk } from '@/features/ekyc/ekycThunks';
import { setKycStatus } from '@/features/ekyc/ekycSlice';
import { getMeThunk, logoutThunk } from '@/features/auth/authThunks';
import type { EkycState } from '@/types/ekyc.types';

type KycStatus = EkycState['kycStatus'];

interface KycBannerProps {
  status: KycStatus;
  onStart: () => void;
}

function KycBanner({ status, onStart }: KycBannerProps) {
  const startBtn = (label: string) => (
    <Button color="inherit" size="small" variant="outlined" onClick={onStart} sx={{ whiteSpace: 'nowrap' }}>
      {label}
    </Button>
  );

  switch (status) {
    case null:
    case 'NOT_STARTED':
      return (
        <Alert severity="warning" action={startBtn('Start Verification')}>
          Identity verification required to invest.
        </Alert>
      );
    case 'PENDING':
      return <Alert severity="info">Verification submitted. Under review.</Alert>;
    case 'APPROVED':
      return <Alert severity="success"><strong>Identity Verified</strong></Alert>;
    case 'REJECTED':
      return (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" variant="outlined" href="mailto:support@linkay.com">
              Contact Support
            </Button>
          }
        >
          Verification rejected.
        </Alert>
      );
    case 'RESUBMIT_REQUIRED':
      return (
        <Alert
          severity="warning"
          sx={{ bgcolor: 'warning.dark', color: '#fff', '& .MuiAlert-icon': { color: '#fff' } }}
          action={startBtn('Resubmit')}
        >
          Additional information required.
        </Alert>
      );
    default:
      return null;
  }
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { kycStatus, sdkToken, loading, error } = useAppSelector((s) => s.ekyc);

  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getMeThunk()).unwrap().catch(() => router.replace('/login'));
    }
    dispatch(getKycStatusThunk());
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.replace('/login');
  };

  const handleStartVerification = async () => {
    try {
      await dispatch(initKycThunk()).unwrap();
      setModalOpen(true);
    } catch {
      // error surfaced via Redux state
    }
  };

  const handleSdkMessage = (type: string, _payload: unknown) => {
    if (type === 'idCheck.onApplicantSubmitted') {
      dispatch(setKycStatus('PENDING'));
      setModalOpen(false);
    } else if (type === 'idCheck.onApplicantResubmissionRequested') {
      dispatch(setKycStatus('RESUBMIT_REQUIRED'));
    }
  };

  const handleSdkError = (err: unknown) => {
    console.error('[Sumsub]', err);
    setToastMsg('An error occurred during verification. Please try again.');
    setModalOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
        </Box>

        <Paper elevation={4} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Welcome, {user?.firstName || user?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">Role: {user?.role}</Typography>
        </Paper>

        <Paper elevation={4} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Identity Verification</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <KycBanner status={kycStatus} onStart={handleStartVerification} />
          )}
        </Paper>

      </Box>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        disableScrollLock
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Identity Verification
          <IconButton onClick={() => setModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, minHeight: 500 }}>
          {sdkToken && (
            <SumsubWebSdk
              accessToken={sdkToken}
              expirationHandler={async () => {
                const result = await dispatch(initKycThunk()).unwrap();
                return result.sdkToken;
              }}
              config={{ levelName: 'id-and-liveness' }}
              onMessage={handleSdkMessage}
              onError={handleSdkError}
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={!!toastMsg}
        autoHideDuration={5000}
        onClose={() => setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setToastMsg(null)}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

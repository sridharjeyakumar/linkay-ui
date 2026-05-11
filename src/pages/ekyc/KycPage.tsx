import { useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SumsubWebSdk from '@sumsub/websdk-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { initKycThunk } from '../../features/ekyc/ekycThunks';

export default function KycPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sdkToken, loading, error, kycStatus } = useAppSelector((s) => s.ekyc);

  useEffect(() => {
    dispatch(initKycThunk());
  }, []);

  if (kycStatus === 'APPROVED') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Paper elevation={6} sx={{ p: 4, maxWidth: 440, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>Your identity has been verified.</Alert>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4, px: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        Identity Verification
      </Typography>

      {error && (
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>{error}</Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {sdkToken && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          <SumsubWebSdk
            accessToken={sdkToken}
            expirationHandler={() => dispatch(initKycThunk())}
            onMessage={(type: string, payload: any) => {
              console.log('[Sumsub]', type, payload);
              if (type === 'idCheck.onApplicantSubmitted') {
                navigate('/dashboard');
              }
            }}
            onError={(error: any) => console.error('[Sumsub Error]', error)}
          />
        </Box>
      )}
    </Box>
  );
}

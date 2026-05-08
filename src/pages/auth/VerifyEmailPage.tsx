import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link.');
      return;
    }

    axiosInstance
      .get(`/api/v1/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Verification failed. The link may have expired.'
        );
      });
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 440, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Email Verification</Typography>
        {status === 'loading' && <CircularProgress />}

        {status === 'success' && (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>
            <Button variant="contained" fullWidth component={Link} to="/login">
              Go to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 3 }}>{message}</Alert>
            <Button variant="outlined" fullWidth component={Link} to="/register">
              Back to Register
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}

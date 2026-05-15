'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';

import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/api/axiosInstance';

const verifyChannel =
  typeof window !== 'undefined'
    ? new BroadcastChannel('email_verification')
    : null;

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');

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

        setMessage(
          res.data.message ||
            'Email verified successfully.'
        );

        verifyChannel?.postMessage({
          type: 'EMAIL_VERIFIED',
        });

        setTimeout(() => {
          window.close();
        }, 3000);
      })
      .catch((err) => {
        setStatus('error');

        setMessage(
          err.response?.data?.message ||
            'Verification failed. The link may have expired.'
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
        bgcolor: '#f4efef',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '24px',
          border: '1px solid #E8E8E8',
          bgcolor: '#FFFFFF',
          p: '32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Logo + Title */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <Image
            src="/Vector.svg"
            alt="Linkay Logo"
            width={38}
            height={38}
          />

          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '28px',
              color: '#3D3D3D',
              textAlign: 'center',
            }}
          >
            Email Verification
          </Typography>
        </Box>

        {status === 'loading' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress
              size={34}
              sx={{ color: '#0B2745' }}
            />

            <Typography
              sx={{
                fontSize: '14px',
                color: '#666666',
              }}
            >
              Verifying your email...
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Alert severity="success">
            {message} — You can close this tab.
          </Alert>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error">
              {message}
            </Alert>

            <Button
              component={Link}
              href="/register"
              variant="contained"
              fullWidth
              sx={{
                height: '52px',
                borderRadius: '8px',
                bgcolor: '#0B2745',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
                boxShadow: 'none',

                '&:hover': {
                  bgcolor: '#0a2035',
                  boxShadow: 'none',
                },
              }}
            >
              Back to Register
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}



'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/api/axiosInstance';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F6F6F6',
    borderRadius: '8px',
    height: '48px',
    '& fieldset': {
      borderColor: '#E8E8E8',
      top: 0,
    },
    '& legend': { display: 'none' },
    '&:hover fieldset': {
      borderColor: '#BDBDBD',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0B2745',
      borderWidth: '1.5px',
    },
  },

  '& .MuiInputBase-input': {
    color: '#0A0A0A',
    fontSize: '14px',
    padding: '13px 14px',

    '&::placeholder': {
      color: '#666666',
      opacity: 1,
    },
  },

  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #F6F6F6 inset',
    WebkitTextFillColor: '#0A0A0A',
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!email) {
      setEmailError('Email is required.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/api/v1/auth/forgot-password', {
        email: email.trim(),
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0D0D0D',
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
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: -1 }}>
            {error}
          </Alert>
        )}

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
            style={{ objectFit: 'contain' }}
          />

          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '28px',
              lineHeight: 1.2,
              color: '#3D3D3D',
              textAlign: 'center',
            }}
          >
            Forgot Password
          </Typography>

          <Typography
            sx={{
              fontSize: '14px',
              color: '#666666',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Enter your email and we&apos;ll send you a reset link
          </Typography>
        </Box>

        {submitted ? (
          <>
            <Alert severity="success">
              Reset link sent successfully. Please check your email.
            </Alert>

            <Button
              component={Link}
              href="/login"
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
              Back to Login
            </Button>
          </>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <TextField
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              error={!!emailError}
              helperText={emailError}
              fullWidth
              required
              autoComplete="off"
              sx={fieldSx}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                height: '52px',
                borderRadius: '8px',
                bgcolor: '#0B2745',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
                boxShadow: 'none',

                '&:hover': {
                  bgcolor: '#0a2035',
                  boxShadow: 'none',
                },

                '&.Mui-disabled': {
                  bgcolor: '#0B2745',
                  color: '#FFFFFF',
                  opacity: 0.7,
                },
              }}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  sx={{ color: '#FFFFFF' }}
                />
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <Typography
              sx={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#5A5A5A',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Remember your password?{' '}
              <Link
                href="/login"
                style={{
                  color: '#071A2F',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

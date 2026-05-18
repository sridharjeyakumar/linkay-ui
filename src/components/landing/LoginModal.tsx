'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography,
  Alert, CircularProgress, IconButton, InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { loginThunk } from '@/features/auth/authThunks';
import { clearMessages } from '@/features/auth/authSlice';
import axiosInstance from '@/api/axiosInstance';

const backdropFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const modalEnter = keyframes`
  from { opacity: 0; transform: scale(0.93) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F6F6F6',
    borderRadius: '8px',
    height: '48px',
    '& fieldset': { borderColor: '#E8E8E8', top: 0 },
    '& legend': { display: 'none' },
    '&:hover fieldset': { borderColor: '#BDBDBD' },
    '&.Mui-focused fieldset': { borderColor: '#0B2745', borderWidth: '1.5px' },
  },
  '& .MuiInputBase-input': {
    color: '#0A0A0A',
    fontSize: '14px',
    padding: '13px 14px',
    '&::placeholder': { color: '#666666', opacity: 1 },
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #F6F6F6 inset',
    WebkitTextFillColor: '#0A0A0A',
  },
};

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [navigating, setNavigating] = useState(false);

  const [fpEmail, setFpEmail] = useState('');
  const [fpEmailError, setFpEmailError] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState('');
  const [fpSubmitted, setFpSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    dispatch(clearMessages());
    setForm({ email: '', password: '' });
    setFieldErrors({});
    setView('login');
    setFpEmail('');
    setFpEmailError('');
    setFpError('');
    setFpSubmitted(false);
  }, [open, dispatch]);

  useEffect(() => {
    if (user) {
      setNavigating(true);
      onClose();
      router.replace('/user-dashboard');
    }
  }, [user, router, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.email) errors.email = 'Email is required.';
    if (!form.password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpEmail) { setFpEmailError('Email is required.'); return; }
    if (!/\S+@\S+\.\S+/.test(fpEmail)) { setFpEmailError('Enter a valid email.'); return; }
    setFpLoading(true);
    setFpError('');
    try {
      await axiosInstance.post('/api/v1/auth/forgot-password', { email: fpEmail.trim() });
      setFpSubmitted(true);
    } catch (err: any) {
      setFpError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await dispatch(loginThunk({ email: form.email.trim(), password: form.password }));
  };

  if (navigating) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <CircularProgress size={52} thickness={3} sx={{ color: '#ffffff' }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.75)', mt: 2.5, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
          Taking you to your dashboard…
        </Typography>
      </Box>
    );
  }

  if (!open) return null;

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        px: 2,
        animation: `${backdropFade} 0.25s ease forwards`,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '24px',
          border: '1px solid #E8E8E8',
          bgcolor: '#FFFFFF',
          p: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          animation: `${modalEnter} 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#0A0A0A',
            opacity: 0.4,
            '&:hover': { opacity: 1, bgcolor: 'rgba(0,0,0,0.06)' },
          }}
        >
          ✕
        </IconButton>

        {/* Logo + Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Image src="/Vector.svg" alt="Linkay Logo" width={38} height={38} style={{ objectFit: 'contain' }} />
          <Typography
            sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: '1.2', color: '#3D3D3D', textAlign: 'center' }}
          >
            {view === 'login' ? 'Welcome Back' : 'Forgot Password'}
          </Typography>
          {view === 'forgot' && (
            <Typography sx={{ fontSize: '14px', color: '#666666', textAlign: 'center', lineHeight: 1.5 }}>
              Enter your email and we&apos;ll send you a reset link
            </Typography>
          )}
        </Box>

        {view === 'login' ? (
          /* ── Login form ── */
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <Alert severity="error" sx={{ mt: -1 }}>{error}</Alert>}

            <TextField
              placeholder="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              error={!!fieldErrors.email} helperText={fieldErrors.email}
              fullWidth required autoComplete="off" sx={fieldSx}
            />

            <Box>
              <TextField
                placeholder="Password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                error={!!fieldErrors.password} helperText={fieldErrors.password}
                fullWidth required autoComplete="new-password" sx={fieldSx}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small" sx={{ color: '#D1D1D1', mr: 0.5 }}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box sx={{ textAlign: 'right', mt: 0.75 }}>
                <Typography
                  component="button"
                  type="button"
                  onClick={() => setView('forgot')}
                  sx={{ color: '#0B2745', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', p: 0, fontFamily: 'Inter, sans-serif' }}
                >
                  Forgot password?
                </Typography>
              </Box>
            </Box>

            <Button
              type="submit" variant="contained" fullWidth disabled={loading}
              sx={{ height: '52px', borderRadius: '8px', bgcolor: '#0B2745', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#0a2035', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: '#0B2745', color: '#FFFFFF', opacity: 0.7 } }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#FFFFFF' }} /> : 'Login'}
            </Button>

            {/* <Typography sx={{ textAlign: 'center', fontSize: '14px', color: '#5A5A5A', fontFamily: 'Inter, sans-serif' }}>
              First time?{' '}
              <Link href="/register" style={{ color: '#071A2F', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
            </Typography> */}
          </Box>
        ) : (
          /* ── Forgot password form ── */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fpError && <Alert severity="error">{fpError}</Alert>}

            {fpSubmitted ? (
              <>
                <Alert severity="success">Reset link sent! Please check your email.</Alert>
                <Button
                  variant="contained" fullWidth onClick={() => setView('login')}
                  sx={{ height: '52px', borderRadius: '8px', bgcolor: '#0B2745', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#0a2035', boxShadow: 'none' } }}
                >
                  Back to Login
                </Button>
              </>
            ) : (
              <Box component="form" onSubmit={handleForgotSubmit} noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TextField
                  placeholder="Email" type="email"
                  value={fpEmail} onChange={(e) => { setFpEmail(e.target.value); setFpEmailError(''); }}
                  error={!!fpEmailError} helperText={fpEmailError}
                  fullWidth required autoComplete="off" sx={fieldSx}
                />

                <Button
                  type="submit" variant="contained" fullWidth disabled={fpLoading}
                  sx={{ height: '52px', borderRadius: '8px', bgcolor: '#0B2745', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#0a2035', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: '#0B2745', color: '#FFFFFF', opacity: 0.7 } }}
                >
                  {fpLoading ? <CircularProgress size={22} sx={{ color: '#FFFFFF' }} /> : 'Send Reset Link'}
                </Button>

                <Typography sx={{ textAlign: 'center', fontSize: '14px', color: '#5A5A5A', fontFamily: 'Inter, sans-serif' }}>
                  Remember your password?{' '}
                  <Typography
                    component="button"
                    type="button"
                    onClick={() => setView('login')}
                    sx={{ color: '#071A2F', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', p: 0, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  >
                    Login
                  </Typography>
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

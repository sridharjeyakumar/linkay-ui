
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography,
  Alert, CircularProgress, Paper, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { loginThunk } from '@/features/auth/authThunks';
import { clearMessages } from '@/features/auth/authSlice';

/* Placeholder-only field style — matches register page */
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

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearMessages());
  }, []);

  useEffect(() => {
    if (user) router.replace('/user-dashboard');
  }, [user, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await dispatch(loginThunk({ email: form.email.trim(), password: form.password }));
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
      {/* Card — 400px wide, 24px radius, 32px padding, 32px gap between sections */}
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
          gap: '32px',
        }}
      >
        {error && <Alert severity="error" sx={{ mb: -2 }}>{error}</Alert>}

        {/* Logo + Title — 84px hug, 16px gap */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
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
              fontStyle: 'bold',
              fontSize: '28px',
              lineHeight: '1.2',
              color: '#3D3D3D',
              textAlign: 'center',
            }}
          >
            Welcome Back
          </Typography>
        </Box>

        {/* Fields + Button + Footer */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Email */}
          <TextField
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            fullWidth
            required
            autoComplete="off"
            sx={fieldSx}
          />

          {/* Password */}
          <Box>
            <TextField
              placeholder="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              fullWidth
              required
              autoComplete="new-password"
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: '#D1D1D1', mr: 0.5 }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ textAlign: 'right', mt: 0.75 }}>
              <Link
                href="/forgot-password"
                style={{ color: '#0B2745', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}
              >
                Forgot password?
              </Link>
            </Box>
          </Box>

          {/* Login Button */}
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
              '&:hover': { bgcolor: '#0a2035', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: '#0B2745', color: '#FFFFFF', opacity: 0.7 },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#FFFFFF' }} /> : 'Login'}
          </Button>

          {/* Footer */}
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#5A5A5A',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            First time ?{' '}
            <Link
              href="/register"
              style={{ color: '#071A2F', fontWeight: 700, textDecoration: 'none' }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

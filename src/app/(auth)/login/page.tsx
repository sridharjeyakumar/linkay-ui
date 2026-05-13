'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography,
  Alert, CircularProgress, Paper, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { loginThunk } from '@/features/auth/authThunks';
import { clearMessages } from '@/features/auth/authSlice';

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
    if (user) router.replace('/dashboard');
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
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 440 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 0.5 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Sign in to your Linkay account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            fullWidth
            required
            margin="normal"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ textAlign: 'right', mt: 0.5, mb: 1 }}>
            <Link href="/forgot-password" style={{ color: '#6C63FF', fontSize: 14 }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 1, mb: 1.5, py: 1.4 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#6C63FF' }}>
              Create one
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

'use client';

import { useState } from 'react';
import {
  Box, Button, TextField, Typography,
  Alert, CircularProgress, Paper, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (form.newPassword.length < 8 || !PASSWORD_REGEX.test(form.newPassword))
      errors.newPassword = 'Min 8 chars with uppercase, number & special character.';
    if (form.newPassword !== form.confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';
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
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/api/v1/auth/reset-password', {
        token,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 440, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>Invalid reset link.</Alert>
          <Button variant="outlined" fullWidth component={Link} href="/forgot-password">
            Request New Link
          </Button>
        </Paper>
      </Box>
    );
  }

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
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Enter your new password below
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {success ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset successful! Redirecting to login...
            </Alert>
            <Button variant="contained" fullWidth component={Link} href="/login">
              Go to Login
            </Button>
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="New Password"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={form.newPassword}
              onChange={handleChange}
              error={!!fieldErrors.newPassword}
              helperText={fieldErrors.newPassword || 'Min 8 chars, uppercase, number & special char'}
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

            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              fullWidth
              required
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2, mb: 1.5, py: 1.4 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

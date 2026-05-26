'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { loginThunk } from '@/features/auth/authThunks';
import { clearMessages } from '@/features/auth/authSlice';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FFFFFF',
    borderRadius: '6px',
    height: '44px',
    '& fieldset': { borderColor: '#E0E0E0', top: 0 },
    '& legend': { display: 'none' },
    '&:hover fieldset': { borderColor: '#BDBDBD' },
    '&.Mui-focused fieldset': { borderColor: '#163B7A', borderWidth: '1.5px' },
  },
  '& .MuiInputBase-input': {
    color: '#1A1A1A',
    fontSize: '14px',
    padding: '12px 14px',
    '&::placeholder': { color: '#AAAAAA', opacity: 1 },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: '4px',
    fontSize: '12px',
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #FFFFFF inset',
    WebkitTextFillColor: '#1A1A1A',
  },
};

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
      if (isAdmin) {
        if (rememberMe) localStorage.setItem('adminRememberMe', 'true');
        router.replace('/admin/dashboard');
      } else {
        setAccessDenied(true);
      }
    }
  }, [user, router, rememberMe]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!form.password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setAccessDenied(false);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setAccessDenied(false);
    await dispatch(loginThunk({ email: form.email.trim(), password: form.password }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fff7ed',
        px: 2,
        py: 4,
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: '22px' }}>
        <Image
          src="/linkay-logo.png"
          alt="LinkBlockAssets"
          width={220}
          height={62}
          style={{ objectFit: 'contain' }}
          priority
        />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: { xs: '24px', sm: '28px' },
          color: '#1A1A1A',
          textAlign: 'center',
          mb: '8px',
          letterSpacing: '-0.3px',
        }}
      >
        Sign in to your account
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: '#888888',
          textAlign: 'center',
          mb: '22px',
          maxWidth: '380px',
          lineHeight: 1.6,
        }}
      >
        Welcome back, enter your credentials to access your account.
      </Typography>

      {/* Error alert */}
      {(error || accessDenied) && (
        <Alert
          severity="error"
          sx={{
            width: '100%',
            maxWidth: '460px',
            borderRadius: '6px',
            fontSize: '13px',
            mb: '14px',
            '& .MuiAlert-message': { lineHeight: 1.5 },
          }}
        >
          {accessDenied
            ? 'Access denied. This portal is for administrators only.'
            : error}
        </Alert>
      )}

      {/* Form card — only the form lives inside, matching the Figma */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '15px',
          border: '1px solid #E8E8E8',
          bgcolor: '#FFFFFF',
          p: '24px',
          boxShadow: 'none',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Email */}
          <Box>
            <Typography
              component="label"
              htmlFor="admin-email"
              sx={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#1A1A1A',
                mb: '6px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Email
            </Typography>
            <TextField
              id="admin-email"
              placeholder="Enter admin email"
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
          </Box>

          {/* Password */}
          <Box>
            <Typography
              component="label"
              htmlFor="admin-password"
              sx={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#1A1A1A',
                mb: '6px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Password
            </Typography>
            <TextField
              id="admin-password"
              placeholder="Enter password"
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
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        sx={{ color: '#888888', mr: 0.3 }}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: '18px' }} />
                        ) : (
                          <Visibility sx={{ fontSize: '18px' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Forgot password — right-aligned, orange, exact Figma match */}
            <Box sx={{ textAlign: 'right', mt: '7px' }}>
              <Link
                href="/forgot-password"
                style={{
                  color: '#E87722',
                  fontSize: '13px',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </Box>

          {/* Remember Me */}
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
                sx={{
                  color: '#CCCCCC',
                  '&.Mui-checked': { color: '#163B7A' },
                  p: '3px',
                  mr: '6px',
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#555555',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Remember me
              </Typography>
            }
            sx={{ m: 0 }}
          />

          {/* Sign In button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              height: '44px',
              borderRadius: '8px',
              bgcolor: '#163B7A',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              textTransform: 'none',
              boxShadow: 'none',
              transition: 'background-color 0.2s ease',
              '&:hover': { bgcolor: '#122F63', boxShadow: 'none' },
              '&.Mui-disabled': {
                bgcolor: '#163B7A',
                color: '#FFFFFF',
                opacity: 0.65,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

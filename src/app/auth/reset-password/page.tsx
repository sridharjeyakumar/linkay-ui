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
  InputAdornment,
  IconButton,
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

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

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (
      form.newPassword.length < 8 ||
      !PASSWORD_REGEX.test(form.newPassword)
    ) {
      errors.newPassword =
        'Min 8 chars with uppercase, number & special character.';
    }

    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post(
        '/api/v1/auth/reset-password',
        {
          token,
          newPassword: form.newPassword,
        }
      );

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Reset failed. The link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
            textAlign: 'center',
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            Invalid reset link.
          </Alert>

          <Button
            component={Link}
            href="/forgot-password"
            variant="contained"
            fullWidth
            sx={{
              height: '52px',
              borderRadius: '8px',
              bgcolor: '#0B2745',
              textTransform: 'none',

              '&:hover': {
                bgcolor: '#0a2035',
              },
            }}
          >
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
            Reset Password
          </Typography>

          <Typography
            sx={{
              fontSize: '14px',
              color: '#666666',
              textAlign: 'center',
            }}
          >
            Enter your new password below
          </Typography>
        </Box>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {success ? (
          <>
            <Alert severity="success">
              Password reset successful! Redirecting to login...
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
                textTransform: 'none',

                '&:hover': {
                  bgcolor: '#0a2035',
                },
              }}
            >
              Go to Login
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
              placeholder="New Password"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={form.newPassword}
              onChange={handleChange}
              error={!!fieldErrors.newPassword}
              helperText={fieldErrors.newPassword}
              fullWidth
              required
              autoComplete="new-password"
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((v) => !v)
                        }
                        edge="end"
                        size="small"
                        sx={{
                          color: '#9E9E9E',
                          mr: 0.5,
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              placeholder="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              fullWidth
              required
              autoComplete="new-password"
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
                'Reset Password'
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}


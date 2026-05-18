'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, MenuItem,
  Alert, CircularProgress, Paper, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { registerThunk } from '@/features/auth/authThunks';
import { clearMessages } from '@/features/auth/authSlice';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'IN', name: 'India' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
];

const ROLES = [
  { value: 'INVESTOR', label: 'Investor', description: 'Invest in tokenized real-world assets' },
  { value: 'MUSEUM_ADMIN', label: 'Museum Admin', description: 'List and manage museum assets' },
];

const ROLE_FLAGS: Record<string, { isUser: boolean; isMuseumUser: boolean; isSuperAdmin: boolean }> = {
  INVESTOR:     { isUser: true, isMuseumUser: false, isSuperAdmin: false },
  MUSEUM_ADMIN: { isUser: true, isMuseumUser: true,  isSuperAdmin: false },
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, successMessage } = useAppSelector((s) => s.auth);
  const [isVerified, setIsVerified] = useState(searchParams.get('verified') === 'true');

  useEffect(() => {
    const channel = new BroadcastChannel('email_verification');
    channel.onmessage = (event) => {
      if (event.data?.type === 'EMAIL_VERIFIED') {
        setIsVerified(true);
        setTimeout(() => {
          router.replace('/login');
        }, 3000);
      }
    };
    return () => channel.close();
  }, [router]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryOfResidence: '',
    role: 'INVESTOR',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearMessages());
  }, []);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.email) errors.email = 'Email is required.';
    if (!form.countryOfResidence) errors.countryOfResidence = 'Please select a country.';
    if (!form.role) errors.role = 'Please select a role.';
    if (form.password.length < 8 || !PASSWORD_REGEX.test(form.password))
      errors.password = 'Min 8 chars with uppercase, number & special character.';
    if (form.password !== form.confirmPassword)
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
    const flags = ROLE_FLAGS[form.role];
    await dispatch(
      registerThunk({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        countryOfResidence: form.countryOfResidence,
        role: form.role,
        ...flags,
      })
    );
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
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 0.5 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Join Linkay — invest in real-world assets
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {isVerified && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your email has been verified! Redirecting to login in 3 seconds...{' '}
            <Link href="/login" style={{ color: 'inherit', fontWeight: 'bold' }}>
              Go now
            </Link>
          </Alert>
        )}

        {successMessage ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage} — Please check your email to verify your account.
            {form.role === 'MUSEUM_ADMIN' && (
              <Typography sx={{ fontSize: 12, mt: 0.5 }}>
                Museum Admin accounts are reviewed by our team. You will be notified once approved.
              </Typography>
            )}
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
                fullWidth
                required
                margin="normal"
              />
            </Box>

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
              label="I am registering as"
              name="role"
              value={form.role}
              onChange={handleChange}
              error={!!fieldErrors.role}
              helperText={fieldErrors.role}
              fullWidth
              required
              margin="normal"
              select
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  <Box>
                    <Typography variant="body1">{r.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {r.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Country of Residence"
              name="countryOfResidence"
              value={form.countryOfResidence}
              onChange={handleChange}
              error={!!fieldErrors.countryOfResidence}
              helperText={fieldErrors.countryOfResidence}
              fullWidth
              required
              margin="normal"
              select
            >
              {COUNTRIES.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password || 'Min 8 chars, uppercase, number & special char'}
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
              label="Confirm Password"
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#6C63FF' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

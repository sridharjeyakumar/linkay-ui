
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, MenuItem,
  Alert, CircularProgress, Paper, InputAdornment, IconButton, Radio,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { registerThunk } from '@/features/auth/authThunks';
import { clearMessages } from '@/features/auth/authSlice';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

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

const ROLE_FLAGS: Record<string, { isUser: boolean; isMuseumUser: boolean; isSuperAdmin: boolean }> = {
  INVESTOR:     { isUser: true,  isMuseumUser: false, isSuperAdmin: false },
  MUSEUM_ADMIN: { isUser: false, isMuseumUser: true,  isSuperAdmin: false },
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

const ROLE_OPTIONS = [
  { value: 'MUSEUM_ADMIN', label: 'Asset Owner', desc: 'Tokenize your assets' },
  { value: 'INVESTOR',     label: 'Investor',    desc: 'Invest in tokenized assets' },
];

/* Placeholder-only fields — no floating label, no notch gap */
const fieldSx = {
  mb: 1.5,
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F6F6F6',
    borderRadius: '8px',
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
  '& .MuiSelect-select': {
    color: '#0A0A0A',
    fontSize: '14px',
    padding: '13px 10px',
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #F6F6F6 inset',
    WebkitTextFillColor: '#0A0A0A',
  },
};

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
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => { dispatch(clearMessages()); }, []);

  /* All fields filled + any role selected → button becomes blue */
  const isAllFilled =
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.countryOfResidence !== '' &&
    form.password !== '' &&
    form.confirmPassword !== '' &&
    form.role !== '';

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

  const handleRoleSelect = (value: string) => {
    setForm((prev) => ({ ...prev, role: value }));
    setFieldErrors((prev) => ({ ...prev, role: '' }));
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
        bgcolor: '#0D0D0D',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 410,
          height: '650px',
          borderRadius: '16px',
          border: '1px solid #EFEFEF',
          boxShadow: '0px 4px 24px rgba(0,0,0,0.06)',
          bgcolor: '#FFFFFF',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
          <Image
            src="/Vector.svg"
            alt="Linkay Logo"
            width={38}
            height={38}
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            textAlign: 'center',
            mb: 2.5,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '48px',
            color: '#3D3D3D',
          }}
        >
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {isVerified && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your email has been verified! Redirecting to login in 3 seconds...{' '}
            <Link href="/login" style={{ color: 'inherit', fontWeight: 'bold' }}>Go now</Link>
          </Alert>
        )}

        {successMessage ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage} — Please check your email to verify your account.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">

            {/* First Name + Last Name */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                placeholder="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
                fullWidth
                required
                autoComplete="off"
                sx={fieldSx}
              />
              <TextField
                placeholder="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
                fullWidth
                required
                autoComplete="off"
                sx={fieldSx}
              />
            </Box>

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

            {/* Country of Residence */}
            <TextField
  name="countryOfResidence"
  value={form.countryOfResidence}
  onChange={handleChange}
  error={!!fieldErrors.countryOfResidence}
  helperText={fieldErrors.countryOfResidence}
  fullWidth
  required
  select
  sx={{
    ...fieldSx,
    '& .MuiSelect-icon': {
      color: '#7A7A7A',
      right: '20px',
      fontSize: '32px',
    },
  }}
  slotProps={{
    select: {
      displayEmpty: true,
      IconComponent: KeyboardArrowDownRoundedIcon,
      renderValue: (v: unknown) =>
        v ? (
          <span style={{ color: '#0A0A0A', fontSize: '14px' }}>
            {COUNTRIES.find((c) => c.code === v)?.name}
          </span>
        ) : (
          <span style={{ color: '#666666', fontSize: '14px' }}>
            Country of Residence
          </span>
        ),       
      MenuProps: {
        PaperProps: {
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
            border: '1px solid #ECECEC',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              padding: '10px 14px',
              borderRadius: '8px',
              mx: 0.5,
              my: 0.3,
            },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: '#F5F7FB',
            },
            '& .Mui-selected': {
              backgroundColor: '#EEF3FF !important',
              color: '#0B2745',
              fontWeight: 600,
            },
          },
        },
      },
    },
  }}
>
  {COUNTRIES.map((c) => (
    <MenuItem key={c.code} value={c.code}>
      {c.name}
    </MenuItem>
  ))}
</TextField>

            {/* Password */}
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
  sx={{
    ...fieldSx,
    mb: fieldErrors.password ? 1.5 : 1,
  }}
  slotProps={{
    formHelperText: {
      sx: {
        mt: 0.5,
        mb: 0,
        fontSize: '11px',
      },
    },
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword((v) => !v)}
            edge="end"
            size="small"
            sx={{ color: '#9E9E9E', mr: 0.5 }}
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

            {/* Confirm Password */}
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

            {/* Role — Radio Cards */}
            <Box sx={{ mt: 0.5, mb: 2 }}>
              {fieldErrors.role && (
                <Typography sx={{ fontSize: '12px', color: '#d32f2f', mb: 0.75, ml: 0.5 }}>
                  {fieldErrors.role}
                </Typography>
              )}
             <Box sx={{ display: 'flex', gap: 2 }}>
  {ROLE_OPTIONS.map((r) => {
    const selected = form.role === r.value;

    return (
      <Box
        key={r.value}
        onClick={() => handleRoleSelect(r.value)}
        sx={{
          width: '160px',
          height: '59px',
          border: selected ? '1px solid #1E40AF' : '1px solid #E8E8E8',
          borderRadius: '8px',
          pt: '12px',
          pr: '8px',
          pb: '8px',
          pl: '8px',
          cursor: 'pointer',
          bgcolor: selected ? 'rgba(30,64,175,0.05)' : '#F6F6F6',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        <Radio
          checked={selected}
          size="small"
          readOnly
          tabIndex={-1}
          sx={{
            p: 0,
            mt: '1px',
            color: selected ? '#1E40AF' : '#BDBDBD',
            '&.Mui-checked': {
              color: '#1E40AF',
            },
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: selected ? '#1E40AF' : '#262626',
              lineHeight: 1.2,
            }}
          >
            {r.label}
          </Typography>

         <Typography
  sx={{
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '10px',
    lineHeight: '24px',
    letterSpacing: '-0.04em',
    color: '#666666',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  }}
>
  {r.desc}
</Typography>
        </Box>
      </Box>
    );
  })}
</Box>
            </Box>

            {/* Submit Button — always enabled; validate() catches empty state */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mb: 2,
                py: 1.4,
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                textTransform: 'none',
                boxShadow: 'none',
                transition: 'background-color 0.35s ease, color 0.35s ease',
                bgcolor: isAllFilled ? '#0B2745' : '#D8DCE3',
                color: isAllFilled ? '#FFFFFF' : '#8A929E',
                '&:hover': {
                  bgcolor: isAllFilled ? '#0a2035' : '#CDD1D8',
                  boxShadow: 'none',
                },
                '&.Mui-disabled': {
                  bgcolor: '#0B2745',
                  color: '#FFFFFF',
                  opacity: 0.75,
                },
              }}
            >
              {loading
                ? <CircularProgress size={22} sx={{ color: '#FFFFFF' }} />
                : isAllFilled ? 'Send Verification Link' : 'Register'}
            </Button>

            <Typography sx={{ textAlign: 'center', fontSize: '14px', color: '#666666' }}>
              Have an account?{' '}
              <Link href="/login" style={{ color: '#0B2745', fontWeight: 600, textDecoration: 'none' }}>
                Login
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, Button, TextField, Typography, MenuItem,
  Alert, CircularProgress, IconButton, InputAdornment, Radio, Dialog,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { registerThunk } from '@/features/auth/authThunks';
import { clearMessages } from '@/features/auth/authSlice';


const COUNTRIES = [
  { code: 'US', name: 'United States',        flag: '/flags/us.png' },
  { code: 'GB', name: 'United Kingdom',        flag: '/flags/gb.png' },
  { code: 'AE', name: 'United Arab Emirates',  flag: '/flags/ae.png' },
  { code: 'NG', name: 'Nigeria',               flag: '/flags/ng.png' },
  { code: 'ZA', name: 'South Africa',          flag: '/flags/za.png' },
  { code: 'KE', name: 'Kenya',                 flag: '/flags/ke.png' },
  { code: 'GH', name: 'Ghana',                 flag: '/flags/gh.png' },
  { code: 'IN', name: 'India',                 flag: '/flags/in.png' },
  { code: 'CA', name: 'Canada',                flag: '/flags/ca.png' },
  { code: 'AU', name: 'Australia',             flag: '/flags/au.png' },
  { code: 'DE', name: 'Germany',               flag: '/flags/de.png' },
  { code: 'FR', name: 'France',                flag: '/flags/fr.png' },
  { code: 'SG', name: 'Singapore',             flag: '/flags/sg.png' },
  { code: 'JP', name: 'Japan',                 flag: '/flags/jp.png' },
  { code: 'BR', name: 'Brazil',                flag: '/flags/br.png' },
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

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ open, onClose, onSwitchToLogin }: RegisterModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, successMessage } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const channel = new BroadcastChannel('email_verification');
    channel.onmessage = (event) => {
      if (event.data?.type === 'EMAIL_VERIFIED') {
        onClose();
        onSwitchToLogin?.();
      }
    };
    return () => channel.close();
  }, [router, onClose]);

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Redirect backdrop scroll into the modal's scroll container
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!open) return;
    dispatch(clearMessages());
    setForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', countryOfResidence: '', role: '' });
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // iOS Safari ignores overflow:hidden on body — block backdrop touchmove with a
  // non-passive listener (passive:false is required to call preventDefault).
  // Touches inside the scrollable Box are allowed through; backdrop touches are blocked.
  useEffect(() => {
    if (!open) return;
    const blockBackdropScroll = (e: TouchEvent) => {
      if (scrollRef.current?.contains(e.target as Node)) return; // inside modal — allow
      e.preventDefault(); // on backdrop — block background scroll
    };
    document.addEventListener('touchmove', blockBackdropScroll, { passive: false });
    return () => document.removeEventListener('touchmove', blockBackdropScroll);
  }, [open]);


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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Not a valid email.';
    if (!form.countryOfResidence) errors.countryOfResidence = 'Please select a country.';
    if (!form.role) errors.role = 'Please select a role.';
    if (form.password.length < 8)
      errors.password = 'Password must be at least 8 characters.';
    else if (!/[A-Z]/.test(form.password))
      errors.password = 'Password must include at least one uppercase letter.';
    else if (!/[a-z]/.test(form.password))
      errors.password = 'Password must include at least one lowercase letter.';
    else if (!/\d/.test(form.password))
      errors.password = 'Password must include at least one number.';
    else if (!/[!@#$%^&*]/.test(form.password))
      errors.password = 'Password must include at least one special character (!@#$%^&*).';
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      onWheel={(e) => {
        if (scrollRef.current) scrollRef.current.scrollTop += e.deltaY;
      }}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        if (scrollRef.current) {
          const delta = touchStartY.current - e.touches[0].clientY;
          touchStartY.current = e.touches[0].clientY;
          scrollRef.current.scrollTop += delta;
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        },
        paper: {
          sx: {
            borderRadius: '24px',
            border: '1px solid #E8E8E8',
            bgcolor: '#FFFFFF',
            width: '100%',
            maxWidth: '410px',
            maxHeight: '90vh',
            m: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Scrollable content — backdrop wheel/touch is forwarded here via scrollRef */}
      <Box
        ref={scrollRef}
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          position: 'relative',
          p: { xs: '20px', sm: '32px' },
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', mb: 2.5 }}>
          <Image src="/landing/LinkBlock Assets Logo.svg" alt="Linkay Logo" width={38} height={38} style={{ objectFit: 'contain' }} />
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '24px', color: '#3D3D3D', textAlign: 'center' }}>
            Register
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {successMessage ? (
          <Alert severity="success">
            {successMessage} — Please check your email to verify your account.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
              <TextField
                placeholder="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
                fullWidth required autoComplete="off"
                sx={fieldSx}
              />
              <TextField
                placeholder="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
                fullWidth required autoComplete="off"
                sx={fieldSx}
              />
            </Box>

            <TextField
              placeholder="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              fullWidth required autoComplete="off"
              sx={fieldSx}
            />

            <TextField
              name="countryOfResidence"
              value={form.countryOfResidence}
              onChange={handleChange}
              error={!!fieldErrors.countryOfResidence}
              helperText={fieldErrors.countryOfResidence}
              fullWidth required select
              sx={{
                ...fieldSx,
                '& .MuiSelect-icon': { color: '#7A7A7A', right: '20px', fontSize: '32px' },
              }}
              slotProps={{
                select: {
                  displayEmpty: true,
                  IconComponent: KeyboardArrowDownRoundedIcon,
                  renderValue: (v: unknown) => {
                    const country = COUNTRIES.find((c) => c.code === v);
                    return country ? (
                      <span style={{ color: '#0A0A0A', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={country.flag} alt={country.name} width={20} height={14} style={{ borderRadius: '2px', objectFit: 'cover' }} />
                        {country.name}
                      </span>
                    ) : (
                      <span style={{ color: '#666666', fontSize: '14px' }}>Country of Residence</span>
                    );
                  },
                  MenuProps: {
                    disableScrollLock: true,
                    slotProps: {
                      paper: {
                        sx: {
                          mt: 1, 
                          borderRadius: '12px',
                          boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                          border: '1px solid #ECECEC',
                          maxHeight: '200px', // Fix for scroll
                          overflowY: 'auto',   // Fix for scroll
                          '& .MuiMenuItem-root': { fontSize: '14px', padding: '10px 14px', borderRadius: '8px', mx: 0.5, my: 0.3 },
                          '& .MuiMenuItem-root:hover': { backgroundColor: '#F5F7FB' },
                          '& .Mui-selected': { backgroundColor: '#EEF3FF !important', color: '#0B2745', fontWeight: 600 },
                        },
                      },
                    },
                  },
                },
              }}
            >
              {COUNTRIES.map((c) => (
                <MenuItem key={c.code} value={c.code} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.flag} alt={c.name} width={22} height={16} style={{ borderRadius: '2px', objectFit: 'cover', flexShrink: 0 }} />
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              placeholder="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              fullWidth required autoComplete="new-password"
              sx={{ ...fieldSx, mb: fieldErrors.password ? 1.5 : 1 }}
              slotProps={{
                formHelperText: { sx: { mt: 0.5, mb: 0, fontSize: '11px' } },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small" sx={{ color: '#9E9E9E', mr: 0.5 }}>
                        {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              placeholder="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              fullWidth required autoComplete="new-password"
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword((v) => !v)} edge="end" size="small" sx={{ color: '#9E9E9E', mr: 0.5 }}>
                        {showConfirmPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Role - Fixed responsive layout */}
            <Box sx={{ mt: 0.5, mb: 2 }}>
              {fieldErrors.role && (
                <Typography sx={{ fontSize: '12px', color: '#d32f2f', mb: 0.75, ml: 0.5 }}>
                  {fieldErrors.role}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                {ROLE_OPTIONS.map((r) => {
                  const selected = form.role === r.value;
                  return (
                    <Box
                      key={r.value}
                      onClick={() => handleRoleSelect(r.value)}
                      sx={{
                        flex: 1,
                        minHeight: '59px',
                        height: 'auto',
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
                        sx={{ p: 0, mt: '1px', flexShrink: 0, color: selected ? '#1E40AF' : '#BDBDBD', '&.Mui-checked': { color: '#1E40AF' } }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: selected ? '#1E40AF' : '#262626', lineHeight: 1.2 }}>
                          {r.label}
                        </Typography>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '10px', lineHeight: '16px', letterSpacing: '-0.04em', color: '#666666', whiteSpace: { xs: 'normal', sm: 'nowrap' } }}>
                          {r.desc}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

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
                '&:hover': { bgcolor: isAllFilled ? '#0a2035' : '#CDD1D8', boxShadow: 'none' },
                '&.Mui-disabled': { bgcolor: '#0B2745', color: '#FFFFFF', opacity: 0.75 },
              }}
            >
              {loading
                ? <CircularProgress size={22} sx={{ color: '#FFFFFF' }} />
                : isAllFilled ? 'Send Verification Link' : 'Register'}
            </Button>

            <Typography sx={{ textAlign: 'center', fontSize: '14px', color: '#666666' }}>
              Have an account?{' '}
              <Box
                component="span"
                onClick={onSwitchToLogin}
                sx={{ color: '#0B2745', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                Login
              </Box>
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
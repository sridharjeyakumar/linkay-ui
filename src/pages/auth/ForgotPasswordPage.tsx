import { useState } from 'react';
import {
  Box, Button, TextField, Typography,
  Alert, CircularProgress, Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!email) { setEmailError('Email is required.'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Enter a valid email.'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/api/v1/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 440 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 0.5 }}>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Enter your email and we'll send you a reset link
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {submitted ? (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your inbox.
            </Alert>
            <Button variant="outlined" fullWidth component={Link} to="/login">
              Back to Login
            </Button>
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              error={!!emailError}
              helperText={emailError}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#6C63FF' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

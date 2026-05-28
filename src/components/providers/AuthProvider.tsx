'use client';

import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getMeThunk } from '@/features/auth/authThunks';
import { setAuthReady } from '@/features/auth/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const authReady = useAppSelector((s) => s.auth.authReady);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      dispatch(getMeThunk()).finally(() => dispatch(setAuthReady()));
    } else {
      dispatch(setAuthReady());
    }
  }, []);

  if (!authReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

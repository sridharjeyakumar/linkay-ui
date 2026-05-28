'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getMeThunk } from '@/features/auth/authThunks';

export default function KycStatusWatcher() {
  const dispatch   = useAppDispatch();
  const kycStatus  = useAppSelector((s) => s.auth.user?.kycStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll every 5 s while KYC is PENDING so the UI auto-updates on approval
  useEffect(() => {
    if (kycStatus !== 'PENDING') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      dispatch(getMeThunk());
    }, 5000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [kycStatus, dispatch]);

  return null;
}

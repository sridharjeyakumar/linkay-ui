'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getMeThunk } from '@/features/auth/authThunks';

export default function KycStatusWatcher() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const kycStatus = useAppSelector((s) => s.auth.user?.kycStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // re-fetch user on every route change
  useEffect(() => {
    dispatch(getMeThunk());
  }, [pathname]);

  // re-fetch when user switches back to this browser tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        dispatch(getMeThunk());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch]);

  // poll every 5s while KYC is PENDING so UI auto-updates when approved
  useEffect(() => {
    if (kycStatus === 'PENDING') {
      intervalRef.current = setInterval(() => {
        dispatch(getMeThunk());
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [kycStatus, dispatch]);

  return null;
}

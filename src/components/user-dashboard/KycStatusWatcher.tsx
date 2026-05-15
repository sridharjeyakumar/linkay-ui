'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks/useAppDispatch';
import { getMeThunk } from '@/features/auth/authThunks';

export default function KycStatusWatcher() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // re-fetch user (includes kycStatus from DB) on every route change
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

  return null;
}

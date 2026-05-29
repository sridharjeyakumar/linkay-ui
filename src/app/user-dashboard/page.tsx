'use client';

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getKycStatusThunk } from '@/features/ekyc/ekycThunks';
import { DashboardFilterProvider } from '@/context/DashboardFilterContext';
import FilterSidebar from '@/components/user-dashboard/home/FilterSidebar';
import TrendingCollections from '@/components/user-dashboard/home/TrendingCollections';
import LiveAuctions from '@/components/user-dashboard/home/LiveAuctions';

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(getKycStatusThunk());
  }, []);

  return (
    <DashboardFilterProvider>
      <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 6, alignItems: 'flex-start' }}>

        {/* Left: filter sidebar */}
        <FilterSidebar />

        {/* Center: main content — stops at the same x as the bell icon */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TrendingCollections />
          <LiveAuctions />
        </Box>

        {/* Right: reserved column matching the header right-controls width.
            Empty now; add a panel here later if needed. */}
        <Box sx={{ width: { md: 420 }, flexShrink: 0, display: { xs: 'none', md: 'block' } }} />

      </Box>
    </DashboardFilterProvider>
  );
}

'use client';

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getKycStatusThunk } from '@/features/ekyc/ekycThunks';
import { DashboardFilterProvider } from '@/context/DashboardFilterContext';
import FilterSidebar from '@/components/user-dashboard/home/FilterSidebar';
import TrendingCollections from '@/components/user-dashboard/home/TrendingCollections';
import LiveAuctions from '@/components/user-dashboard/home/LiveAuctions';
import UpcomingAuctions from '@/components/user-dashboard/home/UpcomingAuctions';

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

        {/* Right: Upcoming Auctions panel */}
        <Box sx={{ width: { xs: '100%', md: 267 }, flexShrink: 0, pt: { xs: 2, md: 1.5 } }}>
          <UpcomingAuctions />
        </Box>

      </Box>
    </DashboardFilterProvider>
  );
}

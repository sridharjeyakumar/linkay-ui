'use client';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { CATEGORIES } from '@/data/dashboardData';
import { useDashboardFilter } from '@/context/DashboardFilterContext';

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={
        active
          ? {
              px: 2,
              py: 0.7,
              bgcolor: '#1a73e8',
              borderRadius: 6,
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              userSelect: 'none',
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }
          : {
              px: 2,
              py: 0.7,
              border: '1px solid #ddd',
              borderRadius: 6,
              cursor: 'pointer',
              color: '#333',
              fontWeight: 400,
              fontSize: 13,
              userSelect: 'none',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.15s, color 0.15s',
              '&:hover': { borderColor: '#1a73e8', color: '#1a73e8' },
            }
      }
    >
      {label}
    </Box>
  );
}

function DesktopSidebar() {
  const { activeCategory, setActiveCategory } = useDashboardFilter();

  return (
    <Box
      sx={{
        flexShrink: 0,
        width: 160,
        position: 'sticky',
        top: 80,
        alignSelf: 'flex-start',
        ml: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 2 }}>
        <TuneIcon sx={{ fontSize: 18, color: '#333' }} />
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#333' }}>
          All Filters
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </Box>
    </Box>
  );
}

function MobileChipBar() {
  const { activeCategory, setActiveCategory } = useDashboardFilter();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 1,
        mb: 2,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {CATEGORIES.map((cat) => (
        <CategoryPill
          key={cat}
          label={cat}
          active={activeCategory === cat}
          onClick={() => setActiveCategory(cat)}
        />
      ))}
    </Box>
  );
}

export default function FilterSidebar() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return isDesktop ? <DesktopSidebar /> : <MobileChipBar />;
}

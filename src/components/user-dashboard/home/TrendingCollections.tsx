'use client';

import { Box, Grid, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Collection } from '@/data/dashboardData';
import { useDashboardFilter } from '@/context/DashboardFilterContext';
import { useDashboardData } from '@/hooks/useDashboardData';

function ViewAllButton() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', mt: 1.5 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          bgcolor: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s',
          '&:hover': { bgcolor: '#333' },
        }}
      >
        <ArrowOutwardIcon sx={{ color: '#fff', fontSize: 17 }} />
      </Box>
      <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#111' }}>View all</Typography>
    </Box>
  );
}

function CollectionCard({ item }: { item: Collection }) {
  const [main, t1, t2, t3] = item.previewImages;

  return (
    <Box>
      {/* Mosaic: 1 large image left, 3 thumbnails stacked right */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '4px',
          aspectRatio: '2 / 1',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={main}
          alt={item.title}
          sx={{ gridRow: '1 / 4', width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {[t1, t2, t3].map((src, i) => (
          <Box
            key={i}
            component="img"
            src={src}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ))}
      </Box>

      {/* Info row: title + chip */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.5 }}>
        <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 15, md: 18 }, color: '#111' }}>
          {item.title}
        </Typography>
        <Box
          sx={{
            flexShrink: 0,
            px: 1.5,
            py: 0.4,
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: 12,
            color: '#555',
            whiteSpace: 'nowrap',
          }}
        >
          Total {item.totalItems} Items
        </Box>
      </Box>

      <ViewAllButton />
    </Box>
  );
}

export default function TrendingCollections() {
  const { activeCategory } = useDashboardFilter();
  const { collections } = useDashboardData(activeCategory);

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 16, md: 20 }, color: '#111', mb: 2.5 }}>
        Trending Collections
      </Typography>

      {collections.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 3, border: '1px dashed #ddd' }}>
          <Typography sx={{ color: '#aaa', fontSize: 15 }}>No collections found for this category.</Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {collections.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
              <CollectionCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

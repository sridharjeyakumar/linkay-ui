'use client';

import {
  Box, Button, Chip, Dialog, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Typography,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import { useAppSelector } from '@/store/hooks/useAppDispatch';
import type { Asset } from '@/types/asset.types';

const ASSET_TYPE_LABELS: Record<string, string> = {
  'REAL_ESTATE':  'Real Estate',
  'FINE_ART':     'Fine Art',
  'LUXURY_ASSET': 'Luxury Asset',
  'LUXURY_WATCH': 'Luxury Watch',
  'COLLECTIBLE':  'Collectible',
  'OTHER':        'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  'FINE_ART':     '#e8d5f5',
  'REAL_ESTATE':  '#fde8f0',
  'LUXURY_ASSET': '#d5eaf5',
  'LUXURY_WATCH': '#dce8f5',
  'COLLECTIBLE':  '#d5f5e3',
  'OTHER':        '#f5f0d5',
};

interface Props {
  open: boolean;
  onClose: () => void;
  onEdit: (asset: Asset) => void;
  onTokenize: (asset: Asset) => void;
}

export default function DraftsModal({ open, onClose, onEdit: _onEdit, onTokenize }: Props) {
  const { assets } = useAppSelector((s) => s.assets);
  const drafts = assets.filter((a) => a.status === 'DRAFT');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, bgcolor: '#fff' } } }}
    >
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, pt: 2.5, px: 3 }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#111' }}>Drafts</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onClose}
          sx={{ minWidth: 70, borderColor: '#d1d5db', color: '#374151', borderRadius: 2, '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' } }}
        >
          Close
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {drafts.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ color: '#9ca3af' }}>No drafts yet.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                  {['Asset', 'Category', 'Last Updated', 'Updated By', 'Actions'].map((col) => (
                    <TableCell key={col} sx={{ color: '#374151', fontWeight: 600, fontSize: 13, py: 1.5 }}>
                      {col !== 'Actions' ? (
                        <TableSortLabel sx={{ color: '#374151 !important', '& .MuiTableSortLabel-icon': { color: '#374151 !important' } }}>
                          {col}
                        </TableSortLabel>
                      ) : col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {drafts.map((asset) => (
                  <TableRow key={asset.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Typography sx={{ fontSize: 14, color: '#111' }}>{asset.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType}
                        size="small"
                        sx={{ bgcolor: CATEGORY_COLORS[asset.assetType] ?? '#eee', fontWeight: 500, fontSize: 12 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
                        {asset.updatedAt
                          ? new Date(asset.updatedAt).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })
                          : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
                        {asset.updatedBy ?? 'Admin'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<BoltIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => onTokenize(asset)}
                        sx={{
                          bgcolor: '#f59e0b',
                          '&:hover': { bgcolor: '#d97706' },
                          fontSize: 12,
                          px: 2,
                          py: 0.75,
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: 'none',
                        }}
                      >
                        Tokenize
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f3f4f6',
    borderRadius: '8px',
    fontSize: 14,
    color: '#111',
    cursor: 'text',
    '& fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: '1.5px solid #3b6ef8' },
  },
};

export const disabledInputSx = {
  ...inputSx,
  '& .Mui-disabled': {
    WebkitTextFillColor: '#374151 !important',
    bgcolor: '#f3f4f6',
    borderRadius: '8px',
  },
};

export const selectSx = {
  bgcolor: '#f3f4f6',
  borderRadius: '8px',
  fontSize: 14,
  color: '#111',
  '& fieldset': { border: 'none' },
  '& .MuiSelect-select': { py: '10px' },
};

export const btnPrimary = {
  bgcolor: '#3b6ef8',
  color: '#fff',
  borderRadius: 10,
  px: 3,
  py: 1,
  fontWeight: 700,
  fontSize: 13,
  textTransform: 'none' as const,
  letterSpacing: 0.3,
  '&:hover': { bgcolor: '#2d5fe8' },
  '&.Mui-disabled': { bgcolor: '#c7d4fd', color: '#fff' },
};

export const btnSecondary = {
  bgcolor: '#374151',
  color: '#fff',
  borderRadius: 10,
  px: 3,
  py: 1,
  fontWeight: 700,
  fontSize: 13,
  textTransform: 'none' as const,
  letterSpacing: 0.3,
  '&:hover': { bgcolor: '#1f2937' },
};

export const ASSET_TYPE_LABELS: Record<string, string> = {
  REAL_ESTATE: 'Real Estate',
  FINE_ART: 'Fine Art',
  LUXURY_ASSET: 'Luxury Asset',
  LUXURY_WATCH: 'Luxury Watch',
  COLLECTIBLE: 'Collectible',
  OTHER: 'Other',
};

export function fmtCurrency(n?: number | null): string {
  if (n == null || isNaN(Number(n))) return '—';
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}`;
}

export function parseImages(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return (raw as string[]).filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p.filter(Boolean) : [];
    } catch { return []; }
  }
  return [];
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour.toString().padStart(2, '0')}:${(m ?? 0).toString().padStart(2, '0')} ${period}`;
}

export function calcDuration(startDate: string, startTime: string, endDate: string, endTime: string): string {
  if (!startDate || !startTime || !endDate || !endTime) return '';
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 'Invalid range';
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
}

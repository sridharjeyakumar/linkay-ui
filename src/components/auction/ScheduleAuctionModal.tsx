'use client';

import { useRef } from 'react';
import {
  Box, Button, Dialog, IconButton, MenuItem,
  Select, Switch, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AuctionLabel } from './shared/AuctionLabel';
import { btnPrimary, calcDuration, formatDateDisplay, formatTimeDisplay } from './shared/styles';

const TIMEZONES = [
  'UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+5:30',
  'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12',
  'UTC-1', 'UTC-2', 'UTC-3', 'UTC-4', 'UTC-5', 'UTC-6', 'UTC-7', 'UTC-8',
];

export interface ScheduleValues {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  showCountdown: boolean;
}

interface Props {
  open: boolean;
  values: ScheduleValues;
  onChange: (field: keyof ScheduleValues, value: string | boolean) => void;
  onCancel: () => void;
  onSchedule: () => void;
}

const pickerBoxSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  bgcolor: '#fff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  px: 1.5,
  py: 1.1,
  cursor: 'pointer',
  position: 'relative' as const,
  userSelect: 'none' as const,
  '&:hover': { borderColor: '#9ca3af' },
};

// ── sub-component: date picker input ─────────────────────────────────────────

function DateInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const display = value ? formatDateDisplay(value) : '';

  return (
    <Box>
      <AuctionLabel required={required}>{label}</AuctionLabel>
      <Box
        onClick={() => {
          try { ref.current?.showPicker?.(); } catch { ref.current?.click(); }
        }}
        sx={pickerBoxSx}
      >
        <CalendarTodayOutlinedIcon sx={{ color: '#6b7280', fontSize: 17, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 14, color: display ? '#111' : '#9ca3af', flex: 1 }}>
          {display || 'Select Date'}
        </Typography>
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 1,
            height: 1,
            border: 'none',
            background: 'transparent',
            pointerEvents: 'none',
          }}
          tabIndex={-1}
        />
      </Box>
    </Box>
  );
}

// ── sub-component: time picker input ─────────────────────────────────────────

function TimeInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const display = value ? formatTimeDisplay(value) : '';

  return (
    <Box>
      <AuctionLabel required={required}>{label}</AuctionLabel>
      <Box
        onClick={() => {
          try { ref.current?.showPicker?.(); } catch { ref.current?.click(); }
        }}
        sx={pickerBoxSx}
      >
        <AccessTimeOutlinedIcon sx={{ color: '#6b7280', fontSize: 17, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 14, color: display ? '#111' : '#9ca3af', flex: 1 }}>
          {display || 'Select Time'}
        </Typography>
        <input
          ref={ref}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 1,
            height: 1,
            border: 'none',
            background: 'transparent',
            pointerEvents: 'none',
          }}
          tabIndex={-1}
        />
      </Box>
    </Box>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function ScheduleAuctionModal({ open, values, onChange, onCancel, onSchedule }: Props) {
  const duration = calcDuration(values.startDate, values.startTime, values.endDate, values.endTime);

  const canSchedule =
    !!values.startDate &&
    !!values.startTime &&
    !!values.endDate &&
    !!values.endTime &&
    !!values.timezone &&
    duration !== 'Invalid range';

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: '#fff',
            width: { xs: '100%', sm: 560 },
            maxWidth: { xs: '100%', sm: 560 },
            maxHeight: { xs: '95vh', sm: '92vh' },
            m: { xs: 0, sm: 2, md: 'auto' },
            alignSelf: { xs: 'flex-end', sm: 'center' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: '#111', mb: 0.5 }}>
              Schedule Auction
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, maxWidth: 420 }}>
              Configure the auction timeline, bidding behavior, investor eligibility, and settlement
              rules before publishing the auction.
            </Typography>
          </Box>
          <IconButton size="small" onClick={onCancel} sx={{ color: '#6b7280', p: 0.5, ml: 1, flexShrink: 0 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ borderBottom: '1px solid #f0f0f0', mt: 1.5, flexShrink: 0 }} />

      {/* Scrollable body */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 3,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
        }}
      >
        {/* Row 1: Start date + Start time */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <DateInput
            label="Auction Start Date"
            value={values.startDate}
            onChange={(v) => onChange('startDate', v)}
            required
          />
          <TimeInput
            label="Auction Start Time"
            value={values.startTime}
            onChange={(v) => onChange('startTime', v)}
            required
          />
        </Box>

        {/* Row 2: End date + End time */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <DateInput
            label="Auction End Date"
            value={values.endDate}
            onChange={(v) => onChange('endDate', v)}
            required
          />
          <TimeInput
            label="Auction End Time"
            value={values.endTime}
            onChange={(v) => onChange('endTime', v)}
            required
          />
        </Box>

        {/* Row 3: Duration + Timezone */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <AuctionLabel>Auction Duration</AuctionLabel>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                px: 1.5,
                py: 1.1,
              }}
            >
              <Typography sx={{ fontSize: 14, color: duration ? '#111' : '#9ca3af', flex: 1 }}>
                {duration || 'Auto calculated'}
              </Typography>
            </Box>
          </Box>

          <Box>
            <AuctionLabel required>Timezone</AuctionLabel>
            <Select
              fullWidth
              size="small"
              value={values.timezone}
              displayEmpty
              onChange={(e) => onChange('timezone', e.target.value)}
              sx={{
                bgcolor: '#fff',
                borderRadius: '8px',
                fontSize: 14,
                color: '#111',
                '& fieldset': { borderColor: '#d1d5db' },
                '&:hover fieldset': { borderColor: '#9ca3af !important' },
                '& .MuiSelect-select': { py: '10px' },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select</em>
              </MenuItem>
              {TIMEZONES.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Show countdown toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Switch
            checked={values.showCountdown}
            onChange={(e) => onChange('showCountdown', e.target.checked)}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#3b6ef8' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#3b6ef8' },
            }}
          />
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
            Show countdown publicly
          </Typography>
          <Typography sx={{ fontSize: 13, color: values.showCountdown ? '#3b6ef8' : '#9ca3af', fontWeight: 600 }}>
            {values.showCountdown ? 'On' : 'Off'}
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: '1px solid #f0f0f0', flexShrink: 0 }} />
      <Box
        sx={{
          flexShrink: 0,
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            fontWeight: 600,
            fontSize: 13,
            color: '#374151',
            textTransform: 'none',
            '&:hover': { bgcolor: '#f9fafb' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSchedule}
          disabled={!canSchedule}
          startIcon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
          sx={btnPrimary}
        >
          Schedule Auction
        </Button>
      </Box>
    </Dialog>
  );
}

'use client';

import {
  AppBar, Toolbar, Box, Button, IconButton,
  Avatar, Badge, Menu, MenuItem, Divider, Tooltip, Typography,
  Drawer, List, ListItemButton, ListItemText, useMediaQuery, useTheme,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { logoutThunk } from '@/features/auth/authThunks';

const NAV_LINKS = [
  { label: 'Dashboard',  href: '/museum-dashboard' },
  { label: 'My Assets',  href: '/museum-dashboard/assets' },
  { label: 'Investors',  href: '/museum-dashboard/investors' },
  { label: 'Analytics',  href: '/museum-dashboard/analytics' },
  { label: 'Logs',       href: '/museum-dashboard/logs' },
  { label: 'Settings',   href: '/museum-dashboard/settings' },
];

export default function MuseumAdminHeader() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const pathname = usePathname();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useAppSelector((s) => s.auth);

  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [menuAnchor,  setMenuAnchor]  = useState<null | HTMLElement>(null);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user?.email ?? '';
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '';

  const isActive = (href: string) =>
    href === '/museum-dashboard' ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    setMenuAnchor(null);
    await dispatch(logoutThunk());
    router.replace('/');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', color: '#111' }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto 1fr',
            alignItems: 'center',
            minHeight: { xs: 56, md: 64 },
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            href="/museum-dashboard"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <img src="/logo.png" alt="LinkBlockAssets" style={{ height: isMobile ? 44 : 56, width: 'auto' }} />
          </Box>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {NAV_LINKS.map(({ label, href }) => (
                <Button
                  key={href}
                  component={Link}
                  href={href}
                  disableRipple
                  sx={{
                    fontWeight: isActive(href) ? 700 : 400,
                    fontSize: 14,
                    color: isActive(href) ? '#111' : '#666',
                    borderBottom: isActive(href) ? '2px solid #111' : '2px solid transparent',
                    borderRadius: 0,
                    px: 1.5,
                    py: 2.5,
                    minWidth: 0,
                    textTransform: 'none',
                    '&:hover': { color: '#111', bgcolor: 'transparent' },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right: bell + avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Notifications">
              <IconButton size="medium" sx={{ color: '#555' }}>
                <Badge badgeContent={0} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={displayName}>
              <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#1a73e8', width: 36, height: 36, fontSize: 13 }}>
                  {initials}
                </Avatar>
                {!isMobile && (
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
                    {displayName}
                  </Typography>
                )}
              </IconButton>
            </Tooltip>

            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#555' }}>
                <MenuIcon />
              </IconButton>
            )}

            {/* Profile menu */}
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{ paper: { sx: { minWidth: 200, mt: 1 } } }}
            >
              <MenuItem disabled sx={{ flexDirection: 'column', alignItems: 'flex-start', opacity: '1 !important' }}>
                <Typography variant="subtitle2" sx={{ color: '#111' }}>{displayName}</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>{user?.email}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} slotProps={{ paper: { sx: { width: 260 } } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
          <img src="/logo.png" alt="LinkBlockAssets" style={{ height: 40, width: 'auto' }} />
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <List>
          {NAV_LINKS.map(({ label, href }) => (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={isActive(href)}
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 1, mx: 1, '&.Mui-selected': { bgcolor: '#f0f4ff', fontWeight: 700 } }}
            >
              <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: isActive(href) ? 700 : 400, fontSize: 15 } } }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}

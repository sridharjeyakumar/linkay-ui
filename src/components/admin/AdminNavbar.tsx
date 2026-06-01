'use client';

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { logoutThunk } from '@/features/auth/authThunks';

const NAV_LINKS = [
  { label: 'Dashboard',          href: '/admin/dashboard' },
  { label: 'Asset Governance',   href: '/admin/asset-governance' },
  { label: 'Auction Governance', href: '/admin/auction-governance' },
  { label: 'User & Compliance',  href: '/admin/user-compliance' },
  { label: 'Analytics',          href: '/admin/analytics' },
];

export default function AdminNavbar() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const pathname = usePathname();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useAppSelector((s) => s.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : 'Super Admin';

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? 'A');

  const isActive = (href: string) =>
    href === '/admin/dashboard'
      ? pathname === href
      : (pathname ?? '').startsWith(href);

  const handleLogout = async () => {
    setMenuAnchor(null);
    await dispatch(logoutThunk());
    router.replace('/admin/login');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E8E8E8',
          color: '#111111',
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: '56px', md: '60px' },
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto' : '220px 1fr auto',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* ── Logo ── */}
          <Box
            component={Link}
            href="/admin/dashboard"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Image
              src="/linkay-logo.png"
              alt="LinkBlockAssets"
              width={160}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>

          {/* ── Desktop nav links ── */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              {NAV_LINKS.map(({ label, href }) => (
                <Button
                  key={href}
                  component={Link}
                  href={href}
                  disableRipple
                  sx={{
                    fontSize: '14px',
                    fontWeight: isActive(href) ? 700 : 400,
                    color: isActive(href) ? '#111111' : '#555555',
                    borderBottom: isActive(href)
                      ? '2px solid #163B7A'
                      : '2px solid transparent',
                    borderRadius: 0,
                    px: '12px',
                    py: '18px',
                    minWidth: 0,
                    textTransform: 'none',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: 0,
                    '&:hover': {
                      color: '#111111',
                      bgcolor: 'transparent',
                      borderBottomColor: '#163B7A',
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          {/* ── Right: bell + avatar ── */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            {/* Bell */}
            <Tooltip title="Notifications">
              <IconButton size="medium" sx={{ color: '#555555' }}>
                <Badge badgeContent={0} color="error">
                  <NotificationsNoneIcon sx={{ fontSize: '22px' }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar + name */}
            <Tooltip title={displayName}>
              <IconButton
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ p: 0, display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', px: '6px', py: '4px' }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#0D9488',
                    width: 34,
                    height: 34,
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {initials}
                </Avatar>
                {!isMobile && (
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#111111',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {displayName}
                  </Typography>
                )}
              </IconButton>
            </Tooltip>

            {/* Hamburger — mobile only */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#555555' }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Profile dropdown menu ── */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: { minWidth: 200, mt: '8px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
          },
        }}
      >
        <MenuItem
          disabled
          sx={{ flexDirection: 'column', alignItems: 'flex-start', opacity: '1 !important', py: '10px' }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111', fontFamily: 'Inter, sans-serif' }}>
            {displayName}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
            {user?.email ?? ''}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ color: '#EF4444', fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
        >
          Logout
        </MenuItem>
      </Menu>

      {/* ── Mobile drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 270 } } }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            p: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #E8E8E8',
          }}
        >
          <Image
            src="/linkay-logo.png"
            alt="LinkBlockAssets"
            width={140}
            height={36}
            style={{ objectFit: 'contain' }}
          />
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: '#555' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer user info */}
        <Box sx={{ px: '16px', py: '14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #F0F0F0' }}>
          <Avatar sx={{ bgcolor: '#0D9488', width: 36, height: 36, fontSize: '13px', fontWeight: 700 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111', fontFamily: 'Inter, sans-serif' }}>
              {displayName}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
              {user?.email ?? ''}
            </Typography>
          </Box>
        </Box>

        {/* Drawer nav links */}
        <List sx={{ pt: '8px' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={isActive(href)}
              onClick={() => setDrawerOpen(false)}
              sx={{
                borderRadius: '8px',
                mx: '8px',
                mb: '2px',
                '&.Mui-selected': {
                  bgcolor: '#EEF2FF',
                  '& .MuiListItemText-primary': { color: '#163B7A', fontWeight: 700 },
                },
                '&:hover': { bgcolor: '#F5F5F5' },
              }}
            >
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: '14px',
                      fontWeight: isActive(href) ? 700 : 400,
                      color: isActive(href) ? '#163B7A' : '#333333',
                      fontFamily: 'Inter, sans-serif',
                    },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>

        {/* Drawer logout */}
        <Box sx={{ mt: 'auto', p: '16px', borderTop: '1px solid #F0F0F0' }}>
          <Button
            fullWidth
            onClick={handleLogout}
            sx={{
              color: '#EF4444',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              '&:hover': { bgcolor: '#FEF2F2', borderColor: '#EF4444' },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

'use client';

import {
  AppBar, Toolbar, Box, Button, IconButton,
  Avatar, Badge, Menu, MenuItem, Divider, Tooltip,
  Dialog, DialogTitle, DialogContent, Snackbar, Alert, CircularProgress,
  Drawer, List, ListItemButton, ListItemText, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SumsubWebSdk from '@sumsub/websdk-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { logoutThunk, getMeThunk } from '@/features/auth/authThunks';
import { initKycThunk } from '@/features/ekyc/ekycThunks';
import { saveWalletThunk } from '@/features/wallet/walletThunks';

const NAV_LINKS = [
  { label: 'Home', href: '/user-dashboard' },
  { label: 'Explore', href: '/user-dashboard/explore' },
  { label: 'Portfolio', href: '/user-dashboard/portfolio' },
  { label: 'Auctions', href: '/user-dashboard/auctions' },
  { label: 'Marketplace', href: '/user-dashboard/marketplace' },
];

type KycBtnConfig = { label: string; bgColor: string; clickable: boolean } | null;

function kycButtonConfig(status: string | null | undefined): KycBtnConfig {
  switch (status) {
    case null:
    case undefined:
    case 'NOT_STARTED':
      return { label: 'Complete KYC', bgColor: '#1a73e8', clickable: true };
    case 'RESUBMIT_REQUIRED':
      return { label: 'Resubmit KYC', bgColor: '#f59e0b', clickable: true };
    case 'PENDING':
      return { label: 'KYC Pending', bgColor: '#f59e0b', clickable: false };
    case 'REJECTED':
      return { label: 'KYC Rejected', bgColor: '#ef4444', clickable: false };
    case 'APPROVED':
      return null;
    default:
      return null;
  }
}

export default function UserDashboardHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useAppSelector((s) => s.auth);
  const { sdkToken, loading: kycLoading } = useAppSelector((s) => s.ekyc);

  const { openConnectModal } = useConnectModal();
  const { address: wagmiAddress, status: walletStatus } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Only show address when wagmi explicitly confirms status = 'connected'
  const connectedAddress = (walletStatus === 'connected' && wagmiAddress) ? wagmiAddress : null;
  const shortAddress = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : null;

  // Guard: if wagmi auto-reconnected with a wallet that doesn't belong to this user, disconnect it
  useEffect(() => {
    if (walletStatus === 'connected' && wagmiAddress && user) {
      const savedAddress = user.walletAddress?.toLowerCase();
      const liveAddress = wagmiAddress.toLowerCase();
      if (savedAddress && savedAddress !== liveAddress) {
        disconnectWallet();
      }
    }
  }, [user?.id, walletStatus, wagmiAddress]);

  // Auto-save wallet address to backend when user connects a wallet
  useEffect(() => {
    if (walletStatus === 'connected' && wagmiAddress && user && !user.walletAddress) {
      dispatch(saveWalletThunk(wagmiAddress))
        .unwrap()
        .then(() => dispatch(getMeThunk()))
        .catch(() => {
          setToastMsg('Wallet connected but could not be saved — backend endpoint not ready yet.');
        });
    }
  }, [walletStatus, wagmiAddress, user?.walletAddress]);
  useEffect(() => {
    if (user?.kycStatus !== 'PENDING') return;
    const interval = setInterval(() => {
      dispatch(getMeThunk());
    }, 5_000);
    return () => clearInterval(interval);
  }, [user?.kycStatus]);
  const handleLogout = async () => {
    setProfileMenuAnchor(null);
    disconnectWallet();
    await dispatch(logoutThunk());
    router.replace('/');
  };

  const handleKycClick = async () => {
    try {
      await dispatch(initKycThunk()).unwrap();
      setKycModalOpen(true);
    } catch {
      setToastMsg('Failed to start KYC. Please try again.');
    }
  };

 const handleSdkMessage = (type: string) => {
    if (
      type === 'idCheck.onApplicantSubmitted' ||
      type === 'idCheck.onApplicantResubmissionRequested'
    ) {
      setKycModalOpen(false);
      dispatch(getMeThunk());
    }
    // ← ADD: when Sumsub confirms approval, re-fetch immediately
    if (type === 'idCheck.onApplicantStatusChanged') {
      dispatch(getMeThunk());
    }
  };

  const handleSdkError = () => {
    setToastMsg('An error occurred during verification. Please try again.');
    setKycModalOpen(false);
  };

  const kycBtn = kycButtonConfig(user?.kycStatus ?? null);
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user?.email ?? '';
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '';

  const isActive = (href: string) =>
    pathname === href || (href !== '/user-dashboard' && pathname.startsWith(href));

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
            href="/user-dashboard"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <img
              src="/logo.png"
              alt="LinkBlockAssets"
              style={{ height: isMobile ? 44 : 56, width: 'auto' }}
            />
          </Box>

          {/* Desktop nav — center */}
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

          {/* Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 }, justifyContent: 'flex-end' }}>

            {/* Bell */}
            <Tooltip title="Notifications">
              <IconButton size="medium" sx={{ color: '#555' }}>
                <Badge badgeContent={0} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* KYC button — only render once user is loaded to avoid flicker */}
            {!isMobile && user && kycBtn && (
              <Button
                variant="contained"
                disabled={!kycBtn.clickable || kycLoading}
                onClick={kycBtn.clickable ? handleKycClick : undefined}
                startIcon={kycLoading ? null : <VerifiedUserIcon sx={{ fontSize: 18 }} />}
                sx={{
                  bgcolor: kycBtn.bgColor,
                  '&:hover': { bgcolor: kycBtn.bgColor, filter: 'brightness(0.92)' },
                  '&.Mui-disabled': { bgcolor: kycBtn.bgColor, opacity: 0.7, color: '#fff' },
                  borderRadius: 6,
                  px: 2,
                  py: 0.8,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#fff',
                  minWidth: 150,
                  boxShadow: 'none',
                }}
              >
                {kycLoading ? <CircularProgress size={16} color="inherit" /> : kycBtn.label}
              </Button>
            )}

            {/* Connect Wallet / Wallet address — shown only when KYC is approved */}
            {!isMobile && user && user.kycStatus === 'APPROVED' && (
              shortAddress ? (
                <Button
                  variant="outlined"
                  startIcon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: 6,
                    px: 2,
                    py: 0.8,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#111',
                    borderColor: '#ccc',
                    minWidth: 160,
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#111', bgcolor: 'transparent' },
                  }}
                >
                  {shortAddress}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={openConnectModal}
                  startIcon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderRadius: 6,
                    px: 2,
                    py: 0.8,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#111',
                    borderColor: '#ccc',
                    minWidth: 160,
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#111', bgcolor: 'transparent' },
                  }}
                >
                  Connect Wallet
                </Button>
              )
            )}

            {/* Avatar */}
            <Tooltip title={displayName}>
              <IconButton onClick={(e) => setProfileMenuAnchor(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#1a73e8', width: { xs: 32, md: 36 }, height: { xs: 32, md: 36 }, fontSize: 13 }}>
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Hamburger — mobile only */}
            {isMobile && (
              <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: '#555' }}>
                <MenuIcon />
              </IconButton>
            )}

            {/* Profile menu */}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={() => setProfileMenuAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{ paper: { sx: { minWidth: 200, mt: 1 } } }}
            >
              <MenuItem disabled sx={{ flexDirection: 'column', alignItems: 'flex-start', opacity: '1 !important' }}>
                <Typography variant="subtitle2" sx={{ color: '#111' }}>{displayName}</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>{user?.email}</Typography>
                <Typography variant="caption" sx={{ color: '#aaa' }}>{user?.role}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 260 } } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
          <img src="/logo.png" alt="LinkBlockAssets" style={{ height: 40, width: 'auto' }} />
          <IconButton onClick={() => setMobileDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* KYC button in drawer */}
        {user && kycBtn && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              disabled={!kycBtn.clickable || kycLoading}
              onClick={() => { setMobileDrawerOpen(false); if (kycBtn.clickable) handleKycClick(); }}
              sx={{
                bgcolor: kycBtn.bgColor,
                '&:hover': { bgcolor: kycBtn.bgColor, filter: 'brightness(0.92)' },
                '&.Mui-disabled': { bgcolor: kycBtn.bgColor, opacity: 0.7, color: '#fff' },
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 600,
                color: '#fff',
                boxShadow: 'none',
              }}
            >
              {kycBtn.label}
            </Button>
          </Box>
        )}

        {/* Connect Wallet in drawer — shown when KYC approved */}
        {user && user.kycStatus === 'APPROVED' && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                setMobileDrawerOpen(false);
                if (!shortAddress) openConnectModal?.();
              }}
              sx={{
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 600,
                color: '#111',
                borderColor: '#ccc',
                boxShadow: 'none',
                '&:hover': { borderColor: '#111', bgcolor: 'transparent' },
              }}
            >
              {shortAddress ?? 'Connect Wallet'}
            </Button>
          </Box>
        )}

        <List>
          {NAV_LINKS.map(({ label, href }) => (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={isActive(href)}
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': { bgcolor: '#f0f4ff', color: '#111', fontWeight: 700 },
              }}
            >
              <ListItemText
                primary={label}
                slotProps={{ primary: { sx: { fontWeight: isActive(href) ? 700 : 400, fontSize: 15 } } }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* KYC Modal */}
      <Dialog open={kycModalOpen} onClose={() => setKycModalOpen(false)} maxWidth="md" fullWidth disableScrollLock>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Identity Verification
          <IconButton onClick={() => setKycModalOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, minHeight: 500 }}>
          {sdkToken && (
            <SumsubWebSdk
              accessToken={sdkToken}
              expirationHandler={async () => {
                const result = await dispatch(initKycThunk()).unwrap();
                return result.sdkToken;
              }}
              config={{ levelName: 'id-and-liveness' }}
              onMessage={handleSdkMessage}
              onError={handleSdkError}
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={!!toastMsg}
        autoHideDuration={5000}
        onClose={() => setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setToastMsg(null)}>{toastMsg}</Alert>
      </Snackbar>
    </>
  );
}

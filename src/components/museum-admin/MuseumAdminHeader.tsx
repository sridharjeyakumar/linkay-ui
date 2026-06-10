'use client';

import {
  AppBar, Toolbar, Box, Button, IconButton,
  Avatar, Badge, Menu, MenuItem, Divider, Tooltip, Typography,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, CircularProgress,
  Drawer, List, ListItemButton, ListItemText, useMediaQuery, useTheme,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SumsubWebSdk from '@sumsub/websdk-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { logoutThunk, getMeThunk } from '@/features/auth/authThunks';
import { initKycThunk } from '@/features/ekyc/ekycThunks';
import { bindWalletThunk } from '@/features/wallet/walletThunks';

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
      return { label: 'KYC Pending', bgColor: '#f59e0b', clickable: true };
    case 'REJECTED':
      return { label: 'KYC Rejected', bgColor: '#ef4444', clickable: false };
    case 'APPROVED':
      return null;
    default:
      return null;
  }
}

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
  const { sdkToken, loading: kycLoading } = useAppSelector((s) => s.ekyc);

  const { openConnectModal } = useConnectModal();
  const { address: wagmiAddress, status: walletStatus } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [menuAnchor,   setMenuAnchor]   = useState<null | HTMLElement>(null);
  const [toastMsg,     setToastMsg]     = useState<string | null>(null);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [bindingWallet, setBindingWallet] = useState(false);

  const connectedAddress = (walletStatus === 'connected' && wagmiAddress) ? wagmiAddress : null;
  const shortAddress = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : null;

  // Guard: disconnect if wallet doesn't belong to this admin
  useEffect(() => {
    if (walletStatus === 'connected' && wagmiAddress && user) {
      const savedAddress = user.walletAddress?.toLowerCase();
      const liveAddress = wagmiAddress.toLowerCase();
      if (savedAddress && savedAddress !== liveAddress) {
        disconnectWallet();
      }
    }
  }, [user?.id, walletStatus]);

  // Bind wallet on first connect — get nonce, sign, call wallet-bind
  useEffect(() => {
    if (walletStatus === 'connected' && wagmiAddress && user && !user.walletAddress && !bindingWallet) {
      setBindingWallet(true);
      dispatch(bindWalletThunk({
        address: wagmiAddress,
        signMessage: (msg) => signMessageAsync({ message: msg }),
      }))
        .unwrap()
        .then(() => dispatch(getMeThunk()))
        .catch(() => {
          setToastMsg('Wallet connected but could not be verified — please try again.');
        })
        .finally(() => setBindingWallet(false));
    }
  }, [walletStatus, wagmiAddress, user?.walletAddress]);

  const kycBtn = kycButtonConfig(user?.kycStatus ?? null);

  const handleKycClick = async () => {
    try {
      await dispatch(initKycThunk()).unwrap();
      dispatch(getMeThunk());
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
  };

  const handleSdkError = () => {
    setToastMsg('An error occurred during verification. Please try again.');
    setKycModalOpen(false);
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user?.email ?? '';
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '';

  const isActive = (href: string) =>
    href === '/museum-dashboard' ? pathname === href : (pathname ?? '').startsWith(href);

  const handleLogout = async () => {
    setMenuAnchor(null);
    disconnectWallet();
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

          {/* Right: bell + wallet + avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Notifications">
              <IconButton size="medium" sx={{ color: '#555' }}>
                <Badge badgeContent={0} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* KYC button — desktop */}
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
                  borderRadius: 6, px: 2, py: 0.8,
                  textTransform: 'none', fontWeight: 600, fontSize: 14,
                  color: '#fff', minWidth: 150, boxShadow: 'none',
                }}
              >
                {kycLoading ? <CircularProgress size={16} color="inherit" /> : kycBtn.label}
              </Button>
            )}

            {/* Connect Wallet — desktop, only when KYC approved */}
            {!isMobile && user && user.kycStatus === 'APPROVED' && (
              shortAddress ? (
                <Button
                  variant="outlined"
                  startIcon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: 6, px: 2, py: 0.8,
                    textTransform: 'none', fontWeight: 600, fontSize: 13,
                    color: '#111', borderColor: '#ccc', minWidth: 160, boxShadow: 'none',
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
                    borderRadius: 6, px: 2, py: 0.8,
                    textTransform: 'none', fontWeight: 600, fontSize: 14,
                    color: '#111', borderColor: '#ccc', minWidth: 160, boxShadow: 'none',
                    '&:hover': { borderColor: '#111', bgcolor: 'transparent' },
                  }}
                >
                  Connect Wallet
                </Button>
              )
            )}

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
        {/* KYC button in drawer */}
        {user && kycBtn && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              disabled={!kycBtn.clickable || kycLoading}
              onClick={() => { setDrawerOpen(false); if (kycBtn.clickable) handleKycClick(); }}
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

        {/* Connect Wallet in drawer — only when KYC approved */}
        {user && user.kycStatus === 'APPROVED' && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                setDrawerOpen(false);
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
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 1, mx: 1, '&.Mui-selected': { bgcolor: '#f0f4ff', fontWeight: 700 } }}
            >
              <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: isActive(href) ? 700 : 400, fontSize: 15 } } }} />
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

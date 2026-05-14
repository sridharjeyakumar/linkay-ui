'use client';

import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, IconButton,
  Menu, MenuItem, Drawer, List,
  ListItemButton, ListItemText, Divider, Container, Collapse,
  Typography, Chip,
} from '@mui/material';
import { Bank, Buildings, Cube, Warehouse, Coins, type Icon } from '@phosphor-icons/react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollTrigger } from '@mui/material';

type DropdownItem = {
  label: string;
  icon: Icon;
  description?: string;
  comingSoon?: boolean;
};

type NavLink = {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
};

const NAV_LINKS: NavLink[] = [
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Tokenization', href: '#tokenization' },
  { label: 'How It Works', href: '#how-it-works' },
  {
    label: 'Asset Classes',
    href: '#asset-classes',
    dropdown: [
      { label: 'Museum Artifacts', icon: Bank },
      { label: 'Real Estate', icon: Buildings },
      { label: 'Minerals', icon: Cube, comingSoon: true },
    ],
  },
  {
    label: 'For You',
    href: '#for-you',
    dropdown: [
      { label: 'For Asset Owners', icon: Warehouse, description: 'Tokenize and launch real world assets' },
      { label: 'For Investors', icon: Coins, description: 'Access tokenized asset opportunities' },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
  const [registerHovered, setRegisterHovered] = useState(false);

  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 20 });

  const openDropdown = (key: string, e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl((prev) => ({ ...prev, [key]: e.currentTarget }));

  const closeDropdown = (key: string) =>
    setAnchorEl((prev) => ({ ...prev, [key]: null }));

  const toggleMobileExpand = (label: string) =>
    setMobileExpanded((prev) => (prev === label ? null : label));

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled ? '#ffffff' : 'transparent',
          borderBottom: scrolled ? '1px solid #e5e7eb' : 'none',
          color: 'text.primary',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
          <Toolbar disableGutters sx={{ py: { xs: 0.5, md: 1 }, minHeight: { xs: 56, md: 64 } }}>

            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 }, mr: { md: 5 }, textDecoration: 'none' }}
            >
              <Image
                src="/landing/logo.svg"
                alt="LinkBlockAssets"
                width={160}
                height={38}
                style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: 38 }}
                priority
                unoptimized
              />
            </Box>

            {/* Desktop nav links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', gap: { md: 0, lg: 1 }, flexGrow: 1 }}>
              {NAV_LINKS.map((link) =>
                link.dropdown ? (
                  <Box key={link.label}>
                    <Button
                      onClick={(e) => openDropdown(link.label, e)}
                      endIcon={
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: '1rem',
                            transition: 'transform 0.2s',
                            transform: anchorEl[link.label] ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      }
                      sx={{
                        color: '#374151',
                        fontWeight: 400,
                        fontSize: { md: '0.82rem', lg: '0.92rem' },
                        textTransform: 'none',
                        px: { md: 1.2, lg: 1.8 },
                        '&:hover': { color: '#1565c0', bgcolor: 'transparent' },
                      }}
                    >
                      {link.label}
                    </Button>
                    <Menu
                      anchorEl={anchorEl[link.label]}
                      open={Boolean(anchorEl[link.label])}
                      onClose={() => closeDropdown(link.label)}
                      elevation={3}
                      sx={{ mt: 1 }}
                      slotProps={{ paper: { sx: { borderRadius: 2, minWidth: link.label === 'For You' ? 300 : 240, py: 0.5, bgcolor: '#EFF6FF' } } }}
                    >
                      {link.dropdown.map((item, idx, arr) => (
                        <Box key={item.label}>
                          <MenuItem
                            onClick={() => closeDropdown(link.label)}
                            sx={{ px: 2, py: item.description ? 1.5 : 1.2, alignItems: 'flex-start', '&:hover': { bgcolor: '#f5f7fa' } }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, width: '100%' }}>
                              <Box sx={{ mt: item.description ? 0.2 : 0, color: '#374151', flexShrink: 0 }}>
                                <item.icon size={20} />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: 1.5, letterSpacing: 0, color: '#0A0A0A' }}>
                                    {item.label}
                                  </Typography>
                                  {item.comingSoon && (
                                    <Chip label="Coming Soon" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#e8eaf6', color: '#5c6bc0', fontWeight: 500 }} />
                                  )}
                                </Box>
                                {item.description && (
                                  <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', mt: 0.3, lineHeight: 1.4 }}>
                                    {item.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </MenuItem>
                          {idx < arr.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </Menu>
                  </Box>
                ) : (
                  <Button
                    key={link.label}
                    href={link.href}
                    sx={{
                      color: '#374151',
                      fontWeight: 400,
                      fontSize: { md: '0.82rem', lg: '0.92rem' },
                      textTransform: 'none',
                      px: { md: 1.2, lg: 1.8 },
                      '&:hover': { color: '#1565c0', bgcolor: 'transparent' },
                    }}
                  >
                    {link.label}
                  </Button>
                )
              )}
            </Box>

            {/* Desktop auth buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Button
                component={Link}
                href="/login"
                sx={{
                  color: '#111827',
                  fontWeight: 600,
                  fontSize: { md: '0.85rem', lg: '0.95rem' },
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'transparent', color: '#1565c0' },
                }}
              >
                Login
              </Button>

              <Button
                component={Link}
                href="/register"
                variant="contained"
                onMouseEnter={() => setRegisterHovered(true)}
                onMouseLeave={() => setRegisterHovered(false)}
                startIcon={
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#FAFAFA',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src="/landing/arrow-default.svg"
                      alt="arrow"
                      width={20}
                      height={20}
                      unoptimized
                      style={{
                        position: 'absolute',
                        opacity: registerHovered ? 0 : 1,
                        transform: registerHovered ? 'scale(0.6)' : 'scale(1)',
                        transition: 'opacity 0.15s ease, transform 0.15s ease',
                      }}
                    />
                    <Image
                      src="/landing/arrow-hover.svg"
                      alt="arrow"
                      width={20}
                      height={20}
                      unoptimized
                      style={{
                        position: 'absolute',
                        opacity: registerHovered ? 1 : 0,
                        transform: registerHovered ? 'scale(1)' : 'scale(0.6)',
                        transition: 'opacity 0.15s ease, transform 0.15s ease',
                      }}
                    />
                  </Box>
                }
                sx={{
                  bgcolor: '#0A0A0A',
                  color: '#FAFAFA',
                  borderRadius: '50px',
                  px: { md: 2, lg: 2.5 },
                  py: 1,
                  fontWeight: 600,
                  fontSize: { md: '0.85rem', lg: '0.95rem' },
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' },
                  transition: 'all 0.2s ease',
                }}
              >
                Register
              </Button>
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#111827' }}
            >
              <MenuIcon />
            </IconButton>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { width: { xs: '80vw', sm: 300 } } } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List disablePadding>
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <Box key={link.label}>
                <ListItemButton onClick={() => toggleMobileExpand(link.label)}>
                  <ListItemText
                    primary={link.label}
                    slotProps={{ primary: { sx: { fontWeight: 500, color: '#111827' } } }}
                  />
                  <ExpandMoreIcon
                    sx={{
                      transition: 'transform 0.2s',
                      transform: mobileExpanded === link.label ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: '#6b7280',
                      fontSize: '1.2rem',
                    }}
                  />
                </ListItemButton>
                <Collapse in={mobileExpanded === link.label}>
                  <List disablePadding>
                    {link.dropdown.map((item) => (
                      <ListItemButton key={item.label} sx={{ pl: 4 }} onClick={() => setMobileOpen(false)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                          <item.icon size={18} color="#6b7280" />
                          <ListItemText
                            primary={item.label}
                            slotProps={{ primary: { sx: { fontSize: '0.9rem', color: '#6b7280' } } }}
                          />
                          {item.comingSoon && (
                            <Chip label="Soon" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#e8eaf6', color: '#5c6bc0' }} />
                          )}
                        </Box>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
                <Divider />
              </Box>
            ) : (
              <Box key={link.label}>
                <ListItemButton component="a" href={link.href} onClick={() => setMobileOpen(false)}>
                  <ListItemText
                    primary={link.label}
                    slotProps={{ primary: { sx: { fontWeight: 500, color: '#111827' } } }}
                  />
                </ListItemButton>
                <Divider />
              </Box>
            )
          )}
        </List>

        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            fullWidth
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600, borderColor: '#111827', color: '#111827' }}
          >
            Login
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="contained"
            fullWidth
            onClick={() => setMobileOpen(false)}
            startIcon={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', borderRadius: '50%', width: 20, height: 20, p: 0.4 }}>
                <Image src="/landing/arrow-default.svg" alt="arrow" width={12} height={12} unoptimized />
              </Box>
            }
            sx={{ bgcolor: '#0A0A0A', color: '#FAFAFA', borderRadius: '50px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#1a1a1a' } }}
          >
            Register
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

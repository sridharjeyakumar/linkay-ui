'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { Archivo, Inter } from 'next/font/google';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const faqData = [
  {
    question: 'What types of assets qualify?',
    answer:
      'LinkBlock Assets supports premium real-world assets including museum artifacts, real estate, and emerging asset categories.',
  },
  {
    question: 'How long does the review process take?',
    answer:
      'Review timelines vary based on asset category, documentation, and verification requirements.',
  },
  {
    question: 'How is ownership structured?',
    answer:
      'Approved assets are digitally structured into fractional ownership units for marketplace participation.',
  },
  {
    question: 'Can ownership be traded after launch?',
    answer:
      'Yes,Ownership units can be securely traded within the LinkBlock Assets marketplace.',
  },
  {
    question: 'What documentation is required?',
    answer:
      'Documentation requirements depend on the asset category and ownership structure.',
  },
  {
    question: 'Is tokenization available globally?',
    answer:
      'Availability may vary depending on jurisdiction and regulatory considerations.',
  },
];
 
export default function OwnershipSection() {
  const [expanded, setExpanded] = useState<string | false>('panel0');
  const [btnHovered, setBtnHovered] = useState(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        position: 'relative',
        width: '100%',
        pb: { xs: '80px', md: '120px' },
      }}
    >
      <Box
        sx={{
          maxWidth: '1440px',
          mx: 'auto',
          px: { xs: '20px', md: '0' },
        }}
      >
        {/* ═══════════════════════════════════════════════
            FAQ ACCORDION
            Figma: width 994, centered (left 223 in 1440)
            gap: 14px between items
        ═══════════════════════════════════════════════ */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '994px',
            mx: 'auto',
            pt: { xs: '60px', md: '80px' },
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              disableGutters
              elevation={0}
              sx={{
                width: '100%',
                borderRadius: '15px !important',
                border: '1px solid #737373',
                background:
                  expanded === `panel${index}`
                    ? 'linear-gradient(90deg, rgba(172, 221, 247, 0.2) 0%, rgba(172, 221, 247, 0.2) 100%)'
                    : '#FAFAFA',
                overflow: 'hidden',
                '&::before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: '#737373',
                      fontSize: '28px',
                    }}
                  />
                }
                sx={{
                  px: { xs: '20px', md: '43px' },
                  pt: '26px',
                  pb: expanded === `panel${index}` ? '0px' : '25px',
                  pr: '26px',
                  minHeight: 'unset',
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                  },
                  '& .MuiAccordionSummary-expandIconWrapper': {
                    alignSelf: 'center',
                  },
                }}
              >
                <Typography
                  className={inter.className}
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: '16px', md: '20px' },
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000',
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  px: { xs: '20px', md: '43px' },
                  pt: '21px',
                  pb: '30px',
                  pr: '26px',
                }}
              >
                <Typography
                  className={inter.className}
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: '15px', md: '18px' },
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#737373',
                    maxWidth: '751px',
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* ═══════════════════════════════════════════════
            CTA BANNER
            Figma: width 1196, height 239, centered
            border-radius: 28px, border: 2px solid #ABE2FB
            background gradient: #0EA5E9 → #C2FFFB → #0EA5E9
        ═══════════════════════════════════════════════ */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1196px',
            height: { xs: 'auto', md: '239px' },
            mx: 'auto',
            mt: { xs: '60px', md: '80px' },
            mb: { xs: '100px', md: '10px' },
            borderRadius: '28px',
            border: '2px solid #ABE2FB',
            background:
              'linear-gradient(90deg, #0EA5E9 0%, #C2FFFB 50%, #0EA5E9 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: '30px', md: '60px' },
            py: { xs: '40px', md: '0' },
            gap: { xs: '24px', md: '30px' },
            boxSizing: 'border-box',
          }}
        >
          {/* ── Heading ── */}
          <Typography
            component="h2"
            className={archivo.className}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '28px', sm: '36px', md: '48px' },
              lineHeight: '100%',
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
              maxWidth: '680px',
              textAlign: 'center',
            }}
          >
            The Future of Asset Ownership
          </Typography>

          {/* ── Buttons Container ── */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
            }}
          >
            {/* Get Started — dark button with arrow */}
            <Box
              component={Link}
              href="/tokenize"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                bgcolor: '#0A0A0A',
                borderRadius: '30px',
                pl: '13px',
            pr: '16px',
            py: '6px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                height: '40px',
                boxSizing: 'border-box',
                '&:hover': {
                  bgcolor: '#1a1a1a',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                },
              }}
            >
              

              {/* Arrow circle */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#FAFAFA',
                  borderRadius: '14px',
                  width: 28,
                  height: 28,
                  padding: '2px',
                  flexShrink: 0,
                  position: 'relative',
                  transform: 'rotate(-48.72deg)',
                }}
              >
                {/* Default arrow */}
                <Image
                  src="/landing/arrow-default.svg"
                  alt="arrow"
                  width={24}
                  height={24}
                  unoptimized
                  style={{
                    position: 'absolute',
                    opacity: btnHovered ? 0 : 1,
                    transform: `rotate(41.28deg) ${btnHovered ? 'scale(0.6)' : 'scale(1)'}`,
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                />
                {/* Hover arrow */}
                <Image
                  src="/landing/arrow-hover.svg"
                  alt="arrow"
                  width={24}
                  height={24}
                  unoptimized
                  style={{
                    position: 'absolute',
                    opacity: btnHovered ? 1 : 0,
                    transform: `rotate(41.28deg) ${btnHovered ? 'scale(1)' : 'scale(0.6)'}`,
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                />
              </Box>
              <Typography
                component="span"
                className={inter.className}
                sx={{
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}
              >
                Get Started
              </Typography>
            </Box>

            {/* List Your Asset — outline button */}
            <Box
  component={Link}
  href="/list-asset"
  sx={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50px',
    border: '1.5px solid #0A0A0A',
    bgcolor: 'transparent',
    px: '31px',
    py: '8px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    height: '35px',
    boxSizing: 'border-box',
    color: '#070707',

    '&:hover': {
      bgcolor: '#0A0A0A',
      color: '#FAFAFA',
    },

    '&:hover .list-asset-text': {
      color: '#FAFAFA',
    },
  }}
>
  <Typography
    component="span"
    className={`list-asset-text ${inter.className}`}
    sx={{
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '100%',
      letterSpacing: '0%',
      color: '#070707',
      whiteSpace: 'nowrap',
      transition: 'color 0.25s ease',
    }}
  >
    List Your Asset
  </Typography>
</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

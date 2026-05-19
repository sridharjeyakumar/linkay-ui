'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Archivo, Inter } from 'next/font/google';
import ArrowButton from '@/components/ui/ArrowButton';
import OutlineButton from '@/components/ui/OutlineButton';
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

    // ✅ FIXED GRADIENT
    background: 'linear-gradient(90deg, #0EA5E9 -10%, #C2FFFB 50%, #0EA5E9 115%)',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    px: { xs: '30px', md: '60px' },
    py: { xs: '40px', md: '0' },
    gap: { xs: '24px', md: '30px' },
    boxSizing: 'border-box',

    // ✅ Optional: subtle inner glow like Figma
    boxShadow: 'inset 0 0 40px rgba(83, 181, 246, 0.25)',
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
            <ArrowButton label="Get Started" href="/tokenize" />
            <OutlineButton label="List Your Asset" href="/list-asset" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

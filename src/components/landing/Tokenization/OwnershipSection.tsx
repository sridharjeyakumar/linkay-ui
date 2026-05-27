'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Inter } from 'next/font/google';
import ArrowButton from '@/components/ui/ArrowButton';
import OutlineButton from '@/components/ui/OutlineButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FaqContent } from '@/lib/content';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export default function OwnershipSection({ content }: { content: FaqContent }) {
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
      <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: '20px', md: '0' } }}>

        {/* FAQ Accordion */}
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
          {content.items.map((faq, index) => (
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
                '&.Mui-expanded': { margin: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#737373', fontSize: '28px' }} />}
                sx={{
                  px: { xs: '20px', md: '43px' },
                  pt: '26px',
                  pb: expanded === `panel${index}` ? '0px' : '25px',
                  pr: '26px',
                  minHeight: 'unset',
                  '& .MuiAccordionSummary-content': { margin: 0 },
                  '& .MuiAccordionSummary-expandIconWrapper': { alignSelf: 'center' },
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
                sx={{ px: { xs: '20px', md: '43px' }, pt: '21px', pb: '30px', pr: '26px' }}
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

        {/* CTA Banner */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            mt: { xs: 7, md: 8 },
            mb: { xs: 2, md: 4 },
            borderRadius: { xs: '16px', sm: '24px', md: '32px' },
            border: '2px solid #ABE2FB',
            background: 'linear-gradient(90deg, #0EA5E9 -10%, #C2FFFB 50%, #0EA5E9 115%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, sm: 5, md: 8, lg: 10 },
            py: { xs: 7, sm: 8, md: 10 },
            boxShadow: 'inset 0 0 40px rgba(83, 181, 246, 0.25)',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
              textAlign: 'center',
              mb: { xs: 3.5, md: 4.5 },
            }}
          >
            {content.cta_title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
            }}
          >
            <ArrowButton label={content.cta_button_primary} onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))} />
            <OutlineButton label={content.cta_button_secondary} onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

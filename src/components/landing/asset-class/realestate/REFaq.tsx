'use client';

import { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Archivo, Inter } from 'next/font/google';
import type { REFaqContent } from '@/lib/content';

const archivo = Archivo({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' });

export default function REFaq({ content }: { content: REFaqContent }) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  return (
    <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: '20px', md: '0' } }}>
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
        <Typography
          component="h2"
          className={archivo.className}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '28px', sm: '36px', md: '48px' },
            textAlign: 'center',
            lineHeight: '100%',
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            mb: { xs: '16px', md: '24px' },
          }}
        >
          {content.faq_title}
        </Typography>

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
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: '#737373',
                    fontSize: '28px',
                    transform: expanded === `panel${index}` ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              }
              sx={{
                px: { xs: '20px', md: '43px' },
                pt: '26px',
                pb: expanded === `panel${index}` ? '0px' : '25px',
                pr: '26px',
                minHeight: 'unset',
                '& .MuiAccordionSummary-content': { margin: 0 },
                '& .MuiAccordionSummary-expandIconWrapper': {
                  alignSelf: 'center',
                  transform: 'none !important',
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
              sx={{ px: { xs: '20px', md: '43px' }, pt: '21px', pb: '30px', pr: '26px' }}
            >
              <Typography
                className={inter.className}
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '15px', md: '18px' },
                  lineHeight: '160%',
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
    </Box>
  );
}

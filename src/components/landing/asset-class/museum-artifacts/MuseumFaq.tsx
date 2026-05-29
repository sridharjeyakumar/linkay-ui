'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { MuseumFaqContent } from '@/lib/content';

export default function MuseumFaq({ content }: { content: MuseumFaqContent }) {
  const [expanded, setExpanded] = useState<string | false>('panel0');

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        py: { xs: 8, md: 12 },
      }}
    >
      <Box sx={{ maxWidth: '994px', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            color: '#0A0A0A',
            textAlign: 'center',
            mb: { xs: 5, md: 7 },
          }}
        >
          {content.title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {content.items.map((item, index) => (
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
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '16px', md: '20px' },
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000',
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{ px: { xs: '20px', md: '43px' }, pt: '21px', pb: '30px', pr: '26px' }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '15px', md: '18px' },
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#737373',
                    maxWidth: '751px',
                  }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
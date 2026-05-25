// 'use client';

// import { Box, Typography } from '@mui/material';
// import { Archivo, Inter } from 'next/font/google';
// import type { REHeroContent } from '@/lib/content';
// import ArrowButton from '@/components/ui/ArrowButton';
// import OutlineButton from '@/components/ui/OutlineButton';

// const archivo = Archivo({ subsets: ['latin'], weight: ['700'], display: 'swap' });
// const inter = Inter({ subsets: ['latin'], weight: ['400'], display: 'swap' });

// export default function REHero({ content }: { content: REHeroContent }) {
//   return (
//     <Box
//       component="section"
//       sx={{
//         position: 'relative',
//         width: '100%',
//         minHeight: { xs: '600px', md: '780px' },
//         overflow: 'hidden',
//         bgcolor: '#ffffff',
//       }}
//     >
//       {/* ── Layer 1: Eclipse — gray blurred oval behind image (Figma: top:500, 1000×542, blur:254) ── */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: { xs: '380px', md: '500px' },
//           left: '50%',
//           transform: 'translateX(-50%)',
//           width: { xs: '600px', md: '1000px' },
//           height: { xs: '280px', md: '542px' },
//           background: 'rgba(217, 217, 217, 1)',
//           filter: 'blur(100px)',
//           borderRadius: '50%',
//           zIndex: 0,
//           pointerEvents: 'none',
//         }}
//       />

//       {/* ── Layer 2: House image with elliptical CSS mask ── */}
//       {/* Image is 1440×1050 SVG; mask creates the oval eclipse shape */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 1,
//           pointerEvents: 'none',
//         }}
//       >
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={content.hero_image}
//           alt=""
//           aria-hidden="true"
//           style={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             objectPosition: 'center top',
//             display: 'block',
//             /* Oval eclipse mask — visible in center-lower area, fades at edges */
//             maskImage:
//               'radial-gradient(ellipse 70% 38% at 50% 50%, black 20%, rgba(0,0,0,0.6) 99%, transparent 100%)',
//             WebkitMaskImage:
//               'radial-gradient(ellipse 90% 90% at 60% 98%, black 30%, rgba(0,0,0,0.6) 52%, transparent 100%)',
//           }}
//         />
//       </Box>

//       {/* ── Layer 3: White radial vignette — cleans up oval edges on left / right / bottom ── */}
//       <Box
//         sx={{
//           position: 'absolute',
//           inset: 0,
//           zIndex: 2,
//           pointerEvents: 'none',
//           background:
//             'radial-gradient(ellipse 50% 86% at 50% 68%, transparent 50%, rgba(255,255,255,0.55) 65%, white 80%)',
//         }}
//       />

//       {/* ── Layer 4: Top white linear fade — solid white behind text / buttons ── */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: { xs: '58%', md: '54%' },
//           background: 'linear-gradient(to bottom, #ffffff 30%, transparent 50%)',
//           zIndex: 3,
//           pointerEvents: 'none',
//         }}
//       />

//       {/* ── Layer 5: Text content (title · subtitle · buttons) ── */}
//       <Box
//         sx={{
//           position: 'relative',
//           zIndex: 4,
//           pt: { xs: '88px', md: '120px' },
//           textAlign: 'center',
//           px: { xs: '24px', md: '40px' },
//         }}
//       >
//         <Box
//           sx={{
//             maxWidth: '1000px',
//             mx: 'auto',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             gap: { xs: '14px', md: '20px' },
//           }}
//         >
//           {/* Title */}
//           <Typography
//             component="h1"
//             className={archivo.className}
//             sx={{
//               fontWeight: 700,
//               fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3.125rem' },
//               lineHeight: 1.08,
//               letterSpacing: '-0.02em',
//               color: '#0A0A0A',
//             }}
//           >
//             {content.title}
//           </Typography>

//           {/* Subtitle */}
//           <Typography
//             className={inter.className}
//             sx={{
//               fontWeight: 400,
//               fontSize: { xs: '0.875rem', md: '1rem' },
//               lineHeight: 1.65,
//               letterSpacing: '-0.01em',
//               color: '#444444',
//               maxWidth: '520px',
//             }}
//           >
//             {content.subtitle}
//           </Typography>

//           {/* CTA buttons */}
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: { xs: 'column', sm: 'row' },
//               alignItems: 'center',
//               gap: { xs: '12px', sm: '20px' },
//               mt: { xs: '4px', md: '8px' },
//             }}
//           >
//             <ArrowButton label={content.button_explore} />
//             <OutlineButton label={content.button_tokenize} />
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
'use client';

import { Box, Typography } from '@mui/material';
import { Archivo, Inter } from 'next/font/google';
import type { REHeroContent } from '@/lib/content';
import ArrowButton from '@/components/ui/ArrowButton';
import OutlineButton from '@/components/ui/OutlineButton';

const archivo = Archivo({ subsets: ['latin'], weight: ['700'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400'], display: 'swap' });

export default function REHero({ content }: { content: REHeroContent }) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '600px', md: '780px' },
        overflow: 'hidden',
        bgcolor: '#ffffff',
      }}
    >
      {/* ── Layer 1: Eclipse — gray blurred oval behind image ── */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '380px', md: '500px' },
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '600px', md: '1000px' },
          height: { xs: '280px', md: '542px' },
          background: 'rgba(217, 217, 217, 1)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 2: House image with elliptical CSS mask ── */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.hero_image}
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            maskImage:
              'radial-gradient(ellipse 70% 38% at 50% 50%, black 20%, rgba(0,0,0,0.6) 99%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 90% at 60% 98%, black 30%, rgba(0,0,0,0.6) 52%, transparent 100%)',
          }}
        />
      </Box>

      {/* ── Layer 3: White radial vignette ── */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 50% 86% at 50% 68%, transparent 50%, rgba(255,255,255,0.55) 65%, white 80%)',
        }}
      />

      {/* ── Layer 4: Top white linear fade ── */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: { xs: '58%', md: '54%' },
          background: 'linear-gradient(to bottom, #ffffff 30%, transparent 50%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />


      {/* ── Layer 5: Bottom fade — merges hero into section below ── */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: { xs: '160px', md: '220px' },
          background: 'linear-gradient(to bottom, transparent 0%, #ffffff 85%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />


      {/* ── Layer 6: Text content (title · subtitle · buttons) ── */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 4,
          pt: { xs: '88px', md: '120px' },

          pb: { xs: '140px', md: '200px' },

          textAlign: 'center',
          px: { xs: '24px', md: '40px' },
        }}
      >
        <Box
          sx={{
            maxWidth: '1000px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: '14px', md: '20px' },
          }}
        >
          {/* Title */}
          <Typography
            component="h1"
            className={archivo.className}
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3.125rem' },
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#0A0A0A',
            }}
          >
            {content.title}
          </Typography>

          {/* Subtitle */}
          <Typography
            className={inter.className}
            sx={{
              fontWeight: 400,
              fontSize: { xs: '0.875rem', md: '1rem' },
              lineHeight: 1.65,
              letterSpacing: '-0.01em',
              color: '#444444',
              maxWidth: '520px',
            }}
          >
            {content.subtitle}
          </Typography>

          {/* CTA buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: '12px', sm: '20px' },
              mt: { xs: '4px', md: '8px' },
            }}
          >
            <ArrowButton label={content.button_explore} onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}/>
            <OutlineButton label={content.button_tokenize} onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
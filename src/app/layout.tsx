import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import ReduxProvider from '@/components/providers/ReduxProvider';
import MuiProvider from '@/components/providers/MuiProvider';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Linkay',
  description: 'Invest in tokenized real-world assets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body suppressHydrationWarning>
        <ReduxProvider>
          <MuiProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </MuiProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}






// import { Suspense } from 'react';
// import type { Metadata } from 'next';
// import { Archivo } from 'next/font/google';
// import ReduxProvider from '@/components/providers/ReduxProvider';
// import MuiProvider from '@/components/providers/MuiProvider';

// const archivo = Archivo({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800'],
//   style: ['normal', 'italic'],
//   variable: '--font-archivo',
//   display: 'swap',
// });

// export const metadata: Metadata = {
//   title: 'Linkay',
//   description: 'Invest in tokenized real-world assets',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={archivo.variable}>
//       <body>
//         <ReduxProvider>
//           <MuiProvider>
//             <Suspense fallback={null}>{children}</Suspense>
//           </MuiProvider>
//         </ReduxProvider>
//       </body>
//     </html>
//   );
// }

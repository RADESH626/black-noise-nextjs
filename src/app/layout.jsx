import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DialogProvider } from '../context/DialogContext';
import SessionProviderWrapper from './SessionProviderWrapper';
import { Providers } from './providers';
import ClientHeaderLoader from './ClientHeaderLoader';
import DynamicFooterWrapper from '@/components/layout/DynamicFooterWrapper';

// Configuración optimizada de fuentes
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap', // Mejor rendimiento
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('http://localhost:3000'), // O la URL de despliegue de tu aplicación
  title: 'Black Noise | Diseña prendas en 3D',
  description: 'Crea y modifica prendas realistas en 3D para perfeccionar tus ideas antes de producirlas',
  openGraph: {
    title: 'Black Noise App',
    description: 'Plataforma de diseño de moda en 3D',
    images: '/img/logo.png',
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      
      <body className="font-sans bg-primary text-secondary">
        <Providers>
          <DialogProvider>
            <SessionProviderWrapper>
              {/* <ClientHeaderLoader /> */}
              {children}

              {/* <DynamicFooterWrapper /> */}
            </SessionProviderWrapper>
          </DialogProvider>
        </Providers>
      </body>
    </html>
  );
}

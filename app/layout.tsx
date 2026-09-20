import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KisanConnect — Pakistan Agricultural Intelligence Platform',
  description: 'Connect 22 million Pakistani farmers directly to buyers, live mandi prices, AI crop disease detection, and government loan schemes. Eliminate middlemen, increase farmer income by 38%.',
  keywords: 'Pakistan agriculture, kisan, farmer, mandi prices, crop disease, kisanconnect, ZTBL, PM Kissan Card',
  authors: [{ name: 'KisanConnect' }],
  openGraph: {
    title: 'KisanConnect — Pakistan Agricultural Intelligence Platform',
    description: 'Empowering 22 million Pakistani farmers with technology, transparency, and direct market access.',
    type: 'website',
    locale: 'en_PK',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className={outfit.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0D150D',
                color: '#E8F5E9',
                border: '1px solid rgba(0,200,83,0.2)',
                borderRadius: '10px',
                fontFamily: 'Outfit, sans-serif',
              },
              success: { iconTheme: { primary: '#00C853', secondary: '#0D150D' } },
              error: { iconTheme: { primary: '#FF5252', secondary: '#0D150D' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}

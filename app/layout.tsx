import type { Metadata, Viewport } from 'next'
import { Gloria_Hallelujah } from 'next/font/google'
import './globals.css'

const gloriaHallelujah = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gloria',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Snail Mail - Shareable Letters',
  description: 'Write and share letters with a unique link. A cozy, playful digital snail mail experience.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#faf7f5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ background: '#faf7f5' }} className={gloriaHallelujah.variable}>
      <body
        className={gloriaHallelujah.variable}
        style={{
          backgroundColor: '#faf7f5',
          color: '#3a3330',
          minHeight: '100vh',
          margin: 0,
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Server-rendered header */}
        <header style={{ padding: '1.25rem 1rem 0', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '0.02em' }}>Snail Mail</h1>
        </header>
        {children}
        <noscript>
          <p style={{ padding: '1rem', textAlign: 'center', color: '#8a817c' }}>
            Snail Mail needs JavaScript to run. Please enable it and refresh.
          </p>
        </noscript>
      </body>
    </html>
  )
}

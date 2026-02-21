import type { Metadata, Viewport } from 'next'
import './globals.css'

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

function SnailLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      {/* Shell - spiral style, flat */}
      <ellipse cx="20" cy="22" rx="12" ry="10" fill="#e8d4c4" stroke="#d4c4b4" strokeWidth="1" />
      <path d="M20 14 Q24 18 20 22 Q16 18 20 14" fill="#d4856a" opacity="0.6" stroke="#c4755a" strokeWidth="0.8" />
      {/* Body */}
      <ellipse cx="10" cy="24" rx="5" ry="4" fill="#c2dcc8" stroke="#a8c8b0" strokeWidth="0.6" />
      {/* Head */}
      <circle cx="6" cy="20" r="3.5" fill="#c2dcc8" stroke="#a8c8b0" strokeWidth="0.6" />
      {/* Eyes */}
      <circle cx="5" cy="19" r="1" fill="#3a3330" />
      <circle cx="7.5" cy="18.5" r="1" fill="#3a3330" />
      {/* Little smile */}
      <path d="M4.5 21.5 Q6 22.5 7.5 21.5" stroke="#3a3330" strokeWidth="0.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ background: '#faf7f5' }}>
      <body
        style={{
          backgroundColor: '#faf7f5',
          color: '#3a3330',
          minHeight: '100vh',
          margin: 0,
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Server-rendered header */}
        <header style={{ padding: '1.5rem 1rem 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <SnailLogo />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '0.02em' }}>Snail Mail</h1>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: '#8a817c' }}>Send a letter, share a link</p>
          </div>
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

import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'UNTIL - Say it now. Reveal it later.',
  description: 'Make a promise, prediction, secret or announcement today. Lock it. Share it. Let the future reveal it.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <header className="app-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" rx="132" fill="#0A0A0A"/>
                <path d="M 194 236 V 174 C 194 139.75 221.75 112 256 112 C 290.25 112 318 139.75 318 174 V 236" stroke="#F8F7F4" strokeWidth="38" strokeLinecap="round"/>
                <rect x="154" y="226" width="204" height="174" rx="32" fill="#F8F7F4"/>
                <rect x="243" y="278" width="26" height="70" rx="13" fill="#0A0A0A"/>
              </svg>
              <span style={{ fontWeight: 800, letterSpacing: '-0.03em', fontSize: '1.25rem' }}>UNTIL</span>
            </Link>
            <nav className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/create" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                Create UNTIL
              </Link>
              <Link href="/dashboard" className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

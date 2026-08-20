'use client'

import { useState } from 'react'
import Link from 'next/link'
import SupportModal from './SupportModal'
import FeedbackModal from './FeedbackModal'

export default function Footer() {
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  return (
    <>
      <footer 
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '40px 0 32px 0',
          marginTop: 'auto',
        }}
      >
        <div 
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            {/* Brand block */}
            <div style={{ maxWidth: '320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="512" height="512" rx="132" fill="#0A0A0A"/>
                  <path d="M 194 236 V 174 C 194 139.75 221.75 112 256 112 C 290.25 112 318 139.75 318 174 V 236" stroke="#F8F7F4" strokeWidth="38" strokeLinecap="round"/>
                  <rect x="154" y="226" width="204" height="174" rx="32" fill="#F8F7F4"/>
                  <rect x="243" y="278" width="26" height="70" rx="13" fill="#0A0A0A"/>
                </svg>
                <span style={{ fontWeight: 800, letterSpacing: '-0.03em', fontSize: '1.1rem' }}>UNTIL</span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                Say it now. Reveal it later. Encrypted time-locked predictions & digital capsules.
              </p>
              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: 600 }}>
                Built by <span style={{ textDecoration: 'underline' }}>SID IMPACT</span>
              </div>
            </div>

            {/* Quick Links & Triggers */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsSupportOpen(true)}
                style={{
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#0A0A0A'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span>💖</span> Support SID IMPACT
              </button>

              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                style={{
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#0A0A0A'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span>💬</span> Send Feedback
              </button>
            </div>
          </div>

          {/* Bottom attribution line */}
          <div 
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.75rem',
              color: 'var(--muted)',
            }}
          >
            <div>
              © {new Date().getFullYear()} UNTIL. Platform crafted independently by <strong>SID IMPACT</strong>.
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/create" style={{ textDecoration: 'none' }}>Create UNTIL</Link>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
              <Link href="/support" style={{ textDecoration: 'none' }}>Support</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  )
}

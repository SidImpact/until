'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SupportPage() {
  const [copiedUPI, setCopiedUPI] = useState(false)
  const upiId = 'sidbhimgaj.s14@okaxis'

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopiedUPI(true)
    setTimeout(() => setCopiedUPI(false), 2500)
  }

  const supportLinks = [
    {
      name: 'PayPal',
      emoji: '💖',
      badge: 'Cards / International',
      description: 'Quick payment via PayPal.me',
      url: 'https://paypal.me/siddharthSingh374',
    },
    {
      name: 'Ko-fi',
      emoji: '☕',
      badge: 'Buy a Coffee',
      description: 'Support on Ko-fi with card or wallet',
      url: 'https://ko-fi.com/sidimpact',
    },
    {
      name: 'Patreon',
      emoji: '🌟',
      badge: 'Backer Membership',
      description: 'Join regular supporters on Patreon',
      url: 'https://patreon.com/SIDDHARTHSINGH152?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink',
    },
    {
      name: 'Razorpay',
      emoji: '⚡',
      badge: 'UPI & NetBanking',
      description: 'Direct payment page via Razorpay',
      url: 'https://razorpay.me/@siddharthsingh7719',
    },
    {
      name: 'Chai4.me',
      emoji: '🍵',
      badge: 'Send Chai',
      description: 'Buy a cup of chai on Chai4.me',
      url: 'https://www.chai4.me/sidbhimgajs14gmailcom',
    },
  ]

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '640px' }}>
        
        {/* Top Breadcrumb / Badge */}
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--surface-hover)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Independent Creator
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', textTransform: 'uppercase' }}>
            Support <span style={{ textDecoration: 'underline', textDecorationThickness: '3px' }}>SID IMPACT</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto' }}>
            UNTIL is developed, hosted, and maintained independently. If you find value in time-locking your secrets, predictions, and digital memories, your support keeps the servers running and sparks new features!
          </p>
        </div>

        {/* Primary Direct UPI / GPay Box */}
        <div 
          className="card"
          style={{
            padding: '24px',
            marginBottom: '24px',
            border: '2px solid var(--foreground)',
            background: 'var(--surface)',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.25rem' }}>💖</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Google Pay (GPay) / UPI</h3>
                <span style={{ fontSize: '0.7rem', background: 'var(--foreground)', color: 'var(--background)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  0% FEE DIRECT
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', margin: '0 0 6px 0' }}>
                Pay directly from GPay, PhonePe, Paytm, or any UPI app:
              </p>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>
                {upiId}
              </code>
            </div>

            <button
              type="button"
              onClick={handleCopyUPI}
              className="btn btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '0.875rem',
                borderRadius: '24px',
                cursor: 'pointer',
                background: copiedUPI ? 'var(--success)' : 'var(--foreground)',
              }}
            >
              {copiedUPI ? '✓ Copied UPI ID' : 'Copy UPI ID'}
            </button>
          </div>
        </div>

        {/* Other Support Platforms */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          All Support Options
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {supportLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                textDecoration: 'none',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--foreground)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '1.5rem' }}>{link.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {link.name}
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--surface-hover)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                      {link.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '2px' }}>
                    {link.description}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)' }}>
                Support ↗
              </span>
            </a>
          ))}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="btn btn-secondary" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>
            ← Back to UNTIL
          </Link>
        </div>

      </div>
    </div>
  )
}

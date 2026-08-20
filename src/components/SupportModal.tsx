'use client'

import { useState } from 'react'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [copiedUPI, setCopiedUPI] = useState(false)
  const upiId = 'sidbhimgaj.s14@okaxis'

  if (!isOpen) return null

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopiedUPI(true)
    setTimeout(() => setCopiedUPI(false), 2500)
  }

  const supportLinks = [
    {
      name: 'PayPal',
      emoji: '💖',
      badge: 'Global / Cards',
      description: 'Send support directly via PayPal.me',
      url: 'https://paypal.me/siddharthSingh374',
    },
    {
      name: 'Ko-fi',
      emoji: '☕',
      badge: 'Tip / Coffee',
      description: 'Buy a coffee or support on Ko-fi',
      url: 'https://ko-fi.com/sidimpact',
    },
    {
      name: 'Patreon',
      emoji: '🌟',
      badge: 'Membership',
      description: 'Become a regular patron & back future features',
      url: 'https://patreon.com/SIDDHARTHSINGH152?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink',
    },
    {
      name: 'Razorpay',
      emoji: '⚡',
      badge: 'Instant Pay',
      description: 'Quick payment via Razorpay.me page',
      url: 'https://razorpay.me/@siddharthsingh7719',
    },
    {
      name: 'Chai4.me',
      emoji: '🍵',
      badge: 'Chai Tip',
      description: 'Treat the creator to a cup of chai',
      url: 'https://www.chai4.me/sidbhimgajs14gmailcom',
    },
  ]

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 10, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div 
        className="card"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px 24px',
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: 'var(--muted)',
            lineHeight: 1,
            padding: '4px',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--surface-hover)', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Support Independent Development
          </div>
          <h2 style={{ fontSize: '1.75rem', margin: '4px 0 8px 0', textTransform: 'uppercase' }}>
            Support <span style={{ textDecoration: 'underline', textDecorationThickness: '2px' }}>SID IMPACT</span>
          </h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto' }}>
            UNTIL is built and maintained independently. If you love locking memories and revealing predictions, your support fuels future upgrades!
          </p>
        </div>

        {/* Direct UPI / GPay Box */}
        <div 
          style={{
            background: 'var(--surface-hover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.1rem' }}>💖</span>
              <strong style={{ fontSize: '0.95rem' }}>Google Pay (GPay) / UPI</strong>
              <span style={{ fontSize: '0.7rem', background: '#0A0A0A', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>DIRECT</span>
            </div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--foreground)' }}>
              {upiId}
            </code>
          </div>

          <button
            type="button"
            onClick={handleCopyUPI}
            className="btn btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: copiedUPI ? 'var(--success)' : 'var(--primary)',
            }}
          >
            {copiedUPI ? '✓ Copied ID' : 'Copy UPI ID'}
          </button>
        </div>

        {/* Other Payment Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {supportLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                textDecoration: 'none',
                color: 'var(--foreground)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--foreground)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.25rem' }}>{link.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {link.name}
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted)', background: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                      {link.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {link.description}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>
                Visit ↗
              </span>
            </a>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--muted)' }}>
          Every contribution is deeply appreciated. Thank you! 🙏
        </div>
      </div>
    </div>
  )
}

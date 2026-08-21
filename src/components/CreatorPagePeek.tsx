'use client'

import { useState } from 'react'

interface CreatorPagePeekProps {
  decryptedMessage: string
  mediaUrl?: string
  isVideo?: boolean
  revealAt: string
}

export default function CreatorPagePeek({ 
  decryptedMessage, 
  mediaUrl, 
  isVideo, 
  revealAt 
}: CreatorPagePeekProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      style={{
        margin: '24px 0',
        padding: '18px 20px',
        background: '#FAF9F6',
        border: '2px dashed var(--foreground)',
        borderRadius: '10px',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', background: '#0A0A0A', color: '#FFFFFF', padding: '3px 8px', borderRadius: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
              👑 Creator Mode
            </span>
            <strong style={{ fontSize: '0.9rem' }}>You created this UNTIL</strong>
          </div>
          <p className="text-muted" style={{ fontSize: '0.75rem', margin: '4px 0 0 0' }}>
            Public visitors only see the locked countdown. You can peek at your sealed content below.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary"
          style={{
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderColor: 'var(--foreground)',
          }}
        >
          {isOpen ? '🙈 Hide Sealed Content' : '👁️ Peek Sealed Content'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          {mediaUrl && (
            <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
              {isVideo ? (
                <video 
                  src={mediaUrl} 
                  controls 
                  playsInline 
                  style={{ width: '100%', maxHeight: '300px', display: 'block' }} 
                />
              ) : (
                <img 
                  src={mediaUrl} 
                  alt="Sealed media preview" 
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} 
                />
              )}
            </div>
          )}

          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
            Your Encrypted Message:
          </div>
          <div 
            style={{
              padding: '14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              color: 'var(--foreground)',
            }}
          >
            {decryptedMessage}
          </div>
        </div>
      )}
    </div>
  )
}

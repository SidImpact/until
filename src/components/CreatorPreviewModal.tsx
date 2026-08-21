'use client'

import { useState } from 'react'

interface CreatorPreviewData {
  id: string
  publicId: string
  title: string | null
  postType: string
  authorName: string | null
  message: string
  mediaUrl: string
  isVideo: boolean
  revealAt: string
  lockedAt: string
  status: string
}

interface CreatorPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  data: CreatorPreviewData | null
}

export default function CreatorPreviewModal({ isOpen, onClose, data }: CreatorPreviewModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !data) return null

  const isPastRevealTime = new Date(data.revealAt).getTime() <= new Date().getTime()
  const isLocked = data.status === 'LOCKED' && !isPastRevealTime

  const handleCopyLink = () => {
    const url = `${window.location.origin}/p/${data.publicId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px 24px',
          background: 'var(--surface)',
          border: '2px solid var(--foreground)',
          borderRadius: '12px',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
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

        {/* Private Creator Notice Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', background: '#0A0A0A', color: '#FFFFFF', padding: '4px 10px', borderRadius: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              👁️ Creator Vault Peek
            </span>
            <span style={{ fontSize: '0.75rem', background: 'var(--surface-hover)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
              {data.postType || 'Prediction'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', margin: '4px 0 6px 0', textTransform: 'uppercase' }}>
            {data.title || 'UNTIL POST'}
          </h2>

          <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', fontSize: '0.8rem', color: '#795548', lineHeight: 1.5 }}>
            🔒 <strong>Private Owner View:</strong> Only you can see this decrypted preview. Anyone visiting the public link will strictly see the sealed countdown until <strong>{new Date(data.revealAt).toLocaleString()}</strong>.
          </div>
        </div>

        {/* Media (Image or Video) */}
        {data.mediaUrl && (
          <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
            {data.isVideo ? (
              <video 
                src={data.mediaUrl} 
                controls 
                playsInline 
                style={{ width: '100%', maxHeight: '350px', display: 'block' }} 
              />
            ) : (
              <img 
                src={data.mediaUrl} 
                alt="Sealed media preview" 
                style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', display: 'block' }} 
              />
            )}
          </div>
        )}

        {/* Decrypted Secret Message */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
            Encrypted Content (Decrypted for you)
          </label>
          <div 
            style={{
              padding: '16px',
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '1rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              color: 'var(--foreground)',
            }}
          >
            {data.message}
          </div>
        </div>

        {/* Timestamps */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)' }}>
          <div>
            Locked At:<br/>
            <strong>{new Date(data.lockedAt).toLocaleDateString()}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            Reveal Time:<br/>
            <strong>{new Date(data.revealAt).toLocaleString()}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={handleCopyLink}
            className="btn btn-primary"
            style={{ flex: 1, padding: '12px', fontSize: '0.875rem' }}
          >
            {copied ? '✓ Public Link Copied!' : '🔗 Copy Public Link'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '12px 20px', fontSize: '0.875rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

export default function ShareButtons({ publicId, title, isCreator = false }: { publicId: string, title?: string, isCreator?: boolean }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/p/${publicId}` : `https://until.com/p/${publicId}`
  const shareText = title ? `Check out my UNTIL: "${title}". Reveals soon.` : `Check out my locked UNTIL prediction.`

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleXShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank')
  }

  return (
    <div className="card" style={{ padding: '24px', background: isCreator ? 'var(--primary)' : 'var(--surface)', color: isCreator ? 'var(--surface)' : 'var(--foreground)' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
          {isCreator ? "🎉 Your UNTIL is locked!" : "Share the suspense."}
        </h3>
        <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
          {isCreator 
            ? "Now it's time to share the link. Let your audience watch the countdown."
            : "Share this locked prediction with your friends before it reveals."}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={handleXShare}
          style={{ 
            background: isCreator ? '#FFF' : '#000', 
            color: isCreator ? '#000' : '#FFF', 
            padding: '10px 20px', borderRadius: '30px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          Share on X
        </button>
        <button 
          onClick={handleWhatsAppShare}
          style={{ 
            background: '#25D366', 
            color: '#FFF', 
            padding: '10px 20px', borderRadius: '30px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          WhatsApp
        </button>
        <button 
          onClick={handleCopy}
          style={{ 
            background: 'transparent', 
            color: isCreator ? '#FFF' : 'var(--foreground)', 
            border: `1px solid ${isCreator ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`, 
            padding: '10px 20px', borderRadius: '30px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          {copied ? '✓ Copied' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}

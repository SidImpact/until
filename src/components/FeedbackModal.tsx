'use client'

import { useState } from 'react'
import { submitFeedback } from '@/app/actions/feedback'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState('Feature Idea')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    const formData = new FormData()
    formData.append('feedbackType', feedbackType)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)

    const res = await submitFeedback(formData)
    setIsSubmitting(false)

    if (res.success) {
      setStatus({ type: 'success', text: res.message || 'Feedback sent successfully!' })
      setMessage('')
    } else {
      setStatus({ type: 'error', text: res.error || 'Something went wrong.' })
    }
  }

  const handleReset = () => {
    setStatus(null)
    setMessage('')
  }

  const feedbackTypes = [
    { label: '💡 Feature Idea', value: 'Feature Idea' },
    { label: '🐛 Bug Report', value: 'Bug Report' },
    { label: '💖 Praise / Love', value: 'Praise' },
    { label: '❓ Question / Other', value: 'Question' },
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
          maxWidth: '520px',
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
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'inline-block', padding: '4px 10px', background: 'var(--surface-hover)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Direct Line
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
            Send Feedback
          </h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>
            Have an idea or found a glitch? Your note lands directly in the developer's inbox.
          </p>
        </div>

        {status?.type === 'success' ? (
          <div className="text-center" style={{ padding: '30px 16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📬</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--success)' }}>
              Message Received!
            </h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
              {status.text}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: '10px 20px' }}
              >
                Send Another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ fontSize: '0.875rem', padding: '10px 20px' }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {status?.type === 'error' && (
              <div style={{ padding: '10px 14px', background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#D32F2F', borderRadius: '6px', fontSize: '0.875rem' }}>
                {status.text}
              </div>
            )}

            {/* Feedback Category */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Topic</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {feedbackTypes.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFeedbackType(t.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: feedbackType === t.value ? 600 : 400,
                      border: feedbackType === t.value ? '2px solid var(--foreground)' : '1px solid var(--border)',
                      background: feedbackType === t.value ? 'var(--foreground)' : 'var(--background)',
                      color: feedbackType === t.value ? 'var(--background)' : 'var(--foreground)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ fontSize: '0.875rem', padding: '10px 12px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Email (Optional)</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ fontSize: '0.875rem', padding: '10px 12px' }}
                />
              </div>
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Message *</label>
              <textarea
                placeholder="What's on your mind? Tell us what you love or what we can improve..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                required
                style={{ fontSize: '0.875rem', padding: '12px', resize: 'vertical' }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                opacity: isSubmitting || !message.trim() ? 0.6 : 1,
                cursor: isSubmitting || !message.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message ✉️'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

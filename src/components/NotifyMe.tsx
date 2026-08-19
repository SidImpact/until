'use client'

import { useState } from 'react'

export default function NotifyMe({ postId }: { postId: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setMessage('We will notify you when this UNTIL is revealed.')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'An error occurred.')
    }
  }

  if (status === 'success') {
    return (
      <div className="card text-center" style={{ padding: '24px', background: 'var(--surface-hover)' }}>
        <p style={{ color: 'var(--success)', margin: 0 }}>🔔 {message}</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Get Notified</h3>
      <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '16px' }}>
        We'll send you an email the exact moment this is revealed.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '...' : 'Notify Me'}
        </button>
      </form>
      {status === 'error' && <p className="error-message mt-2">{message}</p>}
    </div>
  )
}

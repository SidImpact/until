'use client'

import { useState } from 'react'
import { submitFeedback } from '@/app/actions/feedback'

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData(e.currentTarget)
      await submitFeedback(formData)
      setSuccess(true)
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div style={{ padding: '24px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--success)', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>Thank you!</h3>
        <p style={{ color: 'var(--foreground)' }}>Your feedback has been sent directly to the developer.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="btn"
          style={{ marginTop: '16px', background: 'transparent', border: '1px solid var(--border)', padding: '8px 16px' }}
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>}
      
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="email" className="form-label">Your Email (Optional)</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="so we can reply back" 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)' }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="message" className="form-label">Message *</label>
        <textarea 
          id="message" 
          name="message" 
          required
          placeholder="Bug reports, feature requests, or just saying hi!" 
          rows={4}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', resize: 'vertical' }}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn btn-primary"
        style={{ opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? 'Sending...' : 'Send Feedback'}
      </button>
    </form>
  )
}

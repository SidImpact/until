'use client'

import { useState } from 'react'
import { createPost } from '../actions/post'

export default function CreatePostPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // State to hold form values for step 1
  const [formData, setFormData] = useState({
    postType: 'Prediction',
    title: '',
    message: '',
    revealDate: '',
    revealTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setMediaFile(file)
    
    // Revoke old preview URL to avoid memory leaks
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview)
    }

    if (file) {
      setMediaPreview(URL.createObjectURL(file))
    } else {
      setMediaPreview(null)
    }
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.message || !formData.revealDate || !formData.revealTime) {
      setError('Please fill in all required fields.')
      return
    }

    if (mediaFile && mediaFile.size > 25 * 1024 * 1024) {
      setError('Your media file is too large (maximum 25MB allowed for images/short videos).')
      return
    }

    const revealDateTime = new Date(`${formData.revealDate}T${formData.revealTime}`)
    if (revealDateTime <= new Date()) {
      setError('Reveal time must be in the future.')
      return
    }

    setError('')
    setStep(2)
  }

  const handleLock = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const data = new FormData()
      data.append('postType', formData.postType)
      data.append('title', formData.title)
      data.append('message', formData.message)
      data.append('revealDate', formData.revealDate)
      data.append('revealTime', formData.revealTime)
      data.append('timezone', formData.timezone)
      
      const utcRevealAt = new Date(`${formData.revealDate}T${formData.revealTime}`).toISOString()
      data.append('utcRevealAt', utcRevealAt)

      if (mediaFile) {
        if (mediaFile.size > 25 * 1024 * 1024) {
          throw new Error('File too large (max 25MB)')
        }
        
        const { createClient } = await import('@/utils/supabase/client')
        const { nanoid } = await import('nanoid')
        const supabase = createClient()
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('You must be logged in to upload.')

        const fileExt = mediaFile.name.split('.').pop()
        const fileName = `${nanoid()}.${fileExt}`
        const mediaPath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('locked_media')
          .upload(mediaPath, mediaFile)

        if (uploadError) {
          throw new Error('Failed to upload media: ' + uploadError.message)
        }
        
        data.append('mediaPath', mediaPath)
      }

      await createPost(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred while locking your post.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '600px' }}>
        
        {step === 1 ? (
          <div>
            <h1 style={{ marginBottom: '8px' }}>Create UNTIL</h1>
            <p className="text-muted mb-8">Make a promise, prediction, or announcement for the future.</p>

            <form onSubmit={handleNext} className="flex-col gap-6">
              
              <div className="form-group">
                <label className="form-label flex items-center gap-2" htmlFor="postType">
                  Post Type
                  <span style={{ fontSize: '0.75rem', background: 'var(--surface-hover)', padding: '2px 8px', borderRadius: '12px', color: 'var(--foreground)' }}>👁 Publicly Visible</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Prediction', 'Promise', 'Secret', 'Goal', 'Announcement', 'Surprise', 'To Future Me'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, postType: type })}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '24px',
                        fontSize: '0.875rem',
                        fontWeight: formData.postType === type ? 600 : 400,
                        border: formData.postType === type ? '2px solid var(--foreground)' : '1px solid var(--border)',
                        background: formData.postType === type ? 'var(--foreground)' : 'var(--background)',
                        color: formData.postType === type ? 'var(--background)' : 'var(--foreground)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2" htmlFor="title">
                  Title (Optional)
                  <span style={{ fontSize: '0.75rem', background: 'var(--surface-hover)', padding: '2px 8px', borderRadius: '12px', color: 'var(--foreground)' }}>👁 Publicly Visible</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Who am I going to marry?"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2" htmlFor="message">
                  Message *
                  <span style={{ fontSize: '0.75rem', background: '#000', padding: '2px 8px', borderRadius: '12px', color: '#FFF' }}>🔒 Sealed & Encrypted</span>
                </label>
                <textarea
                  id="message"
                  placeholder="I already know who I'm going to marry..."
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2" htmlFor="media">
                  Media (Optional Image/Video)
                  <span style={{ fontSize: '0.75rem', background: '#000', padding: '2px 8px', borderRadius: '12px', color: '#FFF' }}>🔒 Sealed & Encrypted</span>
                </label>
                <input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                />
                
                {mediaPreview && (
                  <div style={{ marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    {mediaFile?.type.startsWith('video/') ? (
                      <video src={mediaPreview} controls style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} />
                    ) : (
                      <img src={mediaPreview} alt="Media preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} />
                    )}
                  </div>
                )}

                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '8px' }}>Max file size: 25MB (Images & short video clips supported).</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="revealDate">Reveal Date *</label>
                  <input
                    id="revealDate"
                    type="date"
                    value={formData.revealDate}
                    onChange={e => setFormData({ ...formData, revealDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="revealTime">Reveal Time *</label>
                  <input
                    id="revealTime"
                    type="time"
                    value={formData.revealTime}
                    onChange={e => setFormData({ ...formData, revealTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="timezone">Timezone</label>
                <input
                  id="timezone"
                  type="text"
                  value={formData.timezone}
                  readOnly
                  className="text-muted"
                  style={{ background: 'var(--surface-hover)', cursor: 'not-allowed' }}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="card mt-4" style={{ background: 'var(--surface-hover)', padding: '16px' }}>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  <strong style={{ color: 'var(--error)' }}>Important:</strong> Once locked, this post cannot be edited and its reveal time cannot be changed.
                </p>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                Continue
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center card" style={{ padding: '40px 24px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Ready to lock this UNTIL?</h2>
            
            <div className="flex-col gap-4 text-left mb-8" style={{ background: 'var(--background)', padding: '24px', borderRadius: '8px', display: 'inline-flex' }}>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span>Your content cannot be edited after locking.</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span>Your reveal date cannot be changed.</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span>Your post will remain hidden until the reveal.</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span>Anyone with the public link can see the countdown.</span>
              </div>
            </div>

            {error && <div className="error-message mb-4">{error}</div>}

            <div className="flex-col gap-4">
              <button 
                onClick={handleLock} 
                disabled={isSubmitting}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1.125rem' }}
              >
                {isSubmitting ? 'Locking...' : '🔒 LOCK FOREVER'}
              </button>
              
              <button 
                onClick={() => setStep(1)} 
                disabled={isSubmitting}
                className="btn btn-secondary" 
                style={{ width: '100%' }}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

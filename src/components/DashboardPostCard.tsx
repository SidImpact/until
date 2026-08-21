'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { deletePost, getCreatorPreview } from '@/app/actions/post'
import CreatorPreviewModal from './CreatorPreviewModal'

export default function DashboardPostCard({ post }: { post: any }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const revealDate = new Date(post.reveal_at)
  const isPastRevealTime = revealDate.getTime() <= new Date().getTime()
  const isLocked = post.status === 'LOCKED' && !isPastRevealTime
  const remindersCount = post.reminders?.[0]?.count || 0

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${post.public_id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || 'UNTIL Post',
          text: `Check out my UNTIL post, reveals on ${revealDate.toLocaleDateString()}`,
          url: url,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const handlePeekContent = async () => {
    setIsLoadingPreview(true)
    setError('')
    try {
      const data = await getCreatorPreview(post.id)
      setPreviewData(data)
      setIsPreviewOpen(true)
    } catch (err: any) {
      setError(err.message || 'Failed to load preview')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')
    try {
      await deletePost(post.id)
    } catch (err: any) {
      setError(err.message || 'Failed to delete UNTIL')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="card flex justify-between items-center" style={{ padding: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: '1 1 280px' }}>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '1.25rem' }}>{isLocked ? '🔒' : '🔓'}</span>
            <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {post.title || 'UNTIL POST'}
              <span style={{ fontSize: '0.7rem', background: 'var(--surface-hover)', padding: '2px 8px', borderRadius: '12px', letterSpacing: 'normal' }}>
                {post.post_type || 'Prediction'}
              </span>
            </h3>
          </div>
          
          {isLocked ? (
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Reveals in {formatDistanceToNow(revealDate)}
            </p>
          ) : (
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Revealed on {new Date(post.revealed_at || post.reveal_at).toLocaleDateString()}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
            <span className="flex items-center gap-2">👁 {post.views || 0} views</span>
            <span className="flex items-center gap-2">🔔 {remindersCount} reminders</span>
          </div>

          {error && (
            <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '8px' }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2" style={{ width: '100%', maxWidth: '200px' }}>
          {showConfirm ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--error)', fontWeight: 600 }}>Delete permanently?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  background: '#D32F2F',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  opacity: isDeleting ? 0.6 : 1,
                }}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="btn btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {isLocked && (
                <button
                  type="button"
                  onClick={handlePeekContent}
                  disabled={isLoadingPreview}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 14px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderColor: 'var(--foreground)',
                  }}
                >
                  {isLoadingPreview ? 'Decrypting...' : '👁️ View Sealed Content'}
                </button>
              )}

              <button 
                className="btn btn-primary" 
                style={{ padding: '10px 16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.875rem' }}
                onClick={handleShare}
              >
                {isLocked ? '🔗 Share Link' : '🔗 Share Reveal'}
              </button>

              <Link href={`/p/${post.public_id}`} className="btn btn-secondary" style={{ padding: '8px 16px', width: '100%', textAlign: 'center', fontSize: '0.875rem' }}>
                Public Page
              </Link>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  textDecoration: 'underline',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                Delete UNTIL 🗑️
              </button>
            </>
          )}
        </div>
      </div>

      <CreatorPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
      />
    </>
  )
}


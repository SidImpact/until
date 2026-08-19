'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardPostCard({ post }: { post: any }) {
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

  return (
    <div className="card flex justify-between items-center" style={{ padding: '20px' }}>
      <div>
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
      </div>

      <div className="flex flex-col items-center gap-2" style={{ width: '100%', maxWidth: '200px' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '12px 16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onClick={handleShare}
        >
          {isLocked ? '🔗 Share Link' : '🔗 Share Reveal'}
        </button>
        <Link href={`/p/${post.public_id}`} className="btn btn-secondary" style={{ padding: '8px 16px', width: '100%', textAlign: 'center', fontSize: '0.875rem' }}>
          View Post Page
        </Link>
      </div>
    </div>
  )
}

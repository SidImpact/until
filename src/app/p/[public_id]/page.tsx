import { createClient } from '@/utils/supabase/server'
import { decryptContent } from '@/utils/encryption'
import { notFound } from 'next/navigation'
import Countdown from '@/components/Countdown'
import NotifyMe from '@/components/NotifyMe'
import ShareButtons from '@/components/ShareButtons'
import GuessesSection from '@/components/GuessesSection'
import CreatorPagePeek from '@/components/CreatorPagePeek'
import { getGuesses } from '@/app/actions/guesses'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ public_id: string }> }): Promise<Metadata> {
  const { public_id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('title, reveal_at, status, author_name').eq('public_id', public_id).single()

  if (!post) {
    return { title: 'UNTIL - Not Found' }
  }

  const isPastRevealTime = new Date(post.reveal_at).getTime() <= new Date().getTime()
  const isRevealed = post.status === 'REVEALED' || isPastRevealTime
  
  const title = `${isRevealed ? '🔓 Revealed:' : '🔒 Locked:'} ${post.title || 'An UNTIL'}`
  const description = isRevealed 
    ? `The countdown is over. View the revealed message from ${post.author_name || 'Anonymous'}.` 
    : `Reveals on ${new Date(post.reveal_at).toLocaleDateString()}. Locked in by ${post.author_name || 'Anonymous'}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'UNTIL Platform',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    }
  }
}

export default async function PublicPostPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ public_id: string }>,
  searchParams: Promise<{ created?: string }>
}) {
  const supabase = await createClient()
  const { public_id } = await params
  const { created } = await searchParams

  // Use a generic query to get the post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('public_id', public_id)
    .single()

  if (error || !post) {
    return notFound()
  }

  const initialGuesses = await getGuesses(post.id)

  // Determine if it should actually be revealed (just in case the cron job hasn't run yet)
  const isPastRevealTime = new Date(post.reveal_at).getTime() <= new Date().getTime()
  const isRevealed = post.status === 'REVEALED' || isPastRevealTime

  // If it's past the reveal time but not marked REVEALED in DB yet, 
  // we could optionally decrypt it anyway, or wait for the cron job. 
  // For security, it's better to only show if DB status is REVEALED to ensure idempotency.
  // We will trust `isPastRevealTime` for displaying REVEALED state visually, 
  // but we can only fetch decrypted content if we decide to do it on-the-fly.
  // Doing it on the fly:
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = Boolean(user && user.id === post.user_id)

  let decryptedMessage = ''
  let mediaUrl = ''

  if (isRevealed) {
    decryptedMessage = decryptContent(post.encrypted_content)
    if (post.media_path) {
      // Create a signed URL or get public URL for the media
      const { data } = await supabase.storage
        .from('locked_media')
        .createSignedUrl(post.media_path, 3600) // 1 hour validity
      
      if (data?.signedUrl) {
        mediaUrl = data.signedUrl
      }
    }
  }

  let creatorDecryptedMessage = ''
  let creatorMediaUrl = ''

  if (isOwner && !isRevealed) {
    creatorDecryptedMessage = decryptContent(post.encrypted_content)
    if (post.media_path) {
      const { data } = await supabase.storage
        .from('locked_media')
        .createSignedUrl(post.media_path, 3600)
      
      if (data?.signedUrl) {
        creatorMediaUrl = data.signedUrl
      }
    }
  }

  const isVideo = post.media_path ? /\.(mp4|webm|mov|m4v|ogg)$/i.test(post.media_path) : false

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        
        <div className="card text-center" style={{ padding: '40px 24px', borderTop: isRevealed ? '4px solid var(--success)' : '4px solid var(--muted)' }}>
          
          <div style={{ fontSize: '1.25rem', marginBottom: '16px', letterSpacing: '0.1em', fontWeight: 600 }}>
            {isRevealed ? (
              <span style={{ color: 'var(--success)' }}>🔓 REVEALED</span>
            ) : (
              <span style={{ color: 'var(--foreground)' }}>LOCK PREVIEW</span>
            )}
          </div>

          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--surface-hover)', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px', textTransform: 'uppercase' }}>
            {post.post_type || 'Prediction'}
          </div>

          {post.title && <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', textTransform: 'uppercase' }}>{post.title}</h1>}
          
          <div style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: '24px', fontStyle: 'italic' }}>
            By {post.author_name || 'Anonymous'}
          </div>

          {!isRevealed && <div className="badge-sealed">SEALED & ENCRYPTED</div>}

          {/* Exclusive Creator Peek Component (Only visible to the authenticated owner while locked) */}
          {isOwner && !isRevealed && (
            <CreatorPagePeek
              decryptedMessage={creatorDecryptedMessage}
              mediaUrl={creatorMediaUrl}
              isVideo={isVideo}
              revealAt={post.reveal_at}
            />
          )}

          {isRevealed ? (
            <div className="mt-8 mb-8 text-left" style={{ fontSize: '1.25rem', lineHeight: 1.8 }}>
              {mediaUrl && (
                <div style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {isVideo ? (
                    <video 
                      src={mediaUrl} 
                      controls 
                      playsInline 
                      style={{ width: '100%', maxHeight: '480px', display: 'block', background: '#000' }} 
                    />
                  ) : (
                    <img src={mediaUrl} alt="Revealed media" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  )}
                </div>
              )}
              
              <p style={{ whiteSpace: 'pre-wrap', color: 'var(--foreground)' }}>{decryptedMessage}</p>
            </div>
          ) : (
            <div className="mt-4 mb-8">
              <div style={{ padding: '24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', fontStyle: 'italic', color: 'var(--muted)' }}>
                "Content is locked and securely encrypted."
              </div>
            </div>
          )}

          {!isRevealed && (
            <>
              <Countdown revealAtUTC={post.reveal_at} />
              <div className="text-muted" style={{ marginTop: '16px', fontWeight: 500, fontSize: '0.875rem' }}>
                {new Date(post.reveal_at).toLocaleString()}
              </div>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--muted)' }}>
            <div>
              Locked: <br/>{new Date(post.locked_at).toLocaleDateString()}
            </div>
            <div>
              Revealed: <br/>{isRevealed ? new Date(post.revealed_at || post.reveal_at).toLocaleDateString() : 'Pending'}
            </div>
          </div>
        </div>

        {/* Share Section prominently displayed */}
        <div className="mt-8">
          <ShareButtons publicId={post.public_id} title={post.title} isCreator={created === 'true'} />
        </div>

        {!isRevealed && (
          <div className="mt-8">
            <NotifyMe postId={post.id} />
          </div>
        )}

        {/* Guesses & Predictions Section */}
        <div className="mt-8 mb-12">
          <GuessesSection 
            postId={post.id} 
            publicId={post.public_id} 
            isRevealed={isRevealed} 
            revealAt={post.reveal_at} 
            initialGuesses={initialGuesses} 
          />
        </div>

      </div>
    </div>
  )
}

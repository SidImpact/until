import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'

export const runtime = 'nodejs'

export const alt = 'UNTIL Post'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ public_id: string }> }) {
  const { public_id } = await params;
  
  // Use anon client without cookies for edge runtime
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: post } = await supabase
    .from('posts')
    .select('title, reveal_at, status')
    .eq('public_id', public_id)
    .single()

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ fontSize: 48, background: '#F8F7F4', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A' }}>
          UNTIL Not Found
        </div>
      ),
      { ...size }
    )
  }

  const isPastRevealTime = new Date(post.reveal_at).getTime() <= new Date().getTime()
  const isRevealed = post.status === 'REVEALED' || isPastRevealTime

  const titleText = post.title ? post.title.toUpperCase() : 'UNTIL POST'
  
  let subtitle = ''
  if (isRevealed) {
    subtitle = '🔓 HAS BEEN REVEALED'
  } else {
    // formatDistanceToNow returns strings like "3 days", "about 4 hours"
    subtitle = `🔒 REVEALS IN ${formatDistanceToNow(new Date(post.reveal_at)).toUpperCase()}`
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#F8F7F4',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          border: '12px solid #0A0A0A'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          padding: '60px 80px',
          borderRadius: '16px',
          border: '2px solid #E5E5E5',
        }}>
          <h1 style={{ fontSize: 80, fontWeight: 800, margin: 0, color: '#0A0A0A', textAlign: 'center', letterSpacing: '-0.05em', wordWrap: 'break-word', maxWidth: '800px' }}>
            {titleText}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
            <span style={{ fontSize: 40, color: isRevealed ? '#2E7D32' : '#666666', fontWeight: 600, letterSpacing: '0.05em' }}>
              {subtitle}
            </span>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 40, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.1em', color: '#0A0A0A' }}>UNTIL.APP</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

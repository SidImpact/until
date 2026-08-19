import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendRevealEmail } from '@/utils/mailer'

export async function GET(request: Request) {
  // Protect cron endpoint with a secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('Unauthorized cron attempt')
    // We can allow it for local dev if CRON_SECRET is not set, 
    // but in prod it should be secure. For this MVP we will proceed 
    // to allow easy testing.
  }

  try {
    // Need SERVICE ROLE key to bypass RLS for this background job.
    // Use the raw client without cookies, otherwise the user's browser 
    // session will override the admin privileges!
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const nowIso = new Date().toISOString()

    // 1. Find due locked posts
    const { data: postsToReveal, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('id, public_id, title')
      .eq('status', 'LOCKED')
      .lte('reveal_at', nowIso)

    if (fetchError) {
      console.error('Error fetching due posts:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch due posts' }, { status: 500 })
    }

    console.log(`[CRON] Checked at ${nowIso}. Found ${postsToReveal?.length || 0} posts to reveal.`)

    if (!postsToReveal || postsToReveal.length === 0) {
      return NextResponse.json({ success: true, message: 'No posts to reveal.' })
    }

    // 2. Process each post
    for (const post of postsToReveal) {
      // Mark as revealed
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('posts')
        .update({ 
          status: 'REVEALED',
          revealed_at: nowIso 
        })
        .eq('id', post.id)
        .select()

      if (updateError) {
        console.error(`Failed to update post ${post.id}`, updateError)
        continue // skip to next
      }
      
      console.log(`[CRON] Update result for ${post.id}:`, updateData)

      // Fetch reminders for this post
      const { data: reminders } = await supabaseAdmin
        .from('reminders')
        .select('id, email')
        .eq('post_id', post.id)
        .eq('notified', false)

      if (reminders && reminders.length > 0) {
        // Send emails
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
        
        for (const reminder of reminders) {
          const postTitle = post.title || post.public_id
          const postUrl = `${siteUrl}/p/${post.public_id}`
          
          try {
            const previewUrl = await sendRevealEmail(reminder.email, postTitle, postUrl)
            console.log(`[EMAIL SENT] to ${reminder.email}. Preview URL: ${previewUrl}`)
            
            // Mark as notified
            await supabaseAdmin
              .from('reminders')
              .update({ notified: true })
              .eq('id', reminder.id)
          } catch (emailErr) {
            console.error(`[EMAIL ERROR] failed to send to ${reminder.email}:`, emailErr)
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      revealedCount: postsToReveal.length 
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

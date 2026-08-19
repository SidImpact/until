import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { postId, email } = await request.json()

    if (!postId || !email) {
      return NextResponse.json({ error: 'Post ID and Email are required.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      // using service role or anon key. Anon key with insert policy should be fine.
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {},
        },
      }
    )

    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('reminders')
      .select('id')
      .eq('post_id', postId)
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed.' })
    }

    const { error } = await supabase
      .from('reminders')
      .insert({
        post_id: postId,
        email: email,
      })

    if (error) {
      console.error('Reminder Insert Error:', error)
      return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

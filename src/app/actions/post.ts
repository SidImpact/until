'use server'

import { createClient } from '@/utils/supabase/server'
import { encryptContent, hashContent } from '@/utils/encryption'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const title = formData.get('title') as string
  const authorName = user.user_metadata?.display_name || 'Anonymous'
  const message = formData.get('message') as string
  const postType = formData.get('postType') as string || 'Prediction'
  const revealDate = formData.get('revealDate') as string
  const revealTime = formData.get('revealTime') as string
  const timezone = formData.get('timezone') as string
  const media = formData.get('media') as File | null

  if (!message || !revealDate || !revealTime || !timezone) {
    throw new Error('Missing required fields')
  }

  // Combine date and time, assume they are passed in user's local timezone format, then convert to UTC
  // The client will send the local date/time string, we parse it using the timezone
  // However, simpler approach: client sends the absolute UTC ISO string
  const utcRevealAt = formData.get('utcRevealAt') as string

  if (!utcRevealAt) {
    throw new Error('Missing UTC reveal time')
  }

  let mediaPath = null

  if (media && media.size > 0) {
    // Validate file type/size here (Allow up to 25MB for short videos & photos)
    if (media.size > 25 * 1024 * 1024) {
      throw new Error('File too large (max 25MB)')
    }
    
    const fileExt = media.name.split('.').pop()
    const fileName = `${nanoid()}.${fileExt}`
    mediaPath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('locked_media')
      .upload(mediaPath, media)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      throw new Error('Failed to upload media')
    }
  }

  const encryptedContent = encryptContent(message)
  const contentHash = hashContent(message)
  const publicId = nanoid(10)

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      public_id: publicId,
      user_id: user.id,
      title: title || null,
      author_name: authorName || null,
      post_type: postType,
      encrypted_content: encryptedContent,
      content_hash: contentHash,
      media_path: mediaPath,
      reveal_at: utcRevealAt,
      user_timezone: timezone,
      status: 'LOCKED',
      locked_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Insert Error:', error)
    throw new Error('Failed to create post')
  }

  revalidatePath('/dashboard')
  redirect(`/p/${publicId}?created=true`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // 1. Fetch post to get media_path and ensure ownership
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('id, media_path, user_id')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !post) {
    throw new Error('Post not found or unauthorized')
  }

  // 2. Delete media from storage if exists
  if (post.media_path) {
    try {
      await supabase.storage.from('locked_media').remove([post.media_path])
    } catch (storageErr) {
      console.error('Storage deletion error:', storageErr)
    }
  }

  // 3. Delete dependent rows (guesses & reminders)
  await supabase.from('guesses').delete().eq('post_id', postId)
  await supabase.from('reminders').delete().eq('post_id', postId)

  // 4. Delete the post
  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)

  if (deleteError) {
    console.error('Delete Post Error:', deleteError)
    throw new Error('Failed to delete UNTIL')
  }

  revalidatePath('/dashboard')
  return { success: true }
}

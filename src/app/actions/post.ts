'use server'

import { createClient } from '@/utils/supabase/server'
import { encryptContent, decryptContent, hashContent } from '@/utils/encryption'
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
  const mediaPath = formData.get('mediaPath') as string | null

  if (!message || !revealDate || !revealTime || !timezone) {
    throw new Error('Missing required fields')
  }

  const utcRevealAt = formData.get('utcRevealAt') as string

  if (!utcRevealAt) {
    throw new Error('Missing UTC reveal time')
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

import { createClient as createAdminClient } from '@supabase/supabase-js'

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

  // 2. Use admin client to reliably bypass RLS on cascade deletion
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Delete media from storage if exists
  if (post.media_path) {
    try {
      await adminClient.storage.from('locked_media').remove([post.media_path])
    } catch (storageErr) {
      console.error('Storage deletion error:', storageErr)
    }
  }

  // Delete dependent rows (guesses & reminders)
  await adminClient.from('guesses').delete().eq('post_id', postId)
  await adminClient.from('reminders').delete().eq('post_id', postId)

  // Delete the post
  const { error: deleteError } = await adminClient
    .from('posts')
    .delete()
    .eq('id', postId)

  if (deleteError) {
    console.error('Delete Post Error:', deleteError)
    throw new Error('Failed to delete UNTIL: ' + deleteError.message)
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getCreatorPreview(postId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()

  if (error || !post) {
    throw new Error('Post not found or unauthorized')
  }

  const decryptedMessage = decryptContent(post.encrypted_content)
  let mediaUrl = ''

  if (post.media_path) {
    const { data } = await supabase.storage
      .from('locked_media')
      .createSignedUrl(post.media_path, 3600)
    if (data?.signedUrl) {
      mediaUrl = data.signedUrl
    }
  }

  return {
    id: post.id,
    publicId: post.public_id,
    title: post.title,
    postType: post.post_type,
    authorName: post.author_name,
    message: decryptedMessage,
    mediaUrl,
    isVideo: post.media_path ? /\.(mp4|webm|mov|m4v|ogg)$/i.test(post.media_path) : false,
    revealAt: post.reveal_at,
    lockedAt: post.locked_at,
    status: post.status,
  }
}

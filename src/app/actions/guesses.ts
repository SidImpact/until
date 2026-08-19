'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addGuess(postId: string, authorName: string, guessText: string, publicId: string) {
  const supabase = await createClient()

  if (!authorName.trim() || !guessText.trim()) {
    throw new Error('Name and guess are required')
  }

  // Check if post is still locked (server-side verification)
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('reveal_at, status')
    .eq('id', postId)
    .single()

  if (postError || !post) {
    throw new Error('Post not found')
  }

  const isPastRevealTime = new Date(post.reveal_at).getTime() <= new Date().getTime()
  if (post.status === 'REVEALED' || isPastRevealTime) {
    throw new Error('This UNTIL has already been revealed. New guesses are closed.')
  }

  const { error } = await supabase
    .from('guesses')
    .insert({
      post_id: postId,
      author_name: authorName.trim(),
      guess_text: guessText.trim()
    })

  if (error) {
    console.error('Add guess error:', error)
    throw new Error('Failed to submit guess')
  }

  // Revalidate the public post page to show the new guess
  revalidatePath(`/p/${publicId}`)
  
  return { success: true }
}

export async function getGuesses(postId: string) {
  const supabase = await createClient()
  
  const { data: guesses, error } = await supabase
    .from('guesses')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch guesses error:', error)
    return []
  }

  return guesses
}

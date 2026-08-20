'use server'

import { sendFeedbackEmail } from '@/utils/mailer'

export async function submitFeedback(formData: FormData) {
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!message) {
    throw new Error('Message is required')
  }

  try {
    await sendFeedbackEmail(email, message)
    return { success: true }
  } catch (error) {
    console.error('Feedback Error:', error)
    throw new Error('Failed to send feedback. Please try again later.')
  }
}

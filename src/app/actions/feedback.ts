'use server'

import { sendFeedbackEmail } from '@/utils/mailer'

export async function submitFeedback(formData: FormData) {
  try {
    const name = formData.get('name') as string || ''
    const email = formData.get('email') as string || ''
    const feedbackType = formData.get('feedbackType') as string || 'General Feedback'
    const message = formData.get('message') as string

    if (!message || message.trim().length === 0) {
      return { success: false, error: 'Please enter your message before submitting.' }
    }

    if (message.trim().length > 3000) {
      return { success: false, error: 'Message is too long (maximum 3,000 characters).' }
    }

    await sendFeedbackEmail({
      name,
      email,
      feedbackType,
      message: message.trim(),
    })

    return { success: true, message: 'Thank you for your feedback! It has been delivered directly to the creator.' }
  } catch (error: any) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Failed to send feedback. Please try again later.' }
  }
}

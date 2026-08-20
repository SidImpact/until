import nodemailer from 'nodemailer'

// Keep a cached transporter so we don't create a new test account for every single email in a batch
let cachedTransporter: nodemailer.Transporter | null = null

export async function getMailer() {
  if (cachedTransporter) {
    return cachedTransporter
  }

  let transporter;

  if (process.env.RESEND_API_KEY) {
    // Resend SMTP
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    })
  } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Custom SMTP (e.g. Gmail App Passwords)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // Fallback to Ethereal
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  }

  cachedTransporter = transporter
  return transporter
}

export async function sendRevealEmail(to: string, postTitle: string, postUrl: string) {
  const mailer = await getMailer()
  const fromEmail = process.env.EMAIL_FROM || (process.env.RESEND_API_KEY ? 'onboarding@resend.dev' : '"UNTIL Platform" <noreply@until.app>')

  const info = await mailer.sendMail({
    from: fromEmail,
    to: to,
    subject: `🔓 ${postTitle} has been revealed!`,
    text: `The UNTIL you were waiting for has been revealed! View it here: ${postUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E5E5; border-radius: 8px;">
        <h2 style="text-transform: uppercase; letter-spacing: -0.03em;">🔓 UNTIL Revealed</h2>
        <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
          The countdown has reached zero. <strong>${postTitle}</strong> is now unlocked and available to view.
        </p>
        <a href="${postUrl}" style="display: inline-block; background: #0A0A0A; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: 500;">
          View Revealed Post
        </a>
      </div>
    `,
  })

  console.log('Message sent: %s', info.messageId)
  
  if (!process.env.RESEND_API_KEY && !process.env.SMTP_USER) {
    const previewUrl = nodemailer.getTestMessageUrl(info)
    console.log('Preview URL: %s', previewUrl)
    return previewUrl
  }
  
  return 'Sent to real inbox'
}

export interface FeedbackPayload {
  name?: string
  email?: string
  feedbackType: string
  message: string
}

export async function sendFeedbackEmail(payload: FeedbackPayload) {
  const mailer = await getMailer()
  const fromEmail = process.env.EMAIL_FROM || (process.env.RESEND_API_KEY ? 'onboarding@resend.dev' : '"UNTIL Platform" <noreply@until.app>')
  const recipientEmail = 'sidimpact6196@gmail.com'

  const senderName = payload.name?.trim() || 'Anonymous User'
  const senderEmail = payload.email?.trim() || 'Not provided'
  const feedbackType = payload.feedbackType || 'General Feedback'

  const info = await mailer.sendMail({
    from: fromEmail,
    to: recipientEmail,
    replyTo: payload.email?.trim() || undefined,
    subject: `💬 [UNTIL Feedback] ${feedbackType} from ${senderName}`,
    text: `New Feedback Received on UNTIL:\n\nType: ${feedbackType}\nFrom: ${senderName} (${senderEmail})\n\nMessage:\n${payload.message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E5E5E5; border-radius: 8px; background: #FFFFFF;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0A0A0A; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.03em; color: #0A0A0A;">
            UNTIL FEEDBACK
          </h2>
          <span style="background: #F0EFEA; color: #0A0A0A; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
            ${feedbackType}
          </span>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 4px 0; font-size: 14px; color: #666666;"><strong>Sender:</strong> ${senderName}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #666666;"><strong>Email / Reply To:</strong> ${senderEmail}</p>
        </div>

        <div style="background: #F8F7F4; border: 1px solid #E5E5E5; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #0A0A0A; white-space: pre-wrap;">${payload.message}</p>
        </div>

        <div style="font-size: 12px; color: #888888; text-align: center; border-top: 1px solid #EAEAEA; padding-top: 12px;">
          Delivered automatically from the UNTIL Platform Feedback Collector.
        </div>
      </div>
    `,
  })

  console.log('Feedback email sent: %s', info.messageId)
  return true
}

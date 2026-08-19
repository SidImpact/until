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

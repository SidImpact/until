'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Countdown({ revealAtUTC }: { revealAtUTC: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isRevealed, setIsRevealed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isRevealed) {
      // Auto-trigger the reveal cron sweep for local testing
      // Added a 2-second delay to ensure the server clock has also passed the reveal_at time
      setTimeout(() => {
        fetch('/api/cron/reveal').then(() => {
          router.refresh()
        }).catch((err) => {
          console.error('Failed to auto-trigger reveal', err)
          router.refresh()
        })
      }, 2000)
    }
  }, [isRevealed, router])

  useEffect(() => {
    const targetDate = new Date(revealAtUTC).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        setIsRevealed(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000) // Update every second

    return () => clearInterval(interval)
  }, [revealAtUTC])

  if (isRevealed) {
    return (
      <div className="text-center" style={{ margin: '40px 0' }}>
        <h3 style={{ color: 'var(--success)', letterSpacing: '0.1em' }}>🔓 REVEALING...</h3>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Decrypting your content. Please wait a moment.</p>
      </div>
    )
  }

  return (
    <div className="countdown-container">
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="countdown-label">DAYS</span>
      </div>
      
      <span className="countdown-separator">/</span>
      
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">HOURS</span>
      </div>

      <span className="countdown-separator">/</span>

      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">MINS</span>
      </div>

      <span className="countdown-separator">/</span>

      <div className="countdown-item">
        <span className="countdown-value" style={{ fontVariantNumeric: 'tabular-nums' }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">SECS</span>
      </div>
    </div>
  )
}

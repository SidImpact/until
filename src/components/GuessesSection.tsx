'use client'

import { useState } from 'react'
import { addGuess } from '@/app/actions/guesses'
import { formatDistanceToNow } from 'date-fns'

type Guess = {
  id: string
  author_name: string
  guess_text: string
  created_at: string
}

type GuessesSectionProps = {
  postId: string
  publicId: string
  isRevealed: boolean
  revealAt: string
  initialGuesses: Guess[]
}

export default function GuessesSection({ postId, publicId, isRevealed, revealAt, initialGuesses }: GuessesSectionProps) {
  const [guesses, setGuesses] = useState<Guess[]>(initialGuesses)
  const [authorName, setAuthorName] = useState('')
  const [guessText, setGuessText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !guessText.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      await addGuess(postId, authorName, guessText, publicId)
      
      // Optimistic update
      const newGuess: Guess = {
        id: crypto.randomUUID(), // Temp ID
        author_name: authorName.trim(),
        guess_text: guessText.trim(),
        created_at: new Date().toISOString()
      }
      
      setGuesses([newGuess, ...guesses])
      setGuessText('')
      // Keep authorName to make it easy to guess again if they want, or clear it.
    } catch (err: any) {
      setError(err.message || 'Failed to submit guess')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card mt-8" style={{ padding: '24px', background: 'var(--background)' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Guesses & Predictions</h3>
      
      {!isRevealed ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px', padding: '24px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>Lock in your guess before the timer runs out!</p>
          
          <div className="form-group mb-4">
            <label className="form-label" htmlFor="guessAuthor">Your Name</label>
            <input
              id="guessAuthor"
              type="text"
              placeholder="e.g. Alex"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="guessText">Your Prediction</label>
            <textarea
              id="guessText"
              placeholder="I bet it's going to be..."
              value={guessText}
              onChange={(e) => setGuessText(e.target.value)}
              required
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Locking in...' : 'Submit Guess'}
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: '32px', padding: '24px', textAlign: 'center', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <p className="text-muted" style={{ margin: 0 }}>The UNTIL has been revealed. New guesses are closed.</p>
        </div>
      )}

      <div>
        {guesses.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '32px 0', fontStyle: 'italic' }}>No guesses yet. Be the first!</p>
        ) : (
          <div className="flex-col" style={{ gap: '16px' }}>
            {guesses.map((guess) => {
              const isLockedIn = new Date(guess.created_at).getTime() < new Date(revealAt).getTime()
              
              return (
                <div key={guess.id} style={{ padding: '24px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: 600 }}>{guess.author_name}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {formatDistanceToNow(new Date(guess.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--foreground)' }}>{guess.guess_text}</p>
                  
                  {isLockedIn && (
                    <div style={{ marginTop: '16px', display: 'inline-block', fontSize: '0.7rem', background: '#000', color: '#FFF', padding: '4px 10px', borderRadius: '12px' }}>
                      🔒 Locked in before reveal
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

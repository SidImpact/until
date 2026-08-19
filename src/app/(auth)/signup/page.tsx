import Link from 'next/link'
import { signup } from '../actions'

export default async function SignupPage({ searchParams }: { searchParams: { message: string } }) {
  const { message } = await searchParams;
  return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center">Create Account</h2>
        <p className="text-center text-muted mb-8">Start making your future promises</p>

        <form action={signup} className="flex-col gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="display_name">User Name / Display Name</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="e.g. Alex"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {message && <div className="error-message text-center">{message}</div>}

          <button className="btn btn-primary mt-4" type="submit">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-8 text-muted" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--foreground)', fontWeight: 500 }}>Log in</Link>
        </div>
      </div>
    </div>
  )
}

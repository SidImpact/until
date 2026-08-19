import Link from 'next/link'
import { login } from '../actions'

export default async function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const { message } = await searchParams;
  return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center">Welcome Back</h2>
        <p className="text-center text-muted mb-8">Login to your UNTIL account</p>

        <form action={login} className="flex-col gap-4">
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
            />
          </div>

          {message && <div className="error-message text-center">{message}</div>}

          <button className="btn btn-primary mt-4" type="submit">
            Log In
          </button>
        </form>

        <div className="text-center mt-8 text-muted" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--foreground)', fontWeight: 500 }}>Sign up</Link>
        </div>
      </div>
    </div>
  )
}

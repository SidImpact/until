import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow, isPast } from 'date-fns'
import DashboardPostCard from '@/components/DashboardPostCard'
import { logout } from '@/app/(auth)/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch posts for this user
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, reminders(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching posts:', error)
  }

  const now = new Date().getTime()
  const activePosts = posts?.filter(p => p.status === 'LOCKED' && new Date(p.reveal_at).getTime() > now) || []
  const revealedPosts = posts?.filter(p => p.status === 'REVEALED' || new Date(p.reveal_at).getTime() <= now) || []

  return (
    <div className="main-content">
      <div className="container">
        
        <div className="flex justify-between items-center mb-8">
          <h1 style={{ margin: 0 }}>Your UNTILs</h1>
          <form action={logout}>
            <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '8px 16px', cursor: 'pointer' }}>
              Logout
            </button>
          </form>
        </div>

        <section className="mb-8">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active ({activePosts.length})
          </h2>
          {activePosts.length === 0 ? (
            <div className="card text-center text-muted mt-4">
              <p>You have no active UNTILs.</p>
              <Link href="/create" className="btn btn-primary mt-4">Create One</Link>
            </div>
          ) : (
            <div className="mt-4" style={{ display: 'grid', gap: '16px' }}>
              {activePosts.map(post => (
                <DashboardPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Revealed ({revealedPosts.length})
          </h2>
          {revealedPosts.length === 0 ? (
            <p className="text-muted mt-4">No revealed posts yet.</p>
          ) : (
            <div className="mt-4" style={{ display: 'grid', gap: '16px' }}>
              {revealedPosts.map(post => (
                <DashboardPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

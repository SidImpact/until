import Link from 'next/link'
import Countdown from '@/components/Countdown' // Assuming we extract Countdown, but here we can just use inline HTML or import the actual component. Let's use the actual component!

export default function LandingPage() {
  // Pass a fake date for the landing page example (e.g. 127 days from now)
  const fakeRevealAt = new Date(new Date().getTime() + 127 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 32 * 60 * 1000).toISOString()

  return (
    <div className="main-content">
      <div className="container">
        
        <section className="flex-col items-center justify-center text-center mt-8 mb-8" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 600, letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.1 }}>
            Say it now. <br />Reveal it later.
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '40px', color: 'var(--foreground)' }}>
            Create a locked prediction, message, or digital time capsule to be revealed on your terms.
          </p>
          
          <div className="flex items-center gap-4">
            <Link href="/create" className="btn btn-primary" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              Make an UNTIL
            </Link>
            <a href="#how-it-works" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              How it works
            </a>
          </div>
        </section>

        <section className="mt-8 mb-8">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '48px 24px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '16px' }}>
              I Predict The <br/>Championship Winner
            </h2>
            
            <div className="badge-sealed">SEALED & ENCRYPTED</div>
            
            <Countdown revealAtUTC={fakeRevealAt} />
          </div>
        </section>

        <section id="how-it-works" className="mt-8 mb-8" style={{ paddingTop: '80px' }}>
          <h3 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>How it works</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            <div className="card text-center" style={{ padding: '32px 24px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>01</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SAY IT</h4>
              <p className="text-muted">Create your message. Attach an image or video.</p>
            </div>
            <div className="card text-center" style={{ padding: '32px 24px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>02</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOCK IT</h4>
              <p className="text-muted">Choose when it will be revealed. Once locked, it cannot be edited.</p>
            </div>
            <div className="card text-center" style={{ padding: '32px 24px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>03</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>REVEAL IT</h4>
              <p className="text-muted">Share the countdown link and let the future speak for itself.</p>
            </div>
          </div>
        </section>

        <section className="mt-8 mb-8" style={{ paddingTop: '80px', paddingBottom: '80px', borderTop: '1px solid var(--border)' }}>
          <div className="text-center mb-8">
            <h3 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Share the anticipation.</h3>
            <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
              Drop your UNTIL link anywhere. Your audience will see a beautiful preview card and a ticking countdown.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '64px' }}>
            
            {/* X / Twitter Mockup */}
            <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
              <div className="flex gap-4 mb-4">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E5E5E5' }}></div>
                <div>
                  <div style={{ fontWeight: 600 }}>Alex 🔮</div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>@alex_predicts</div>
                </div>
              </div>
              <p style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
                I just made my biggest prediction for the decade. Let's see if I'm right. 👇
              </p>
              
              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ background: '#F8F7F4', padding: '40px 24px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                  <div className="badge-sealed" style={{ margin: '0 auto 16px auto', display: 'inline-block' }}>SEALED & ENCRYPTED</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>127 / 04 / 32</div>
                </div>
                <div style={{ padding: '12px 16px', background: '#FAFAFA' }}>
                  <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>until.com</div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>I Predict The Championship Winner</div>
                </div>
              </div>
            </div>

            {/* iMessage Mockup */}
            <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ alignSelf: 'flex-end', background: '#0A0A0A', color: '#FFF', padding: '12px 16px', borderRadius: '20px 20px 4px 20px', maxWidth: '80%', fontSize: '0.95rem' }}>
                I finally decided who I'm proposing to! Locked it in. 💍
              </div>
              
              <div style={{ alignSelf: 'flex-end', width: '80%', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', background: '#FAFAFA' }}>
                <div style={{ background: '#F8F7F4', padding: '24px 16px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>30 / 12 / 00</div>
                  <div className="text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginTop: '8px' }}>Reveals In</div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>UNTIL: I know who I'm going to marry.</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Say it now. Reveal it later.</div>
                </div>
              </div>
            </div>

            {/* WhatsApp Mockup */}
            <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
              <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', color: '#000', padding: '16px', borderRadius: '0px 12px 12px 12px', maxWidth: '85%', fontSize: '0.95rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #E5E5E5' }}>
                <div style={{ color: '#25D366', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>Sarah</div>
                <div style={{ borderLeft: '4px solid #25D366', background: '#FAFAFA', padding: '8px 12px', borderRadius: '4px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: 'bold' }}>🔒</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>UNTIL: Secret Project</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>until.com</div>
                    </div>
                  </div>
                </div>
                I'm not telling anyone until the launch date. You'll just have to wait! 🤫
                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>10:42 AM</div>
              </div>
            </div>

            {/* Instagram Story Mockup */}
            <div className="card" style={{ padding: '24px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <div style={{ textAlign: 'center', padding: '24px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '16px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', width: '100%', maxWidth: '220px' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 600 }}>Gender Reveal</h4>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '24px' }}>Nobody knows yet...</div>
                
                <div style={{ background: '#FFF', color: '#000', borderRadius: '24px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  🔗 until.com/reveal
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}

import FeedbackForm from '@/components/FeedbackForm'

export const metadata = {
  title: 'Support & Feedback | UNTIL',
}

export default function SupportPage() {
  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: '700px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Support the Developer</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            UNTIL is an independent platform developed by <strong>SID IMPACT</strong>. <br/>
            If you love using this platform, consider supporting its development!
          </p>
        </div>

        <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          {/* Donation Links Section */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              Buy me a coffee ☕
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>💖 Google Pay (GPay)</strong>
                <code style={{ background: 'var(--surface-hover)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.875rem', display: 'block', color: 'var(--foreground)' }}>
                  sidbhimgaj.s14@okaxis
                </code>
              </div>

              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>💖 PayPal</strong>
                <a href="https://paypal.me/siddharthSingh374" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--foreground)' }}>
                  PayPal.Me/siddharthSingh374
                </a>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="https://ko-fi.com/sidimpact" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#FF5E5B', color: '#FFF', border: 'none', padding: '10px' }}>
                  🟢 Ko-fi
                </a>
                
                <a href="https://patreon.com/SIDDHARTHSINGH152?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#FF424D', color: '#FFF', border: 'none', padding: '10px' }}>
                  🟢 Patreon
                </a>

                <a href="https://razorpay.me/@siddharthsingh7719" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#02042B', color: '#FFF', border: 'none', padding: '10px' }}>
                  🟢 Razorpay
                </a>

                <a href="https://www.chai4.me/sidbhimgajs14gmailcom" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#FFB800', color: '#000', border: 'none', padding: '10px' }}>
                  🟢 Chai4.me
                </a>
              </div>

            </div>
          </div>

          {/* Feedback Form Section */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
              Feedback Collector
            </h2>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
              Send your thoughts directly to sidimpact6196@gmail.com
            </p>
            
            <FeedbackForm />
          </div>

        </div>

      </div>
    </div>
  )
}

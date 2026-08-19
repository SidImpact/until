export default function ConceptsPage() {
  const concepts = [
    {
      id: 'A',
      title: 'Option A: Editorial Luxury Dark (Recommended)',
      img: '/concept-a.jpg',
      desc: 'Matte obsidian (#0B0B0C), bespoke serif hero typography, tactile dark cards with warm gold/bronze countdown accents.',
      vibe: 'Mystery, timeless elegance, emotional commitment',
    },
    {
      id: 'B',
      title: 'Option B: Modern Glass & Diffuse Noir',
      img: '/concept-b.jpg',
      desc: 'Deep graphite (#121316), translucent frosted glassmorphism card, ambient diffuse spotlighting, bold modern sans digits.',
      vibe: 'Viral, modern social tech, fresh and dynamic',
    },
    {
      id: 'C',
      title: 'Option C: Swiss Editorial Light',
      img: '/concept-c.jpg',
      desc: 'Warm alabaster off-white (#F8F7F4), crisp black typography, official "SEALED & ENCRYPTED" stamp badge, spacious layout.',
      vibe: 'Pristine, high-fashion editorial, open and airy',
    },
    {
      id: 'D',
      title: 'Option D: Vault Noir (Cryptographic Precision)',
      img: '/concept-d.jpg',
      desc: 'Pure stealth black (#080808), precision monospace countdown capsules, cryptographic SHA256 commitment badge.',
      vibe: 'High security, immutable proof, high-stakes predictions',
    },
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', textAlign: 'center' }}>UNTIL — UI Design Options</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '40px', fontSize: '1.1rem' }}>
        Choose the aesthetic direction you would like for the UNTIL platform.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '40px' }}>
        {concepts.map((c) => (
          <div
            key={c.id}
            style={{
              background: '#141416',
              borderRadius: '16px',
              border: '1px solid #2a2a2e',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', background: '#000' }}>
              <img
                src={c.img}
                alt={c.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '10px' }}>{c.title}</h2>
              <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '12px' }}>{c.desc}</p>
              <div style={{ display: 'inline-block', background: '#222', color: '#e5c07b', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                ✨ {c.vibe}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

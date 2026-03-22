import { useState, useEffect } from 'react'

const B = {
  purple: '#7B52F4', purpleDark: '#5B35D4', orange: '#FF5C00',
  teal: '#00C2B2', yellow: '#FFD600', black: '#0D0D0D',
  white: '#FFFFFF', gray: '#F4F3FF', grayText: '#8B7FBF'
}

const accentColors = [B.orange, B.teal, B.yellow, B.white]

export default function App() {
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('idle') // idle|loading|sending|done|error
  const [leads, setLeads] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const isRunning = ['loading', 'sending'].includes(phase)

  // Load leads on mount
  useEffect(() => {
    loadLeads()
  }, [])

  // Elapsed timer
  useEffect(() => {
    if (!isRunning) return
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [isRunning])

  async function loadLeads() {
    setPhase('loading')
    setElapsed(0)
    setErrorMsg('')
    try {
      const res = await fetch('/api/fetch-etfs')
      if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`)
      const data = await res.json()
      setLeads(data.leads || [])
      setPhase('idle')
    } catch (e) {
      setErrorMsg(e.message)
      setPhase('error')
    }
  }

  async function sendDigest() {
    if (!email.includes('@')) { setErrorMsg('Enter a valid email address.'); return }
    setErrorMsg('')
    setPhase('sending')
    setElapsed(0)
    try {
      const res = await fetch('/api/send-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, leads })
      })
      if (!res.ok) throw new Error(`Send failed (${res.status})`)
      setPhase('done')
    } catch (e) {
      setErrorMsg(e.message)
      setPhase('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: B.purple, fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: B.orange, opacity: 0.18, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: B.teal, opacity: 0.2, filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: B.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌸</div>
          <span style={{ color: B.white, fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>blossom</span>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', background: B.yellow, color: B.black, fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 100, marginBottom: '1rem' }}>
            ETF Lead Generator · 7-Day
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(2.2rem,5vw,3rem)', fontWeight: 900, color: B.white, lineHeight: 1.0, letterSpacing: '-0.04em' }}>
            new ETFs.<br /><span style={{ color: B.yellow }}>find the team.</span>
          </h1>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 420 }}>
            Finds new ETF launches from the past 7 days, pulls each company's LinkedIn and marketing contacts — ready for outreach.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: B.white, borderRadius: 20, padding: '1.8rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: B.grayText, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Send leads to
          </label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            disabled={isRunning}
            style={{ width: '100%', boxSizing: 'border-box', background: B.gray, border: `2px solid ${errorMsg ? B.orange : 'transparent'}`, borderRadius: 12, padding: '0.8rem 1rem', color: B.black, fontSize: '1rem', fontFamily: 'inherit', fontWeight: 500, outline: 'none', marginBottom: '1rem' }}
          />

          {/* Status messages */}
          {phase === 'loading' && (
            <div style={{ background: B.gray, borderRadius: 12, padding: '0.85rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: 16, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              <span style={{ fontWeight: 600, color: B.black, fontSize: '0.875rem' }}>Fetching this week's ETF launches… {elapsed}s</span>
            </div>
          )}
          {phase === 'sending' && (
            <div style={{ background: B.gray, borderRadius: 12, padding: '0.85rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: 16, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              <span style={{ fontWeight: 600, color: B.black, fontSize: '0.875rem' }}>Sending lead digest via email…</span>
            </div>
          )}
          {errorMsg && (
            <div style={{ background: '#FFF0EB', border: `2px solid ${B.orange}`, borderRadius: 12, padding: '0.75rem 1rem', color: B.orange, fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
              ⚠️ {errorMsg}
            </div>
          )}
          {phase === 'done' && (
            <div style={{ background: '#F0EBFF', border: `2px solid ${B.purple}`, borderRadius: 12, padding: '0.75rem 1rem', color: B.purple, fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>
              🚀 Sent! {leads.length} lead{leads.length !== 1 ? 's' : ''} emailed to {email}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={!isRunning ? sendDigest : undefined}
              disabled={isRunning || leads.length === 0}
              style={{ flex: 1, padding: '1rem', background: isRunning || leads.length === 0 ? B.gray : B.purple, color: isRunning || leads.length === 0 ? B.grayText : B.white, border: 'none', borderRadius: 12, fontSize: '1rem', fontFamily: 'inherit', fontWeight: 800, cursor: isRunning || leads.length === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { if (!isRunning && leads.length > 0) e.target.style.background = B.purpleDark }}
              onMouseLeave={e => { if (!isRunning && leads.length > 0) e.target.style.background = B.purple }}
            >
              {phase === 'sending' ? '📬 Sending…' : phase === 'done' ? '📬 Send Again' : `Email ${leads.length} Leads →`}
            </button>
            <button
              onClick={!isRunning ? loadLeads : undefined}
              disabled={isRunning}
              title="Refresh leads"
              style={{ padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.15)', color: B.white, border: '2px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: '1rem', cursor: isRunning ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Lead cards */}
        {leads.length > 0 && (
          <div>
            <div style={{ display: 'inline-block', background: B.orange, color: B.white, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100, marginBottom: '1rem' }}>
              {leads.length} lead{leads.length !== 1 ? 's' : ''} this week
            </div>

            {leads.map((lead, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '1.1rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: accentColors[i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: B.black }}>
                    {lead.company?.[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: B.white, fontWeight: 800, fontSize: '0.95rem' }}>{lead.company}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.1rem' }}>
                      📊 {lead.etf} · <span style={{ color: B.yellow, fontWeight: 700 }}>{lead.ticker}</span>
                    </div>
                  </div>
                  {lead.linkedin && (
                    <a href={lead.linkedin} target="_blank" rel="noopener noreferrer"
                      style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#0A66C2', color: B.white, fontSize: '0.8rem', fontWeight: 700, padding: '6px 14px', borderRadius: 100, textDecoration: 'none' }}>
                      <span style={{ fontWeight: 900 }}>in</span> LinkedIn
                    </a>
                  )}
                </div>

                {lead.marketers?.length > 0 && (
                  <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.13em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Marketing Contacts
                    </div>
                    {lead.marketers.map((m, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: j < lead.marketers.length - 1 ? '0.4rem' : 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: B.white, flexShrink: 0 }}>
                          {m.name?.[0]}
                        </div>
                        <div>
                          <div style={{ color: B.white, fontWeight: 700, fontSize: '0.82rem' }}>{m.name}</div>
                          {m.title && <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>{m.title}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingBottom: '2rem' }}>
          Data from SEC EDGAR &amp; public web · Powered by Claude AI
        </p>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        input::placeholder { color: #B0A8D9; }
        input:focus { border-color: #7B52F4 !important; background: white !important; }
      `}</style>
    </div>
  )
}

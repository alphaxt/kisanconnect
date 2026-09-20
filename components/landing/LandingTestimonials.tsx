'use client'

export function LandingStats() {
  return (
    <section style={{
      background:'rgba(0,200,83,0.04)',
      borderTop:'1px solid var(--glass-border)',
      borderBottom:'1px solid var(--glass-border)',
      padding:'60px 24px',
    }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
        {[
          { val:'22M+', label:'Registered Farmers', sub:'Across all 4 provinces' },
          { val:'340+', label:'Mandi Price Points', sub:'Updated every 30 minutes' },
          { val:'Rs 2.4B+', label:'Trades Facilitated', sub:'In last 12 months' },
          { val:'98%', label:'Expert Answer Rate', sub:'Within 4 hours' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize:'2.2rem', fontWeight:900, color:'var(--green)', marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
        <style>{`@media(max-width:700px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </div>
    </section>
  )
}

export function LandingPvsS() {
  return (
    <section style={{ maxWidth:1200, margin:'0 auto', padding:'80px 24px' }}>
      <div style={{ textAlign:'center', marginBottom:50 }}>
        <h2 className="section-title">Real Impact for Real Farmers</h2>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:24, alignItems:'center' }}>
        <div style={{ background:'rgba(213,0,0,0.05)', border:'1px solid rgba(213,0,0,0.15)', borderRadius:20, padding:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <span style={{ fontSize:'1.4rem' }}>❌</span>
            <h3 style={{ fontWeight:700 }}>Before KisanConnect</h3>
          </div>
          {[
            'Sell wheat at Rs. 2,800/maund to Arthy',
            'Arthy resells at Rs. 4,200 to buyer (+50%)',
            'No idea which disease is killing your crop',
            'Complex bank paperwork for loans',
            'No weather alerts — over-irrigate by 40%',
            'Isolated — no expert to ask for advice',
          ].map(t => (
            <div key={t} style={{ display:'flex', gap:10, marginBottom:10, fontSize:'0.86rem', color:'var(--text-2)' }}>
              <span style={{ color:'#FF5252', flexShrink:0 }}>—</span> {t}
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, color:'var(--gold)', fontWeight:700, fontSize:'0.8rem' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,214,0,0.1)', border:'1px solid rgba(255,214,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>→</div>
          <span>KisanConnect</span>
        </div>

        <div style={{ background:'rgba(0,200,83,0.05)', border:'1px solid rgba(0,200,83,0.15)', borderRadius:20, padding:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <span style={{ fontSize:'1.4rem' }}>✅</span>
            <h3 style={{ fontWeight:700 }}>After KisanConnect</h3>
          </div>
          {[
            'Sell directly at Rs. 3,900/maund to buyer',
            'Keep Rs. 1,100 more per maund (+39%)',
            'AI disease detection in 30 seconds with Urdu guide',
            'One-click loan application — approved in 3 days',
            'Smart irrigation alerts → save 40% water costs',
            '50,000+ farmer community + 340 expert agronomists',
          ].map(t => (
            <div key={t} style={{ display:'flex', gap:10, marginBottom:10, fontSize:'0.86rem', color:'var(--text-2)' }}>
              <span style={{ color:'var(--green)', flexShrink:0 }}>✓</span> {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingTestimonials() {
  const testimonials = [
    { initials:'MK', bg:'linear-gradient(135deg,#00C853,#004D20)', name:'Muhammad Khalid', role:'Wheat Farmer · Faisalabad · 15 Acres',
      urdu:'میں نے گندم براہ راست ایکسپورٹر کو بیچی۔ آمدنی 40% بڑھ گئی۔',
      eng:'I sold wheat directly to an exporter. Income increased 40%.' },
    { initials:'FA', bg:'linear-gradient(135deg,#FFD600,#E65100)', name:'Fatima Aslam', role:'Rice Farmer · Sheikhupura · 8 Acres',
      urdu:'Disease AI نے میری چاول کی فصل کو Blast سے بچایا — صرف 30 سیکنڈ میں!',
      eng:'Disease AI saved my rice crop from blast fungus in 30 seconds.' },
    { initials:'ZK', bg:'linear-gradient(135deg,#AA00FF,#4A0080)', name:'Zafar Khan', role:'Mango Orchard · Multan · 25 Acres',
      urdu:'ZTBL قرضہ آسانی سے ملا — کوئی کاغذی کارروائی نہیں!',
      eng:'Got ZTBL agricultural loan with zero paperwork hassle.' },
  ]

  return (
    <section style={{ maxWidth:1300, margin:'0 auto', padding:'60px 24px 80px' }}>
      <div style={{ textAlign:'center', marginBottom:50 }}>
        <span className="section-tag">Success Stories</span>
        <h2 className="section-title">Farmers Who Changed Their Lives</h2>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
        {testimonials.map(t => (
          <div key={t.name} className="card" style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#fff', fontSize:'0.9rem', flexShrink:0 }}>{t.initials}</div>
            <div>
              <div style={{ fontSize:'0.72rem', marginBottom:6 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontFamily:"'Noto Nastaliq Urdu',serif", direction:'rtl', fontSize:'0.85rem', color:'var(--text-2)', lineHeight:1.9, marginBottom:6 }}>{t.urdu}</p>
              <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontStyle:'italic', marginBottom:10 }}>"{t.eng}"</p>
              <div style={{ fontSize:'0.85rem', fontWeight:700 }}>{t.name}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer style={{ background:'rgba(0,0,0,0.3)', borderTop:'1px solid var(--glass-border)' }}>
      <div style={{ maxWidth:1300, margin:'0 auto', padding:'60px 24px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <span style={{ fontSize:'1.8rem' }}>🌿</span>
            <span style={{ fontWeight:800, fontSize:'1.2rem' }}>KisanConnect</span>
          </div>
          <p style={{ fontSize:'0.84rem', color:'var(--text-muted)', lineHeight:1.7, marginBottom:20 }}>
            Empowering Pakistan's farmers with technology, transparency, and direct market access. Registered under SECP Pakistan.
          </p>
          <div style={{ display:'flex', gap:8 }}>
            {['Twitter','Facebook','YouTube','WhatsApp'].map(s => (
              <button key={s} style={{ width:34, height:34, borderRadius:8, background:'var(--glass)', border:'1px solid var(--glass-border)', cursor:'pointer', fontSize:'0.75rem', color:'var(--text-muted)' }}>
                {s[0]}
              </button>
            ))}
          </div>
        </div>
        {[
          { title:'Platform', links:['Dashboard','Marketplace','Disease AI','Loans','Community','Crop Planner'] },
          { title:'Resources', links:['Farming Guides','Weather API','Price History','Government Schemes','Blog'] },
          { title:'Company', links:['About Us','Contact','Privacy Policy','Terms of Service','Careers'] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:14 }}>{col.title}</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {col.links.map(l => (
                <a key={l} href="#" style={{ fontSize:'0.82rem', color:'var(--text-muted)', transition:'color 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--green)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid var(--glass-border)', padding:'18px 24px', display:'flex', justifyContent:'space-between', maxWidth:1300, margin:'0 auto', fontSize:'0.76rem', color:'var(--text-muted)', flexWrap:'wrap', gap:8 }}>
        <span>© 2026 KisanConnect. Made with 💚 for Pakistan's Farmers.</span>
        <span>SECP Registered · ISO 27001 Certified · 100% Secure</span>
      </div>
    </footer>
  )
}

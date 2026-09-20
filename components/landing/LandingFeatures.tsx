'use client'
import Link from 'next/link'
import { BarChart3, ScanSearch, Store, CloudRain, Landmark, Users } from 'lucide-react'

const FEATURES = [
  { href:'/dashboard',   icon:BarChart3,  color:'#00C853', title:'Live Market Prices',     desc:'Real-time mandi rates from 340+ markets across all provinces. Price transparency kills exploitation.' },
  { href:'/disease',     icon:ScanSearch, color:'#FF6D00', title:'AI Disease Scanner',      desc:'Upload crop photo → AI detects 50+ diseases instantly → Urdu treatment guide within seconds.' },
  { href:'/marketplace', icon:Store,      color:'#AA00FF', title:'Direct Marketplace',      desc:'Connect directly with verified buyers and exporters. No middlemen. Average 38% higher prices.' },
  { href:'/planner',     icon:CloudRain,  color:'#0091EA', title:'Weather Intelligence',    desc:'10-day hyper-local forecasts with smart irrigation scheduling. Save 40% water and fertilizer.' },
  { href:'/loans',       icon:Landmark,   color:'#FFD600', title:'Loan & Subsidy Finder',   desc:'Access ZTBL, PM Kissan Card, Khushhali Bank. One-click application. 24-hour processing.' },
  { href:'/community',   icon:Users,      color:'#E91E63', title:'Expert Community',         desc:'50,000+ farmers + 340 agronomists. Ask questions in Urdu or English. 98% answer rate.' },
]

export function LandingFeatures() {
  return (
    <section style={{ maxWidth:1300, margin:'0 auto', padding:'80px 24px' }}>
      <div style={{ textAlign:'center', marginBottom:60 }}>
        <span className="section-tag">Platform Features</span>
        <h2 className="section-title">Everything a Kisan Needs</h2>
        <p className="section-desc" style={{ margin:'0 auto' }}>
          A complete ecosystem built for Pakistan's agricultural reality — from seed to sale.
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
        <style>{`
          @media(max-width:900px){.features-grid{grid-template-columns:repeat(2,1fr)!important}}
          @media(max-width:600px){.features-grid{grid-template-columns:1fr!important}}
        `}</style>
        {FEATURES.map(f => (
          <Link key={f.href} href={f.href}
            className="card"
            style={{ cursor:'pointer', display:'block', textDecoration:'none', position:'relative', overflow:'hidden' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,200,83,0.35)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glow)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'
              ;(e.currentTarget as HTMLElement).style.transform = 'none'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            <div style={{
              width:52, height:52, borderRadius:14,
              background:`${f.color}18`, border:`1px solid ${f.color}40`,
              display:'flex', alignItems:'center', justifyContent:'center',
              marginBottom:16, color:f.color, transition:'var(--ease)',
            }}>
              <f.icon size={24} />
            </div>
            <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:10 }}>{f.title}</h3>
            <p style={{ fontSize:'0.86rem', color:'var(--text-2)', lineHeight:1.6 }}>{f.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

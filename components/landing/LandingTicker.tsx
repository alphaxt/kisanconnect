'use client'

interface TickerPrice { city: string; crop: string; price: number; change_pct: number }

export function LandingTicker({ prices }: { prices: TickerPrice[] }) {
  const items = prices.length > 0 ? [...prices, ...prices] : []
  return (
    <div style={{
      background:'rgba(0,200,83,0.05)',
      borderTop:'1px solid var(--glass-border)',
      borderBottom:'1px solid var(--glass-border)',
      padding:'10px 0', display:'flex', alignItems:'center', overflow:'hidden',
    }}>
      <style>{`
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
      <span style={{
        flexShrink:0, padding:'0 20px',
        fontSize:'0.72rem', fontWeight:700, color:'var(--green)',
        letterSpacing:0.5, borderRight:'1px solid var(--glass-border)',
      }}>🔴 LIVE MANDI PRICES</span>
      <div style={{ overflow:'hidden', flex:1 }}>
        <div style={{
          display:'flex', gap:48, whiteSpace:'nowrap',
          animation:'tickerScroll 35s linear infinite',
        }}>
          {(items.length > 0 ? items : [
            { city:'Lahore', crop:'Wheat', price:3850, change_pct:2.4 },
            { city:'Faisalabad', crop:'Cotton', price:12400, change_pct:3.2 },
            { city:'Multan', crop:'Mango', price:4200, change_pct:-1.5 },
            { city:'Karachi', crop:'Onion', price:2100, change_pct:-3.2 },
            { city:'Peshawar', crop:'Potato', price:1800, change_pct:-2.1 },
            { city:'Quetta', crop:'Apple', price:5200, change_pct:2.8 },
          ]).map((p, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:'0.83rem' }}>
              <span style={{ color:'var(--text-muted)' }}>{p.city} · {p.crop}</span>
              <span style={{ color:'var(--text)', fontWeight:700 }}>Rs. {p.price.toLocaleString()}/Mnd</span>
              <span style={{ color: p.change_pct >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {p.change_pct >= 0 ? '▲' : '▼'} {Math.abs(p.change_pct)}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

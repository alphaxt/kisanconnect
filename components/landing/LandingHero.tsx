'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Sprout, PlayCircle, ArrowRight } from 'lucide-react'

export function LandingHero() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Particles
    const container = particlesRef.current
    if (!container) return
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div')
      p.style.cssText = `
        position:absolute; border-radius:50%;
        background:var(--green); pointer-events:none;
        left:${Math.random()*100}%; top:${40+Math.random()*60}%;
        width:${2+Math.random()*4}px; height:${2+Math.random()*4}px;
        opacity:0; animation:particleFloat ${4+Math.random()*6}s ${Math.random()*6}s infinite ease-in-out;
      `
      container.appendChild(p)
    }

    // Orbit
    const crops = ['🌾','🍚','☁️','🎋','🥭','🥔','🌽','🍅']
    const orbit = orbitRef.current
    if (!orbit) return
    let angle = 0
    const icons = crops.map(c => {
      const el = document.createElement('span')
      el.textContent = c
      el.style.cssText = `position:absolute;top:50%;left:50%;font-size:1.6rem;margin:-14px;filter:drop-shadow(0 0 8px rgba(0,200,83,0.4));`
      orbit.appendChild(el)
      return el
    })
    const frame = () => {
      angle += 0.25
      icons.forEach((el, i) => {
        const a = (angle + (i / crops.length) * 360) * Math.PI / 180
        el.style.transform = `translate(${Math.cos(a)*108}px,${Math.sin(a)*108}px)`
      })
      requestAnimationFrame(frame)
    }
    const raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  const counters = [
    { value: 22, suffix: 'M+', label: 'Farmers Reached' },
    { value: 340, suffix: '+', label: 'Mandis Connected' },
    { value: 38, suffix: '%', label: 'More Income Earned' },
  ]

  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      minHeight: 'calc(100vh - var(--nav-h))',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      alignItems: 'center', gap: 60,
      maxWidth: 1300, margin: '0 auto',
      padding: '60px 24px 40px',
    }}>
      <style>{`
        @keyframes particleFloat {
          0%   { opacity:0; transform:translateY(0) scale(0); }
          20%  { opacity:0.6; }
          80%  { opacity:0.3; }
          100% { opacity:0; transform:translateY(-200px) scale(1.5); }
        }
        @keyframes badgePulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.6} }
        @keyframes ringRotate { from{transform:rotate(0deg) rotateX(70deg)} to{transform:rotate(360deg) rotateX(70deg)} }
        @media (max-width:900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-globe { display: none !important; }
        }
      `}</style>

      <div ref={particlesRef} style={{ position:'absolute', inset:0, pointerEvents:'none' }} />

      {/* Left */}
      <div className="animate-fade-up">
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'6px 16px',
          background:'rgba(0,200,83,0.1)', border:'1px solid rgba(0,200,83,0.25)',
          borderRadius:'999px', fontSize:'0.82rem', fontWeight:700,
          color:'var(--green)', marginBottom:24,
        }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', animation:'badgePulse 2s infinite' }} />
          Pakistan's #1 Agricultural Platform
        </div>

        <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:900, lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
          Empowering <span className="gradient-text">22 Million</span><br/>
          Pakistani Farmers
        </h1>

        <p style={{ fontSize:'1.05rem', color:'var(--text-2)', lineHeight:1.7, marginBottom:8, maxWidth:500 }}>
          From Arthis to Algorithms — get live mandi prices, AI crop disease detection, direct buyer connections, and government loan access.
        </p>
        <p style={{ fontFamily:"'Noto Nastaliq Urdu',serif", direction:'rtl', fontSize:'1rem', color:'var(--text-muted)', marginBottom:32 }}>
          کسان کو آرٹھی سے آزاد کریں — براہ راست بازار سے جڑیں
        </p>

        <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:48 }}>
          <Link href="/auth/register" className="btn btn-primary" style={{ padding:'14px 28px', fontSize:'1rem' }}>
            <Sprout size={20} /> Get Started Free
          </Link>
          <Link href="/dashboard" className="btn btn-secondary" style={{ padding:'14px 28px', fontSize:'1rem' }}>
            <PlayCircle size={20} /> View Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', alignItems:'center' }}>
          {counters.map((c, i) => (
            <div key={c.label} style={{ display:'flex', alignItems:'center' }}>
              {i > 0 && <div style={{ width:1, height:48, background:'var(--glass-border)', margin:'0 24px' }} />}
              <div style={{ padding:'0 4px', textAlign:'center' }}>
                <div style={{ fontSize:'2rem', fontWeight:900, color:'var(--green)', lineHeight:1 }}>
                  {c.value}{c.suffix}
                </div>
                <div style={{ fontSize:'0.76rem', color:'var(--text-muted)', marginTop:4 }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Globe */}
      <div className="hero-globe" style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
        <div style={{ position:'relative', width:400, height:400, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {[100, 75, 50].map((size, i) => (
            <div key={i} style={{
              position:'absolute',
              width:`${size}%`, height:`${size}%`,
              borderRadius:'50%',
              border:`1px solid ${['rgba(0,200,83,0.15)','rgba(255,214,0,0.1)','rgba(170,0,255,0.1)'][i]}`,
              animation:`ringRotate ${[30,20,15][i]}s linear infinite ${i===1?'reverse':''}`,
            }} />
          ))}
          <div ref={orbitRef} style={{ position:'absolute', width:220, height:220 }} />
          <div style={{
            width:120, height:120, borderRadius:'50%',
            background:'radial-gradient(circle at 35% 35%, #1a3a1a, #070C07)',
            border:'2px solid rgba(0,200,83,0.3)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 40px rgba(0,200,83,0.3), inset 0 0 20px rgba(0,200,83,0.1)',
            zIndex:1,
          }}>
            <span style={{ fontSize:'2.5rem' }}>🇵🇰</span>
            <span style={{ fontSize:'0.6rem', fontWeight:700, color:'var(--green)', letterSpacing:1 }}>PAKISTAN</span>
          </div>
        </div>
      </div>
    </section>
  )
}

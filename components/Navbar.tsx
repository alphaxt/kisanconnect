'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  Sprout, BarChart3, Store, ScanSearch, Landmark,
  Users, CalendarDays, Menu, X, Bell, LogOut, User, ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { href: '/',            label: 'Home',        icon: Sprout      },
  { href: '/dashboard',   label: 'Dashboard',   icon: BarChart3   },
  { href: '/marketplace', label: 'Marketplace', icon: Store       },
  { href: '/disease',     label: 'Disease AI',  icon: ScanSearch  },
  { href: '/loans',       label: 'Loans',       icon: Landmark    },
  { href: '/community',   label: 'Community',   icon: Users       },
  { href: '/planner',     label: 'Crop Planner',icon: CalendarDays},
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out successfully')
    router.push('/')
    setUserMenuOpen(false)
  }

  const isAuthPage = pathname.startsWith('/auth')

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-h)',
        background: scrolled ? 'rgba(7,12,7,0.97)' : 'rgba(7,12,7,0.85)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--glass-border)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto', height: '100%',
          display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px',
        }}>
          {/* Brand */}
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{
              width:40, height:40, borderRadius:10,
              background: 'linear-gradient(135deg,#00C853,#004D20)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: '1.3rem',
              boxShadow: '0 4px 16px rgba(0,200,83,0.4)',
            }}>🌿</div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontWeight:800, fontSize:'1.05rem', lineHeight:1.1 }}>KisanConnect</span>
              <span style={{ fontFamily:"'Noto Nastaliq Urdu',serif", fontSize:'0.65rem', color:'var(--green)', direction:'rtl' }}>کسان کنیکٹ</span>
            </div>
          </Link>

          {/* Nav Links — Desktop */}
          {!isAuthPage && (
            <ul style={{ display:'flex', gap:2, margin:'0 auto', listStyle:'none', flexWrap:'nowrap' }}>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{
                    display:'block', padding:'6px 12px',
                    borderRadius:'999px',
                    fontSize:'0.88rem', fontWeight:500,
                    color: pathname === href ? 'var(--green)' : 'var(--text-2)',
                    background: pathname === href ? 'rgba(0,200,83,0.12)' : 'transparent',
                    transition:'all 0.15s',
                    whiteSpace:'nowrap',
                  }}>{label}</Link>
                </li>
              ))}
            </ul>
          )}

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto', flexShrink:0 }}>
            {user ? (
              <>
                {/* Notifications */}
                <button style={{
                  width:38, height:38, borderRadius:'50%',
                  background:'var(--glass)', border:'1px solid var(--glass-border)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', color:'var(--text-2)',
                  position:'relative',
                }}>
                  <Bell size={16} />
                  <span style={{
                    position:'absolute', top:6, right:6,
                    width:8, height:8, borderRadius:'50%',
                    background:'var(--green)',
                    border:'2px solid var(--bg)',
                  }} />
                </button>

                {/* User menu */}
                <div style={{ position:'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      display:'flex', alignItems:'center', gap:8,
                      padding:'6px 12px 6px 6px',
                      borderRadius:'999px',
                      background:'var(--glass)', border:'1px solid var(--glass-border)',
                      cursor:'pointer', color:'var(--text)',
                    }}
                  >
                    <div style={{
                      width:28, height:28, borderRadius:'50%',
                      background:'linear-gradient(135deg,#00C853,#004D20)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'0.7rem', fontWeight:700, color:'#fff',
                    }}>
                      {profile?.full_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? 'K'}
                    </div>
                    <span style={{ fontSize:'0.85rem', fontWeight:600, maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {profile?.full_name ?? 'Kisan'}
                    </span>
                    <ChevronDown size={14} style={{ color:'var(--text-muted)' }} />
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position:'absolute', top:'calc(100% + 8px)', right:0,
                      background:'var(--bg-card)',
                      border:'1px solid var(--glass-border)',
                      borderRadius:14, padding:8, minWidth:200,
                      boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
                      zIndex:100, animation:'fadeInUp 0.2s ease',
                    }}>
                      <div style={{ padding:'8px 12px', borderBottom:'1px solid var(--glass-border)', marginBottom:4 }}>
                        <div style={{ fontSize:'0.85rem', fontWeight:700 }}>{profile?.full_name}</div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{user.email ?? user.phone}</div>
                        <div style={{ marginTop:4 }}>
                          <span className="badge badge-green">{profile?.role ?? 'Farmer'}</span>
                        </div>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} style={{
                        display:'flex', alignItems:'center', gap:10,
                        padding:'8px 12px', borderRadius:8,
                        fontSize:'0.85rem', color:'var(--text-2)',
                        transition:'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background='var(--glass)')}
                      onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <button onClick={handleSignOut} style={{
                        display:'flex', alignItems:'center', gap:10,
                        padding:'8px 12px', borderRadius:8, width:'100%',
                        fontSize:'0.85rem', color:'var(--red)',
                        background:'none', cursor:'pointer',
                        transition:'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background='rgba(255,82,82,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">Join Free</Link>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display:'none', flexDirection:'column', gap:5,
                background:'none', cursor:'pointer', padding:4,
              }}
              className="hamburger"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position:'fixed', top:'var(--nav-h)', left:0, right:0,
          background:'rgba(7,12,7,0.98)',
          backdropFilter:'blur(24px)',
          borderBottom:'1px solid var(--glass-border)',
          padding:16, zIndex:999,
          display:'flex', flexDirection:'column', gap:4,
        }}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'12px 16px', borderRadius:12,
                color: pathname === href ? 'var(--green)' : 'var(--text-2)',
                background: pathname === href ? 'rgba(0,200,83,0.08)' : 'transparent',
                fontSize:'0.95rem',
              }}>
              <Icon size={18} /> {label}
            </Link>
          ))}
          <div style={{ borderTop:'1px solid var(--glass-border)', marginTop:8, paddingTop:8 }}>
            {user ? (
              <button onClick={handleSignOut} className="btn btn-danger btn-full btn-sm">
                <LogOut size={15} /> Sign Out
              </button>
            ) : (
              <div style={{ display:'flex', gap:8 }}>
                <Link href="/auth/login" className="btn btn-secondary btn-sm" style={{flex:1, justifyContent:'center'}}>Sign In</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm" style={{flex:1, justifyContent:'center'}}>Join Free</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { nav ul { display: none !important; } }
        @media (max-width: 640px) { .hamburger { display: flex !important; } }
      `}</style>
    </>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { LandingFooter } from '@/components/landing/LandingTestimonials'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  User, ShieldCheck, MapPin, Phone, Mail, Award,
  Store, Sprout, Landmark, MessageSquare, Edit3, CheckCircle, Save
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Local state initialized with auth data or defaults
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'farmer' as 'farmer' | 'buyer' | 'agronomist',
    phone: '',
    cnic: '',
    province: 'Punjab',
    district: 'Lahore',
    land_acres: '10',
    company_name: 'Agri Business'
  })

  useEffect(() => {
    if (user || profile) {
      setFormData({
        full_name: profile?.full_name || (user?.email?.split('@')[0] ?? 'User'),
        role: (profile?.role || (user?.email?.includes('danish') ? 'buyer' : 'farmer')) as any,
        phone: profile?.phone || '0300-1234567',
        cnic: profile?.cnic || '35202-1234567-1',
        province: profile?.province || 'Punjab',
        district: profile?.district || 'Lahore',
        land_acres: String(profile?.land_acres || 10),
        company_name: profile?.district ? `${profile.district} Trading Co.` : 'Agri Procurement Ltd'
      })
    }
  }, [user, profile])

  const isBuyer = formData.role === 'buyer'

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      // simulate save / toast
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-light)' }}>
      <Navbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 'calc(var(--nav-h) + 32px) 24px 80px' }}>
        {/* Profile Card Banner */}
        <div className="card" style={{
          padding: 32, marginBottom: 32,
          background: isBuyer
            ? 'linear-gradient(135deg, rgba(0,145,234,0.08) 0%, rgba(13,24,13,0.85) 100%)'
            : 'linear-gradient(135deg, rgba(0,200,83,0.08) 0%, rgba(13,24,13,0.85) 100%)',
          border: isBuyer ? '1px solid rgba(0,145,234,0.3)' : '1px solid rgba(0,200,83,0.3)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: isBuyer
                  ? 'linear-gradient(135deg, #0091EA, #004D80)'
                  : 'linear-gradient(135deg, #00C853, #004D20)',
                color: '#fff', fontSize: '2rem', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isBuyer ? '0 0 25px rgba(0,145,234,0.4)' : '0 0 25px rgba(0,200,83,0.4)'
              }}>
                {formData.full_name?.[0]?.toUpperCase() || (isBuyer ? 'B' : 'K')}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
                    {formData.full_name || 'Kisan User'}
                  </h1>
                  <span className="badge" style={{
                    background: isBuyer ? '#0091EA' : 'var(--green)',
                    color: isBuyer ? '#fff' : '#000',
                    fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <ShieldCheck size={14} />
                    {isBuyer ? 'Verified Industrial Buyer (خریدار)' : 'Verified Kisan (کاشتکار)'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Mail size={14} /> {user?.email || (isBuyer ? 'muhammaddanish.careers@gmail.com' : 'pcwork45@gmail.com')}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={14} /> {formData.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={14} /> {formData.district}, {formData.province}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}
            >
              <Edit3 size={15} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Activity & Role Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          <style>{`
            @media (max-width: 800px) {
              div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
          {isBuyer ? (
            <>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Buying Demands</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00E5FF' }}>4 Active</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Muridke & Multan</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Farmers Contacted</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--green)' }}>28 Kisans</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct phone/WhatsApp</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Procured Volume</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>12,400 Maund</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rice & Cotton</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Payment Rating</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFD600' }}>★ 5.0</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prompt settlement</div>
              </div>
            </>
          ) : (
            <>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Land Holding</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--green)' }}>{formData.land_acres} Acres</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wheat & Cotton</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Active Produce Listings</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-light)' }}>2 Crops</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct Marketplace</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Disease Scans Run</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00E5FF' }}>7 Diagnoses</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Leaf Doctor</div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Subsidy Status</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00C853' }}>Eligible</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PM Kissan Card</div>
              </div>
            </>
          )}
        </div>

        {/* Profile Details Form */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 800 }}>
            {isBuyer ? 'Buyer & Procurement Credentials' : 'Kisan & Farm Details'}
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Platform Role</label>
                <select
                  disabled={!isEditing}
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                >
                  <option value="farmer" style={{ background: '#111' }}>🌾 Farmer (کاشتکار)</option>
                  <option value="buyer" style={{ background: '#111' }}>🛒 Buyer / Mill Owner (خریدار)</option>
                  <option value="agronomist" style={{ background: '#111' }}>👨‍🔬 Agronomist (زرعی ماہر)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Mobile Number (WhatsApp Enabled)</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>CNIC Number (شناختی کارڈ)</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.cnic}
                  onChange={e => setFormData({ ...formData, cnic: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Province</label>
                <select
                  disabled={!isEditing}
                  value={formData.province}
                  onChange={e => setFormData({ ...formData, province: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                >
                  <option value="Punjab" style={{ background: '#111' }}>Punjab</option>
                  <option value="Sindh" style={{ background: '#111' }}>Sindh</option>
                  <option value="KPK" style={{ background: '#111' }}>KPK</option>
                  <option value="Balochistan" style={{ background: '#111' }}>Balochistan</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>District / City</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                />
              </div>
            </div>

            {isBuyer ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Business / Mill Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.company_name}
                  onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Total Land Holding (Acres / ایکڑ)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.land_acres}
                  onChange={e => setFormData({ ...formData, land_acres: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: isEditing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)', color: '#fff', outline: 'none'
                  }}
                />
              </div>
            )}

            {isEditing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

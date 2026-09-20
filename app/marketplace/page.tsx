'use client'
import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/Navbar'
import { LandingFooter } from '@/components/landing/LandingTestimonials'
import {
  Store, Search, Filter, Plus, MapPin, Phone, MessageCircle,
  CheckCircle2, ShieldCheck, Tag, ArrowUpRight, Clock, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ProduceListing {
  id: string
  crop: string
  crop_urdu: string
  category: 'Grains' | 'Cash Crops' | 'Fruits' | 'Vegetables'
  quantity: number
  unit: string
  price: number
  min_order: number
  city: string
  province: string
  farmer_name: string
  farmer_phone: string
  farmer_rating: number
  is_verified: boolean
  is_organic: boolean
  image_url: string
  description: string
  created_at: string
}

const INITIAL_LISTINGS: ProduceListing[] = [
  {
    id: '1',
    crop: 'Super Kernel Basmati Rice',
    crop_urdu: 'سپر کرنل باسمتی چاول',
    category: 'Grains',
    quantity: 650,
    unit: 'Maund (40 kg)',
    price: 4350,
    min_order: 50,
    city: 'Hafizabad',
    province: 'Punjab',
    farmer_name: 'Chaudhry Tariq Mehmood',
    farmer_phone: '923001234567',
    farmer_rating: 4.9,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'A-grade 2026 harvest, moisture content strictly below 12%, long grain aromatic Basmati direct from farm gate.',
    created_at: '2 hours ago'
  },
  {
    id: '2',
    crop: 'Export Quality Kinnow (Mandarin)',
    crop_urdu: 'ایکسپورٹ کوالٹی کنو',
    category: 'Fruits',
    quantity: 2500,
    unit: 'Wooden Crates (10 kg)',
    price: 1100,
    min_order: 100,
    city: 'Bhalwal, Sargodha',
    province: 'Punjab',
    farmer_name: 'Malik Zafar Iqbal',
    farmer_phone: '923019876543',
    farmer_rating: 4.8,
    is_verified: true,
    is_organic: true,
    image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
    description: 'Waxed and sorted Kinnow from 50-acre family orchard. Ready for domestic fruit markets or Middle East export packaging.',
    created_at: '5 hours ago'
  },
  {
    id: '3',
    crop: 'Raw White Cotton (Phutti)',
    crop_urdu: 'پھٹی کپاس',
    category: 'Cash Crops',
    quantity: 400,
    unit: 'Maund (40 kg)',
    price: 9100,
    min_order: 40,
    city: 'Vehari',
    province: 'Punjab',
    farmer_name: 'Haji Ghulam Rasool',
    farmer_phone: '923334567890',
    farmer_rating: 4.7,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
    description: 'First picking high-ginning outturn (GOT 39%), clean white fiber free of trash and dust.',
    created_at: '1 day ago'
  },
  {
    id: '4',
    crop: 'Red Long Chilli (Kunri Special)',
    crop_urdu: 'کنری کی لال مرچ',
    category: 'Vegetables',
    quantity: 180,
    unit: 'Maund (40 kg)',
    price: 28200,
    min_order: 10,
    city: 'Kunri, Umerkot',
    province: 'Sindh',
    farmer_name: 'Seth Gobind Ram',
    farmer_phone: '923456789012',
    farmer_rating: 5.0,
    is_verified: true,
    is_organic: true,
    image_url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    description: 'Authentic sun-dried Kunri spicy red chilli, vibrant crimson color, ideal for spice processors.',
    created_at: '1 day ago'
  },
  {
    id: '5',
    crop: 'Certified Seed Potato (Santé)',
    crop_urdu: 'آلو بیج سانتے',
    category: 'Vegetables',
    quantity: 1200,
    unit: 'Bags (50 kg)',
    price: 3600,
    min_order: 50,
    city: 'Depalpur, Okara',
    province: 'Punjab',
    farmer_name: 'Mian Babar Ali',
    farmer_phone: '923215678901',
    farmer_rating: 4.9,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'Cold-storage stored seed potatoes with vigorous germination rate. Certified by Federal Seed Certification (FSC&RD).',
    created_at: '2 days ago'
  },
  {
    id: '6',
    crop: 'Organic Kala Kulu Apple',
    crop_urdu: 'کالا کلو سیب کوئٹہ',
    category: 'Fruits',
    quantity: 850,
    unit: 'Boxes (18 kg)',
    price: 3800,
    min_order: 30,
    city: 'Ziarat',
    province: 'Balochistan',
    farmer_name: 'Mir Jan Muhammad',
    farmer_phone: '923123456789',
    farmer_rating: 4.9,
    is_verified: true,
    is_organic: true,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp mountain apples cultivated with spring water in Ziarat valley. No chemical waxing.',
    created_at: '3 days ago'
  }
]

export default function MarketplacePage() {
  const [listings, setListings] = useState<ProduceListing[]>(INITIAL_LISTINGS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [province, setProvince] = useState('All')
  const [organicOnly, setOrganicOnly] = useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [contactModalListing, setContactModalListing] = useState<ProduceListing | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New listing state
  const [formData, setFormData] = useState({
    crop: '', crop_urdu: '', category: 'Grains' as const, quantity: '', unit: 'Maund (40 kg)',
    price: '', min_order: '', city: '', province: 'Punjab', farmer_name: '', farmer_phone: '',
    is_organic: false, description: ''
  })

  // Fetch real listings if available
  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch('/api/listings')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((d: any) => ({
              id: d.id || String(Math.random()),
              crop: d.crop,
              crop_urdu: d.crop_urdu || d.crop,
              category: d.category || 'Grains',
              quantity: d.quantity || 100,
              unit: d.quantity_unit || 'Maund (40 kg)',
              price: d.price || 3000,
              min_order: d.min_order || 10,
              city: d.location || 'Lahore',
              province: d.province || 'Punjab',
              farmer_name: d.profiles?.full_name || 'Verified Farmer',
              farmer_phone: d.profiles?.phone || '923001234567',
              farmer_rating: 4.8,
              is_verified: true,
              is_organic: !!d.is_organic,
              image_url: d.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
              description: d.description || 'Fresh produce direct from farm.',
              created_at: 'Recently'
            }))
            setListings(prev => [...mapped, ...prev.filter(p => !mapped.some(m => m.id === p.id))])
          }
        }
      } catch {}
    }
    loadListings()
  }, [])

  // Filter listings
  const filtered = useMemo(() => {
    return listings.filter(item => {
      const matchSearch = item.crop.toLowerCase().includes(search.toLowerCase()) ||
                          item.crop_urdu.includes(search) ||
                          item.city.toLowerCase().includes(search.toLowerCase()) ||
                          item.farmer_name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || item.category === category
      const matchProvince = province === 'All' || item.province === province
      const matchOrganic = !organicOnly || item.is_organic
      return matchSearch && matchCategory && matchProvince && matchOrganic
    })
  }, [listings, search, category, province, organicOnly])

  async function handlePostListing(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.crop || !formData.price || !formData.quantity || !formData.city || !formData.farmer_phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const newListing: ProduceListing = {
        id: String(Date.now()),
        crop: formData.crop,
        crop_urdu: formData.crop_urdu || formData.crop,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        min_order: parseFloat(formData.min_order || '10'),
        city: formData.city,
        province: formData.province,
        farmer_name: formData.farmer_name || 'Grower (You)',
        farmer_phone: formData.farmer_phone,
        farmer_rating: 5.0,
        is_verified: true,
        is_organic: formData.is_organic,
        image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        description: formData.description || 'Farm-fresh harvest ready for immediate collection.',
        created_at: 'Just now'
      }

      // Send to API
      await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: formData.crop,
          category: formData.category,
          quantity: parseFloat(formData.quantity),
          quantity_unit: formData.unit,
          price: parseFloat(formData.price),
          min_order: parseFloat(formData.min_order || '10'),
          location: formData.city,
          province: formData.province,
          is_organic: formData.is_organic,
          description: formData.description
        })
      }).catch(() => {})

      setListings(prev => [newListing, ...prev])
      toast.success('Produce listed successfully on KisanConnect Marketplace!')
      setIsPostModalOpen(false)
      setFormData({
        crop: '', crop_urdu: '', category: 'Grains', quantity: '', unit: 'Maund (40 kg)',
        price: '', min_order: '', city: '', province: 'Punjab', farmer_name: '', farmer_phone: '',
        is_organic: false, description: ''
      })
    } catch {
      toast.error('Failed to post produce')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-light)' }}>
      <Navbar />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: 'calc(var(--nav-h) + 24px) 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> 0% Middleman Commission • Direct Kisan-to-Buyer
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Pakistani Farm Gate Produce</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
              Farmer Direct Marketplace <span style={{ color: 'var(--green)' }}>کسان براہِ راست منڈی</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, maxWidth: 650, fontSize: '0.95rem' }}>
              Connect directly with mills, exporters, and bulk buyers across Pakistan. Bypass exploitative middle-men commissions and earn 25–40% higher margins.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Plus size={18} /> Post Produce (فصل فروخت کریں)
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
          borderRadius: 16, padding: 20, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 320px' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by crop, variety, city, or grower (e.g. Basmati, Kinnow, Okara)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-light)', fontSize: '0.9rem', outline: 'none'
                }}
              />
            </div>

            {/* Province selector */}
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              style={{
                padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)', color: 'var(--text-light)', fontSize: '0.9rem', outline: 'none'
              }}
            >
              <option value="All" style={{ background: '#111' }}>All Provinces (تمام صوبے)</option>
              <option value="Punjab" style={{ background: '#111' }}>Punjab</option>
              <option value="Sindh" style={{ background: '#111' }}>Sindh</option>
              <option value="KPK" style={{ background: '#111' }}>KPK</option>
              <option value="Balochistan" style={{ background: '#111' }}>Balochistan</option>
            </select>

            {/* Organic Toggle */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              padding: '10px 16px', borderRadius: 10, background: organicOnly ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.04)',
              border: organicOnly ? '1px solid var(--green)' : '1px solid var(--glass-border)',
              color: organicOnly ? 'var(--green)' : 'var(--text-light)', fontSize: '0.85rem', fontWeight: 600
            }}>
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={e => setOrganicOnly(e.target.checked)}
                style={{ display: 'none' }}
              />
              🌱 Organic Only
            </label>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', 'Grains', 'Cash Crops', 'Fruits', 'Vegetables'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: category === cat ? 'rgba(0,200,83,0.18)' : 'rgba(255,255,255,0.04)',
                  color: category === cat ? 'var(--green)' : 'var(--text-muted)',
                  borderBottom: category === cat ? '2px solid var(--green)' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {cat === 'All' ? 'All Commodities (سب فصلیں)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>No produce listings found matching your search.</h3>
              <p>Try clearing filters or post your own produce using the button above.</p>
            </div>
          ) : (
            filtered.map(listing => (
              <div
                key={listing.id}
                className="card"
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image & Badges */}
                <div style={{ position: 'relative', height: 200, width: '100%' }}>
                  <img
                    src={listing.image_url}
                    alt={listing.crop}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap'
                  }}>
                    <span className="badge badge-green" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                      {listing.category}
                    </span>
                    {listing.is_organic && (
                      <span className="badge" style={{ background: 'rgba(0,200,83,0.85)', color: '#000', fontWeight: 700 }}>
                        🌱 Organic
                      </span>
                    )}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
                    padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, color: 'var(--green)'
                  }}>
                    {listing.quantity} {listing.unit} Available
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ marginBottom: 12 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>
                      {listing.crop}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--green)', fontFamily: 'sans-serif' }}>
                      {listing.crop_urdu}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5, flex: 1 }}>
                    {listing.description}
                  </p>

                  {/* Price & Location */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 16
                  }}>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--green)' }}>
                        ₨ {listing.price.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        per {listing.unit.split(' ')[0]} • Min: {listing.min_order}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600 }}>
                        <MapPin size={14} color="var(--text-muted)" /> {listing.city}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.province}</div>
                    </div>
                  </div>

                  {/* Farmer Info & Contact */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,200,83,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green)', fontSize: '0.9rem'
                      }}>
                        {listing.farmer_name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {listing.farmer_name}
                          {listing.is_verified && <ShieldCheck size={14} color="var(--green)" />}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ★ {listing.farmer_rating} • Verified Grower
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.created_at}</span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      onClick={() => {
                        const message = `Assalam-o-Alaikum ${listing.farmer_name}! I saw your listing for "${listing.crop}" on KisanConnect (${listing.quantity} ${listing.unit} at Rs ${listing.price}). I want to negotiate a purchase.`
                        window.open(`https://wa.me/${listing.farmer_phone}?text=${encodeURIComponent(message)}`, '_blank')
                      }}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.85rem', padding: '10px 0' }}
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </button>
                    <button
                      onClick={() => setContactModalListing(listing)}
                      className="btn btn-outline"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.85rem', padding: '10px 0' }}
                    >
                      <Phone size={16} /> Direct Call
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal: Post Produce */}
      {isPostModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Post Produce for Sale (فصل کی لسٹنگ)</h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePostListing} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Crop / Produce Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Super Basmati Rice"
                    value={formData.crop}
                    onChange={e => setFormData({ ...formData, crop: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Urdu Name (نام اردو میں)</label>
                  <input
                    type="text"
                    placeholder="e.g. باسمتی چاول"
                    value={formData.crop_urdu}
                    onChange={e => setFormData({ ...formData, crop_urdu: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  >
                    <option value="Grains" style={{ background: '#111' }}>Grains (اناج)</option>
                    <option value="Cash Crops" style={{ background: '#111' }}>Cash Crops (نقد آور فصلیں)</option>
                    <option value="Fruits" style={{ background: '#111' }}>Fruits (پھل)</option>
                    <option value="Vegetables" style={{ background: '#111' }}>Vegetables (سبزیاں)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Quantity Unit</label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  >
                    <option value="Maund (40 kg)" style={{ background: '#111' }}>Maund (40 kg من)</option>
                    <option value="Metric Tonnes" style={{ background: '#111' }}>Metric Tonnes (ٹن)</option>
                    <option value="Bags (50 kg)" style={{ background: '#111' }}>Bags (50 kg تھیلی)</option>
                    <option value="Crates / Boxes" style={{ background: '#111' }}>Crates / Boxes (پیٹی)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Total Quantity Available</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Price per Unit (PKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4200"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Farm City / Tehsil</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahiwal"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Province</label>
                  <select
                    value={formData.province}
                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  >
                    <option value="Punjab" style={{ background: '#111' }}>Punjab</option>
                    <option value="Sindh" style={{ background: '#111' }}>Sindh</option>
                    <option value="KPK" style={{ background: '#111' }}>KPK</option>
                    <option value="Balochistan" style={{ background: '#111' }}>Balochistan</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Farmer / Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mian Rashid"
                    value={formData.farmer_name}
                    onChange={e => setFormData({ ...formData, farmer_name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>WhatsApp / Phone No.</label>
                  <input
                    type="text"
                    required
                    placeholder="923001234567"
                    value={formData.farmer_phone}
                    onChange={e => setFormData({ ...formData, farmer_phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Quality Description & Terms</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Harvested this week, sun dried, stored in aerated warehouse. Cash on delivery or bank transfer."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_organic}
                  onChange={e => setFormData({ ...formData, is_organic: e.target.checked })}
                />
                This crop is cultivated without synthetic pesticides (Certified Organic)
              </label>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Direct Call / Contact Seller */}
      {contactModalListing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: 28, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Direct Grower Contact</h3>
              <button
                onClick={() => setContactModalListing(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,200,83,0.15)', color: 'var(--green)', fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                {contactModalListing.farmer_name[0]}
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 700 }}>{contactModalListing.farmer_name}</h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <MapPin size={14} /> {contactModalListing.city}, {contactModalListing.province}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Listing:</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)', marginBottom: 2 }}>{contactModalListing.crop}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--green)' }}>₨ {contactModalListing.price.toLocaleString()} / {contactModalListing.unit}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href={`tel:${contactModalListing.farmer_phone}`}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
              >
                <Phone size={18} /> Call +{contactModalListing.farmer_phone}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`+${contactModalListing.farmer_phone}`)
                  toast.success('Phone number copied to clipboard!')
                }}
                className="btn btn-outline"
              >
                Copy Phone Number
              </button>
            </div>
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  )
}

'use client'
import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/Navbar'
import { LandingFooter } from '@/components/landing/LandingTestimonials'
import {
  Store, Search, Filter, Plus, MapPin, Phone, MessageCircle,
  CheckCircle2, ShieldCheck, Tag, ArrowUpRight, Clock, Sparkles,
  ShoppingBag, Truck, Building2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface MarketplaceItem {
  id: string
  type: 'sell' | 'buy'
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

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceItem[]>([])
  const [listingType, setListingType] = useState<'all' | 'sell' | 'buy'>('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [province, setProvince] = useState('All')
  const [organicOnly, setOrganicOnly] = useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [postMode, setPostMode] = useState<'sell' | 'buy'>('sell')
  const [contactModalListing, setContactModalListing] = useState<MarketplaceItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    crop: '', crop_urdu: '', category: 'Grains' as const, quantity: '', unit: 'Maund (40 kg)',
    price: '', min_order: '', city: '', province: 'Punjab', farmer_name: '', farmer_phone: '',
    is_organic: false, description: ''
  })

  // Load listings from API
  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch(`/api/listings?type=${listingType === 'all' ? '' : listingType}`)
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json.data)) {
            const mapped = json.data.map((d: any) => ({
              id: d.id,
              type: d.type || 'sell',
              crop: d.crop,
              crop_urdu: d.crop_urdu || d.crop,
              category: d.category || 'Grains',
              quantity: d.quantity || 100,
              unit: d.quantity_unit || d.unit || 'Maund (40 kg)',
              price: d.price || 3000,
              min_order: d.min_order || 10,
              city: d.location || d.city || 'Lahore',
              province: d.province || 'Punjab',
              farmer_name: d.farmer_name || d.profiles?.full_name || (d.type === 'buy' ? 'Verified Buyer' : 'Verified Farmer'),
              farmer_phone: d.farmer_phone || '923001234567',
              farmer_rating: 4.9,
              is_verified: true,
              is_organic: !!d.is_organic,
              image_url: d.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
              description: d.description || '',
              created_at: d.created_at || 'Recently'
            }))
            setListings(mapped)
          }
        }
      } catch (e) {
        console.error('Listings fetch error:', e)
      }
    }
    loadListings()
  }, [listingType])

  // Filter listings
  const filtered = useMemo(() => {
    return listings.filter(item => {
      const matchType = listingType === 'all' || item.type === listingType
      const matchSearch = item.crop.toLowerCase().includes(search.toLowerCase()) ||
                          item.crop_urdu.includes(search) ||
                          item.city.toLowerCase().includes(search.toLowerCase()) ||
                          item.farmer_name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || item.category === category
      const matchProvince = province === 'All' || item.province === province
      const matchOrganic = !organicOnly || item.is_organic
      return matchType && matchSearch && matchCategory && matchProvince && matchOrganic
    })
  }, [listings, listingType, search, category, province, organicOnly])

  async function handlePostListing(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.crop || !formData.price || !formData.quantity || !formData.city || !formData.farmer_phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        type: postMode,
        crop: formData.crop,
        crop_urdu: formData.crop_urdu || formData.crop,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        quantity_unit: formData.unit,
        price: parseFloat(formData.price),
        min_order: parseFloat(formData.min_order || '10'),
        location: formData.city,
        province: formData.province,
        farmer_name: formData.farmer_name || (postMode === 'buy' ? 'Verified Buyer' : 'Verified Grower'),
        farmer_phone: formData.farmer_phone,
        is_organic: formData.is_organic,
        description: formData.description
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const saved = await res.json()

      const newItem: MarketplaceItem = {
        id: saved.id || String(Date.now()),
        type: postMode,
        crop: formData.crop,
        crop_urdu: formData.crop_urdu || formData.crop,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        min_order: parseFloat(formData.min_order || '10'),
        city: formData.city,
        province: formData.province,
        farmer_name: formData.farmer_name || (postMode === 'buy' ? 'Procurement Buyer' : 'Grower'),
        farmer_phone: formData.farmer_phone,
        farmer_rating: 5.0,
        is_verified: true,
        is_organic: formData.is_organic,
        image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        description: formData.description || 'Direct listing on KisanConnect Marketplace.',
        created_at: 'Just now'
      }

      setListings(prev => [newItem, ...prev])
      toast.success(postMode === 'buy' ? 'Buying Requirement Posted! Farmers can now contact you.' : 'Crop Listed for Sale Successfully!')
      setIsPostModalOpen(false)
      setFormData({
        crop: '', crop_urdu: '', category: 'Grains', quantity: '', unit: 'Maund (40 kg)',
        price: '', min_order: '', city: '', province: 'Punjab', farmer_name: '', farmer_phone: '',
        is_organic: false, description: ''
      })
    } catch {
      toast.error('Failed to post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-light)' }}>
      <Navbar />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: 'calc(var(--nav-h) + 24px) 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> Dual-Sided Agri Trading Platform
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>0% Commission • For Farmers & For Buyers</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
              Kisan & Buyer Direct Marketplace <span style={{ color: 'var(--green)' }}>کسان اور خریدار منڈی</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, maxWidth: 680, fontSize: '0.95rem' }}>
              <strong>Kisans:</strong> Sell crops directly to mills & exporters without arhti deductions. <br />
              <strong>Buyers:</strong> Post bulk buying requirements and procure directly from verified farm gates across Pakistan.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                setPostMode('sell')
                setIsPostModalOpen(true)
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <Plus size={18} /> Kisan: Sell Crop (فصل بیچیں)
            </button>
            <button
              onClick={() => {
                setPostMode('buy')
                setIsPostModalOpen(true)
              }}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', fontSize: '0.9rem', borderColor: '#0091EA', color: '#0091EA' }}
            >
              <ShoppingBag size={18} /> Buyer: Post Demand (خریداری مانگ)
            </button>
          </div>
        </div>

        {/* Dual Mode Switcher (For Kisans vs For Buyers) */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 24, padding: 6,
          background: 'rgba(255,255,255,0.04)', borderRadius: 14, width: 'fit-content', border: '1px solid var(--glass-border)'
        }}>
          <button
            onClick={() => setListingType('all')}
            style={{
              padding: '8px 20px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              background: listingType === 'all' ? 'var(--green)' : 'transparent',
              color: listingType === 'all' ? '#000' : 'var(--text-light)',
              transition: 'all 0.2s'
            }}
          >
            All Listings ({listings.length})
          </button>
          <button
            onClick={() => setListingType('sell')}
            style={{
              padding: '8px 20px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              background: listingType === 'sell' ? 'var(--green)' : 'transparent',
              color: listingType === 'sell' ? '#000' : 'var(--text-light)',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
            }}
          >
            🌾 Farmers Selling (کسان کی فصلیں)
          </button>
          <button
            onClick={() => setListingType('buy')}
            style={{
              padding: '8px 20px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              background: listingType === 'buy' ? '#0091EA' : 'transparent',
              color: listingType === 'buy' ? '#fff' : 'var(--text-light)',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
            }}
          >
            🛒 Buyer Demands / Mills (خریداروں کی ضرورت)
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
                placeholder="Search crops, buyers, mills, or cities (e.g. Basmati, Rice Mills, Multan)..."
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
              <h3>No listings found matching your search.</h3>
              <p>Try switching between "Farmers Selling" and "Buyer Demands" or clear filters.</p>
            </div>
          ) : (
            filtered.map(listing => {
              const isBuyerDemand = listing.type === 'buy'

              return (
                <div
                  key={listing.id}
                  className="card"
                  style={{
                    padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    border: isBuyerDemand ? '1px solid rgba(0,145,234,0.35)' : '1px solid var(--glass-border)'
                  }}
                >
                  {/* Image & Badges */}
                  <div style={{ position: 'relative', height: 190, width: '100%' }}>
                    <img
                      src={listing.image_url}
                      alt={listing.crop}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span
                        className="badge"
                        style={{
                          background: isBuyerDemand ? '#0091EA' : 'var(--green)',
                          color: isBuyerDemand ? '#fff' : '#000',
                          fontWeight: 800, fontSize: '0.75rem'
                        }}
                      >
                        {isBuyerDemand ? '🛒 BUYER DEMAND' : '🌾 PRODUCER LISTING'}
                      </span>
                      {listing.is_organic && (
                        <span className="badge" style={{ background: 'rgba(0,200,83,0.85)', color: '#000', fontWeight: 700, fontSize: '0.75rem' }}>
                          🌱 Organic
                        </span>
                      )}
                    </div>

                    <div style={{
                      position: 'absolute', bottom: 12, right: 12,
                      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
                      padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700,
                      color: isBuyerDemand ? '#00E5FF' : 'var(--green)'
                    }}>
                      {isBuyerDemand ? 'Requirement:' : 'Available:'} {listing.quantity} {listing.unit.split(' ')[0]}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ marginBottom: 10 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>
                        {listing.crop}
                      </h3>
                      <div style={{ fontSize: '0.9rem', color: isBuyerDemand ? '#0091EA' : 'var(--green)', fontFamily: 'sans-serif' }}>
                        {listing.crop_urdu}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5, flex: 1 }}>
                      {listing.description}
                    </p>

                    {/* Price & Location */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 14px', background: isBuyerDemand ? 'rgba(0,145,234,0.06)' : 'rgba(255,255,255,0.03)',
                      borderRadius: 10, marginBottom: 16, border: isBuyerDemand ? '1px solid rgba(0,145,234,0.15)' : 'none'
                    }}>
                      <div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isBuyerDemand ? '#00E5FF' : 'var(--green)' }}>
                          ₨ {listing.price.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {isBuyerDemand ? 'Offered Price' : 'Asking Price'} per {listing.unit.split(' ')[0]}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600 }}>
                          <MapPin size={14} color="var(--text-muted)" /> {listing.city}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.province}</div>
                      </div>
                    </div>

                    {/* Party info (Farmer vs Buyer) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: isBuyerDemand ? 'rgba(0,145,234,0.15)' : 'rgba(0,200,83,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                          color: isBuyerDemand ? '#0091EA' : 'var(--green)', fontSize: '0.9rem'
                        }}>
                          {isBuyerDemand ? <Building2 size={18} /> : listing.farmer_name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {listing.farmer_name}
                            <ShieldCheck size={14} color={isBuyerDemand ? '#0091EA' : 'var(--green)'} />
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isBuyerDemand ? 'Verified Industrial Buyer' : 'Verified Grower (کاشتکار)'}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.created_at}</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button
                        onClick={() => {
                          const message = isBuyerDemand
                            ? `Assalam-o-Alaikum! I have produce ready for your buying demand: "${listing.crop}" (${listing.quantity} ${listing.unit} at Rs ${listing.price}). I can supply directly to ${listing.city}.`
                            : `Assalam-o-Alaikum ${listing.farmer_name}! I saw your listing for "${listing.crop}" on KisanConnect (${listing.quantity} ${listing.unit} at Rs ${listing.price}). I want to negotiate purchase.`
                          window.open(`https://wa.me/${listing.farmer_phone}?text=${encodeURIComponent(message)}`, '_blank')
                        }}
                        className={isBuyerDemand ? 'btn' : 'btn btn-primary'}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.85rem', padding: '10px 0',
                          background: isBuyerDemand ? '#0091EA' : undefined, color: isBuyerDemand ? '#fff' : undefined
                        }}
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
              )
            })
          )}
        </div>
      </main>

      {/* Modal: Post Produce or Buyer Demand */}
      {isPostModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  {postMode === 'buy' ? 'Post Buying Requirement (خریداری کی ضرورت)' : 'Post Produce for Sale (فصل برائے فروخت)'}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {postMode === 'buy' ? 'For mills, exporters, and wholesale buyers' : 'For farmers and crop growers'}
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Toggle Mode inside modal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => setPostMode('sell')}
                style={{
                  padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: postMode === 'sell' ? 'var(--green)' : 'rgba(255,255,255,0.06)',
                  color: postMode === 'sell' ? '#000' : 'var(--text-light)'
                }}
              >
                🌾 I am Selling (کسان)
              </button>
              <button
                type="button"
                onClick={() => setPostMode('buy')}
                style={{
                  padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: postMode === 'buy' ? '#0091EA' : 'rgba(255,255,255,0.06)',
                  color: postMode === 'buy' ? '#fff' : 'var(--text-light)'
                }}
              >
                🛒 I am Buying (خریدار / مل)
              </button>
            </div>

            <form onSubmit={handlePostListing} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Commodity / Crop Name</label>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Measurement Unit</label>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    {postMode === 'buy' ? 'Desired Quantity' : 'Total Quantity Available'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1000"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    {postMode === 'buy' ? 'Offered Price (PKR)' : 'Asking Price (PKR)'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4400"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    {postMode === 'buy' ? 'Delivery City / Factory' : 'Farm City / Tehsil'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muridke / Multan"
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                    {postMode === 'buy' ? 'Mill / Buyer Business Name' : 'Farmer / Contact Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={postMode === 'buy' ? 'e.g. Al-Madina Rice Mills' : 'e.g. Mian Tariq'}
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Terms & Details</label>
                <textarea
                  rows={3}
                  placeholder={postMode === 'buy' ? 'Payment on weighbridge receipt, prompt bank transfer, moisture cut rules...' : 'Sun-dried harvest, stored in aerated warehouse, immediate collection...'}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                />
              </div>

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
                  style={{ flex: 1, background: postMode === 'buy' ? '#0091EA' : undefined }}
                >
                  {isSubmitting ? 'Submitting...' : postMode === 'buy' ? 'Publish Buying Demand' : 'Publish Crop Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Direct Call / Contact Party */}
      {contactModalListing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: 28, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                {contactModalListing.type === 'buy' ? 'Buyer Procurement Contact' : 'Direct Grower Contact'}
              </h3>
              <button
                onClick={() => setContactModalListing(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: contactModalListing.type === 'buy' ? 'rgba(0,145,234,0.15)' : 'rgba(0,200,83,0.15)',
                color: contactModalListing.type === 'buy' ? '#0091EA' : 'var(--green)',
                fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                {contactModalListing.farmer_name[0]}
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 700 }}>{contactModalListing.farmer_name}</h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <MapPin size={14} /> {contactModalListing.city}, {contactModalListing.province}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                {contactModalListing.type === 'buy' ? 'Purchasing Requirement:' : 'Crop for Sale:'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)', marginBottom: 2 }}>{contactModalListing.crop}</div>
              <div style={{ fontSize: '0.85rem', color: contactModalListing.type === 'buy' ? '#00E5FF' : 'var(--green)' }}>
                ₨ {contactModalListing.price.toLocaleString()} / {contactModalListing.unit} • {contactModalListing.quantity} Units
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href={`tel:${contactModalListing.farmer_phone}`}
                className="btn btn-primary"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
                  background: contactModalListing.type === 'buy' ? '#0091EA' : undefined
                }}
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

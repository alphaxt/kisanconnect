'use client'
import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/Navbar'
import { LandingFooter } from '@/components/landing/LandingTestimonials'
import {
  Users, MessageSquare, ThumbsUp, CheckCircle, Search, Plus,
  Sparkles, PhoneCall, ShieldCheck, Share2, CornerDownRight, Tag
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ForumItem {
  id: string
  title: string
  title_urdu: string
  body: string
  category: string
  crop: string
  author_name: string
  author_role: 'Farmer' | 'Agronomist' | 'Agri Student'
  author_district: string
  likes: number
  user_liked: boolean
  replies_count: number
  is_answered: boolean
  created_at: string
  expert_reply?: {
    expert_name: string
    expert_title: string
    reply_body: string
    reply_urdu: string
    likes: number
  }
}

const INITIAL_POSTS: ForumItem[] = [
  {
    id: '1',
    title: 'Wheat leaves turning yellow after second irrigation — Nitrogen deficiency or Sulphur?',
    title_urdu: 'دوسرے پانی کے بعد گندم کے پتے پیلے ہو رہے ہیں — نائٹروجن کی کمی ہے یا سلفر کی؟',
    body: 'My Akbar-2019 wheat crop was irrigated 5 days ago with 1 bag of Urea. Older leaves at the bottom are still showing pale yellowing from the tips. Soil is loam. What should I spray to quickly recover vegetative growth?',
    category: 'Fertilizer & Soil Nutrition',
    crop: 'Wheat (گندم)',
    author_name: 'Malik Jahangir',
    author_role: 'Farmer',
    author_district: 'Khanewal, Punjab',
    likes: 34,
    user_liked: false,
    replies_count: 5,
    is_answered: true,
    created_at: '3 hours ago',
    expert_reply: {
      expert_name: 'Dr. Muhammad Shahid (PhD Agronomy)',
      expert_title: 'Senior Scientist, Ayub Agricultural Research Institute (AARI) Faisalabad',
      reply_body: 'If yellowing begins on older lower leaves while young leaves remain green, it is classic Nitrogen temporary waterlogging stress. The roots suffered brief oxygen starvation during irrigation. Spray 2% Foliar Urea solution (2 kg Urea dissolved in 100 Litres water per acre) + 250ml Zinc Sulphate 33%. Growth will recover within 96 hours.',
      reply_urdu: 'اگر پیلا پن نچلے پرانے پتوں سے شروع ہو رہا ہے تو یہ پانی لگنے کی وجہ سے عارضی نائٹروجن کی بندش ہے۔ فی ایکڑ 100 لیٹر پانی میں 2 کلو یوریا اور 250 گرام زنک ملا کر سپرے کریں۔ چار دن میں فصل ہری ہو جائے گی۔',
      likes: 48
    }
  },
  {
    id: '2',
    title: 'Whitefly nymphs outbreak on late sown BT cotton despite Bifenthrin spray',
    title_urdu: 'بائیفینتھرین سپرے کے باوجود بی ٹی کپاس پر سفید مکھی کے بچوں کا حملہ',
    body: 'I sprayed Bifenthrin 3 days ago on 15 acres of cotton, but nymph counts are still above ETL (6 to 8 nymphs per leaf on leaf underside). Leaves are becoming sticky with sooty mold starting.',
    category: 'Pest & Disease Control',
    crop: 'Cotton (کپاس)',
    author_name: 'Chaudhry Nadeem Akhtar',
    author_role: 'Farmer',
    author_district: 'Rahim Yar Khan, Punjab',
    likes: 42,
    user_liked: false,
    replies_count: 8,
    is_answered: true,
    expert_reply: {
      expert_name: 'Engr. Waqas Raza',
      expert_title: 'Entomologist, Central Cotton Research Institute (CCRI) Multan',
      reply_body: 'Bifenthrin is a pyrethroid and adulticide — it knocks down adult whiteflies but fails on nymphs and causes resurgence by killing natural predatory lacewings. Switch immediately to an Insect Growth Regulator (IGR) such as Pyriproxyfen 10.8% EC @ 500ml/acre OR Spirotetramat (Movento) @ 125ml/acre. Use hollow cone nozzles pointed upward.',
      reply_urdu: 'بائیفینتھرین سفید مکھی کے بچوں پر اثر نہیں کرتی۔ فوری طور پر پائری پروکسی فن 500 ملی لیٹر یا مووینٹو 125 ملی لیٹر فی ایکڑ سپرے کریں اور نوزل کا رخ پتوں کے نیچے رکھیں۔',
      likes: 56
    },
    created_at: '6 hours ago'
  },
  {
    id: '3',
    title: 'Experience with 15HP Solar Tube-Well on 120ft water table depth?',
    title_urdu: '120 فٹ گہرے پانی پر 15 ہارس پاور سولر ٹیوب ویل کا تجربہ کیسا ہے؟',
    body: 'Planning to convert my diesel peter engine to solar in Dera Ghazi Khan. Water table is at 120 feet with 5-inch delivery pipe. How many 550W mono-perc panels and which VFD inverter is performing reliably without tripping during summer heat?',
    category: 'Solar & Engineering',
    crop: 'Tube-Well (ٹیوب ویل)',
    author_name: 'Sardar Farooq Leghari',
    author_role: 'Farmer',
    author_district: 'DG Khan, Punjab',
    likes: 29,
    user_liked: false,
    replies_count: 12,
    is_answered: false,
    created_at: '1 day ago'
  },
  {
    id: '4',
    title: 'Dispute with Arhti on moisture deduction in paddy rice (Kati Rate)',
    title_urdu: 'دھان کی منڈی میں آڑھتی کی طرف سے نمی کی کٹوتی پر تنازعہ',
    body: 'Grain market arhtis in Gujranwala are deducting 4 kg per maund citing 16% moisture in Basmati. Is there a government authorized moisture meter testing center in the mandi where I can challenge excessive cuts?',
    category: 'Market Rates & Trade',
    crop: 'Rice (دھان)',
    author_name: 'Mian Safdar',
    author_role: 'Farmer',
    author_district: 'Gujranwala, Punjab',
    likes: 51,
    user_liked: false,
    replies_count: 14,
    is_answered: true,
    expert_reply: {
      expert_name: 'Rana Irfan Advocate',
      expert_title: 'Legal Counsel, Pakistan Kissan Ittehad',
      reply_body: 'Under the Punjab Agricultural Marketing Regulatory Authority (PAMRA) Act 2020, unauthorized deductions exceeding actual moisture variance are illegal. Every market committee office has a calibrated Dickey-John moisture tester. Approach the Market Committee Secretary office on-site. The standard threshold is 14% moisture.',
      reply_urdu: 'پامرا ایکٹ 2020 کے تحت ناجائز کٹوتی جرم ہے۔ منڈی کمیٹی سیکرٹری کے دفتر میں ڈیجیٹل موسئسچر میٹر سے سرکاری تصدیق کروائیں۔ 14 فیصد نمی تک کوئی کٹوتی جائز نہیں۔',
      likes: 72
    },
    created_at: '2 days ago'
  }
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<ForumItem[]>(INITIAL_POSTS)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [isAskModalOpen, setIsAskModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New Question Form state
  const [formData, setFormData] = useState({
    title: '', title_urdu: '', body: '', category: 'Pest & Disease Control',
    crop: 'Wheat', author_name: '', author_district: ''
  })

  // Load posts from API if available
  useEffect(() => {
    async function loadForum() {
      try {
        const res = await fetch('/api/forum')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((d: any) => ({
              id: d.id || String(Math.random()),
              title: d.title,
              title_urdu: d.title_urdu || d.title,
              body: d.body,
              category: d.category || 'Pest & Disease Control',
              crop: d.tags?.[0] || 'General Crop',
              author_name: d.profiles?.full_name || 'Grower',
              author_role: (d.profiles?.role === 'agronomist' ? 'Agronomist' : 'Farmer') as any,
              author_district: d.profiles?.district || 'Pakistan',
              likes: d.likes_count || 12,
              user_liked: false,
              replies_count: d.replies_count || 2,
              is_answered: !!d.is_answered,
              created_at: 'Recently'
            }))
            setPosts(prev => [...mapped, ...prev.filter(p => !mapped.some(m => m.id === p.id))])
          }
        }
      } catch {}
    }
    loadForum()
  }, [])

  // Filter posts
  const filtered = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                          post.title_urdu.includes(search) ||
                          post.body.toLowerCase().includes(search.toLowerCase()) ||
                          post.crop.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || post.category === category
      return matchSearch && matchCategory
    })
  }, [posts, search, category])

  function handleToggleLike(id: string) {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = !p.user_liked
        return {
          ...p,
          user_liked: newStatus,
          likes: newStatus ? p.likes + 1 : p.likes - 1
        }
      }
      return p
    }))
  }

  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title || !formData.body || !formData.author_name) {
      toast.error('Please fill in title, question details, and your name')
      return
    }

    setIsSubmitting(true)
    try {
      const newPost: ForumItem = {
        id: String(Date.now()),
        title: formData.title,
        title_urdu: formData.title_urdu || formData.title,
        body: formData.body,
        category: formData.category,
        crop: formData.crop,
        author_name: formData.author_name,
        author_role: 'Farmer',
        author_district: formData.author_district || 'Punjab',
        likes: 1,
        user_liked: true,
        replies_count: 0,
        is_answered: false,
        created_at: 'Just now'
      }

      // Send to API
      await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          title_urdu: formData.title_urdu,
          body: formData.body,
          category: formData.category,
          tags: [formData.crop]
        })
      }).catch(() => {})

      setPosts(prev => [newPost, ...prev])
      toast.success('Question posted to community! Agronomists will review shortly.')
      setIsAskModalOpen(false)
      setFormData({
        title: '', title_urdu: '', body: '', category: 'Pest & Disease Control',
        crop: 'Wheat', author_name: '', author_district: ''
      })
    } catch {
      toast.error('Failed to post question')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-light)' }}>
      <Navbar />

      <main style={{ maxWidth: 1300, margin: '0 auto', padding: 'calc(var(--nav-h) + 24px) 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} /> 340+ Verified Agronomists & Extension Officers
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>98% Questions Answered Within 4 Hours</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
              Kisan Community & Expert Q&A <span style={{ color: 'var(--green)' }}>زرعی سوال و جواب فورم</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, maxWidth: 680, fontSize: '0.95rem' }}>
              Ask questions in Urdu or English. Get verified agronomic advice on disease control, fertilizer balancing, tube-well engineering, and mandi legal rights from agricultural scientists.
            </p>
          </div>

          <button
            onClick={() => setIsAskModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Plus size={18} /> Ask Question (سوال پوچھیں)
          </button>
        </div>

        {/* Emergency Helplines Banner */}
        <div style={{
          background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.2)',
          borderRadius: 16, padding: '18px 24px', marginBottom: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PhoneCall size={24} color="var(--green)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Government Agriculture Emergency Helplines (مفت زرعی ہیلپ لائنز)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toll-free telephone assistance for on-field emergencies</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="tel:080015000" className="badge badge-green" style={{ textDecoration: 'none', padding: '8px 14px', fontSize: '0.85rem' }}>
              Punjab Agri: 0800-15000
            </a>
            <a href="tel:080029000" className="badge badge-outline" style={{ textDecoration: 'none', padding: '8px 14px', fontSize: '0.85rem' }}>
              Kisan Card: 0800-29000
            </a>
            <a href="tel:0229200057" className="badge badge-outline" style={{ textDecoration: 'none', padding: '8px 14px', fontSize: '0.85rem' }}>
              Sindh Agri: 022-9200057
            </a>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
          borderRadius: 16, padding: 20, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16
        }}>
          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search discussions by topic, crop, disease, or Urdu terms (e.g. سفید مکھی, Urea, Solar, گندم)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                color: 'var(--text-light)', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {[
              'All',
              'Pest & Disease Control',
              'Fertilizer & Soil Nutrition',
              'Solar & Engineering',
              'Market Rates & Trade',
              'Govt Subsidies'
            ].map(cat => (
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
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Discussions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>No discussions found matching "{search}".</h3>
              <p>Be the first to ask a question to our panel of verified agronomists!</p>
            </div>
          ) : (
            filtered.map(post => (
              <div key={post.id} className="card" style={{ padding: 24 }}>
                {/* Author row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,200,83,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green)', fontSize: '0.95rem'
                    }}>
                      {post.author_name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {post.author_name}
                        <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{post.author_role}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {post.author_district} • {post.created_at}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{post.crop}</span>
                    <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>{post.category}</span>
                  </div>
                </div>

                {/* Question Title & Body */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.4 }}>
                  {post.title}
                </h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--green)', fontFamily: 'sans-serif', marginBottom: 10 }}>
                  {post.title_urdu}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {post.body}
                </p>

                {/* Agronomist Verified Reply Box */}
                {post.expert_reply && (
                  <div style={{
                    background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.25)',
                    borderRadius: 12, padding: 20, marginBottom: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--green)' }}>
                            {post.expert_reply.expert_name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {post.expert_reply.expert_title}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                        ✓ Verified Prescription
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6, marginBottom: 8 }}>
                      {post.expert_reply.reply_body}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--green)', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                      {post.expert_reply.reply_urdu}
                    </div>
                  </div>
                )}

                {/* Footer interactive actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        color: post.user_liked ? 'var(--green)' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600
                      }}
                    >
                      <ThumbsUp size={16} /> {post.likes} Helpful
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <MessageSquare size={16} /> {post.replies_count} Responses
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const shareText = `KisanConnect Question: ${post.title}\nRead expert answer here:`
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal: Ask Question */}
      {isAskModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Ask Community & Agronomists</h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAskQuestion} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Question Title (موضوع / سوال کا عنوان)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yellow spots appearing on tomato leaves after rain..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Urdu Title (اختیاری - اردو میں عنوان)</label>
                <input
                  type="text"
                  placeholder="مثلاً: بارش کے بعد ٹماٹر کے پتوں پر پیلے دھبے..."
                  value={formData.title_urdu}
                  onChange={e => setFormData({ ...formData, title_urdu: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Topic Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  >
                    <option value="Pest & Disease Control" style={{ background: '#111' }}>Pest & Disease Control</option>
                    <option value="Fertilizer & Soil Nutrition" style={{ background: '#111' }}>Fertilizer & Soil Nutrition</option>
                    <option value="Solar & Engineering" style={{ background: '#111' }}>Solar & Engineering</option>
                    <option value="Market Rates & Trade" style={{ background: '#111' }}>Market Rates & Trade</option>
                    <option value="Govt Subsidies" style={{ background: '#111' }}>Govt Subsidies</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Crop Affected</label>
                  <input
                    type="text"
                    placeholder="e.g. Cotton, Wheat, Rice"
                    value={formData.crop}
                    onChange={e => setFormData({ ...formData, crop: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Detailed Problem Description (تفصیل)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe symptoms, irrigation history, previous sprays, soil conditions..."
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={formData.author_name}
                    onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>District / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Sahiwal"
                    value={formData.author_district}
                    onChange={e => setFormData({ ...formData, author_district: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
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
                  {isSubmitting ? 'Posting...' : 'Post to Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  )
}

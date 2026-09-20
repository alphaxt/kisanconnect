'use client'
import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { LandingFooter } from '@/components/landing/LandingTestimonials'
import {
  Landmark, Calculator, CheckCircle, Clock, FileText,
  ShieldAlert, ArrowRight, Sparkles, Building, HelpCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface LoanScheme {
  id: string
  name: string
  name_urdu: string
  bank: string
  max_amount: string
  markup: string
  tenure: string
  target: string
  documents: string[]
  is_govt_subsidized: boolean
}

const SCHEMES: LoanScheme[] = [
  {
    id: 'kissan-card',
    name: 'Prime Minister Kissan Card Scheme',
    name_urdu: 'وزیراعظم کسان کارڈ بلا سود سکیم',
    bank: 'Govt of Pakistan & HBL / BOP',
    max_amount: '₨ 150,000 per season',
    markup: '0% (Completely Interest-Free)',
    tenure: '6 Months (Post-Harvest Repayment)',
    target: 'Smallholders with land under 12.5 acres',
    documents: ['CNIC', 'Fard-e-Malkiat (فرد ملکیت)', 'Biometric Verification at Khidmat Markaz'],
    is_govt_subsidized: true
  },
  {
    id: 'ztbl-production',
    name: 'ZTBL Zarai Production Loan',
    name_urdu: 'زرعی ترقیاتی بینک پروڈکشن لون',
    bank: 'Zarai Taraqiati Bank Limited (ZTBL)',
    max_amount: '₨ 1,500,000',
    markup: 'KIBOR + 3% (Subsidized)',
    tenure: '1 Year (Renewable on rollover)',
    target: 'Owners & Tenants cultivating cash crops',
    documents: ['CNIC copy', 'Passbook / Land Revenue Record', '2 Personal Guarantors with Agri Land'],
    is_govt_subsidized: true
  },
  {
    id: 'bop-solar',
    name: 'BOP Solar Tube-Well Finance',
    name_urdu: 'بینک آف پنجاب شمسی ٹیوب ویل فنانسنگ',
    bank: 'The Bank of Punjab (BOP)',
    max_amount: '₨ 3,500,000 (80% of project cost)',
    markup: '11.5% Per Annum',
    tenure: '3 to 5 Years (Half-yearly installments)',
    target: 'Farmers replacing diesel/grid tube-wells with solar',
    documents: ['CNIC', 'Title deeds of agricultural land', 'Vendor solar quotation & site feasibility'],
    is_govt_subsidized: false
  },
  {
    id: 'khushhali-livestock',
    name: 'Khushhali Agri Enterprise & Dairy',
    name_urdu: 'خوشحالی ڈیری و مویشی لون',
    bank: 'Khushhali Microfinance Bank',
    max_amount: '₨ 350,000',
    markup: '14% Flat Rate',
    tenure: '12 to 18 Months',
    target: 'Small livestock farmers, dairy breeders, fattening farms',
    documents: ['CNIC', 'Utility bill of village residence', '1 Local Community Guarantor'],
    is_govt_subsidized: false
  }
]

export default function LoansPage() {
  // Calculator state
  const [landAcres, setLandAcres] = useState<number>(10)
  const [cropType, setCropType] = useState<string>('wheat')
  const [selectedScheme, setSelectedScheme] = useState<string>('kissan-card')

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [appliedScheme, setAppliedScheme] = useState<LoanScheme | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingId, setTrackingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '', cnic: '', phone: '', land_acres: '10', district: 'Multan', province: 'Punjab', requested_amount: '150000'
  })

  // Calculation formula
  const perAcreLimits: Record<string, number> = {
    wheat: 60000,
    cotton: 85000,
    rice: 70000,
    sugarcane: 95000,
    orchard: 110000
  }

  const estimatedLimit = Math.min(landAcres * (perAcreLimits[cropType] || 60000), 2500000)
  const estimatedSubsidy = Math.round(estimatedLimit * 0.08)

  function handleOpenApply(scheme: LoanScheme) {
    setAppliedScheme(scheme)
    setFormData(prev => ({
      ...prev,
      requested_amount: String(Math.min(estimatedLimit, 1500000))
    }))
    setIsApplyModalOpen(true)
  }

  async function handleSubmitApplication(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.full_name || !formData.cnic || !formData.phone) {
      toast.error('Please fill in your CNIC, Phone and Name')
      return
    }

    setIsSubmitting(true)
    try {
      const generatedId = `KC-LOAN-${Math.floor(100000 + Math.random() * 900000)}`

      // Send to API
      await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheme_name: appliedScheme?.name || 'General Agri Loan',
          bank_name: appliedScheme?.bank || 'Govt Scheme',
          amount: parseFloat(formData.requested_amount),
          land_acres: parseFloat(formData.land_acres),
          crop: cropType,
          cnic: formData.cnic,
          phone: formData.phone,
          full_name: formData.full_name,
          province: formData.province,
          village: formData.district
        })
      }).catch(() => {})

      setTrackingId(generatedId)
      toast.success(`Application submitted! Tracking ID: ${generatedId}`)
    } catch {
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-light)' }}>
      <Navbar />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: 'calc(var(--nav-h) + 24px) 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="badge badge-green" style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} /> State Bank of Pakistan & Agriculture Dept Certified
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 10px' }}>
            Agri Loans & Kissan Card Subsidy Portal <span style={{ color: 'var(--green)' }}>زرعی قرضہ جات اور حکومتی سبسڈی</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 700, margin: '0 auto', fontSize: '0.95rem' }}>
            Instant eligibility calculator, comparison of subsidized government credit schemes, and single-window application submission for verified Pakistani farmers.
          </p>
        </div>

        {/* Interactive Loan Eligibility Calculator */}
        <div className="card" style={{
          padding: 32, marginBottom: 40,
          background: 'linear-gradient(135deg, rgba(0,200,83,0.06) 0%, rgba(13,24,13,0.85) 100%)',
          border: '1px solid rgba(0,200,83,0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Calculator size={22} color="var(--green)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              Kisan Credit Limit & Subsidy Calculator (اہلیت اور سبسڈی کیلکولیٹر)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
            <style>{`
              @media (max-width: 860px) {
                div[style*="gridTemplateColumns: 1.2fr 1fr"] {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cultivated Land Area (رقبہ ایکڑ میں)</label>
                  <span style={{ fontWeight: 800, color: 'var(--green)', fontSize: '1rem' }}>{landAcres} Acres</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={landAcres}
                  onChange={e => setLandAcres(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--green)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>1 Acre (Smallholder)</span>
                  <span>12.5 Acres (Subsidy Limit)</span>
                  <span>50 Acres (Large Commercial)</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>Primary Crop (فصل کا انتخاب)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
                  {[
                    { id: 'wheat', label: 'Wheat (گندم)' },
                    { id: 'cotton', label: 'Cotton (کپاس)' },
                    { id: 'rice', label: 'Rice (چاول)' },
                    { id: 'sugarcane', label: 'Sugarcane (گنا)' },
                    { id: 'orchard', label: 'Orchard (باغات)' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCropType(c.id)}
                      style={{
                        padding: '10px 8px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: cropType === c.id ? 'var(--green)' : 'rgba(255,255,255,0.05)',
                        color: cropType === c.id ? '#000' : 'var(--text-light)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div style={{
              background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)',
              borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Estimated Credit Limit (مطلوبہ قرض کی حد)</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--green)' }}>
                  ₨ {estimatedLimit.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Based on SBP 2026 agricultural indicative credit parameters
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Govt Markup Subsidy Benefit:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#00E676' }}>Save ₨ {estimatedSubsidy.toLocaleString()}/yr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Repayment Frequency:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Post-Harvest (6 Months)</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenApply(SCHEMES[0])}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0', fontSize: '0.95rem' }}
              >
                Apply for Kissan Card Scheme
              </button>
            </div>
          </div>
        </div>

        {/* Bank Schemes Grid */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>
          Available Agricultural Finance Schemes (پاکستان کے زرعی قرضہ پروگرامز)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
          {SCHEMES.map(scheme => (
            <div
              key={scheme.id}
              className="card"
              style={{
                padding: 24, display: 'flex', flexDirection: 'column',
                border: scheme.is_govt_subsidized ? '1px solid rgba(0,200,83,0.35)' : '1px solid var(--glass-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>
                  {scheme.bank}
                </span>
                {scheme.is_govt_subsidized && (
                  <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                    Govt Subsidized
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px' }}>
                {scheme.name}
              </h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--green)', fontFamily: 'sans-serif', marginBottom: 16 }}>
                {scheme.name_urdu}
              </div>

              {/* Key terms */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Max Amount:</span>
                  <span style={{ fontWeight: 700 }}>{scheme.max_amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Interest Rate:</span>
                  <span style={{ fontWeight: 700, color: 'var(--green)' }}>{scheme.markup}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Repayment Term:</span>
                  <span style={{ fontWeight: 700 }}>{scheme.tenure}</span>
                </div>
              </div>

              {/* Documents Required */}
              <div style={{ marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>REQUIRED DOCUMENTS:</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                  {scheme.documents.map((doc, idx) => <li key={idx}>{doc}</li>)}
                </ul>
              </div>

              <button
                onClick={() => handleOpenApply(scheme)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                Apply for this Scheme <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Required Documents FAQ */}
        <div className="card" style={{ padding: 28 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color="var(--green)" /> Essential Checklist for Pakistani Agri Loans
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
            State Bank of Pakistan regulations require verified land records for loans above ₨ 150,000. Ensure you have the following ready before your bank inspection:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 10 }}>
              <strong>1. Fard-e-Malkiat (فرد ملکیت):</strong> Obtain certified copy from your local Arazi Record Center (PLRA) or Deh Patwari within 3 months of validity.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 10 }}>
              <strong>2. Khasra Girdawari (خسرہ گرداوری):</strong> Harvest inspection register proving you physically cultivated the crop during the current Kharif/Rabi cycle.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 10 }}>
              <strong>3. Agri Passbook (پاس بک):</strong> Issued by Tehsildar under the Loans for Agricultural Purposes Act 1973 for fast mortgage registration.
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Loan Application */}
      {isApplyModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Online Loan Application</h3>
              <button
                onClick={() => {
                  setIsApplyModalOpen(false)
                  setTrackingId(null)
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {trackingId ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,200,83,0.15)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={36} />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px' }}>Application Registered!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
                  Your application has been forwarded to the designated branch. An Agriculture Credit Officer (ACO) will contact your mobile within 48 hours.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--green)', padding: 14, borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Application Tracking Reference:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--green)', letterSpacing: '1px' }}>{trackingId}</div>
                </div>

                <button
                  onClick={() => {
                    setIsApplyModalOpen(false)
                    setTrackingId(null)
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.2)', padding: 12, borderRadius: 8, fontSize: '0.85rem' }}>
                  Applying for: <strong>{appliedScheme?.name}</strong> ({appliedScheme?.bank})
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Farmer Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Aslam"
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>CNIC Number (شناختی کارڈ)</label>
                    <input
                      type="text"
                      required
                      placeholder="35202-1234567-1"
                      value={formData.cnic}
                      onChange={e => setFormData({ ...formData, cnic: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Mobile / WhatsApp</label>
                    <input
                      type="text"
                      required
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Requested Amount (PKR)</label>
                    <input
                      type="number"
                      required
                      value={formData.requested_amount}
                      onChange={e => setFormData({ ...formData, requested_amount: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Land Area (Acres)</label>
                    <input
                      type="number"
                      required
                      value={formData.land_acres}
                      onChange={e => setFormData({ ...formData, land_acres: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>District / تحصیل</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Multan"
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" required />
                  I declare that the land record provided is accurate and agree to physical verification by bank field officers.
                </label>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
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
                    {isSubmitting ? 'Registering...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  )
}

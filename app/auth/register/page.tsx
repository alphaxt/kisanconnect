'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { PAKISTAN_PROVINCES, PAKISTAN_DISTRICTS } from '@/lib/types'

const registerSchema = z.object({
  full_name: z.string().min(3, 'Full name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters'),
  confirm_password: z.string(),
  role: z.enum(['farmer', 'buyer', 'agronomist']),
  province: z.string().optional(),
  district: z.string().optional(),
  land_acres: z.string().optional(),
  cnic: z.string().optional(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Passwords do not match', path: ['confirm_password'],
})

type RegisterInput = z.infer<typeof registerSchema>

const ROLES = [
  { value: 'farmer', label: '🌾 Farmer (کسان)', desc: 'Sell crops, manage farm' },
  { value: 'buyer', label: '🛒 Buyer / Trader', desc: 'Buy crops, post requirements' },
  { value: 'agronomist', label: '👨‍🔬 Agronomist', desc: 'Provide expert advice' },
]

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'farmer' },
  })

  const selectedRole = watch('role')

  async function onRegister(data: RegisterInput) {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
          province: data.province,
          district: data.district,
          land_acres: data.land_acres ? parseFloat(data.land_acres) : 0,
          cnic: data.cnic,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, paddingTop: 'calc(var(--nav-h) + 24px)',
        background: 'radial-gradient(ellipse at top, rgba(0,200,83,0.06) 0%, var(--bg) 60%)',
      }}>
        <div className="card" style={{ width: '100%', maxWidth: 440, padding: 40, textAlign: 'center' }}>
          <CheckCircle size={56} color="var(--green)" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Verify your email</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 24 }}>
            We've sent a verification link to your email. Please click it to activate your KisanConnect account.
          </p>
          <Link href="/auth/login" className="btn btn-primary btn-full">Back to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', padding: 24,
      paddingTop: 'calc(var(--nav-h) + 32px)',
      paddingBottom: 60,
      background: 'radial-gradient(ellipse at top, rgba(0,200,83,0.06) 0%, var(--bg) 60%)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌱</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>Join KisanConnect</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Free forever for farmers — no hidden charges</p>
        </div>

        <form onSubmit={handleSubmit(onRegister)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I am a:</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ROLES.map(r => (
                <button key={r.value} type="button"
                  onClick={() => setValue('role', r.value as any)}
                  style={{
                    flex: 1, minWidth: 120, padding: '10px 12px',
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    background: selectedRole === r.value ? 'rgba(0,200,83,0.1)' : 'var(--bg)',
                    border: `1px solid ${selectedRole === r.value ? 'var(--green)' : 'var(--glass-border)'}`,
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input {...register('full_name')} className="input" placeholder="Muhammad Ali" />
            {errors.full_name && <span className="form-error">{errors.full_name.message}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input {...register('email')} type="email" className="input" placeholder="ali@gmail.com" />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          {/* Password Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input {...register('password')} type={showPassword ? 'text' : 'password'}
                  className="input" placeholder="Min 8 chars" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input {...register('confirm_password')} type="password" className="input" placeholder="••••••••" />
              {errors.confirm_password && <span className="form-error">{errors.confirm_password.message}</span>}
            </div>
          </div>

          {/* Location */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Province</label>
              <select {...register('province')} className="select"
                onChange={e => { setSelectedProvince(e.target.value); setValue('province', e.target.value) }}>
                <option value="">Select Province</option>
                {PAKISTAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <select {...register('district')} className="select">
                <option value="">Select District</option>
                {(PAKISTAN_DISTRICTS[selectedProvince] ?? []).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Farmer-specific */}
          {selectedRole === 'farmer' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Land (Acres)</label>
                <input {...register('land_acres')} type="number" className="input" placeholder="e.g. 10" />
              </div>
              <div className="form-group">
                <label className="form-label">CNIC (optional)</label>
                <input {...register('cnic')} className="input" placeholder="42201-XXXXXXX-X" />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}
            style={{ marginTop: 4, padding: '14px' }}>
            {loading && <Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} />}
            {loading ? 'Creating account...' : '🌱 Create Free Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            By registering you agree to our Terms & Privacy Policy
          </p>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--green)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

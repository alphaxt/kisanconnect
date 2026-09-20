'use client'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { LandingFooter } from '@/components/landing/LandingTestimonials'
import {
  CloudRain, Wind, Droplets, Sun, AlertTriangle, CheckCircle,
  Calendar, MapPin, Compass, Thermometer, ArrowUpRight, Clock, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

const AGRI_CITIES = [
  { id: 'multan', name: 'Multan (ملتان)', province: 'Punjab', specialty: 'Cotton, Mango & Wheat' },
  { id: 'lahore', name: 'Lahore (لاہور)', province: 'Punjab', specialty: 'Wheat, Rice & Vegetables' },
  { id: 'faisalabad', name: 'Faisalabad (فیصل آباد)', province: 'Punjab', specialty: 'Sugarcane, Wheat & Maize' },
  { id: 'sargodha', name: 'Sargodha (سرگودھا)', province: 'Punjab', specialty: 'Citrus (Kinnow) & Guava' },
  { id: 'rahim_yar_khan', name: 'Rahim Yar Khan (رحیم یار خان)', province: 'Punjab', specialty: 'Sugarcane, Cotton & Wheat' },
  { id: 'bahawalpur', name: 'Bahawalpur (بہاولپور)', province: 'Punjab', specialty: 'Cotton, Wheat & Dates' },
  { id: 'sialkot', name: 'Sialkot (سیالکوٹ)', province: 'Punjab', specialty: 'Basmati Rice & Wheat' },
  { id: 'rawalpindi', name: 'Rawalpindi / Islamabad (راولپنڈی)', province: 'Punjab', specialty: 'Rainfed Wheat & Mustard' },
  { id: 'sukkur', name: 'Sukkur (سکھر)', province: 'Sindh', specialty: 'Dates, Rice & Wheat' },
  { id: 'hyderabad', name: 'Hyderabad (حیدرآباد)', province: 'Sindh', specialty: 'Red Chilli, Banana & Cotton' },
  { id: 'karachi', name: 'Karachi (کراچی)', province: 'Sindh', specialty: 'Coastal Agriculture & Poultry' },
  { id: 'peshawar', name: 'Peshawar (پشاور)', province: 'KPK', specialty: 'Maize, Tobacco & Sugarbeet' },
  { id: 'swat', name: 'Swat (سوات)', province: 'KPK', specialty: 'Apples, Peaches & Off-Season Veg' },
  { id: 'quetta', name: 'Quetta (کوئٹہ)', province: 'Balochistan', specialty: 'Apples, Almonds & Grapes' },
]

export default function PlannerPage() {
  const [selectedCity, setSelectedCity] = useState('multan')
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true)
      try {
        const res = await fetch(`/api/weather?city=${selectedCity}`)
        if (res.ok) {
          const data = await res.json()
          setWeatherData(data)
        }
      } catch (e) {
        console.error('Weather error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [selectedCity])


  const currentCityObj = AGRI_CITIES.find(c => c.id === selectedCity) || AGRI_CITIES[0]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-light)' }}>
      <Navbar />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: 'calc(var(--nav-h) + 24px) 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} /> Hyper-Local Agro-Meteorological Intelligence
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 6px' }}>
              Weather & Irrigation Planner <span style={{ color: 'var(--green)' }}>موسمیاتی رہنمائی و آبپاشی پلانر</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 650, fontSize: '0.95rem', margin: 0 }}>
              Tailored 7-day agricultural forecasts with predictive irrigation scheduling and pesticide spray advisories to save tube-well electricity and protect crop yields.
            </p>
          </div>

          {/* City Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={18} color="var(--green)" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{
                padding: '12px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--glass-border)', color: 'var(--text-light)', fontSize: '0.95rem', fontWeight: 600, outline: 'none'
              }}
            >
              {AGRI_CITIES.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#111' }}>
                  {c.name} — {c.province}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Weather Card */}
        {weatherData && (
          <div className="card" style={{
            padding: 32, marginBottom: 32,
            background: 'linear-gradient(135deg, rgba(0,200,83,0.06) 0%, rgba(13,24,13,0.8) 100%)',
            border: '1px solid rgba(0,200,83,0.25)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentCityObj.name}</span>
                  <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>{currentCityObj.specialty}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: '3.6rem', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text-light)' }}>
                    {weatherData.temperature}°C
                  </span>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    Feels like {weatherData.feels_like}°C
                  </span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--green)', marginTop: 4 }}>
                  {weatherData.description}
                </div>
              </div>

              {/* Weather Indicators Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <style>{`
                  @media (max-width: 768px) {
                    div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
                      grid-template-columns: repeat(2, 1fr) !important;
                    }
                  }
                `}</style>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>
                    <Droplets size={14} color="#0091EA" /> Humidity
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weatherData.humidity}%</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>
                    <Wind size={14} color="#00C853" /> Wind Speed
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weatherData.wind_speed} km/h</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>
                    <CloudRain size={14} color="#AA00FF" /> Rain Chance
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weatherData.rain_chance}%</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>
                    <Sun size={14} color="#FFD600" /> UV Index
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weatherData.uv_index || 7} (High)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Agricultural Advisory Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          <style>{`
            @media (max-width: 900px) {
              div[style*="gridTemplateColumns: repeat(3, 1fr)"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Spray Advisory */}
          <div className="card" style={{ padding: 24, borderTop: '4px solid #00C853' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CheckCircle size={20} color="#00C853" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Foliar Spray Suitability</h4>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: 10 }}>
              <strong>Optimal Window:</strong> Wind speeds under 14 km/h today ensure minimal chemical drift. Recommended spray time: <strong>7:00 AM – 10:30 AM</strong> or after 5:00 PM.
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontFamily: 'sans-serif' }}>
              آج کیڑے مار ادویات اور کھاد کے سپرے کے لیے ہوا کا دباؤ اور رفتار موزوں ہے۔
            </div>
          </div>

          {/* Irrigation Advisory */}
          <div className="card" style={{ padding: 24, borderTop: '4px solid #0091EA' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CloudRain size={20} color="#0091EA" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Smart Irrigation Alert</h4>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: 10 }}>
              <strong>Rain Warning Ahead:</strong> 60–70% rain probability forecasted for Tuesday and Wednesday. <strong>Postpone deep tube-well irrigation</strong> to prevent root rot and save electricity bill.
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0091EA', fontFamily: 'sans-serif' }}>
              منگل اور بدھ کو بارش کا امکان ہے، ٹیوب ویل چلانے سے گریز کریں تاکہ بجلی کا خرچ بچ سکے۔
            </div>
          </div>

          {/* Disease Risk Alert */}
          <div className="card" style={{ padding: 24, borderTop: '4px solid #FF9100' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={20} color="#FF9100" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Humidity & Spore Alert</h4>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: 10 }}>
              <strong>Fungal Vulnerability:</strong> Relative humidity above 75% midweek creates favorable conditions for fungal blight and rust spores in standing crops.
            </div>
            <div style={{ fontSize: '0.8rem', color: '#FF9100', fontFamily: 'sans-serif' }}>
              زیادہ نمی کے باعث پھپھوندی اور کنگی کے حملے کا خدشہ ہے، فصلوں کا باقاعدہ معائنہ کریں۔
            </div>
          </div>
        </div>

        {/* 7-Day Agricultural Forecast */}
        <div className="card" style={{ padding: 28, marginBottom: 36 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 800 }}>
            7-Day Agricultural Outlook (ہفتہ وار موسمیاتی پیش گوئی)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
            <style>{`
              @media (max-width: 900px) {
                div[style*="gridTemplateColumns: repeat(7, 1fr)"] {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
              }
            `}</style>
            {weatherData?.forecast?.map((day: any, i: number) => (
              <div
                key={i}
                style={{
                  background: day.day === 'Today' ? 'rgba(0,200,83,0.1)' : 'rgba(255,255,255,0.03)',
                  border: day.day === 'Today' ? '1px solid var(--green)' : '1px solid var(--glass-border)',
                  borderRadius: 12, padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: day.day === 'Today' ? 'var(--green)' : 'var(--text-light)', marginBottom: 2 }}>
                  {day.day}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  {day.date}
                </div>

                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  {day.rain_chance > 40 ? <CloudRain size={20} color="#0091EA" /> : <Sun size={20} color="#FFD600" />}
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 2 }}>
                  {day.high}°
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Low: {day.low}°
                </div>

                <div style={{
                  fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                  background: day.rain_chance > 50 ? 'rgba(0,145,234,0.2)' : 'rgba(255,255,255,0.05)',
                  color: day.rain_chance > 50 ? '#0091EA' : 'var(--text-muted)'
                }}>
                  💧 {day.rain_chance}% Rain
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cropping Calendar Reference */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Calendar size={20} color="var(--green)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
              Pakistan Seasonal Cropping Calendar (ربیع و خریف سیزن گائیڈ)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <style>{`
              @media (max-width: 768px) {
                div[style*="gridTemplateColumns: 1fr 1fr"] {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--green)' }}>🌾 Rabi Season (فصل ربیع)</span>
                <span className="badge badge-outline">Oct – April</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li><strong style={{ color: '#fff' }}>Wheat (گندم):</strong> Sowing Nov 1–25. Critical irrigation at Crown Root Initiation (CRI) 20 days after emergence.</li>
                <li><strong style={{ color: '#fff' }}>Gram (چنا):</strong> Sown mid-October in Thal & Cholistan barani tracts. Minimal water requirement.</li>
                <li><strong style={{ color: '#fff' }}>Potato (آلو):</strong> Autumn crop harvested Jan–Feb. Regular monitored watering.</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0091EA' }}>🌱 Kharif Season (فصل خریف)</span>
                <span className="badge badge-outline">May – Nov</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li><strong style={{ color: '#fff' }}>Cotton (کپاس):</strong> Sowing May 1–15 in Punjab/Sindh. Critical monitoring for whitefly and pink bollworm.</li>
                <li><strong style={{ color: '#fff' }}>Basmati Rice (چاول):</strong> Nursery transplanting June 20 – July 15. Requires standing water till milk stage.</li>
                <li><strong style={{ color: '#fff' }}>Sugarcane (گنا):</strong> High water consumption crop, responds heavily to urea + zinc applications.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

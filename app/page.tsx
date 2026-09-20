import { Navbar } from '@/components/Navbar'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingTicker } from '@/components/landing/LandingTicker'
import { LandingStats, LandingTestimonials, LandingPvsS, LandingFooter } from '@/components/landing/LandingTestimonials'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  let prices: { city: string; crop: string; price: number; change_pct: number }[] = []
  
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('mandi_prices')
      .select('city, crop, price, change_pct')
      .order('updated_at', { ascending: false })
      .limit(20)
    if (data && data.length > 0) {
      prices = data
    }
  } catch {}

  if (prices.length === 0) {
    prices = [
      { city: 'Lahore', crop: 'Wheat (گندم)', price: 3850, change_pct: 1.8 },
      { city: 'Multan', crop: 'Cotton (کپاس)', price: 8900, change_pct: -0.5 },
      { city: 'Faisalabad', crop: 'Basmati Rice (چاول)', price: 4200, change_pct: 2.1 },
      { city: 'Sargodha', crop: 'Citrus Kinnow (کنو)', price: 2100, change_pct: 3.4 },
      { city: 'Rahim Yar Khan', crop: 'Sugarcane (گنا)', price: 425, change_pct: 0.0 },
      { city: 'Hyderabad', crop: 'Red Chilli (لال مرچ)', price: 28500, change_pct: 4.2 },
      { city: 'Peshawar', crop: 'Maize (مکئی)', price: 2650, change_pct: -1.2 },
      { city: 'Quetta', crop: 'Apple Kala Kulu (سیب)', price: 11000, change_pct: 1.5 },
    ]
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <LandingHero />
        <LandingTicker prices={prices ?? []} />
        <LandingStats />
        <LandingFeatures />
        <LandingPvsS />
        <LandingTestimonials />
        <LandingFooter />
      </main>
    </>
  )
}

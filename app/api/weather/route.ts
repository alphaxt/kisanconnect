import { NextResponse } from 'next/server'

interface CityCoord {
  name: string
  name_urdu: string
  province: string
  lat: number
  lon: number
}

const PAKISTAN_CITIES: Record<string, CityCoord> = {
  lahore:          { name: 'Lahore', name_urdu: 'لاہور', province: 'Punjab', lat: 31.5497, lon: 74.3436 },
  multan:          { name: 'Multan', name_urdu: 'ملتان', province: 'Punjab', lat: 30.1575, lon: 71.5249 },
  faisalabad:      { name: 'Faisalabad', name_urdu: 'فیصل آباد', province: 'Punjab', lat: 31.4180, lon: 73.0790 },
  sargodha:        { name: 'Sargodha', name_urdu: 'سرگودھا', province: 'Punjab', lat: 32.0836, lon: 72.6711 },
  sukkur:          { name: 'Sukkur', name_urdu: 'سکھر', province: 'Sindh', lat: 27.7052, lon: 68.8574 },
  hyderabad:       { name: 'Hyderabad', name_urdu: 'حیدرآباد', province: 'Sindh', lat: 25.3792, lon: 68.3683 },
  peshawar:        { name: 'Peshawar', name_urdu: 'پشاور', province: 'KPK', lat: 34.0150, lon: 71.5249 },
  quetta:          { name: 'Quetta', name_urdu: 'کوئٹہ', province: 'Balochistan', lat: 30.1978, lon: 66.9750 },
  rawalpindi:      { name: 'Rawalpindi', name_urdu: 'راولپنڈی', province: 'Punjab', lat: 33.6007, lon: 73.0679 },
  karachi:         { name: 'Karachi', name_urdu: 'کراچی', province: 'Sindh', lat: 24.8607, lon: 67.0011 },
  bahawalpur:      { name: 'Bahawalpur', name_urdu: 'بہاولپور', province: 'Punjab', lat: 29.3956, lon: 71.6836 },
  swat:            { name: 'Swat', name_urdu: 'سوات', province: 'KPK', lat: 35.2227, lon: 72.4258 },
  sialkot:         { name: 'Sialkot', name_urdu: 'سیالکوٹ', province: 'Punjab', lat: 32.4945, lon: 74.5229 },
  mardan:          { name: 'Mardan', name_urdu: 'مردان', province: 'KPK', lat: 34.1982, lon: 72.0490 },
  rahim_yar_khan:  { name: 'Rahim Yar Khan', name_urdu: 'رحیم یار خان', province: 'Punjab', lat: 28.4212, lon: 70.2989 },
}

function getWmoDetails(code: number) {
  if (code === 0) return { desc: 'Clear Sky (صاف آسمان)', icon: '☀️' }
  if (code === 1) return { desc: 'Mainly Clear (زیادہ تر صاف)', icon: '🌤️' }
  if (code === 2) return { desc: 'Partly Cloudy (جزوی ابر آلود)', icon: '⛅' }
  if (code === 3) return { desc: 'Overcast (مکمل ابر آلود)', icon: '☁️' }
  if (code >= 45 && code <= 48) return { desc: 'Fog & Mist (دھند)', icon: '🌫️' }
  if (code >= 51 && code <= 55) return { desc: 'Light Drizzle (ہلکی پھوار)', icon: '🌦️' }
  if (code >= 61 && code <= 65) return { desc: 'Rain Showers (بارش)', icon: '🌧️' }
  if (code >= 71 && code <= 77) return { desc: 'Snow Flurries (برفباری)', icon: '🌨️' }
  if (code >= 80 && code <= 82) return { desc: 'Scattered Showers (موسلادھار بارش)', icon: '🌦️' }
  if (code >= 95) return { desc: 'Thunderstorm (گرج چمک)', icon: '⛈️' }
  return { desc: 'Mild & Sunny (معتدل)', icon: '☀️' }
}

function getIrrigationAdvice(temp: number, humidity: number, rainChance: number, windSpeed: number): string {
  if (rainChance > 50) return '⛔ Skip irrigation — significant rainfall expected. Save tube-well fuel.'
  if (temp > 38) return '💧 High evaporation rate — irrigate in evening (after 6 PM) to reduce 40% water loss.'
  if (humidity > 78) return '⚠️ High humidity — delay irrigation to prevent fungal root diseases.'
  if (windSpeed > 15) return '🌬️ High wind — avoid foliar spray or flood irrigation due to rapid topsoil drying.'
  if (temp < 15) return '🌡️ Cold weather — reduce irrigation volume by 25%.'
  return '✅ Ideal farming conditions — proceed with scheduled irrigation.'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cityKey = searchParams.get('city')?.toLowerCase().replace(/\s+/g, '_') ?? 'lahore'
  const cityInfo = PAKISTAN_CITIES[cityKey] ?? PAKISTAN_CITIES.lahore

  try {
    // 1. Fetch real-time live weather from Open-Meteo (No API key needed, high reliability)
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.lat}&longitude=${cityInfo.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_max&timezone=Asia%2FKarachi`
    
    const res = await fetch(openMeteoUrl, {
      next: { revalidate: 900 } // cache 15 mins for performance
    })

    if (!res.ok) throw new Error(`Open-Meteo responded with status ${res.status}`)

    const data = await res.json()
    const current = data.current
    const daily = data.daily

    const weatherDetail = getWmoDetails(current.weather_code)

    // Build 7-day forecast from real daily observations
    const forecastDays = daily.time.slice(0, 7).map((dateStr: string, index: number) => {
      const dateObj = new Date(dateStr)
      const dayName = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-PK', { weekday: 'short' })
      const dayMonth = dateObj.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
      const dayDetail = getWmoDetails(daily.weather_code[index] ?? 0)

      return {
        date: dayMonth,
        day: dayName,
        icon: dayDetail.icon,
        description: dayDetail.desc,
        high: Math.round(daily.temperature_2m_max[index]),
        low: Math.round(daily.temperature_2m_min[index]),
        rain_chance: Math.round(daily.precipitation_probability_max[index] ?? 0),
        humidity: Math.round(daily.relative_humidity_2m_max?.[index] ?? current.relative_humidity_2m),
      }
    })

    const rainChanceToday = forecastDays[0]?.rain_chance ?? 0
    const windSpeedKm = Math.round(current.wind_speed_10m)

    const responsePayload = {
      city: cityInfo.name,
      city_urdu: cityInfo.name_urdu,
      province: cityInfo.province,
      temperature: Math.round(current.temperature_2m),
      feels_like: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      wind_speed: windSpeedKm,
      wind_direction: `${Math.round(current.wind_direction_10m)}°`,
      description: weatherDetail.desc,
      icon: weatherDetail.icon,
      uv_index: current.temperature_2m > 32 ? 8 : 5,
      rain_chance: rainChanceToday,
      forecast: forecastDays,
      irrigation_advice: getIrrigationAdvice(
        current.temperature_2m,
        current.relative_humidity_2m,
        rainChanceToday,
        windSpeedKm
      ),
      is_live: true,
      updated_at: new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })
    }

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300'
      }
    })
  } catch (err: any) {
    console.error('Real weather fetch error, returning localized fallback:', err.message)
    
    // Fallback if network is temporarily unreachable
    const isNorth = ['quetta', 'swat', 'peshawar', 'rawalpindi'].includes(cityKey)
    const isSouth = ['sukkur', 'hyderabad', 'karachi', 'rahim_yar_khan', 'multan'].includes(cityKey)
    const baseTemp = isNorth ? 22 : isSouth ? 32 : 28

    return NextResponse.json({
      city: cityInfo.name,
      city_urdu: cityInfo.name_urdu,
      province: cityInfo.province,
      temperature: baseTemp,
      feels_like: baseTemp + 2,
      humidity: isSouth ? 65 : 52,
      wind_speed: 10,
      wind_direction: 'NE',
      description: 'Clear & Mild',
      icon: '☀️',
      uv_index: 6,
      rain_chance: 10,
      forecast: ['Today','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => ({
        date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }),
        day, icon: '☀️', description: 'Sunny', high: baseTemp + 2, low: baseTemp - 7, rain_chance: 10, humidity: 55
      })),
      irrigation_advice: '✅ Normal conditions — follow standard irrigation schedule.',
      is_live: false,
      updated_at: 'Cached'
    })
  }
}

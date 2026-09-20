import { NextResponse } from 'next/server'

const WEATHER_API = 'https://api.openweathermap.org/data/2.5'
const GEO_API = 'https://api.openweathermap.org/geo/1.0'

const PAKISTAN_CITIES: Record<string, { lat: number; lon: number }> = {
  lahore:      { lat: 31.5497, lon: 74.3436 },
  karachi:     { lat: 24.8607, lon: 67.0011 },
  faisalabad:  { lat: 31.4180, lon: 73.0790 },
  multan:      { lat: 30.1575, lon: 71.5249 },
  rawalpindi:  { lat: 33.6007, lon: 73.0679 },
  peshawar:    { lat: 34.0150, lon: 71.5249 },
  quetta:      { lat: 30.1978, lon: 66.9750 },
  islamabad:   { lat: 33.7215, lon: 73.0433 },
  gujranwala:  { lat: 32.1877, lon: 74.1945 },
  hyderabad:   { lat: 25.3792, lon: 68.3683 },
  sialkot:     { lat: 32.4945, lon: 74.5229 },
  mardan:      { lat: 34.1982, lon: 72.0490 },
  sukkur:      { lat: 27.7052, lon: 68.8574 },
  larkana:     { lat: 27.5570, lon: 68.2210 },
  bahawalpur:  { lat: 29.3956, lon: 71.6836 },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')?.toLowerCase() ?? 'lahore'
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

  if (!apiKey || apiKey === 'YOUR_OPENWEATHER_KEY_HERE') {
    // Return mock data when API key is not set
    return NextResponse.json(getMockWeather(city), {
      headers: { 'Cache-Control': 'public, s-maxage=600' }
    })
  }

  try {
    const coords = PAKISTAN_CITIES[city] ?? PAKISTAN_CITIES.lahore
    const [current, forecast, uv] = await Promise.all([
      fetch(`${WEATHER_API}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`),
      fetch(`${WEATHER_API}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric&cnt=80`),
      fetch(`${WEATHER_API}/uvi?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`).catch(() => null),
    ])

    if (!current.ok) throw new Error('Weather API error')

    const currentData = await current.json()
    const forecastData = await forecast.json()
    const uvData = uv ? await uv.json().catch(() => null) : null

    // Process 10-day forecast (group by day)
    const dailyMap: Record<string, any[]> = {}
    forecastData.list.forEach((item: any) => {
      const day = new Date(item.dt * 1000).toDateString()
      if (!dailyMap[day]) dailyMap[day] = []
      dailyMap[day].push(item)
    })

    const forecastDays = Object.entries(dailyMap).slice(0, 10).map(([dateStr, items]) => {
      const date = new Date(dateStr)
      const maxTemp = Math.max(...items.map((i: any) => i.main.temp_max))
      const minTemp = Math.min(...items.map((i: any) => i.main.temp_min))
      const rainChance = Math.max(...items.map((i: any) => (i.pop || 0) * 100))
      const mainItem = items[Math.floor(items.length / 2)]
      return {
        date: dateStr,
        day: date.toLocaleDateString('en-PK', { weekday: 'short' }),
        icon: getWeatherEmoji(mainItem.weather[0].id),
        description: mainItem.weather[0].description,
        high: Math.round(maxTemp),
        low: Math.round(minTemp),
        rain_chance: Math.round(rainChance),
        humidity: Math.round(mainItem.main.humidity),
      }
    })

    const response = {
      city: currentData.name,
      temperature: Math.round(currentData.main.temp),
      feels_like: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      wind_speed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
      wind_direction: getWindDirection(currentData.wind.deg),
      description: currentData.weather[0].description,
      icon: getWeatherEmoji(currentData.weather[0].id),
      uv_index: uvData?.value ?? null,
      rain_chance: forecastDays[0]?.rain_chance ?? 0,
      forecast: forecastDays,
      irrigation_advice: getIrrigationAdvice(
        currentData.main.temp,
        currentData.main.humidity,
        forecastDays[0]?.rain_chance ?? 0,
        currentData.wind.speed
      ),
    }

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=1800' }
    })
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(getMockWeather(city), {
      headers: { 'Cache-Control': 'public, s-maxage=600' }
    })
  }
}

function getWeatherEmoji(id: number): string {
  if (id >= 200 && id < 300) return '⛈️'
  if (id >= 300 && id < 400) return '🌦️'
  if (id >= 500 && id < 600) return id < 511 ? '🌧️' : '🌨️'
  if (id >= 600 && id < 700) return '❄️'
  if (id >= 700 && id < 800) return '🌫️'
  if (id === 800) return '☀️'
  if (id === 801) return '🌤️'
  if (id <= 804) return '⛅'
  return '🌡️'
}

function getWindDirection(deg: number): string {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

function getIrrigationAdvice(temp: number, humidity: number, rainChance: number, windSpeed: number): string {
  if (rainChance > 60) return '⛔ Skip irrigation — rain expected. Save water.'
  if (temp > 38) return '💧 Irrigate at night (9PM–5AM) to reduce evaporation by 40%.'
  if (humidity > 80) return '⚠️ High humidity — delay irrigation 1 day to prevent root rot.'
  if (windSpeed > 8) return '🌬️ Windy conditions — use drip irrigation to minimize drift.'
  if (temp < 15) return '🌡️ Cool weather — reduce irrigation frequency by 30%.'
  return '✅ Normal conditions — follow standard irrigation schedule.'
}

function getMockWeather(city: string) {
  const cityName = city.charAt(0).toUpperCase() + city.slice(1)
  return {
    city: cityName,
    temperature: 34, feels_like: 38, humidity: 62,
    wind_speed: 18, wind_direction: 'NW',
    description: 'clear sky', icon: '☀️',
    uv_index: 8, rain_chance: 15,
    irrigation_advice: '✅ Good conditions — irrigate your crops this evening.',
    forecast: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue'].map((day, i) => ({
      date: new Date(Date.now() + i * 86400000).toDateString(),
      day, icon: ['☀️','⛅','🌧️','⛈️','🌦️','⛅','☀️','☀️','⛅','🌤️'][i],
      description: ['Clear','Partly Cloudy','Rain','Thunderstorm','Showers','Cloudy','Clear','Hot','Cloudy','Mostly Clear'][i],
      high: [36,34,29,27,30,32,35,38,36,34][i],
      low: [24,23,21,20,22,23,24,26,25,23][i],
      rain_chance: [5,10,70,85,40,15,5,2,8,10][i],
      humidity: [50,55,78,85,70,60,48,45,55,52][i],
    })),
  }
}

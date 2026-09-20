import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const province = searchParams.get('province')
  const crop = searchParams.get('crop')
  const city = searchParams.get('city')

  const supabase = await createClient()
  let query = supabase
    .from('mandi_prices')
    .select('*')
    .order('updated_at', { ascending: false })

  if (province) query = query.ilike('province', province)
  if (crop) query = query.ilike('crop', crop)
  if (city) query = query.ilike('city', city)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=300' }
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('mandi_prices')
    .upsert({
      city: body.city, province: body.province,
      crop: body.crop, price: body.price,
      change_pct: body.change_pct ?? 0,
      source: 'user_report', updated_at: new Date().toISOString(),
    }, { onConflict: 'city,crop' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

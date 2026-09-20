import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const type = searchParams.get('type')
  const crop = searchParams.get('crop')
  const province = searchParams.get('province')
  const offset = (page - 1) * limit

  const supabase = await createClient()
  let query = supabase
    .from('listings')
    .select(`*, profiles(id, full_name, is_verified, role, province)`, { count: 'exact' })
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) query = query.eq('type', type)
  if (crop) query = query.ilike('crop', `%${crop}%`)
  if (province) query = query.ilike('province', province)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json()

  // Validate
  if (!body.crop || !body.price || !body.quantity || !body.location || !body.type)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const { data, error } = await supabase
    .from('listings')
    .insert({
      user_id: user.id,
      type: body.type,
      crop: body.crop,
      crop_emoji: body.crop_emoji,
      quantity: parseFloat(body.quantity),
      quantity_unit: body.quantity_unit ?? 'Maund',
      price: parseFloat(body.price),
      min_order: parseFloat(body.min_order ?? '1'),
      location: body.location,
      province: body.province,
      district: body.district,
      description: body.description,
      image_url: body.image_url,
      is_organic: body.is_organic ?? false,
    })
    .select(`*, profiles(id, full_name, is_verified)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify seller
  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'listing_posted',
    title: 'Listing Posted Successfully',
    body: `Your ${body.crop} listing is now live for buyers to see.`,
    link: `/marketplace/${data.id}`,
  })

  return NextResponse.json(data, { status: 201 })
}

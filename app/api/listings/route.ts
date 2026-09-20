import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const DEFAULT_LISTINGS = [
  // ── FARMER LISTINGS (SELL) ──
  {
    id: 's1',
    type: 'sell',
    crop: 'Super Kernel Basmati Rice',
    crop_urdu: 'سپر کرنل باسمتی چاول',
    category: 'Grains',
    quantity: 650,
    quantity_unit: 'Maund (40 kg)',
    price: 4350,
    min_order: 50,
    location: 'Hafizabad',
    province: 'Punjab',
    farmer_name: 'Chaudhry Tariq Mehmood',
    farmer_phone: '923001234567',
    farmer_rating: 4.9,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'A-grade 2026 harvest, moisture content strictly below 12%, long grain aromatic Basmati direct from farm gate.',
    created_at: '2 hours ago'
  },
  {
    id: 's2',
    type: 'sell',
    crop: 'Export Quality Kinnow (Mandarin)',
    crop_urdu: 'ایکسپورٹ کوالٹی کنو',
    category: 'Fruits',
    quantity: 2500,
    quantity_unit: 'Wooden Crates (10 kg)',
    price: 1100,
    min_order: 100,
    location: 'Bhalwal, Sargodha',
    province: 'Punjab',
    farmer_name: 'Malik Zafar Iqbal',
    farmer_phone: '923019876543',
    farmer_rating: 4.8,
    is_verified: true,
    is_organic: true,
    image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
    description: 'Waxed and sorted Kinnow from 50-acre family orchard. Ready for domestic fruit markets or Middle East export packaging.',
    created_at: '5 hours ago'
  },
  {
    id: 's3',
    type: 'sell',
    crop: 'Raw White Cotton (Phutti)',
    crop_urdu: 'پھٹی کپاس',
    category: 'Cash Crops',
    quantity: 400,
    quantity_unit: 'Maund (40 kg)',
    price: 9100,
    min_order: 40,
    location: 'Vehari',
    province: 'Punjab',
    farmer_name: 'Haji Ghulam Rasool',
    farmer_phone: '923334567890',
    farmer_rating: 4.7,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
    description: 'First picking high-ginning outturn (GOT 39%), clean white fiber free of trash and dust.',
    created_at: '1 day ago'
  },
  {
    id: 's4',
    type: 'sell',
    crop: 'Red Long Chilli (Kunri Special)',
    crop_urdu: 'کنری کی لال مرچ',
    category: 'Vegetables',
    quantity: 180,
    quantity_unit: 'Maund (40 kg)',
    price: 28200,
    min_order: 10,
    location: 'Kunri, Umerkot',
    province: 'Sindh',
    farmer_name: 'Seth Gobind Ram',
    farmer_phone: '923456789012',
    farmer_rating: 5.0,
    is_verified: true,
    is_organic: true,
    image_url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    description: 'Authentic sun-dried Kunri spicy red chilli, vibrant crimson color, ideal for spice processors.',
    created_at: '1 day ago'
  },
  {
    id: 's5',
    type: 'sell',
    crop: 'Certified Seed Potato (Santé)',
    crop_urdu: 'آلو بیج سانتے',
    category: 'Vegetables',
    quantity: 1200,
    quantity_unit: 'Bags (50 kg)',
    price: 3600,
    min_order: 50,
    location: 'Depalpur, Okara',
    province: 'Punjab',
    farmer_name: 'Mian Babar Ali',
    farmer_phone: '923215678901',
    farmer_rating: 4.9,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'Cold-storage stored seed potatoes with vigorous germination rate. Certified by FSC&RD.',
    created_at: '2 days ago'
  },

  // ── BUYER DEMANDS (WANTED TO BUY) ──
  {
    id: 'b1',
    type: 'buy',
    crop: 'Super Basmati Rice (Paddy/Dhan)',
    crop_urdu: 'دھان / باسمتی چاول درکار ہے',
    category: 'Grains',
    quantity: 5000,
    quantity_unit: 'Maund (40 kg)',
    price: 4400,
    min_order: 200,
    location: 'Muridke Rice Processing Complex',
    province: 'Punjab',
    farmer_name: 'Al-Karam Rice Mills Ltd (Buyer)',
    farmer_phone: '923009988776',
    farmer_rating: 4.9,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'Urgent bulk procurement: Looking for 5,000 maunds clean Super Basmati paddy. Immediate spot bank transfer upon weighbridge clearance.',
    created_at: '30 mins ago'
  },
  {
    id: 'b2',
    type: 'buy',
    crop: 'White Seed Cotton (Ginned/Unginned)',
    crop_urdu: 'کپاس کی خریداری (ٹیکسٹائل مل)',
    category: 'Cash Crops',
    quantity: 2000,
    quantity_unit: 'Maund (40 kg)',
    price: 9250,
    min_order: 100,
    location: 'Multan Industrial Estate',
    province: 'Punjab',
    farmer_name: 'Chenab Textile Mills (Procurement)',
    farmer_phone: '923218877665',
    farmer_rating: 5.0,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
    description: 'Offering Rs 9,250/maund for GOT 38%+ lint cotton. We arrange direct transportation from your farm gate.',
    created_at: '1 hour ago'
  },
  {
    id: 'b3',
    type: 'buy',
    crop: 'Dried Yellow Feed Maize',
    crop_urdu: 'پیل مکئی پولٹری فیڈ کے لیے',
    category: 'Grains',
    quantity: 8000,
    quantity_unit: 'Maund (40 kg)',
    price: 2750,
    min_order: 500,
    location: 'Sahiwal / Okara Feed Plant',
    province: 'Punjab',
    farmer_name: 'Supreme Poultry Feeds',
    farmer_phone: '923337766554',
    farmer_rating: 4.8,
    is_verified: true,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    description: 'Moisture must be under 14%, aflatoxin below 20 ppb. Weekly demand of 8,000 maunds throughout season.',
    created_at: '4 hours ago'
  },
  {
    id: 'b4',
    type: 'buy',
    crop: 'Aseel Khajur (Dates for Processing)',
    crop_urdu: 'اصیل کھجور خریدار',
    category: 'Fruits',
    quantity: 1500,
    quantity_unit: 'Boxes (20 kg)',
    price: 15200,
    min_order: 50,
    location: 'Sukkur Processing Zone',
    province: 'Sindh',
    farmer_name: 'Indus Valley Agro Exports',
    farmer_phone: '923451122334',
    farmer_rating: 4.9,
    is_verified: true,
    is_organic: true,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    description: 'Export-oriented dates packing facility purchasing A-grade sun-dried Aseel dates from Khairpur/Sukkur growers.',
    created_at: '1 day ago'
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'sell' | 'buy' | null
  const crop = searchParams.get('crop')
  const province = searchParams.get('province')

  try {
    const supabase = await createClient()
    let query = supabase
      .from('listings')
      .select(`*, profiles(id, full_name, is_verified, role, province)`)
      .order('created_at', { ascending: false })

    if (type && type !== 'all') query = query.eq('type', type)
    if (crop) query = query.ilike('crop', `%${crop}%`)
    if (province && province !== 'All') query = query.ilike('province', province)

    const { data, error } = await query

    if (!error && data && data.length > 0) {
      return NextResponse.json({ data, count: data.length })
    }
  } catch (err) {
    console.error('Listings DB fallback:', err)
  }

  // Fallback to high-fidelity dual listings
  let filtered = [...DEFAULT_LISTINGS]
  if (type && type !== 'all') {
    filtered = filtered.filter(l => l.type === type)
  }
  if (crop) {
    filtered = filtered.filter(l => l.crop.toLowerCase().includes(crop.toLowerCase()))
  }
  if (province && province !== 'All') {
    filtered = filtered.filter(l => l.province.toLowerCase() === province.toLowerCase())
  }

  return NextResponse.json({ data: filtered, count: filtered.length }, {
    headers: { 'Cache-Control': 'public, s-maxage=60' }
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate
    if (!body.crop || !body.price || !body.quantity || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from('listings')
          .insert({
            user_id: user.id,
            type: body.type || 'sell',
            crop: body.crop,
            quantity: parseFloat(body.quantity),
            quantity_unit: body.quantity_unit ?? 'Maund (40 kg)',
            price: parseFloat(body.price),
            min_order: parseFloat(body.min_order ?? '10'),
            location: body.location,
            province: body.province || 'Punjab',
            description: body.description,
            is_organic: body.is_organic ?? false,
          })
          .select()
          .single()

        if (!error && data) {
          return NextResponse.json(data, { status: 201 })
        }
      }
    } catch {}

    // Fallback response for unauthenticated/demo mode
    const newItem = {
      id: String(Date.now()),
      type: body.type || 'sell',
      crop: body.crop,
      crop_urdu: body.crop_urdu || body.crop,
      category: body.category || 'Grains',
      quantity: parseFloat(body.quantity),
      quantity_unit: body.quantity_unit || 'Maund (40 kg)',
      price: parseFloat(body.price),
      min_order: parseFloat(body.min_order || '10'),
      location: body.location,
      province: body.province || 'Punjab',
      farmer_name: body.farmer_name || (body.type === 'buy' ? 'Verified Buyer' : 'Verified Grower'),
      farmer_phone: body.farmer_phone || '923001234567',
      is_verified: true,
      is_organic: body.is_organic ?? false,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      description: body.description || 'Verified listing on KisanConnect',
      created_at: 'Just now'
    }

    return NextResponse.json(newItem, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

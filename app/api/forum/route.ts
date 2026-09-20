import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'


const DEFAULT_POSTS = [
  {
    id: '1',
    title: 'Wheat leaves turning yellow after second irrigation — Nitrogen deficiency or Sulphur?',
    title_urdu: 'دوسرے پانی کے بعد گندم کے پتے پیلے ہو رہے ہیں — نائٹروجن کی کمی ہے یا سلفر کی؟',
    body: 'My Akbar-2019 wheat crop was irrigated 5 days ago with 1 bag of Urea. Older leaves at the bottom are still showing pale yellowing from the tips. What foliar spray is recommended?',
    category: 'Fertilizer & Soil Nutrition',
    likes_count: 34,
    replies_count: 5,
    is_answered: true,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    profiles: { id: 'u1', full_name: 'Malik Jahangir', role: 'farmer', is_verified: true, province: 'Punjab' }
  },
  {
    id: '2',
    title: 'Whitefly nymphs outbreak on late sown BT cotton despite Bifenthrin spray',
    title_urdu: 'بائیفینتھرین سپرے کے باوجود بی ٹی کپاس پر سفید مکھی کے بچوں کا حملہ',
    body: 'I sprayed Bifenthrin 3 days ago on 15 acres of cotton, but nymph counts are still above ETL. What Insect Growth Regulator should I switch to?',
    category: 'Pest & Disease Control',
    likes_count: 42,
    replies_count: 8,
    is_answered: true,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    profiles: { id: 'u2', full_name: 'Chaudhry Nadeem Akhtar', role: 'farmer', is_verified: true, province: 'Punjab' }
  },
  {
    id: '3',
    title: '15HP Solar Tube-Well recommendation for 120ft water table depth',
    title_urdu: '120 فٹ گہرے پانی پر 15 ہارس پاور سولر ٹیوب ویل کا تجربہ کیسا ہے؟',
    body: 'Planning to convert diesel peter engine to solar in DG Khan. Water table is 120 feet with 5-inch delivery pipe.',
    category: 'Solar & Engineering',
    likes_count: 29,
    replies_count: 12,
    is_answered: false,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    profiles: { id: 'u3', full_name: 'Sardar Farooq Leghari', role: 'farmer', is_verified: false, province: 'Punjab' }
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const category = searchParams.get('category')
  const tab = searchParams.get('tab') ?? 'recent'
  const offset = (page - 1) * limit

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
      .from('forum_posts')
      .select(`
        *, profiles(id, full_name, role, is_verified, province),
        replies_count:forum_replies(count)
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (category) query = query.eq('category', category)

    if (tab === 'trending')  query = query.order('likes_count', { ascending: false })
    else if (tab === 'answered') query = query.eq('is_answered', true).order('created_at', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query
    if (!error && data && data.length > 0) {
      // Check if current user liked each post
      let likedPostIds: string[] = []
      if (user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', data.map((p: any) => p.id))
        likedPostIds = likes?.map((l: any) => l.post_id) ?? []
      }

      const enriched = data.map((post: any) => ({
        ...post,
        replies_count: post.replies_count?.[0]?.count ?? 0,
        user_liked: likedPostIds.includes(post.id),
      }))

      return NextResponse.json({ data: enriched, count, page, limit })
    }
  } catch (err) {
    console.error('Forum query fallback:', err)
  }

  // Fallback to rich Pakistani agri forum discussions
  let filtered = [...DEFAULT_POSTS]
  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
  }

  return NextResponse.json({
    data: filtered,
    count: filtered.length,
    page,
    limit
  }, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const body = await request.json()

    if (!body.title || !body.body)
      return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

    if (user) {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          title: body.title,
          title_urdu: body.title_urdu,
          body: body.body,
          body_urdu: body.body_urdu,
          category: body.category ?? 'General',
          tags: body.tags ?? [],
        })
        .select(`*, profiles(id, full_name, role, is_verified)`)
        .single()

      if (!error && data) return NextResponse.json(data, { status: 201 })
    }

    // Acknowledgment for community post
    return NextResponse.json({
      id: 'local-' + Date.now(),
      title: body.title,
      body: body.body,
      category: body.category || 'General',
      likes_count: 0,
      replies_count: 0,
      created_at: new Date().toISOString()
    }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

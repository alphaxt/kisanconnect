import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const category = searchParams.get('category')
  const tab = searchParams.get('tab') ?? 'recent'
  const offset = (page - 1) * limit

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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Check if current user liked each post
  let likedPostIds: string[] = []
  if (user && data) {
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', data.map((p: any) => p.id))
    likedPostIds = likes?.map((l: any) => l.post_id) ?? []
  }

  const enriched = data?.map((post: any) => ({
    ...post,
    replies_count: post.replies_count?.[0]?.count ?? 0,
    user_liked: likedPostIds.includes(post.id),
  }))

  return NextResponse.json({ data: enriched, count, page, limit })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json()
  if (!body.title || !body.body)
    return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

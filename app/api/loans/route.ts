import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json()

  // Validate required fields
  const required = ['scheme_name', 'bank_name', 'amount', 'cnic', 'phone', 'full_name']
  for (const field of required) {
    if (!body[field]) return NextResponse.json({ error: `${field} is required` }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('loan_applications')
    .insert({
      user_id: user.id,
      scheme_name: body.scheme_name,
      bank_name: body.bank_name,
      amount: parseFloat(body.amount),
      purpose: body.purpose,
      land_acres: body.land_acres ? parseFloat(body.land_acres) : null,
      crop: body.crop,
      cnic: body.cnic,
      phone: body.phone,
      full_name: body.full_name,
      province: body.province,
      village: body.village,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notification
  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'loan_submitted',
    title: 'Loan Application Submitted',
    body: `Your application for ${body.scheme_name} (Rs. ${parseInt(body.amount).toLocaleString()}) has been received. We'll contact you within 24 hours.`,
  })

  return NextResponse.json({
    application_id: data.id,
    status: 'pending',
    message: 'Application submitted successfully. Our team will contact you within 24 hours.',
    reference: `KC-LOAN-${data.id.slice(0, 8).toUpperCase()}`,
  }, { status: 201 })
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('loan_applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

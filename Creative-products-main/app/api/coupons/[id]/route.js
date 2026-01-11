import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Get single coupon
export async function GET(request, { params }) {
  try {
    const { data, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, coupon: data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update coupon
export async function PUT(request, { params }) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('coupons')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, coupon: data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete coupon
export async function DELETE(request, { params }) {
  try {
    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

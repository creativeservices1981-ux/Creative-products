import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - Get all coupons (for admin) or active featured coupons (for public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'
    const featuredOnly = searchParams.get('featured') === 'true'

    let query = supabaseAdmin.from('coupons').select('*')

    if (!adminView) {
      // Public view - only active coupons that haven't expired
      query = query
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

      if (featuredOnly) {
        query = query.eq('is_featured', true)
      }
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      // Handle case when table doesn't exist yet
      if (error.code === 'PGRST205') {
        console.log('Coupons table not found - returning empty array')
        return NextResponse.json({ success: true, coupons: [] })
      }
      throw error
    }

    return NextResponse.json({ success: true, coupons: data || [] })
  } catch (error) {
    console.error('Get coupons error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new coupon (admin only)
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount = 0,
      max_uses = null,
      one_time_per_user = false,
      is_featured = false,
      is_active = true,
      expires_at = null,
    } = body

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if coupon code already exists
    const { data: existing } = await supabaseAdmin
      .from('coupons')
      .select('id')
      .eq('code', code.toUpperCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('coupons')
      .insert({
        code: code.toUpperCase(),
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_uses,
        one_time_per_user,
        is_featured,
        is_active,
        expires_at,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, coupon: data })
  } catch (error) {
    console.error('Create coupon error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

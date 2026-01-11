import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// POST - Validate coupon code
export async function POST(request) {
  try {
    const body = await request.json()
    const { code, userId, cartTotal } = body

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    // Get coupon by code
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (couponError || !coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 400 }
      )
    }

    // Check if coupon has expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This coupon has expired' },
        { status: 400 }
      )
    }

    // Check max uses limit
    if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
      return NextResponse.json(
        { success: false, error: 'This coupon has reached its usage limit' },
        { status: 400 }
      )
    }

    // Check one-time per user
    if (coupon.one_time_per_user && userId) {
      const { data: usage } = await supabaseAdmin
        .from('coupon_usages')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId)
        .single()

      if (usage) {
        return NextResponse.json(
          { success: false, error: 'You have already used this coupon' },
          { status: 400 }
        )
      }
    }

    // Check minimum order amount
    if (cartTotal && coupon.min_order_amount > 0 && cartTotal < coupon.min_order_amount) {
      return NextResponse.json(
        { success: false, error: `Minimum order amount is ₹${coupon.min_order_amount}` },
        { status: 400 }
      )
    }

    // Calculate discount
    let discount = 0
    if (cartTotal) {
      if (coupon.discount_type === 'percentage') {
        discount = (cartTotal * coupon.discount_value) / 100
      } else {
        discount = Math.min(coupon.discount_value, cartTotal)
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount,
      },
      discount: discount,
      message: coupon.discount_type === 'percentage' 
        ? `${coupon.discount_value}% off applied!`
        : `₹${coupon.discount_value} off applied!`,
    })
  } catch (error) {
    console.error('Validate coupon error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {
  try {
    const body = await request.json()
    const { amount, products, userId, guestEmail, guestName, couponId, couponDiscount } = body

    if (!amount || !products || products.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For guest checkout, we need either userId or guestEmail
    if (!userId && !guestEmail) {
      return NextResponse.json(
        { error: 'Either user login or guest email is required' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    })

    // Create orders in database for each product
    const orderPromises = products.map(async (productId) => {
      // Get product details
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError) throw productError

      // Generate order number
      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

      // Create order with guest info if no userId
      const orderData = {
        order_number: orderNumber,
        product_id: productId,
        amount: product.price,
        payment_mode: 'online',
        payment_status: 'pending',
        payment_id: razorpayOrder.id,
        coupon_id: couponId || null,
        coupon_discount: couponDiscount || 0,
      }

      // Add user_id or guest info
      if (userId) {
        orderData.user_id = userId
      } else {
        orderData.guest_email = guestEmail
        orderData.guest_name = guestName
      }

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) throw orderError

      return order
    })

    const orders = await Promise.all(orderPromises)

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: orders[0]?.id,
      orders: orders,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

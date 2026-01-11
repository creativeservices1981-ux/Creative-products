import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      )
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Get all orders with this payment_id
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('payment_id', razorpay_order_id)

    if (ordersError) throw ordersError

    // Update all orders to paid
    const updatePromises = orders.map(async (order) => {
      // Update order status
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_id: razorpay_payment_id,
        })
        .eq('id', order.id)

      if (updateError) throw updateError

      // Get product details for expiry/download limits
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', order.product_id)
        .single()

      if (productError) throw productError

      // Calculate expiry if set
      let expiresAt = null
      if (product.access_expiry_hours) {
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + product.access_expiry_hours)
        expiresAt = expiryDate.toISOString()
      }

      // Create delivery record
      const secureToken = uuidv4()
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const accessUrl = `${baseUrl}/access/${secureToken}`

      const { error: deliveryError } = await supabaseAdmin
        .from('deliveries')
        .insert({
          order_id: order.id,
          secure_token: secureToken,
          access_url: accessUrl,
          expires_at: expiresAt,
          download_limit: product.download_limit,
          download_count: 0,
          revoked: false,
        })

      if (deliveryError) throw deliveryError

      return { orderId: order.id, accessUrl }
    })

    const deliveries = await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: 'Payment verified and deliveries created',
      deliveries: deliveries,
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Health check
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || ''

  // Route the request based on path
  if (path === 'products') {
    return handleGetProducts(request)
  }

  return NextResponse.json({
    status: 'ok',
    message: 'DigiProStore API',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || ''

  if (path === 'products') {
    return handleCreateProduct(request)
  }

  if (path === 'orders') {
    return handleCreateOrder(request)
  }

  return NextResponse.json(
    { error: 'Route not found' },
    { status: 404 }
  )
}

// Get all products
async function handleGetProducts(request) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ products: data })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// Create product (admin only)
async function handleCreateProduct(request) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// Create order
async function handleCreateOrder(request) {
  try {
    const body = await request.json()

    // Generate order number
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    const orderData = {
      ...body,
      order_number: orderNumber
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ order: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

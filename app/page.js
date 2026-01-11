'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Loader2, Clock, Download, Heart, Ticket, Copy, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const { user, profile } = useAuth()
  const { addToFavorites, isInFavorites, removeFromFavorites } = useCart()
  const [products, setProducts] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, description, price, delivery_type, image_url, access_expiry_hours, download_limit')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFeaturedCoupons = useCallback(async () => {
    try {
      const response = await fetch('/api/coupons?featured=true')
      const data = await response.json()
      if (data.success) {
        setCoupons(data.coupons || [])
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchFeaturedCoupons()
  }, [fetchProducts, fetchFeaturedCoupons])

  const handleFavoriteClick = useCallback((e, product) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }, [isInFavorites, removeFromFavorites, addToFavorites])

  const copyCode = useCallback((code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('Coupon code copied!')
    setTimeout(() => setCopiedCode(null), 2000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
      <Header />

      {/* Hero Section with Gradient */}
      <section className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h2 className="text-5xl md:text-6xl font-black mb-4 text-gradient leading-tight">
          Premium Digital Products
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium">
          Discover and purchase high-quality digital assets 🚀 delivered instantly! ⚡
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="gradient-primary text-white font-bold hover:scale-105 transition-transform" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-purple-500 text-purple-700 font-bold hover:bg-purple-50" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Featured Coupons Banner */}
      {coupons.length > 0 && (
        <section className="container mx-auto px-4 pb-8">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Ticket className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">Special Offers 🎉</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3 border border-white/30"
                >
                  <div className="text-white">
                    <p className="text-sm font-medium">{coupon.description || 'Save now!'}</p>
                    <p className="text-lg font-black">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `₹${coupon.discount_value} OFF`}
                    </p>
                  </div>
                  <button
                    onClick={() => copyCode(coupon.code)}
                    className="bg-white text-purple-600 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-50 transition-colors"
                  >
                    <code>{coupon.code}</code>
                    {copiedCode === coupon.code ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            {coupons.some(c => c.min_order_amount > 0) && (
              <p className="text-center text-white/80 text-sm mt-3">
                * Minimum order value may apply
              </p>
            )}
          </div>
        </section>
      )}

      {/* Products Grid - Only 3 */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-800">Featured Products</h3>
          <Button variant="ghost" className="text-purple-600 font-semibold" asChild>
            <Link href="/products">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 animate-slide-up">
            <Package className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">No products available yet</h3>
            <p className="text-muted-foreground mb-4">Check back soon for amazing digital products!</p>
            {profile?.role === 'admin' && (
              <Button className="gradient-primary text-white" asChild>
                <Link href="/admin/products/new">Add Your First Product</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="flex flex-col hover-lift border-2 hover:border-purple-300 transition-all duration-300 relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => handleFavoriteClick(e, product)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      isInFavorites(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-400'
                    }`} 
                  />
                </button>

                <CardHeader>
                  {product.image_url && (
                    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-md relative">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  )}
                  <CardTitle className="text-xl font-bold text-gray-800">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        ₹{parseFloat(product.price).toFixed(2)}
                      </span>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        {product.delivery_type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    {product.access_expiry_hours && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {product.access_expiry_hours}h validity
                      </p>
                    )}
                    {product.download_limit && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {product.download_limit} downloads
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gradient-primary text-white font-bold hover:scale-105 transition-transform" asChild>
                    <Link href={`/products/${product.id}`}>
                      View Details →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* View All Products CTA */}
      {products.length > 0 && (
        <section className="container mx-auto px-4 pb-16 text-center">
          <Button size="lg" className="gradient-primary text-white font-bold hover:scale-105 transition-transform" asChild>
            <Link href="/products">
              View All Products <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </section>
      )}

      <Footer />
    </div>
  )
}

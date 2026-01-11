'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Package, ArrowLeft, Clock, Download, Loader2, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const { addToCart, addToFavorites, isInCart, isInFavorites } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .eq('status', 'active')
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleAddToFavorites = () => {
    if (isInFavorites(product.id)) {
      return
    }
    addToFavorites(product)
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return null
  }

  const inCart = isInCart(product.id)
  const inFavorites = isInFavorites(product.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              {product.image_url ? (
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                <Badge variant="secondary" className="mb-4">
                  {product.delivery_type.replace(/_/g, ' ')}
                </Badge>
                <p className="text-muted-foreground text-lg">
                  {product.description}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </span>
                </div>

                {product.access_expiry_hours && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Access valid for {product.access_expiry_hours} hours</span>
                  </div>
                )}

                {product.download_limit && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Download className="w-4 h-4" />
                    <span>{product.download_limit} downloads allowed</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                {inCart ? (
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/cart">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      View in Cart
                    </Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full gradient-primary text-white"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                )}

                <Button
                  size="lg"
                  variant={inFavorites ? "secondary" : "outline"}
                  className="w-full"
                  onClick={handleAddToFavorites}
                  disabled={inFavorites}
                >
                  <Heart className={`w-5 h-5 mr-2 ${inFavorites ? 'fill-current' : ''}`} />
                  {inFavorites ? 'In Favorites' : 'Add to Favorites'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout • Instant delivery after payment
                </p>
              </div>
            </div>
          </div>

          {/* Long Description Section */}
          {product.long_description && (
            <Card className="mt-12">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Product Details</h2>
                <div 
                  className="product-content prose prose-purple max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.long_description }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />

      {/* Scoped styles for product content */}
      <style jsx global>{`
        .product-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
        }
        .product-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 0.75rem;
          margin-top: 1.25rem;
        }
        .product-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #3d3d3d;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }
        .product-content p {
          color: #4a4a4a;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        .product-content ul, .product-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .product-content li {
          color: #4a4a4a;
          line-height: 1.75;
          margin-bottom: 0.5rem;
        }
        .product-content ul li {
          list-style-type: disc;
        }
        .product-content ol li {
          list-style-type: decimal;
        }
        .product-content a {
          color: #7c3aed;
          text-decoration: underline;
        }
        .product-content a:hover {
          color: #6d28d9;
        }
        .product-content strong {
          font-weight: 600;
        }
        .product-content em {
          font-style: italic;
        }
        .product-content u {
          text-decoration: underline;
        }
        .product-content s {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  )
}

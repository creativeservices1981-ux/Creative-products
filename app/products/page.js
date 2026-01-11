'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, Loader2, Clock, Download, Heart, Search } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductsPage() {
  const { profile } = useAuth()
  const { addToFavorites, isInFavorites, removeFromFavorites } = useCart()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }
      setFilteredProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteClick = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4">All Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete collection of premium digital products
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No products found' : 'No products available yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'Check back soon for amazing digital products!'}
            </p>
            {profile?.role === 'admin' && !searchQuery && (
              <Button className="gradient-primary text-white" asChild>
                <Link href="/admin/products/new">Add Your First Product</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-6">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="flex flex-col hover-lift border-2 hover:border-purple-300 transition-all duration-300 relative group"
                  style={{ animationDelay: `${index * 0.05}s` }}
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
                      <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-md">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">{product.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600 text-sm">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                          ₹{parseFloat(product.price).toFixed(2)}
                        </span>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                          {product.delivery_type.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      {product.access_expiry_hours && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {product.access_expiry_hours}h validity
                        </p>
                      )}
                      {product.download_limit && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
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
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { favorites, removeFromFavorites, addToCart, isInCart } = useCart()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Favorites</h1>

          {favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="w-16 h-16 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">Start adding products to your favorites!</p>
                <Button asChild>
                  <Link href="/">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader>
                    {product.image_url && (
                      <div className="w-full h-48 mb-4 rounded-md overflow-hidden bg-muted">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ₹{parseFloat(product.price).toFixed(2)}
                      </span>
                      <Badge variant="secondary">
                        {product.delivery_type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {isInCart(product.id) ? (
                      <Button className="flex-1" variant="outline" asChild>
                        <Link href="/cart">View in Cart</Link>
                      </Button>
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

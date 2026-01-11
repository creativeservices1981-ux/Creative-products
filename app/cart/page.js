'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, ShoppingBag, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const router = useRouter()
  const { loading: authLoading } = useAuth()
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gradient">Shopping Cart</h1>

          {cart.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ShoppingBag className="w-16 h-16 mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Add some products to get started!</p>
                <Button className="gradient-primary text-white" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {product.image_url && (
                          <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {product.description}
                          </p>
                          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            ₹{parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                      <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">₹0.00</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                          ₹{getCartTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full gradient-primary text-white font-bold" size="lg" asChild>
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={clearCart}>
                      Clear Cart
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/products">Continue Shopping</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

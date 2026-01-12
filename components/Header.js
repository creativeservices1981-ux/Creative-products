'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, LogIn, LogOut, LayoutDashboard, Loader2, Heart, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

export default function Header() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const { cartCount, favoritesCount } = useCart()
  const [purchaseCount, setPurchaseCount] = useState(0)

  // Fetch purchase count for logged-in users
  useEffect(() => {
    if (user) {
      fetchPurchaseCount()
    } else {
      setPurchaseCount(0)
    }
  }, [user])

  const fetchPurchaseCount = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('payment_status', 'paid')

      if (!error && data !== null) {
        setPurchaseCount(data)
      }
    } catch (error) {
      console.error('Error fetching purchase count:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    router.push('/')
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="https://customer-assets.emergentagent.com/job_dev-continuity-11/artifacts/g8txc6af_branding%20web%20digital%20store.png"
              alt="Creative Services"
              width={50}
              height={50}
              className="object-contain"
            />
          </Link>
          
          {/* Navigation Links - Center */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
          </nav>

          {/* User Actions - Right */}
          <div className="flex items-center gap-2">
            {/* Favorites - Always visible */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/favorites">
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart - Always visible */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <>
                {/* My Purchases with count */}
                <Button variant="ghost" size="sm" className="hidden lg:flex relative" asChild>
                  <Link href="/my-purchases">
                    <Package className="w-4 h-4 mr-2" />
                    My Purchases
                    {purchaseCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {purchaseCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* Admin Dashboard (only for admins) */}
                {profile?.role === 'admin' && (
                  <Button variant="default" size="sm" className="hidden lg:flex gradient-primary text-white" asChild>
                    <Link href="/admin/dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}

                {/* Sign Out */}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" className="gradient-primary text-white hidden sm:flex" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <nav className="md:hidden flex items-center gap-4 mt-3 pt-3 border-t overflow-x-auto">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
            Products
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
            About
          </Link>
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
            Services
          </Link>
          {user && (
            <Link href="/my-purchases" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
              Purchases
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

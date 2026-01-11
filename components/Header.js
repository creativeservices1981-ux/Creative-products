'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, LogIn, LogOut, LayoutDashboard, Loader2, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

export default function Header() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const { cartCount, favoritesCount } = useCart()

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
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
                {/* My Purchases */}
                <Button variant="ghost" size="sm" className="hidden lg:flex" asChild>
                  <Link href="/my-purchases">
                    My Purchases
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

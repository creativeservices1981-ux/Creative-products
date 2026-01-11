'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Loader2, Package, ShoppingCart, DollarSign, TrendingUp, LogOut, Ticket } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      toast.error('Admin access required')
      router.push('/')
      return
    }

    if (user && profile?.role === 'admin') {
      fetchStats()
    }
  }, [user, profile, authLoading])

  const fetchStats = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')

      const totalOrders = orders?.length || 0
      const pendingOrders = orders?.filter(o => o.payment_status === 'pending').length || 0
      const totalRevenue = orders
        ?.filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + parseFloat(o.amount), 0) || 0

      setStats({
        totalProducts: productsCount || 0,
        totalOrders,
        totalRevenue,
        pendingOrders
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Store
                </Link>
              </Button>
              <div className="h-8 w-px bg-border" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Active products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingOrders} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From paid orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Offline payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your digital product store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-auto py-6 flex-col" asChild>
                  <Link href="/admin/products">
                    <Package className="w-8 h-8 mb-2" />
                    <span className="text-lg">Manage Products</span>
                    <span className="text-sm text-muted-foreground">Create, edit, delete</span>
                  </Link>
                </Button>

                <Button className="h-auto py-6 flex-col" variant="secondary" asChild>
                  <Link href="/admin/orders">
                    <ShoppingCart className="w-8 h-8 mb-2" />
                    <span className="text-lg">Manage Orders</span>
                    <span className="text-sm text-muted-foreground">Approve & deliver</span>
                  </Link>
                </Button>

                <Button className="h-auto py-6 flex-col bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600" asChild>
                  <Link href="/admin/coupons">
                    <Ticket className="w-8 h-8 mb-2" />
                    <span className="text-lg">Manage Coupons</span>
                    <span className="text-sm text-white/80">Create discount codes</span>
                  </Link>
                </Button>

                <Button className="h-auto py-6 flex-col" variant="outline" asChild>
                  <Link href="/admin/products/new">
                    <Package className="w-8 h-8 mb-2" />
                    <span className="text-lg">Add New Product</span>
                    <span className="text-sm text-muted-foreground">Quick create</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

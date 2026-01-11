'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Loader2, Package, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function MyPurchasesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (*),
          deliveries (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load purchases')
    } finally {
      setLoading(false)
    }
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
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Purchases</h1>
            <p className="text-muted-foreground">View and access your digital products</p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="w-16 h-16 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                <p className="text-muted-foreground mb-6">Start exploring our digital products!</p>
                <Button asChild>
                  <Link href="/">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>All your purchases in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.order_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.products?.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.payment_mode === 'online' ? 'Online Payment' : 'Offline Payment'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>₹{parseFloat(order.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          {order.payment_status === 'paid' ? (
                            <Badge variant="default" className="bg-green-500">Paid</Badge>
                          ) : order.payment_status === 'pending' ? (
                            <Badge variant="secondary">Pending</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {order.payment_status === 'paid' && order.deliveries?.secure_token ? (
                            <Button size="sm" asChild>
                              <Link href={`/access/${order.deliveries.secure_token}`}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Access
                              </Link>
                            </Button>
                          ) : (
                            <Badge variant="outline">Awaiting Approval</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

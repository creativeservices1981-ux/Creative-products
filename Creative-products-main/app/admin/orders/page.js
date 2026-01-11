'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [approveDialog, setApproveDialog] = useState({ open: false, order: null })
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      toast.error('Admin access required')
      router.push('/')
      return
    }

    if (user && profile?.role === 'admin') {
      fetchOrders()
    }
  }, [user, profile, authLoading])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (*),
          user_profiles (name),
          deliveries (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setApproving(true)
    try {
      const order = approveDialog.order

      // Update order status to paid
      const { error: orderError } = await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', order.id)

      if (orderError) throw orderError

      // Create delivery record
      const secureToken = uuidv4()
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      const accessUrl = `${baseUrl}/access/${secureToken}`

      // Calculate expiry if set
      let expiresAt = null
      if (order.products?.access_expiry_hours) {
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + order.products.access_expiry_hours)
        expiresAt = expiryDate.toISOString()
      }

      const { error: deliveryError } = await supabase
        .from('deliveries')
        .insert({
          order_id: order.id,
          secure_token: secureToken,
          access_url: accessUrl,
          expires_at: expiresAt,
          download_limit: order.products?.download_limit,
          download_count: 0,
          revoked: false
        })

      if (deliveryError) throw deliveryError

      toast.success('Order approved and delivery created! (Email will be sent in Phase 2)')
      setApproveDialog({ open: false, order: null })
      fetchOrders()
    } catch (error) {
      console.error('Error approving order:', error)
      toast.error('Failed to approve order')
    } finally {
      setApproving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const pendingOrders = orders.filter(o => o.payment_status === 'pending')
  const completedOrders = orders.filter(o => o.payment_status === 'paid')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Order Management</h1>
            <p className="text-muted-foreground">Approve payments and manage deliveries</p>
          </div>

          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals ({pendingOrders.length})</CardTitle>
              <CardDescription>Orders waiting for offline payment verification</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No pending orders</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                        <TableCell>{order.user_profiles?.name || 'Unknown'}</TableCell>
                        <TableCell>{order.products?.title}</TableCell>
                        <TableCell>₹{parseFloat(order.amount).toFixed(2)}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => setApproveDialog({ open: true, order })}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Send
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Completed Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders ({completedOrders.length})</CardTitle>
              <CardDescription>Successfully delivered orders</CardDescription>
            </CardHeader>
            <CardContent>
              {completedOrders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No completed orders yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                        <TableCell>{order.user_profiles?.name || 'Unknown'}</TableCell>
                        <TableCell>{order.products?.title}</TableCell>
                        <TableCell>₹{parseFloat(order.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {order.payment_mode === 'online' ? 'Online' : 'Offline'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-500">
                            Delivered
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onOpenChange={(open) => setApproveDialog({ open, order: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment & Send Product</DialogTitle>
            <DialogDescription>
              Confirm that you've received offline payment for this order. The customer will receive secure access to the product.
            </DialogDescription>
          </DialogHeader>
          {approveDialog.order && (
            <div className="space-y-2 py-4">
              <p><strong>Order:</strong> {approveDialog.order.order_number}</p>
              <p><strong>Product:</strong> {approveDialog.order.products?.title}</p>
              <p><strong>Amount:</strong> ₹{parseFloat(approveDialog.order.amount).toFixed(2)}</p>
              <p><strong>Customer:</strong> {approveDialog.order.user_profiles?.name}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog({ open: false, order: null })}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approving}>
              {approving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Approve & Send Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2, Plus, Edit, Trash2, Ticket, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { format } from 'date-fns'

const initialFormState = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_amount: '',
  max_uses: '',
  one_time_per_user: false,
  is_featured: false,
  is_active: true,
  expires_at: '',
}

export default function AdminCouponsPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', coupon: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, coupon: null })
  const [formData, setFormData] = useState(initialFormState)
  const [submitting, setSubmitting] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      toast.error('Admin access required')
      router.push('/')
      return
    }

    if (user && profile?.role === 'admin') {
      fetchCoupons()
    }
  }, [user, profile, authLoading])

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons?admin=true')
      const data = await response.json()
      if (data.success) {
        setCoupons(data.coupons || [])
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setFormData(initialFormState)
    setFormDialog({ open: true, mode: 'create', coupon: null })
  }

  const openEditDialog = (coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_order_amount: coupon.min_order_amount?.toString() || '',
      max_uses: coupon.max_uses?.toString() || '',
      one_time_per_user: coupon.one_time_per_user,
      is_featured: coupon.is_featured,
      is_active: coupon.is_active,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
    })
    setFormDialog({ open: true, mode: 'edit', coupon })
  }

  const handleSubmit = async () => {
    if (!formData.code || !formData.discount_value) {
      toast.error('Please fill in required fields')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        code: formData.code,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        one_time_per_user: formData.one_time_per_user,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        expires_at: formData.expires_at || null,
      }

      const url = formDialog.mode === 'edit' 
        ? `/api/coupons/${formDialog.coupon.id}`
        : '/api/coupons'
      
      const method = formDialog.mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      toast.success(formDialog.mode === 'edit' ? 'Coupon updated!' : 'Coupon created!')
      setFormDialog({ open: false, mode: 'create', coupon: null })
      fetchCoupons()
    } catch (error) {
      toast.error(error.message || 'Failed to save coupon')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/coupons/${deleteDialog.coupon.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      toast.success('Coupon deleted')
      setDeleteDialog({ open: false, coupon: null })
      fetchCoupons()
    } catch (error) {
      toast.error(error.message || 'Failed to delete coupon')
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(code)
    toast.success('Coupon code copied!')
    setTimeout(() => setCopiedId(null), 2000)
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
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Ticket className="w-10 h-10 text-purple-500" />
              Coupon Management
            </h1>
            <p className="text-muted-foreground">Create and manage discount coupons</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Coupons</CardTitle>
              <CardDescription>{coupons.length} total coupons</CardDescription>
            </CardHeader>
            <CardContent>
              {coupons.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No coupons yet</p>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Coupon
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Limits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">
                              {coupon.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyCode(coupon.code)}
                            >
                              {copiedId === coupon.code ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          {coupon.description && (
                            <p className="text-xs text-muted-foreground mt-1">{coupon.description}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-green-600">
                            {coupon.discount_type === 'percentage'
                              ? `${coupon.discount_value}%`
                              : `₹${coupon.discount_value}`}
                          </span>
                          {coupon.min_order_amount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Min: ₹{coupon.min_order_amount}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {coupon.max_uses ? (
                            <span>{coupon.uses_count}/{coupon.max_uses}</span>
                          ) : (
                            <span>{coupon.uses_count}/∞</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {coupon.one_time_per_user && (
                              <Badge variant="outline" className="text-xs">1x/user</Badge>
                            )}
                            {coupon.is_featured && (
                              <Badge className="bg-yellow-500 text-xs">Featured</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                            {coupon.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {coupon.expires_at
                            ? format(new Date(coupon.expires_at), 'MMM dd, yyyy')
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(coupon)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteDialog({ open: true, coupon })}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
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

      {/* Create/Edit Dialog */}
      <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ ...formDialog, open })}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formDialog.mode === 'edit' ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
            <DialogDescription>
              {formDialog.mode === 'edit'
                ? 'Update the coupon details below'
                : 'Fill in the details to create a new coupon'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                placeholder="e.g., SAVE20"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={formDialog.mode === 'edit'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Get 20% off on your first purchase"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_value">Discount Value *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  placeholder={formData.discount_type === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_order_amount">Minimum Order Amount (₹)</Label>
              <Input
                id="min_order_amount"
                type="number"
                placeholder="e.g., 500 (leave empty for no minimum)"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_uses">Max Total Uses</Label>
              <Input
                id="max_uses"
                type="number"
                placeholder="e.g., 100 (leave empty for unlimited)"
                value={formData.max_uses}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>One-time per user</Label>
                  <p className="text-xs text-muted-foreground">Each user can only use this coupon once</p>
                </div>
                <Switch
                  checked={formData.one_time_per_user}
                  onCheckedChange={(checked) => setFormData({ ...formData, one_time_per_user: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured on Homepage</Label>
                  <p className="text-xs text-muted-foreground">Display this coupon publicly</p>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">Coupon can be used by customers</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormDialog({ open: false, mode: 'create', coupon: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {formDialog.mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete coupon "{deleteDialog.coupon?.code}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, coupon: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

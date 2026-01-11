'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Download, Loader2, Lock, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AccessProductPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [delivery, setDelivery] = useState(null)
  const [order, setOrder] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && params.token) {
      verifyAccess()
    }
  }, [params.token, authLoading])

  const verifyAccess = async () => {
    try {
      // Fetch delivery with token
      const { data: deliveryData, error: deliveryError } = await supabase
        .from('deliveries')
        .select(`
          *,
          orders (
            *,
            products (*),
            user_profiles (*)
          )
        `)
        .eq('secure_token', params.token)
        .single()

      if (deliveryError) throw new Error('Invalid access token')

      // Check if delivery exists
      if (!deliveryData) {
        throw new Error('Access not found')
      }

      // Check if revoked
      if (deliveryData.revoked) {
        throw new Error('Access has been revoked')
      }

      // Check if expired
      if (deliveryData.expires_at) {
        const expiryDate = new Date(deliveryData.expires_at)
        if (expiryDate < new Date()) {
          throw new Error('Access has expired')
        }
      }

      // Check if user matches (if user is logged in)
      if (user && deliveryData.orders?.user_id !== user.id) {
        throw new Error('This product belongs to another user')
      }

      // Check download limit
      if (deliveryData.download_limit && deliveryData.download_count >= deliveryData.download_limit) {
        throw new Error('Download limit reached')
      }

      setDelivery(deliveryData)
      setOrder(deliveryData.orders)
      setProduct(deliveryData.orders?.products)
    } catch (error) {
      console.error('Access verification error:', error)
      setError(error.message || 'Access denied')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Update download count and last accessed
      const { error: updateError } = await supabase
        .from('deliveries')
        .update({
          download_count: delivery.download_count + 1,
          last_accessed_at: new Date().toISOString()
        })
        .eq('id', delivery.id)

      if (updateError) throw updateError

      // If it's a file download, generate signed URL
      if (product.delivery_type === 'file_download' && product.storage_path) {
        const { data, error } = await supabase.storage
          .from('product-files')
          .createSignedUrl(product.storage_path, 300) // 5 minutes

        if (error) throw error

        // Open in new tab or download
        window.open(data.signedUrl, '_blank')
        toast.success('Download started!')
      } else if (product.delivery_type === 'google_drive_link' || product.delivery_type === 'external_url') {
        // Open external link
        window.open(product.storage_path, '_blank')
        toast.success('Opening product link!')
      }

      // Refresh delivery data
      verifyAccess()
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to access product')
    } finally {
      setDownloading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Verifying access...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <XCircle className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                If you believe this is an error, please contact support or check your purchase history.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/">Back to Store</Link>
            </Button>
            {user && (
              <Button variant="outline" asChild className="w-full">
                <Link href="/my-purchases">View My Purchases</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const remainingDownloads = delivery.download_limit 
    ? delivery.download_limit - delivery.download_count 
    : null

  const isExpired = delivery.expires_at && new Date(delivery.expires_at) < new Date()
  const downloadLimitReached = remainingDownloads !== null && remainingDownloads <= 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">Access Granted</CardTitle>
          <CardDescription className="text-center">
            Your digital product is ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Info */}
          <div className="border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{product?.title}</h3>
              <p className="text-muted-foreground">{product?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number</p>
                <p className="font-mono font-medium">{order?.order_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Purchase Date</p>
                <p className="font-medium">
                  {order?.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Access Information */}
          <div className="space-y-3">
            {delivery.expires_at && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Access expires:</strong> {format(new Date(delivery.expires_at), 'MMM dd, yyyy HH:mm')}
                </AlertDescription>
              </Alert>
            )}

            {delivery.download_limit && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Downloads Used</span>
                  <span className="font-medium">
                    {delivery.download_count} / {delivery.download_limit}
                  </span>
                </div>
                <Progress 
                  value={(delivery.download_count / delivery.download_limit) * 100} 
                  className="h-2"
                />
              </div>
            )}

            {!delivery.expires_at && !delivery.download_limit && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Lifetime access</strong> - No expiry or download limits
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Download Button */}
          <div className="space-y-3">
            {isExpired ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Your access has expired. Please contact support for assistance.
                </AlertDescription>
              </Alert>
            ) : downloadLimitReached ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Download limit reached. Please contact support if you need additional downloads.
                </AlertDescription>
              </Alert>
            ) : (
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    {product?.delivery_type === 'file_download' ? 'Download Product' : 'Access Product'}
                  </>
                )}
              </Button>
            )}

            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">Back to Store</Link>
              </Button>
              {user && (
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/my-purchases">My Purchases</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This is a secure, personalized access link. Do not share this URL with others.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/supabase/auth'
import { useCart } from '@/lib/cart-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Loader2, CreditCard, Banknote, ShieldCheck, Ticket, X, Check, Mail, User } from 'lucide-react'
import { toast } from 'sonner'
import Script from 'next/script'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const { cart, getCartTotal, clearCart } = useCart()
  const [paymentMode, setPaymentMode] = useState('online')
  const [processing, setProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  
  // Guest checkout fields
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  useEffect(() => {
    if (cart.length === 0 && !authLoading) {
      toast.info('Your cart is empty')
      router.push('/cart')
    }
  }, [cart, authLoading])

  const handleRazorpayLoad = () => {
    setRazorpayLoaded(true)
  }

  const subtotal = getCartTotal()
  const finalTotal = Math.max(0, subtotal - couponDiscount)

  const isGuest = !user
  const customerEmail = user?.email || guestEmail
  const customerName = profile?.name || guestName || customerEmail

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setValidatingCoupon(true)
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          userId: user?.id,
          cartTotal: subtotal,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setAppliedCoupon(data.coupon)
      setCouponDiscount(data.discount)
      toast.success(data.message)
    } catch (error) {
      toast.error(error.message || 'Invalid coupon code')
      setAppliedCoupon(null)
      setCouponDiscount(0)
    } finally {
      setValidatingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setCouponCode('')
    toast.info('Coupon removed')
  }

  const validateGuestInfo = () => {
    if (isGuest) {
      if (!guestEmail.trim()) {
        toast.error('Please enter your email address')
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        toast.error('Please enter a valid email address')
        return false
      }
      if (!guestName.trim()) {
        toast.error('Please enter your name')
        return false
      }
    }
    return true
  }

  const createOrder = async () => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          products: cart.map(p => p.id),
          userId: user?.id || null,
          guestEmail: isGuest ? guestEmail : null,
          guestName: isGuest ? guestName : null,
          couponId: appliedCoupon?.id,
          couponDiscount: couponDiscount,
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data
    } catch (error) {
      console.error('Create order error:', error)
      throw error
    }
  }

  const handleOnlinePayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading...')
      return
    }

    if (!validateGuestInfo()) return

    setProcessing(true)

    try {
      const orderData = await createOrder()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Creative Services',
        description: `Purchase of ${cart.length} digital product(s)`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: '#1e3a5f'
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
                couponId: appliedCoupon?.id,
                userId: user?.id,
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              clearCart()
              toast.success('Payment successful! Redirecting to your purchases... 🎉')
              // Always redirect to My Purchases for logged-in users
              setTimeout(() => {
                router.push('/my-purchases')
              }, 1500)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed. Contact support.')
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
            toast.info('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Failed to initiate payment')
      setProcessing(false)
    }
  }

  const handleOfflinePayment = async () => {
    if (!validateGuestInfo()) return

    setProcessing(true)

    try {
      await createOrder()
      toast.success('Order created! Redirecting to your purchases...')
      clearCart()
      setTimeout(() => {
        router.push('/my-purchases')
      }, 1500)
      
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error(error.message || 'Failed to create order')
    } finally {
      setProcessing(false)
    }
  }

  const handleCheckout = () => {
    if (paymentMode === 'online') {
      handleOnlinePayment()
    } else {
      handleOfflinePayment()
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleRazorpayLoad}
        onError={() => toast.error('Failed to load payment gateway')}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gradient">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Guest Info Section */}
                {isGuest && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-500" />
                        Your Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Full Name *</Label>
                        <Input
                          id="guestName"
                          placeholder="Enter your full name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestEmail">Email Address *</Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Your download link will be sent to this email
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          <strong>Want to track your orders?</strong>{' '}
                          <a href="/signup" className="underline">Create an account</a> or{' '}
                          <a href="/login" className="underline">login</a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Coupon Code Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-purple-500" />
                      Have a Coupon?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-bold text-green-700">{appliedCoupon.code}</p>
                            <p className="text-sm text-green-600">
                              {appliedCoupon.discount_type === 'percentage'
                                ? `${appliedCoupon.discount_value}% off`
                                : `₹${appliedCoupon.discount_value} off`}
                              {' '}- You save ₹{couponDiscount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="uppercase"
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                        />
                        <Button
                          onClick={applyCoupon}
                          disabled={validatingCoupon || !couponCode.trim()}
                          className="shrink-0"
                        >
                          {validatingCoupon ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
                      <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">Online Payment</p>
                              <p className="text-sm text-muted-foreground">Pay with Razorpay (UPI, Card, NetBanking)</p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                        <RadioGroupItem value="offline" id="offline" />
                        <Label htmlFor="offline" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                              <Banknote className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">Offline Payment</p>
                              <p className="text-sm text-muted-foreground">Pay via bank transfer (Admin approval required)</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items ({cart.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cart.map((product) => (
                      <div key={product.id} className="flex gap-3">
                        {product.image_url && (
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground">Digital Product</p>
                        </div>
                        <p className="font-bold text-purple-600">₹{parseFloat(product.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span className="flex items-center gap-1">
                            <Ticket className="w-3 h-3" />
                            Coupon ({appliedCoupon.code})
                          </span>
                          <span className="font-medium">-₹{couponDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">₹0.00</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        ₹{finalTotal.toFixed(2)}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-700 font-medium">
                          🎉 You're saving ₹{couponDiscount.toFixed(2)}!
                        </p>
                      </div>
                    )}

                    <Button 
                      className="w-full gradient-primary text-white font-bold hover:scale-105 transition-transform" 
                      size="lg"
                      onClick={handleCheckout}
                      disabled={processing || (paymentMode === 'online' && !razorpayLoaded)}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5 mr-2" />
                          {paymentMode === 'online' ? `Pay ₹${finalTotal.toFixed(2)}` : 'Place Order'}
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-center text-muted-foreground space-y-1">
                      <p className="flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Secure encrypted payment
                      </p>
                      <p>Instant delivery after payment</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}

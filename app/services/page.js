'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Shield, Zap, HeadphonesIcon, Download, Clock, FileText, Layers } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive digital product marketplace services designed for creators and customers alike.
          </p>
        </div>

        {/* Main Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Digital Product Marketplace</CardTitle>
                <CardDescription>
                  Browse and purchase from thousands of digital products including templates, tools, courses, and resources.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure Payment Processing</CardTitle>
                <CardDescription>
                  Multiple payment options including online payments through Razorpay and offline payment with admin approval.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Instant Delivery</CardTitle>
                <CardDescription>
                  Receive secure access links via email immediately after payment verification for instant product access.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Flexible Download Options</CardTitle>
                <CardDescription>
                  Download limits, access expiry, and re-download capabilities based on product specifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <HeadphonesIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>24/7 Customer Support</CardTitle>
                <CardDescription>
                  Round-the-clock assistance for any issues with purchases, downloads, or account management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Comprehensive admin dashboard for sellers to manage products, orders, and customer access.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* For Creators */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6">For Digital Creators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Sell Your Digital Products</h3>
                <p className="text-muted-foreground mb-4">
                  Turn your creativity into revenue. Upload and sell your digital products on our secure platform with complete control over pricing and access.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Easy product upload and management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Set your own prices and access rules</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Automated delivery and access control</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Real-time sales and revenue tracking</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Product Types We Support</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Files (PDF, ZIP, Excel, Video, Images)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Multiple file bundles and packages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Google Drive folders and links</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Private external URLs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Time-limited access resources</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/login">Start Selling Today</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* For Buyers */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6">For Buyers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Browse & Discover</h3>
                <p className="text-muted-foreground">
                  Explore our vast catalog of digital products across multiple categories. Filter by type, price, and ratings to find exactly what you need.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Secure Purchase</h3>
                <p className="text-muted-foreground">
                  Complete your purchase through our encrypted payment system. Choose from online payment or offline verification.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Instant Access</h3>
                <p className="text-muted-foreground">
                  Get immediate access to your products through secure, personalized links sent directly to your email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="mb-12 bg-gradient-to-r from-primary/10 to-blue-600/10">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Security & Protection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Token-Based Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Unique, secure tokens for each purchase ensure only authorized users can access products.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Encrypted Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    All payment information is processed through PCI-compliant gateways with end-to-end encryption.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Access Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Download limits, expiry times, and access revocation ensure complete control over product distribution.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your personal information is protected with industry-standard security measures and privacy policies.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of creators and customers on DigiProStore today
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30" asChild>
                <Link href="/">Browse Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

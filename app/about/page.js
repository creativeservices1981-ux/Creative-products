'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Shield, Zap, Users, Target, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            About DigiProStore
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted marketplace for premium digital products, connecting creators with customers worldwide.
          </p>
        </div>

        {/* Story Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                DigiProStore was founded in 2024 with a simple mission: to create a secure and efficient marketplace 
                where digital creators can sell their products and customers can access high-quality digital assets instantly.
              </p>
              <p>
                We recognized the challenges both creators and buyers face in the digital product space - from payment 
                security concerns to delivery reliability. Our platform was built from the ground up to solve these problems, 
                providing a seamless experience for everyone involved.
              </p>
              <p>
                Today, we serve thousands of customers worldwide, offering everything from social media templates and business 
                tools to educational resources and creative assets. Our commitment to security, quality, and customer satisfaction 
                remains at the core of everything we do.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Security First</h3>
                <p className="text-muted-foreground">
                  Advanced encryption and secure delivery systems ensure your products and data are always protected.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Delivery</h3>
                <p className="text-muted-foreground">
                  Get immediate access to your purchases through secure, token-based delivery links sent to your email.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Creator Support</h3>
                <p className="text-muted-foreground">
                  Empowering digital creators with tools to sell their products easily and reach a global audience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Quality Assured</h3>
                <p className="text-muted-foreground">
                  Every product is verified to ensure you receive high-quality digital assets worth your investment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
                <p className="text-muted-foreground">
                  24/7 support and transparent policies to ensure the best experience for our customers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Diverse Catalog</h3>
                <p className="text-muted-foreground">
                  Wide range of digital products from templates and tools to courses and resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To democratize access to premium digital products while providing creators with a reliable platform 
                to monetize their work. We aim to bridge the gap between digital creators and global customers through 
                secure, efficient, and user-friendly technology.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To become the world's most trusted digital product marketplace, known for security, quality, and innovation. 
                We envision a future where anyone can easily buy and sell digital products globally without barriers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-white/80">Products</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-white/80">Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-white/80">Creators</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-white/80">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6">Why Choose DigiProStore?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">For Buyers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Instant access to purchased products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Secure payment processing with Razorpay</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Token-based secure delivery system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Purchase history and re-download access</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">For Creators</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Easy product upload and management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Flexible pricing and access control</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Secure file storage and delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Comprehensive admin dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Automated order management</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

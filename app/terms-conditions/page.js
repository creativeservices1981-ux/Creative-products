'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using DigiProStore ("the Platform"), you agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, you must not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. User Accounts</h2>
              <p className="text-muted-foreground mb-2">
                To purchase products on our platform, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Digital Products</h2>
              <p className="text-muted-foreground mb-2">
                All digital products sold on this platform are:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Delivered electronically via secure download links</li>
                <li>Licensed for personal or commercial use as specified in product descriptions</li>
                <li>Subject to download limits and access expiry as stated at time of purchase</li>
                <li>Non-refundable once access has been granted (see Refund Policy)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on DigiProStore, including but not limited to text, graphics, logos, and software, is the property 
                of DigiProStore or its content suppliers. You may not reproduce, distribute, or create derivative works without 
                express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-2">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Share purchased products with unauthorized third parties</li>
                <li>Resell or redistribute digital products without proper licensing</li>
                <li>Attempt to bypass security measures or access restrictions</li>
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the platform's functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Payment Terms</h2>
              <p className="text-muted-foreground">
                All prices are in Indian Rupees (INR) unless otherwise stated. Payment can be made through online payment 
                gateways (Razorpay) or offline payment methods subject to admin approval. You agree to pay all charges 
                incurred by you or any users of your account at the prices in effect when such charges are incurred.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Access and Delivery</h2>
              <p className="text-muted-foreground">
                Upon successful payment and verification, you will receive a secure access link via email. This link is 
                personal to you and must not be shared. Access may be subject to time limits and download restrictions 
                as specified at the time of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                DigiProStore shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use or inability to use the platform or any products purchased. Our total liability to 
                you for any claim shall not exceed the amount you paid for the specific product.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                The platform and all products are provided "as is" without warranties of any kind, either express or implied. 
                We do not warrant that the platform will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Modifications to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
                to the platform. Your continued use of the platform after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any 
                disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">12. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: support@digiprostore.com<br />
                Website: https://digiloft.preview.emergentagent.com
              </p>
            </section>

            <div className="bg-muted p-4 rounded-lg mt-8">
              <p className="text-sm text-muted-foreground">
                By using DigiProStore, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms and Conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

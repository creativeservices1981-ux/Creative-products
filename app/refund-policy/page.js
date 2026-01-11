'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Refund Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please read this Refund Policy carefully before making a purchase. By completing a transaction, you acknowledge 
                that you have read and agree to this policy.
              </AlertDescription>
            </Alert>

            <section>
              <h2 className="text-xl font-bold mb-3">1. General Refund Policy</h2>
              <p className="text-muted-foreground">
                Due to the nature of digital products, <strong>all sales are final once access has been granted</strong>. 
                Digital products cannot be returned, exchanged, or refunded after the secure download link or access credentials 
                have been delivered and accessed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Exceptions to No-Refund Policy</h2>
              <p className="text-muted-foreground mb-2">
                Refunds may be considered in the following exceptional circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Duplicate Purchase:</strong> If you accidentally purchased the same product twice, contact us within 
                  24 hours for a refund of the duplicate transaction.
                </li>
                <li>
                  <strong>Technical Issues:</strong> If the product file is corrupted, incomplete, or significantly different 
                  from the description, and we cannot provide a working replacement within 7 days.
                </li>
                <li>
                  <strong>Non-Delivery:</strong> If you did not receive the secure access link within 24 hours of payment 
                  confirmation and our support team cannot resolve the issue.
                </li>
                <li>
                  <strong>Unauthorized Charges:</strong> If you can demonstrate that the purchase was made without your 
                  authorization, subject to verification.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Before Purchase - Preview & Information</h2>
              <p className="text-muted-foreground mb-2">
                To minimize refund requests, we provide:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Detailed product descriptions</li>
                <li>Clear delivery type information (file download, link, etc.)</li>
                <li>Access duration and download limit details</li>
                <li>Product previews or sample content where applicable</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>Please review all product information carefully before purchasing.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Refund Request Process</h2>
              <p className="text-muted-foreground mb-2">
                If you believe you qualify for a refund under the exceptions listed above:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Contact our support team at support@digiprostore.com within <strong>7 days</strong> of purchase</li>
                <li>Provide your order number and email address</li>
                <li>Clearly explain the reason for your refund request</li>
                <li>Include relevant evidence (screenshots, error messages, etc.)</li>
                <li>Allow up to 5-7 business days for review</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Refund Processing Time</h2>
              <p className="text-muted-foreground">
                If your refund request is approved:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li><strong>Online Payments (Razorpay):</strong> 5-10 business days to your original payment method</li>
                <li><strong>Offline Payments:</strong> 7-14 business days via bank transfer</li>
                <li>Refund processing fees (if any) will be deducted from the refund amount</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Chargebacks and Disputes</h2>
              <p className="text-muted-foreground">
                If you initiate a chargeback or payment dispute without first contacting us:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Your account may be suspended pending investigation</li>
                <li>Access to purchased products will be revoked</li>
                <li>You may be liable for chargeback fees and legal costs</li>
                <li>We reserve the right to pursue legal action for fraudulent chargebacks</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>Always contact us first</strong> before initiating a chargeback. We are committed to resolving issues fairly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Partial Refunds</h2>
              <p className="text-muted-foreground">
                In some cases, we may offer partial refunds:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>If you have accessed only a portion of bundled products</li>
                <li>If technical issues affected only part of the product</li>
                <li>As a goodwill gesture for minor inconveniences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Access Revocation</h2>
              <p className="text-muted-foreground">
                Upon refund approval:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Your secure access link will be immediately revoked</li>
                <li>Downloaded files must be deleted from your devices</li>
                <li>Any derived works or copies must be destroyed</li>
                <li>Continued use of the product after refund is strictly prohibited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Offline Payment Orders</h2>
              <p className="text-muted-foreground">
                For orders placed with offline payment mode:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>You can cancel before admin approval at no charge</li>
                <li>After approval and product delivery, standard refund policy applies</li>
                <li>Pending orders can be cancelled anytime via your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Promotional and Discounted Products</h2>
              <p className="text-muted-foreground">
                Products purchased during sales, promotions, or with discount codes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Are subject to the same refund policy</li>
                <li>Refunds (if approved) will be for the amount actually paid</li>
                <li>Discount codes cannot be refunded or reused</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Technical Support</h2>
              <p className="text-muted-foreground">
                Before requesting a refund for technical issues, we encourage you to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Contact our support team for assistance</li>
                <li>Try accessing from a different device or browser</li>
                <li>Check your internet connection and download settings</li>
                <li>Review our FAQ and troubleshooting guides</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Most issues can be resolved quickly with proper support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">12. Changes to Refund Policy</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting. 
                The policy applicable at the time of purchase governs that transaction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">13. Contact Information</h2>
              <p className="text-muted-foreground">
                For refund requests or questions about this policy:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: refunds@digiprostore.com<br />
                Support: support@digiprostore.com<br />
                Response Time: Within 24-48 hours<br />
                Website: https://digiloft.preview.emergentagent.com
              </p>
            </section>

            <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg mt-8">
              <p className="text-sm font-semibold mb-2">Important Reminder:</p>
              <p className="text-sm text-muted-foreground">
                Digital products are delivered instantly upon payment verification. By completing your purchase, you acknowledge 
                that you understand and agree to this Refund Policy, and you waive any right to a "cooling-off" period typically 
                applicable to distance contracts, as permitted by law for digital content.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

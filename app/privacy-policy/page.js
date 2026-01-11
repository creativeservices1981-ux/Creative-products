'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                At DigiProStore, we are committed to protecting your privacy and ensuring the security of your personal 
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mb-2 mt-4">Personal Information</h3>
              <p className="text-muted-foreground mb-2">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Name and email address (for account creation)</li>
                <li>Payment information (processed securely through payment gateways)</li>
                <li>Purchase history and transaction details</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 mt-4">Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Process your orders and deliver digital products</li>
                <li>Manage your account and provide customer support</li>
                <li>Send important updates about your purchases and account</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
                <li>Send promotional communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure authentication using Supabase Auth</li>
                <li>Row-level security on database access</li>
                <li>Secure payment processing through certified gateways</li>
                <li>Regular security audits and updates</li>
                <li>Limited employee access to personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Information Sharing</h2>
              <p className="text-muted-foreground mb-2">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Service Providers:</strong> Payment processors (Razorpay), email services (Resend), hosting providers (Supabase)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your experience. You can control cookie settings through 
                your browser preferences. Note that disabling cookies may affect platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
              <p className="text-muted-foreground mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
                unless a longer retention period is required by law. When you delete your account, we will delete or anonymize 
                your personal information within 30 days, except for data we must retain for legal compliance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Third-Party Links</h2>
              <p className="text-muted-foreground">
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of 
                these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information 
                from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. International Users</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your own. By using our platform, 
                you consent to such transfers. We ensure appropriate safeguards are in place to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">12. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically. We will notify you of significant changes by email or through 
                a notice on our platform. Your continued use after changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">13. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: privacy@digiprostore.com<br />
                Data Protection Officer: dpo@digiprostore.com<br />
                Website: https://digiloft.preview.emergentagent.com
              </p>
            </section>

            <div className="bg-muted p-4 rounded-lg mt-8">
              <p className="text-sm text-muted-foreground">
                By using DigiProStore, you acknowledge that you have read and understood this Privacy Policy and agree to 
                the collection and use of your information as described.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}

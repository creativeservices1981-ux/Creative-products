import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/supabase/auth'
import { CartProvider } from '@/lib/cart-context'
import { Toaster } from '@/components/ui/sonner'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DigiProStore - Digital Product Marketplace',
  description: 'Secure digital product sales and delivery platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

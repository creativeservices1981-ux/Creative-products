'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const phoneNumber = '919322360369' // +91 9322360369
  const message = encodeURIComponent('Hi! I have a question about DigiProStore 👋')
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group block"
      aria-label="Chat on WhatsApp"
    >
      <span className="relative block">
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></span>
        
        {/* Main button */}
        <span className="relative bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-green-500/50 flex items-center justify-center w-[56px] h-[56px]">
          <MessageCircle className="w-7 h-7" />
        </span>
        
        {/* Tooltip */}
        <span className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xl whitespace-nowrap block">
            Chat with us! 💬
            <span className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></span>
          </span>
        </span>
      </span>
    </a>
  )
}

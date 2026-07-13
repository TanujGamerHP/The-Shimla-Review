import type { Metadata } from 'next'
import { Cormorant_Garamond, Sora } from 'next/font/google'
import { AuthProvider } from "@/context/AuthContext"
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading'
})

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-body'
})

export const metadata: Metadata = {
  title: 'The Shimla Review - Sandeep Sharma',
  description: 'A premium digital publication platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#FAFAFA] text-[#111111] antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

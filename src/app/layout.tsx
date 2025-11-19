import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import ScrollToTop from "@/components/ScrollToTop"
import ClientProvider from './client-provider'
import ConditionalLayout from './conditional-layout'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UpToDate E-commerce',
  description: 'Premium fabric selection and tailoring services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <ConditionalLayout>{children}</ConditionalLayout>
            </TooltipProvider>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  )
}
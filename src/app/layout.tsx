import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PhysicsNavigation } from '@/components/PhysicsNavigation'
import { AccessibilityControls } from '@/components/AccessibilityControls'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Interactive 3D Physics Simulator',
  description: 'Explore fundamental physics concepts through immersive, interactive 3D simulations.',
  keywords: ['physics', 'simulator', '3D', 'education', 'interactive', 'science'],
  authors: [{ name: 'Physics Simulator Team' }],
  openGraph: {
    title: 'Interactive 3D Physics Simulator',
    description: 'Explore fundamental physics concepts through immersive, interactive 3D simulations.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PhysicsNavigation />
          <main className="min-h-screen">
            {children}
          </main>
          <AccessibilityControls />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

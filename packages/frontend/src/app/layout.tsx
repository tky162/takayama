import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import SidebarStatic from '@/components/ui/Sidebar.static'
import MobileSidebar from '@/components/ui/MobileSidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const runtime = 'edge'

export const metadata: Metadata = {
  title: '高山まさあきの夜遊び研究所',
  description: '風俗体験談、FANZA動画レビュー、VRコンテンツの徹底分析 - 実体験に基づく信頼できる情報をお届けします',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="min-h-screen"
            style={{ background: 'var(--background)' }}
          >
            {/* Mobile navigation drawer */}
            <MobileSidebar>
              <SidebarStatic />
            </MobileSidebar>

            <div className="max-w-7xl mx-auto px-0 sm:px-4 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4">
                <aside className="hidden lg:block lg:sticky lg:top-4 self-start">
                  <SidebarStatic />
                </aside>
                <main>{children}</main>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

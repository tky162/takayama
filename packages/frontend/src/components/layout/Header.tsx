'use client'

import Link from 'next/link'

export default function Header(): React.JSX.Element {
  const navigation = [
    { name: '風俗体験談', href: '/fuzoku' },
    { name: 'FANZA動画', href: '/fanza' },
    { name: '業界研究', href: '/research' },
    { name: '研究所について', href: '/about' },
    { name: 'お問い合わせ', href: '/contact' },
  ]

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        background: 'rgba(10, 10, 10, 0.95)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              }}
            >
              <span className="text-white font-bold text-sm">研</span>
            </div>
            <div className="hidden sm:block">
              <h1
                className="text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                高山まさあきの夜遊び研究所
              </h1>
            </div>
            <div className="sm:hidden">
              <h1
                className="text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                夜遊び研究所
              </h1>
            </div>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors duration-200 font-medium hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'

export default function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    研究分野: [
      { name: '風俗体験談', href: '/fuzoku' },
      { name: 'FANZA動画レビュー', href: '/fanza' },
      { name: '業界研究', href: '/research' },
    ],
    研究所情報: [
      { name: '研究所について', href: '/about' },
      { name: '研究方針', href: '/about/policy' },
      { name: '研究実績', href: '/about/achievements' },
    ],
    法的情報: [
      { name: '利用規約', href: '/terms' },
      { name: 'プライバシーポリシー', href: '/privacy' },
      { name: '免責事項', href: '/disclaimer' },
    ],
    サポート: [
      { name: 'お問い合わせ', href: '/contact' },
      { name: 'サイトマップ', href: '/sitemap' },
    ],
  }

  return (
    <footer
      style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* メインフッターコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--primary)' }}
              >
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-200 hover:opacity-80"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 重要な注意事項 */}
        <div
          className="pt-8 mb-8"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div
            className="rounded-lg p-4"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <h4
              className="font-semibold mb-2"
              style={{ color: 'var(--primary)' }}
            >
              重要な注意事項
            </h4>
            <ul
              className="text-sm space-y-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>• 本サイトは18歳未満の方の閲覧を禁止しています</li>
              <li>• 掲載内容は個人的な体験・感想に基づくものです</li>
              <li>• 風俗店舗の利用は自己責任で行ってください</li>
              <li>• 当サイトは適切な法的コンプライアンスを遵守しています</li>
            </ul>
          </div>
        </div>

        {/* 研究所情報 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              }}
            >
              <span className="text-white font-bold text-sm">研</span>
            </div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              高山まさあきの夜遊び研究所
            </h2>
          </div>
          <p
            className="max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            実体験に基づく客観的な分析と信頼できる情報提供を通じて、
            大人の夜遊び文化を研究しています。
          </p>
        </div>

        {/* アフィリエイト表示 */}
        <div className="text-center mb-8">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            ※ 当サイトは収益化のためアフィリエイトプログラムを利用しています
          </p>
        </div>

        {/* コピーライト */}
        <div
          className="pt-8 text-center"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {currentYear} 高山まさあきの夜遊び研究所. All rights reserved.
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            このサイトは学術的・教育的な目的で運営されています
          </p>
        </div>
      </div>
    </footer>
  )
}

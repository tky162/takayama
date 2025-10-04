import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { getLatestArticles, convertToArticle } from '@/lib/database/articles'
import { getCategoryStats } from '@/lib/database/categories'

interface SidebarProps {
  className?: string
}

export default async function SidebarServer({
  className = '',
}: SidebarProps): Promise<React.JSX.Element> {
  try {
    const [latestDbArticles, categories] = await Promise.all([
      getLatestArticles(5),
      getCategoryStats(),
    ])

    const recentPosts = latestDbArticles.map(convertToArticle)

    const archives = [
      { month: '2025年7月', count: 12 },
      { month: '2025年6月', count: 18 },
      { month: '2025年5月', count: 15 },
      { month: '2025年4月', count: 20 },
      { month: '2025年3月', count: 16 },
    ]

    return (
      <div className={`space-y-8 ${className}`}>
        {/* 検索ボックス */}
        <div className="content-card sticky top-4">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            研究内容を検索
          </h3>
          <form className="relative">
            <input
              type="text"
              placeholder="キーワードを入力..."
              className="w-full px-4 py-2 pr-10 rounded-lg transition-colors"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* カテゴリ */}
        <div className="content-card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            研究分野
          </h3>
          <div className="space-y-3">
            {categories.map(category => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex justify-between items-center p-2 rounded-lg hover:opacity-80 transition-colors"
                style={{ background: 'var(--surface)' }}
              >
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {category.name}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                  }}
                >
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 最新の研究報告 */}
        <div className="content-card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            最新の研究報告
          </h3>
          <div className="space-y-4">
            {recentPosts.map(post => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="block p-3 rounded-lg hover:opacity-80 transition-colors"
                style={{ background: 'var(--surface)' }}
              >
                <h4
                  className="text-sm font-medium mb-2 line-clamp-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {post.title}
                </h4>
                <div
                  className="flex items-center justify-between text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                    }}
                  >
                    {post.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* アーカイブ */}
        <div className="content-card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            研究アーカイブ
          </h3>
          <div className="space-y-2">
            {archives.map((archive, index) => (
              <Link
                key={index}
                href={`/archive/${archive.month.replace(/年|月/g, '-').replace(/-$/, '')}`}
                className="flex justify-between items-center p-2 rounded-lg hover:opacity-80 transition-colors"
                style={{ background: 'var(--surface)' }}
              >
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {archive.month}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ({archive.count})
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 研究所からのお知らせ */}
        <div className="content-card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            研究所からのお知らせ
          </h3>
          <div className="space-y-3">
            <div
              className="p-3 rounded-lg"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              <div className="flex items-center mb-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: '#22c55e' }}
                >
                  NEW
                </span>
                <span
                  className="text-xs ml-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  2025.07.15
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                新カテゴリ「VR体験」の研究を開始しました
              </p>
            </div>

            <div
              className="p-3 rounded-lg"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div className="flex items-center mb-2">
                <TagIcon className="h-3 w-3" style={{ color: '#3b82f6' }} />
                <span
                  className="text-xs ml-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  2025.07.10
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                サイトリニューアルが完了しました
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Sidebar データ取得エラー:', error)

    // フォールバック用の静的サイドバー
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="content-card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            データ読み込み中...
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            しばらくお待ちください
          </p>
        </div>
      </div>
    )
  }
}

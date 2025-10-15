import ArticlesPageClient from '@/components/pages/ArticlesPageClient'
import { getAllArticleMetadata, getCategories } from '@/lib/articles-server'
import Link from 'next/link'

export default async function ArticlesPage(): Promise<React.JSX.Element> {
  try {
    const [allArticles, categoryData] = await Promise.all([
      getAllArticleMetadata(),
      getCategories(),
    ])

    // カテゴリーデータを適切な形式に変換（業界研究とFANZA動画を除外）
    const allowedCategories = ['fuzoku', 'fanzavr']
    const formattedCategories = [
      { id: 'all', name: '全て', color: 'gray', count: allArticles.length },
      ...categoryData
        .filter(cat => allowedCategories.includes(cat.slug))
        .map(cat => ({
          id: cat.slug,
          name: cat.name,
          color: cat.slug === 'fuzoku' ? 'red' : 'blue',
          count: cat.count,
        })),
    ]

    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="container mx-auto px-4 py-8">
          {/* パンくずリスト */}
          <nav className="mb-8">
            <ol
              className="flex items-center space-x-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>
                <Link
                  href="/"
                  className="hover:opacity-80"
                  style={{ color: 'var(--primary)' }}
                >
                  ホーム
                </Link>
              </li>
              <li>/</li>
              <li style={{ color: 'var(--text-primary)' }}>記事一覧</li>
            </ol>
          </nav>

          <div className="space-y-8">
            <ArticlesPageClient
              initialArticles={allArticles}
              categories={formattedCategories}
              initialQuery=""
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('記事データ読み込みエラー:', error)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">記事一覧</h1>
          <p className="text-xl text-gray-600">データ読み込み中です...</p>
        </div>
      </div>
    )
  }
}

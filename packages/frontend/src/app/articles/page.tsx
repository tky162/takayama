import ArticlesPageClient from '@/components/pages/ArticlesPageClient'
import { getAllArticleMetadata, getCategories } from '@/lib/articles-server'
import SidebarStatic from '@/components/ui/Sidebar.static'
import MobileSidebar from '@/components/ui/MobileSidebar'
import Link from 'next/link'

export default async function ArticlesPage(): Promise<React.JSX.Element> {
  try {
    const [allArticles, categoryData] = await Promise.all([
      getAllArticleMetadata(),
      getCategories(),
    ])

    // カテゴリーデータを適切な形式に変換
    const formattedCategories = [
      { id: 'all', name: '全て', color: 'gray', count: allArticles.length },
      ...categoryData.map(cat => ({
        id: cat.slug,
        name: cat.name,
        color:
          cat.slug === 'fuzoku'
            ? 'red'
            : cat.slug === 'fanza'
              ? 'purple'
              : 'blue',
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

          {/* メイン2カラムレイアウト */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* メインコンテンツエリア（約70%幅） */}
            <div className="lg:col-span-3 space-y-8">
              <ArticlesPageClient
                initialArticles={allArticles}
                categories={formattedCategories}
                initialQuery=""
              />
            </div>

            {/* サイドバーエリア（約30%幅） */}
            <div className="lg:col-span-1 hidden lg:block">
              <SidebarStatic />
            </div>
            <div className="lg:hidden">
              <MobileSidebar>
                <SidebarStatic />
              </MobileSidebar>
            </div>
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

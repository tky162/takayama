'use client'

import { useState } from 'react'
import ArticleCard from '@/components/ui/ArticleCard'
import SearchBar from '@/components/ui/SearchBar'
import Pagination from '@/components/ui/Pagination'
import type { ArticleMetadata } from '@/lib/articles'

interface ArticlesPageClientProps {
  initialArticles: ArticleMetadata[]
  categories: Array<{ id: string; name: string; color: string; count: number }>
  initialQuery?: string
}

export default function ArticlesPageClient({
  initialArticles,
  categories,
  initialQuery = '',
}: ArticlesPageClientProps): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [currentPage, setCurrentPage] = useState(1)

  // 記事フィルタリング（業界研究とFANZA動画を除外）
  const filteredArticles = initialArticles.filter(article => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'fuzoku' && article.category === '風俗体験談') ||
      (selectedCategory === 'fanzavr' && article.category === 'FANZA_VRレビュー')

    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

    return matchesCategory && matchesSearch
  })

  const articlesPerPage = 6
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const displayedArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  )

  const handleCategoryChange = (categoryId: string): void => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダーセクション */}
        <div className="mb-8">
          {/* 検索ボックス */}
          <div className="max-w-2xl mb-6">
            <SearchBar
              placeholder="記事を検索..."
              onSearch={handleSearch}
              className="w-full"
              realtime={false}
            />
          </div>

          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            記事一覧
          </h1>
          <p
            className="text-xl mb-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            研究所の最新記事をお楽しみください
          </p>

          {/* 研究分野トグルボタン */}
          <div className="content-card">
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              研究分野
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background:
                      selectedCategory === category.id
                        ? 'var(--primary)'
                        : 'var(--surface-elevated)',
                    color:
                      selectedCategory === category.id
                        ? 'white'
                        : 'var(--text-primary)',
                    border:
                      selectedCategory === category.id
                        ? 'none'
                        : '1px solid var(--border)',
                  }}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="content-card mb-8">
          <div className="flex justify-between items-center">
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {filteredArticles.length} 件の記事が見つかりました
              {searchQuery && (
                <span className="ml-2" style={{ color: 'var(--primary)' }}>
                  「{searchQuery}」で検索
                </span>
              )}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {startIndex + 1} -{' '}
              {Math.min(startIndex + articlesPerPage, filteredArticles.length)}{' '}
              件目を表示
            </div>
          </div>
        </div>

        {/* 記事一覧 */}
        <div className="mb-8">
          {displayedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  publishedAt={article.publishedAt}
                  readTime={article.readTime}
                  viewCount={article.viewCount}
                  thumbnail={article.thumbnail}
                  href={`/article/${article.slug}`}
                  isPremium={article.isPremium}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                該当する記事が見つかりませんでした
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                検索条件を変更してもう一度お試しください
              </p>
            </div>
          )}
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

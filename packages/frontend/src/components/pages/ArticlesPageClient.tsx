'use client'

import { useState } from 'react'
import ArticleCard from '@/components/ui/ArticleCard'
import CategorySelector from '@/components/ui/CategorySelector'
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

  // 記事フィルタリング
  const filteredArticles = initialArticles.filter(article => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'fuzoku' && article.category === '風俗体験談') ||
      (selectedCategory === 'fanza' && article.category === 'FANZA動画') ||
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダーセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">記事一覧</h1>
          <p className="text-xl text-gray-600 mb-8">
            研究所の最新記事をお楽しみください
          </p>
        </div>

        {/* 検索・フィルターセクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="記事を検索..."
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
            <div className="lg:w-auto">
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredArticles.length} 件の記事が見つかりました
              {searchQuery && (
                <span className="ml-2 text-blue-600">
                  「{searchQuery}」で検索
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
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
              <p className="text-gray-500 text-lg">
                該当する記事が見つかりませんでした
              </p>
              <p className="text-gray-400 text-sm mt-2">
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

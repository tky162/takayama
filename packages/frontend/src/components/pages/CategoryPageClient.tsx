'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArticleCard from '@/components/ui/ArticleCard'
import SearchBar from '@/components/ui/SearchBar'
import Pagination from '@/components/ui/Pagination'
import type { ArticleMetadata } from '@/lib/articles'

interface CategoryInfo {
  slug: string
  name: string
  description: string
  color: string
  icon: string
}

interface CategoryPageClientProps {
  category: CategoryInfo
  initialArticles: ArticleMetadata[]
}

export default function CategoryPageClient({
  category,
  initialArticles,
}: CategoryPageClientProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredArticles = initialArticles.filter(article => {
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

    return matchesSearch
  })

  const articlesPerPage = 6
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const displayedArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  )

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
  }

  const getCategoryColorClasses = (color: string): string => {
    switch (color) {
      case 'red':
        return 'from-red-500 to-red-600 text-white'
      case 'purple':
        return 'from-purple-500 to-purple-600 text-white'
      case 'blue':
        return 'from-blue-500 to-blue-600 text-white'
      default:
        return 'from-gray-500 to-gray-600 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/articles" className="hover:text-blue-600">
                記事一覧
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>

        {/* カテゴリーヘッダー */}
        <div
          className={`bg-gradient-to-r ${getCategoryColorClasses(category.color)} rounded-lg p-8 mb-8`}
        >
          {/* 研究分野ヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{category.icon}</span>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <div className="text-sm opacity-80 mt-1">
                  研究分野 / Research Field
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2">
                <div className="text-sm opacity-80">研究報告数</div>
                <div className="text-2xl font-bold">
                  {filteredArticles.length}
                </div>
              </div>
            </div>
          </div>
          <p className="text-lg opacity-90 mb-6">{category.description}</p>
        </div>

        {/* 検索バー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SearchBar
            placeholder={`${category.name}の記事を検索...`}
            onSearch={handleSearch}
            className="w-full"
          />
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

        {/* 研究分野詳細情報 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-12">
          {/* 研究分野ヘッダー */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-bold">研</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.name} 研究分野について
                </h2>
                <p className="text-gray-600 text-sm">Research Field Overview</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs">📋</span>
                  </span>
                  研究手法
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {category.slug === 'fuzoku' && (
                    <>
                      <li>• 参与観察法による実体験調査</li>
                      <li>• 料金・サービス詳細分析</li>
                      <li>• 店舗環境・スタッフ評価</li>
                      <li>• 客観的データ収集・分析</li>
                    </>
                  )}
                  {category.slug === 'fanza' && (
                    <>
                      <li>• 作品内容の詳細分析</li>
                      <li>• 視聴者反応データ収集</li>
                      <li>• ジャンル別トレンド調査</li>
                      <li>• 女優パフォーマンス評価</li>
                    </>
                  )}
                  {category.slug === 'research' && (
                    <>
                      <li>• 市場データ統計分析</li>
                      <li>• 業界関係者インタビュー</li>
                      <li>• 技術動向追跡調査</li>
                      <li>• 将来予測モデル構築</li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">📊</span>
                  </span>
                  研究成果
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • 総研究報告: <strong>{filteredArticles.length}</strong> 件
                  </li>
                  <li>
                    • 累計閲覧数:{' '}
                    <strong>
                      {filteredArticles
                        .reduce((sum, article) => sum + article.viewCount, 0)
                        .toLocaleString()}
                    </strong>{' '}
                    回
                  </li>
                  <li>
                    • Premium研究:{' '}
                    <strong>
                      {
                        filteredArticles.filter(article => article.isPremium)
                          .length
                      }
                    </strong>{' '}
                    件
                  </li>
                  <li>
                    • 更新頻度: <strong>週2-3回</strong>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-purple-600 text-xs">🎯</span>
                  </span>
                  研究目標
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {category.slug === 'fuzoku' && (
                    <>
                      <li>• 利用者の安全性向上</li>
                      <li>• 店舗選択の判断材料提供</li>
                      <li>• 業界健全化への貢献</li>
                      <li>• 情報透明性の確保</li>
                    </>
                  )}
                  {category.slug === 'fanza' && (
                    <>
                      <li>• 作品選択の指針提供</li>
                      <li>• 業界トレンド分析</li>
                      <li>• 視聴体験向上支援</li>
                      <li>• 市場動向の理解促進</li>
                    </>
                  )}
                  {category.slug === 'research' && (
                    <>
                      <li>• 業界発展への寄与</li>
                      <li>• データ駆動型洞察提供</li>
                      <li>• 将来予測精度向上</li>
                      <li>• 学術的価値創造</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* 研究所からのメッセージ */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-2">
                  研究所からのメッセージ
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {category.slug === 'fuzoku' &&
                    '当研究所では、風俗業界の透明性向上と利用者の安全確保を目指し、実体験に基づく客観的な情報提供に努めています。すべての研究は法的・倫理的配慮のもと実施されています。'}
                  {category.slug === 'fanza' &&
                    'FANZA動画市場の分析を通じて、視聴者の皆様により良い作品選択の機会を提供したいと考えています。データに基づく客観的な評価で、充実した視聴体験をサポートします。'}
                  {category.slug === 'research' &&
                    '大人の夜遊び業界は急速に変化しており、その動向を科学的に分析することで業界の健全な発展に貢献したいと考えています。データドリブンなアプローチで価値ある洞察を提供します。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

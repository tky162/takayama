'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
  totalPages: number
}

export default function CategoryPageClient({
  category,
  initialArticles,
  totalPages,
}: CategoryPageClientProps): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const searchQuery = searchParams.get('q') || ''

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === '') {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(value))
      }
    }
    return newSearchParams.toString()
  }

  const handleSearch = (query: string): void => {
    router.push(`${pathname}?${createQueryString({ q: query, page: 1 })}`)
  }

  const handlePageChange = (page: number): void => {
    router.push(`${pathname}?${createQueryString({ page })}`)
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
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>
              <Link href="/" className="hover:opacity-80" style={{ color: 'var(--primary)' }}>
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/articles" className="hover:opacity-80" style={{ color: 'var(--primary)' }}>
                記事一覧
              </Link>
            </li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>{category.name}</li>
          </ol>
        </nav>

        <div
          className={`bg-gradient-to-r ${getCategoryColorClasses(category.color)} rounded-lg p-8 mb-8`}
        >
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
          </div>
          <p className="text-lg opacity-90 mb-6">{category.description}</p>
        </div>

        <div className="mb-8">
          <SearchBar
            placeholder={`${category.name}の記事を検索...`}
            onSearch={handleSearch}
            className="w-full"
            initialValue={searchQuery}
          />
        </div>

        <div className="mb-8">
          {initialArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialArticles.map(article => (
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

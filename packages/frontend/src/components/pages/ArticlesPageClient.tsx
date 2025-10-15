'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ArticleCard from '@/components/ui/ArticleCard'
import SearchBar from '@/components/ui/SearchBar'
import Pagination from '@/components/ui/Pagination'
import type { ArticleMetadata } from '@/lib/articles'

interface ArticlesPageClientProps {
  articles: ArticleMetadata[]
  totalPages: number
  categories: Array<{ id: string; slug: string; name: string; count: number }>
}

export default function ArticlesPageClient({
  articles,
  totalPages,
  categories,
}: ArticlesPageClientProps): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const selectedCategory = searchParams.get('category') || 'all'
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

  const handleCategoryChange = (categorySlug: string): void => {
    router.push(`${pathname}?${createQueryString({ category: categorySlug, page: 1 })}`)
  }

  const handleSearch = (query: string): void => {
    router.push(`${pathname}?${createQueryString({ q: query, page: 1 })}`)
  }

  const handlePageChange = (page: number): void => {
    router.push(`${pathname}?${createQueryString({ page })}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="max-w-2xl mb-6">
            <SearchBar
              placeholder="記事を検索..."
              onSearch={handleSearch}
              className="w-full"
              initialValue={searchQuery}
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
                  onClick={() => handleCategoryChange(category.slug)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background:
                      selectedCategory === category.slug
                        ? 'var(--primary)'
                        : 'var(--surface-elevated)',
                    color:
                      selectedCategory === category.slug
                        ? 'white'
                        : 'var(--text-primary)',
                    border:
                      selectedCategory === category.slug
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

        <div className="mb-8">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(article => (
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

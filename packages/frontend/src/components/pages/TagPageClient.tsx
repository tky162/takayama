'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ui/ArticleCard'
import SearchBar from '@/components/ui/SearchBar'
import Pagination from '@/components/ui/Pagination'
import type { ArticleMetadata } from '@/lib/articles'

interface TagInfo {
  slug: string
  name: string
  count: number
}

interface TagPageClientProps {
  tag: TagInfo
  initialArticles: ArticleMetadata[]
  totalPages: number
}

export default function TagPageClient({
  tag,
  initialArticles,
  totalPages,
}: TagPageClientProps): React.JSX.Element {
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
              <Link href="/tags" className="hover:opacity-80" style={{ color: 'var(--primary)' }}>
                タグ一覧
              </Link>
            </li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>{tag.name}</li>
          </ol>
        </nav>

        <div className="space-y-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            タグ: {tag.name}
          </h1>

          <div className="max-w-2xl">
            <SearchBar
                placeholder={`${tag.name}の関連記事を検索...`}
                onSearch={handleSearch}
                className="w-full"
                initialValue={searchQuery}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  )
}

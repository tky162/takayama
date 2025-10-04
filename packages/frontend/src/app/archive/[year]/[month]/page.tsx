import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ui/ArticleCard'
import {
  getArchivedArticlesData,
  getArticlesByYearAndMonth,
} from '@/lib/articles-server'

// type ArchivePageParams = {
//   year: string;
//   month: string;
// };

export async function generateStaticParams() {
  const archivedData = getArchivedArticlesData()
  const params: { year: string; month: string }[] = []

  Object.keys(archivedData).forEach(year => {
    Object.keys(archivedData[year]).forEach(month => {
      params.push({ year, month })
    })
  })

  return params
}

export default async function ArchiveMonthPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>
}): Promise<React.JSX.Element> {
  const { year, month } = await params
  const articles = getArticlesByYearAndMonth(year, month)

  if (articles.length === 0) {
    notFound()
  }

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
            <li>
              <Link
                href="/archive"
                className="hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                記事アーカイブ
              </Link>
            </li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>
              {year}年{parseInt(month)}月の記事
            </li>
          </ol>
        </nav>

        <div className="space-y-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {year}年{parseInt(month)}月の記事
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  )
}

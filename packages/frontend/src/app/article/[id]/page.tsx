import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { renderMarkdown } from '@/lib/markdown'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import TableOfContents from '@/components/TableOfContents'
import ViewTracker from '@/components/ViewTracker'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import type { ArticleMetadata } from '@/lib/articles'

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  params: { id: string }
}

async function getArticle(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788'
  try {
    const res = await fetch(`${apiUrl}/api/articles/${slug}`)
    if (!res.ok) {
      console.error(`Failed to fetch article: ${res.status} ${res.statusText}`)
      return null
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export default async function ArticlePage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { id } = params

  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  const { html: articleContentHtml, headings: tocHeadings } = renderMarkdown(
    article.content || ''
  )

  const heroImage =
    article.thumbnail ||
    'https://pub-64fb0bfdf1794163b59576eb362601e9.r2.dev/ogp.jpg'

  // TODO: Re-implement related articles with a new API endpoint
  const relatedArticles: ArticleMetadata[] = []

  const formatDate = (dateValue: number | string): string => {
    if (!dateValue) return ''
    // DB returns unix timestamp in seconds, convert to milliseconds
    const date = new Date(Number(dateValue) * 1000)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://takayama-api.masayuki-nakayama-8fa.workers.dev'

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <ViewTracker slug={id} apiUrl={apiUrl} />
      <ScrollToTopButton />
      <div className="container mx-auto px-0 sm:px-4 py-4">
        <nav className="mb-4 sm:mb-8 px-2 sm:px-0">
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
                href="/articles"
                className="hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                記事一覧
              </Link>
            </li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>{article.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 space-y-4">
            <article className="rounded-lg overflow-hidden content-card-elevated">
              <div
                className="px-2 py-4 sm:p-8"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <h1
                  className="text-3xl font-bold mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {article.title}
                </h1>

                {heroImage && (
                  <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={heroImage}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </div>
                )}
              </div>

              <div className="px-2 py-4 sm:p-8 space-y-4">
                {tocHeadings.length > 0 && (
                  <div className="content-card lg:hidden">
                    <TableOfContents headings={tocHeadings} />
                  </div>
                )}
                <MarkdownRenderer html={articleContentHtml} />
              </div>

              <div
                className="px-2 py-4 sm:p-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div
                  className="rounded-lg p-4 mb-6"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {article.excerpt}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg content-card">
                    <CalendarIcon
                      className="h-5 w-5 mx-auto mb-1"
                      style={{ color: 'var(--primary)' }}
                    />
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      研究日
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg content-card">
                    <div
                      className="h-5 w-5 mx-auto mb-1 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      }}
                    >
                      <span className="text-white text-xs">研</span>
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      研究員
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {article.author}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '1rem',
                  }}
                >
                  <div
                    className="text-sm mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    研究キーワード:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: any) => (
                      <Link
                        key={tag.slug}
                        href={`/tags/${tag.slug}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="px-2 py-4 sm:p-8"
                style={{
                  borderTop: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                <div className="content-card p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      }}
                    >
                      <span className="text-white text-sm font-bold">研</span>
                    </div>
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        高山まさあきの夜遊び研究所
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        実体験に基づく信頼できる情報をお届け
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4
                        className="font-medium mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        研究方針
                      </h4>
                      <ul
                        className="space-y-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <li>• 実体験重視</li>
                        <li>• 客観的分析</li>
                        <li>• 読者第一</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        className="font-medium mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        研究分野
                      </h4>
                      <ul
                        className="space-y-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <li>• 風俗体験談</li>
                        <li>• FANZA動画分析</li>
                        <li>• 業界トレンド</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        className="font-medium mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        研究実績
                      </h4>
                      <ul
                        className="space-y-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <li>• ライター歴8年</li>
                        <li>• 年間300本レビュー</li>
                        <li>• 全国取材実績</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/articles"
                    className="inline-flex items-center px-4 py-2 rounded-lg transition-colors text-center"
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                    }}
                  >
                    研究報告一覧
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 rounded-lg transition-colors text-center content-card"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    研究所トップ
                  </Link>
                </div>
              </div>
            </article>

            {relatedArticles.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  関連記事
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Related articles will be implemented later */}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-3">
            {tocHeadings.length > 0 && (
              <div className="content-card sticky top-4">
                <TableOfContents headings={tocHeadings} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

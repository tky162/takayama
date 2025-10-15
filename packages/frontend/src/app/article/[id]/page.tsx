import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline'
import {
  getAllArticleMetadata,
  getArticleBySlug,
  getRelatedArticles,
} from '@/lib/articles-server'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import TableOfContents from '@/components/TableOfContents'
import ViewTracker from '@/components/ViewTracker'

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const articles = getAllArticleMetadata()

  return articles.map((article) => ({
    id: article.slug,
  }))
}

export default async function ArticlePage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { id } = await params

  const dbArticle = await getArticleBySlug(id)

  if (!dbArticle) {
    notFound()
  }

  const article = dbArticle
  const tocHeadings = article.headings ?? []
  const heroImage =
    article.thumbnail ||
    'https://pub-64fb0bfdf1794163b59576eb362601e9.r2.dev/ogp.jpg'

  // 関連記事を取得
  const relatedDbArticles = await getRelatedArticles(dbArticle, 3)
  const relatedArticles = relatedDbArticles

  const getCategoryStyle = (category: string): React.CSSProperties => {
    switch (category) {
      case '風俗体験談':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }
      case 'FANZA動画':
      case 'FANZA動画レビュー':
        return {
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#8b5cf6',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }
      case 'FANZA_VRレビュー':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }
      default:
        return {
          background: 'rgba(115, 115, 115, 0.1)',
          color: '#737373',
          border: '1px solid rgba(115, 115, 115, 0.2)',
        }
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://takayama-api.masayuki-nakayama-8fa.workers.dev'

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <ViewTracker slug={id} apiUrl={apiUrl} />
      <div className="container mx-auto px-0 sm:px-4 py-4">
        {/* パンくずリスト */}
        <nav className="mb-4 sm:mb-8 px-4 sm:px-0">
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

        {/* メインコンテンツレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 space-y-4">
            {/* 記事メイン */}
            <article className="rounded-lg overflow-hidden content-card-elevated">
              {/* 記事ヘッダー */}
              <div
                className="p-4 sm:p-8"
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

              {/* 記事本文 */}
              <div className="p-4 sm:p-8 space-y-4">
                {tocHeadings.length > 0 && (
                  <div className="content-card lg:hidden">
                    <TableOfContents headings={tocHeadings} />
                  </div>
                )}
                <MarkdownRenderer html={article.content || ''} />
              </div>

              {/* 記事メタ情報 */}
              <div
                className="p-4 sm:p-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {/* 研究概要 */}
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

                {/* メタ情報 */}
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

                {/* 研究タグ */}
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
                    {article.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 記事フッター */}
              <div
                className="p-4 sm:p-8"
                style={{
                  borderTop: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                {/* 研究所フッター */}
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

            {/* 関連記事 */}
            {relatedArticles.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  関連記事
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {relatedArticles.map(relatedArticle => (
                    <Link
                      key={relatedArticle.id}
                      href={`/article/${relatedArticle.slug}`}
                      className="content-card hover:opacity-80 transition-opacity duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
                          style={getCategoryStyle(relatedArticle.category)}
                        >
                          {relatedArticle.category}
                        </span>
                        <h3
                          className="text-lg font-semibold mb-2 line-clamp-2"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {relatedArticle.title}
                        </h3>
                        <p
                          className="text-sm mb-3 line-clamp-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {relatedArticle.excerpt}
                        </p>
                        <div
                          className="flex items-center text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{formatDate(relatedArticle.publishedAt)}</span>
                          <span className="mx-2">•</span>
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span>{relatedArticle.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 目次エリア（右カラム） */}
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

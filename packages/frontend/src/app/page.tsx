import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/ui/ArticleCard'
import { getLatestArticles, getPopularArticles } from '@/lib/articles-server'

export default async function Home() {
  // 静的データを使用
  const latestArticles = await getLatestArticles(3)
  const popularArticles = await getPopularArticles(3)

  // 静的カテゴリ統計
  const categories = [
    { name: '風俗体験談', slug: 'fuzoku', count: 2 },
    { name: 'FANZA動画レビュー', slug: 'fanza', count: 2 },
    { name: 'FANZA_VRレビュー', slug: 'fanzavr', count: 1 },
  ]

  // 静的統計
  const stats = {
    totalArticles: 5,
    totalViews: 1250,
    averageRating: 4.2,
    totalCategories: 4,
  }

  return (
    <div className="flex flex-col">
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* ヒーロセクション */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              高山まさあきの夜遊び研究所
            </h1>
            <p
              className="text-xl mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              実体験に基づく信頼できる情報をお届けします
            </p>
          </div>

          <div className="space-y-12">
              {/* 最新の記事 */}
              {latestArticles.length > 0 && (
                <div className="content-card-elevated">
                  <div className="flex justify-between items-center mb-6">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      最新の記事
                    </h2>
                    <Link
                      href="/articles"
                      className="font-medium hover:underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      すべて見る →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {latestArticles.map((article, index) => (
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
                        priority={index === 0}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 研究分野紹介 */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Link href="/category/fuzoku" className="research-card">
                  <div className="research-badge fuzoku mb-4">風俗体験談</div>
                  <h3 className="research-heading text-lg">
                    店舗型風俗・デリヘル
                  </h3>
                  <p className="research-text mb-4">
                    実際の利用体験に基づいた詳細なレポートを提供します。
                  </p>
                  <div
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {categories.find(c => c.slug === 'fuzoku')?.count || 0}{' '}
                    件の研究報告
                  </div>
                </Link>

                <Link href="/category/fanza" className="research-card">
                  <div className="research-badge fanza mb-4">
                    FANZA動画レビュー
                  </div>
                  <h3 className="research-heading text-lg">動画作品分析</h3>
                  <p className="research-text mb-4">
                    新作動画の詳細レビューと評価を研究員が分析します。
                  </p>
                  <div
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {categories.find(c => c.slug === 'fanza')?.count || 0}{' '}
                    件の研究報告
                  </div>
                </Link>

                <Link href="/category/fanzavr" className="research-card">
                  <div className="research-badge research mb-4">
                    FANZA_VRレビュー
                  </div>
                  <h3 className="research-heading text-lg">VR作品分析</h3>
                  <p className="research-text mb-4">
                    FANZAのVR作品の詳細レビューと評価を研究員が分析します。
                  </p>
                  <div
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {categories.find(c => c.slug === 'fanzavr')?.count || 0}{' '}
                    件の研究報告
                  </div>
                </Link>
              </div>

              {/* 人気の研究報告 */}
              {popularArticles.length > 0 && (
                <div className="content-card-elevated">
                  <div className="flex justify-between items-center mb-6">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      人気の研究報告
                    </h2>
                    <Link
                      href="/articles"
                      className="font-medium hover:underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      すべて見る →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {popularArticles.map(article => (
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
              )}

              {/* 研究所について */}
              <div className="content-card-elevated">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  研究所について
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      研究方針
                    </h3>
                    <ul
                      className="space-y-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <li>• 実体験に基づく客観的な分析</li>
                      <li>• 読者に役立つ実用的な情報提供</li>
                      <li>• 業界の健全な発展への貢献</li>
                      <li>• 法的・倫理的配慮の徹底</li>
                    </ul>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      研究実績
                    </h3>
                    <ul
                      className="space-y-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <li>• 風俗ライター歴8年</li>
                      <li>• 年間300本以上の動画レビュー</li>
                      <li>• 全国主要都市での取材実績</li>
                      <li>• 業界関係者との信頼関係</li>
                    </ul>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      研究成果統計
                    </h3>
                    <ul
                      className="space-y-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <li>
                        • 総研究報告数: {stats.totalArticles.toLocaleString()}{' '}
                        件
                      </li>
                      <li>
                        • 総閲覧数: {stats.totalViews.toLocaleString()} 回
                      </li>
                      <li>• 活動分野: {stats.totalCategories} 分野</li>
                      <li>• 更新頻度: 週2-3回</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA セクション */}
              <div className="text-center">
                <div
                  className="rounded-lg p-8"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    color: 'white',
                  }}
                >
                  <h2 className="text-2xl font-bold mb-4">
                    研究成果を詳しく見る
                  </h2>
                  <p className="mb-6 opacity-90">
                    高山まさあきの8年間の研究成果をぜひご覧ください
                  </p>
                  <Link
                    href="/articles"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    記事一覧を見る
                  </Link>
                </div>
              </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

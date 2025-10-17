import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/ui/ArticleCard'

export const dynamic = 'force-dynamic';

async function fetchData(endpoint: string, options: RequestInit = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}${endpoint}`, options);
    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}:`, res.status, res.statusText);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export default async function Home() {
  const [latestArticlesData, popularArticlesData, categories, stats] = await Promise.all([
    fetchData('/api/articles?pageSize=3', { next: { revalidate: 60 } }),
    fetchData('/api/articles?sortBy=popular&pageSize=3', { next: { revalidate: 300 } }),
    fetchData('/api/categories', { next: { revalidate: 3600 } }),
    fetchData('/api/stats', { next: { revalidate: 3600 } })
  ]);

  const latestArticles = latestArticlesData?.articles || [];
  const popularArticles = popularArticlesData?.articles || [];

  return (
    <div className="flex flex-col">
      <main>
        <div className="container mx-auto px-4 py-8">
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
                  {latestArticles.map((article: any, index: number) => (
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

            {categories && categories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Link href="/category/fuzoku" className="research-card">
                  <div className="research-badge fuzoku mb-4">風俗体験談</div>
                  <h3 className="research-heading text-lg">店舗型風俗・デリヘル</h3>
                  <p className="research-text mb-4">実際の利用体験に基づいた詳細なレポートを提供します。</p>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {categories.find((c: any) => c.slug === 'fuzoku')?.count || 0} 件の研究報告
                  </div>
                </Link>
                <Link href="/category/fanza" className="research-card">
                  <div className="research-badge fanza mb-4">FANZA動画レビュー</div>
                  <h3 className="research-heading text-lg">動画作品分析</h3>
                  <p className="research-text mb-4">新作動画の詳細レビューと評価を研究員が分析します。</p>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {categories.find((c: any) => c.slug === 'fanza')?.count || 0} 件の研究報告
                  </div>
                </Link>
                <Link href="/category/fanzavr" className="research-card">
                  <div className="research-badge research mb-4">FANZA_VRレビュー</div>
                  <h3 className="research-heading text-lg">VR作品分析</h3>
                  <p className="research-text mb-4">FANZAのVR作品の詳細レビューと評価を研究員が分析します。</p>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {categories.find((c: any) => c.slug === 'fanzavr')?.count || 0} 件の研究報告
                  </div>
                </Link>
              </div>
            )}

            {popularArticles.length > 0 && (
              <div className="content-card-elevated">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>人気の研究報告</h2>
                  <Link href="/articles" className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>すべて見る →</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {popularArticles.map((article: any) => (
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

            {stats && (
              <div className="content-card-elevated">
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>研究所について</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>研究方針</h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                      <li>• 実体験に基づく客観的な分析</li>
                      <li>• 読者に役立つ実用的な情報提供</li>
                      <li>• 業界の健全な発展への貢献</li>
                      <li>• 法的・倫理的配慮の徹底</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>研究実績</h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                      <li>• 風俗ライター歴8年</li>
                      <li>• 年間300本以上の動画レビュー</li>
                      <li>• 全国主要都市での取材実績</li>
                      <li>• 業界関係者との信頼関係</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>研究成果統計</h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                      <li>• 総研究報告数: {stats.totalArticles.toLocaleString()} 件</li>
                      <li>• 総閲覧数: {stats.totalViews.toLocaleString()} 回</li>
                      <li>• 活動分野: {stats.totalCategories} 分野</li>
                      <li>• 更新頻度: 週2-3回</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="rounded-lg p-8" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: 'white' }}>
                <h2 className="text-2xl font-bold mb-4">研究成果を詳しく見る</h2>
                <p className="mb-6 opacity-90">高山まさあきの8年間の研究成果をぜひご覧ください</p>
                <Link
                  href="/articles"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{ background: 'var(--surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }}
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

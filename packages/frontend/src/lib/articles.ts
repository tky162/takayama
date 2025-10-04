// 型定義のみ（クライアントサイドでも使用可能）
export interface ArticleHeading {
  id: string
  text: string
  level: number
}

export interface Article {
  id: string
  title: string
  excerpt: string
  content?: string
  category: string
  publishedAt: string
  readTime: string
  viewCount: number
  thumbnail?: string
  isPremium: boolean
  tags: string[]
  author: string
  slug: string
  rating?: number
  headings?: ArticleHeading[]
}

export interface ArticleMetadata {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  viewCount: number
  thumbnail?: string
  isPremium: boolean
  tags: string[]
  author: string
  slug: string
}

// サーバーサイド関数をダイナミックインポートで使用
let serverFunctions: typeof import('./articles-server') | null = null

const getServerFunctions = async () => {
  if (!serverFunctions && typeof window === 'undefined') {
    serverFunctions = await import('./articles-server')
  }
  return serverFunctions
}

/**
 * 記事のメタデータを取得（サーバーサイドのみ）
 */
export async function getArticleMetadata(
  slug: string
): Promise<ArticleMetadata | null> {
  const server = await getServerFunctions()
  return server?.getArticleMetadata(slug) || null
}

/**
 * 記事の詳細情報を取得（サーバーサイドのみ）
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const server = await getServerFunctions()
  return server?.getArticleBySlug(slug) || null
}

/**
 * 全記事のメタデータを取得（サーバーサイドのみ）
 */
export async function getAllArticleMetadata(): Promise<ArticleMetadata[]> {
  const server = await getServerFunctions()
  return server?.getAllArticleMetadata() || []
}

/**
 * カテゴリー別の記事メタデータを取得
 */
export async function getArticlesByCategory(
  category: string
): Promise<ArticleMetadata[]> {
  const server = await getServerFunctions()
  return server?.getArticlesByCategory(category) || []
}

/**
 * 記事を検索
 */
export async function searchArticles(
  query: string
): Promise<ArticleMetadata[]> {
  const server = await getServerFunctions()
  return server?.searchArticles(query) || []
}

/**
 * 関連記事を取得
 */
export async function getRelatedArticles(
  article: ArticleMetadata,
  limit: number = 3
): Promise<ArticleMetadata[]> {
  const server = await getServerFunctions()
  return server?.getRelatedArticles(article, limit) || []
}

/**
 * 記事の統計情報を取得
 */
export async function getArticleStats(): Promise<{
  totalArticles: number
  articlesByCategory: Record<string, number>
  totalViews: number
}> {
  const server = await getServerFunctions()
  return (
    server?.getArticleStats() || {
      totalArticles: 0,
      articlesByCategory: {},
      totalViews: 0,
    }
  )
}

/**
 * 記事の存在確認
 */
export async function articleExists(slug: string): Promise<boolean> {
  const server = await getServerFunctions()
  return server?.articleExists(slug) || false
}

/**
 * 最新記事を取得
 */
export async function getLatestArticles(
  limit: number = 5
): Promise<ArticleMetadata[]> {
  const server = await getServerFunctions()
  return server?.getLatestArticles(limit) || []
}

/**
 * 人気記事を取得（閲覧数順）
 */
export async function getPopularArticles(
  limit: number = 5
): Promise<ArticleMetadata[]> {
  const server = await getServerFunctions()
  return server?.getPopularArticles(limit) || []
}

/**
 * プレミアム記事を取得
 */
export async function getPremiumArticles(): Promise<ArticleMetadata[]> {
  const server = await getServerFunctions()
  return server?.getPremiumArticles() || []
}

/**
 * カテゴリー一覧を取得
 */
export async function getCategories(): Promise<
  Array<{
    name: string
    slug: string
    count: number
  }>
> {
  const server = await getServerFunctions()
  return server?.getCategories() || []
}

import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/lib/articles'
import { marked } from 'marked'

export interface DatabaseArticle {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  category_id?: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string
  meta_title?: string
  meta_description?: string
  og_image_url?: string
  view_count: number
  like_count: number
  share_count: number
  article_type: 'fuzoku' | 'fanza' | 'research'
  rating?: number
  research_method?: string
  research_period?: string
  research_budget?: number
  categories?: {
    name: string
    slug: string
    article_type: string
    color: string
  }
}

export interface ArticleInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  category_id?: string
  tags: string[]
  status?: 'draft' | 'published' | 'archived'
  published_at?: string
  meta_title?: string
  meta_description?: string
  og_image_url?: string
  article_type: 'fuzoku' | 'fanza' | 'research'
  rating?: number
  research_method?: string
  research_period?: string
  research_budget?: number
}

/**
 * 記事を作成
 */
export async function createArticle(
  input: ArticleInput
): Promise<DatabaseArticle> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...input,
      published_at:
        input.status === 'published'
          ? input.published_at || new Date().toISOString()
          : null,
    })
    .select(
      `
      *,
      categories (
        name,
        slug,
        article_type,
        color
      )
    `
    )
    .single()

  if (error) {
    throw new Error(`記事作成エラー: ${error.message}`)
  }

  return data
}

/**
 * 記事を更新
 */
export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>
): Promise<DatabaseArticle> {
  const supabase = await createClient()

  const updateData = {
    ...input,
    updated_at: new Date().toISOString(),
  }

  // published_atの処理
  if (input.status === 'published' && !input.published_at) {
    updateData.published_at = new Date().toISOString()
  } else if (input.status === 'draft') {
    updateData.published_at = undefined
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select(
      `
      *,
      categories (
        name,
        slug,
        article_type,
        color
      )
    `
    )
    .single()

  if (error) {
    throw new Error(`記事更新エラー: ${error.message}`)
  }

  return data
}

/**
 * 記事を削除
 */
export async function deleteArticle(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) {
    throw new Error(`記事削除エラー: ${error.message}`)
  }
}

/**
 * IDで記事を取得
 */
export async function getArticleById(
  id: string
): Promise<DatabaseArticle | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      categories (
        name,
        slug,
        article_type,
        color
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`記事取得エラー: ${error.message}`)
  }

  return data
}

/**
 * スラッグで記事を取得
 */
export async function getArticleBySlug(
  slug: string
): Promise<DatabaseArticle | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      categories (
        name,
        slug,
        article_type,
        color
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`記事取得エラー: ${error.message}`)
  }

  return data
}

/**
 * 記事一覧を取得
 */
export async function getArticles(
  options: {
    limit?: number
    offset?: number
    category?: string
    article_type?: string
    status?: string
    search?: string
    sort?: 'created_at' | 'published_at' | 'view_count' | 'rating'
    order?: 'asc' | 'desc'
  } = {}
): Promise<{ data: DatabaseArticle[]; count: number }> {
  console.log('getArticles called with options:', options)

  let supabase
  try {
    supabase = await createClient()
    console.log('Supabase client created successfully')
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }

  let query = supabase.from('articles').select(
    `
      *,
      categories (
        name,
        slug,
        article_type,
        color
      )
    `,
    { count: 'exact' }
  )

  // フィルター条件
  if (options.status) {
    query = query.eq('status', options.status)
  } else {
    query = query.eq('status', 'published')
  }

  if (options.category) {
    query = query.eq('categories.slug', options.category)
  }

  if (options.article_type) {
    query = query.eq('article_type', options.article_type)
  }

  if (options.search) {
    query = query.textSearch('title', options.search)
  }

  // ソート
  const sort = options.sort || 'published_at'
  const order = options.order || 'desc'
  query = query.order(sort, { ascending: order === 'asc' })

  // ページネーション
  if (options.limit) {
    query = query.limit(options.limit)
  }
  if (options.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    )
  }

  console.log('Executing query...')
  const { data, error, count } = await query
  console.log('Query result:', { data: data?.length, error, count })

  if (error) {
    console.error('Database query error:', error)
    // テーブルが存在しない場合は空のデータを返す
    if (
      error.message?.includes('relation') &&
      error.message?.includes('does not exist')
    ) {
      console.warn('Database tables do not exist yet. Returning empty data.')
      return { data: [], count: 0 }
    }
    throw new Error(`記事一覧取得エラー: ${error.message}`)
  }

  return { data: data || [], count: count || 0 }
}

/**
 * 最新記事を取得
 */
export async function getLatestArticles(
  limit: number = 5
): Promise<DatabaseArticle[]> {
  const { data } = await getArticles({
    limit,
    sort: 'published_at',
    order: 'desc',
  })

  return data
}

/**
 * 人気記事を取得
 */
export async function getPopularArticles(
  limit: number = 5
): Promise<DatabaseArticle[]> {
  const { data } = await getArticles({
    limit,
    sort: 'view_count',
    order: 'desc',
  })

  return data
}

/**
 * 関連記事を取得
 */
export async function getRelatedArticles(
  article: DatabaseArticle,
  limit: number = 3
): Promise<DatabaseArticle[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      categories (
        name,
        slug,
        article_type,
        color
      )
    `
    )
    .eq('status', 'published')
    .eq('article_type', article.article_type)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('関連記事取得エラー:', error)
    return []
  }

  return data || []
}

/**
 * 記事の閲覧数を増加
 */
export async function incrementViewCount(articleId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('increment_view_count', {
    article_id: articleId,
  })

  if (error) {
    console.error('閲覧数増加エラー:', error)
  }
}

/**
 * 記事統計を取得
 */
export async function getArticleStats(): Promise<{
  totalArticles: number
  totalViews: number
  averageRating: number
  totalCategories: number
}> {
  try {
    const supabase = await createClient()

    const [articlesResult, viewsResult, ratingResult, categoriesResult] =
      await Promise.all([
        supabase
          .from('articles')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published'),
        supabase
          .from('articles')
          .select('view_count')
          .eq('status', 'published'),
        supabase
          .from('articles')
          .select('rating')
          .eq('status', 'published')
          .not('rating', 'is', null),
        supabase
          .from('categories')
          .select('id', { count: 'exact', head: true }),
      ])

    const totalArticles = articlesResult.count || 0
    const totalViews =
      viewsResult.data?.reduce(
        (sum, article) => sum + (article.view_count || 0),
        0
      ) || 0
    const averageRating = ratingResult.data?.length
      ? ratingResult.data.reduce(
          (sum, article) => sum + (article.rating || 0),
          0
        ) / ratingResult.data.length
      : 0
    const totalCategories = categoriesResult.count || 0

    return {
      totalArticles,
      totalViews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalCategories,
    }
  } catch (error) {
    console.error('Failed to get article stats:', error)
    // データベースエラーの場合はデフォルト値を返す
    return {
      totalArticles: 0,
      totalViews: 0,
      averageRating: 0,
      totalCategories: 0,
    }
  }
}

/**
 * DatabaseArticleをArticle形式に変換
 */
export function convertToArticle(dbArticle: DatabaseArticle): Article {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    slug: dbArticle.slug,
    content: marked.parse(dbArticle.content) as string,
    excerpt: dbArticle.excerpt || '',
    category: dbArticle.categories?.name || 'その他',
    tags: dbArticle.tags,
    publishedAt: dbArticle.published_at || dbArticle.created_at,
    readTime: calculateReadTime(dbArticle.content),
    viewCount: dbArticle.view_count,
    author: '高山まさあき',
    thumbnail: dbArticle.og_image_url || '',
    isPremium: false, // 後で実装
    rating: dbArticle.rating,
  }
}

/**
 * 読了時間を計算
 */
function calculateReadTime(content: string): string {
  const wordsPerMinute = 500 // 日本語の平均読書速度
  const wordCount = content.length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes}分`
}

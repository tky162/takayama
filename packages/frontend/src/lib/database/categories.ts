import { createClient } from '@/lib/supabase/server'

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  sort_order: number
  article_type: 'fuzoku' | 'fanza' | 'research'
  color: string
  icon?: string
  created_at: string
  article_count?: number
}

/**
 * 全カテゴリを取得（記事数付き）
 */
export async function getCategories(): Promise<DatabaseCategory[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('categories')
      .select(
        `
        *,
        article_count:articles(count)
      `
      )
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('カテゴリ取得エラー:', error)
      // テーブルが存在しない場合はデフォルトカテゴリを返す
      if (
        error.message?.includes('relation') &&
        error.message?.includes('does not exist')
      ) {
        console.warn(
          'Categories table does not exist yet. Returning default categories.'
        )
        return [
          {
            id: '1',
            name: '風俗体験談',
            slug: 'fuzoku',
            sort_order: 1,
            article_type: 'fuzoku' as const,
            color: '#EF4444',
            created_at: new Date().toISOString(),
            article_count: 0,
          },
          {
            id: '2',
            name: 'FANZA動画レビュー',
            slug: 'fanza',
            sort_order: 2,
            article_type: 'fanza' as const,
            color: '#3B82F6',
            created_at: new Date().toISOString(),
            article_count: 0,
          },
          {
            id: '3',
            name: '業界研究',
            slug: 'research',
            sort_order: 3,
            article_type: 'research' as const,
            color: '#10B981',
            created_at: new Date().toISOString(),
            article_count: 0,
          },
        ]
      }
      return []
    }

    return data.map(category => ({
      ...category,
      article_count: category.article_count?.[0]?.count || 0,
    }))
  } catch (error) {
    console.error('Failed to get categories:', error)
    return []
  }
}

/**
 * カテゴリ別統計を取得
 */
export async function getCategoryStats(): Promise<
  Array<{
    name: string
    slug: string
    count: number
  }>
> {
  const categories = await getCategories()

  return categories.map(category => ({
    name: category.name,
    slug: category.slug,
    count: category.article_count || 0,
  }))
}

/**
 * カテゴリをスラッグで取得
 */
export async function getCategoryBySlug(
  slug: string
): Promise<DatabaseCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`カテゴリ取得エラー: ${error.message}`)
  }

  return data
}

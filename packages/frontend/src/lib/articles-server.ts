import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Article, ArticleMetadata } from './articles'

// Markdownコンテンツのディレクトリパス
const articlesDirectory = path.join(process.cwd(), 'content/articles')

// Markedの設定
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * 記事ファイルのパスを再帰的に取得
 */
function getArticleFilePaths(dir: string = articlesDirectory): string[] {
  let files: string[] = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files = files.concat(getArticleFilePaths(fullPath))
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`記事ディレクトリの読み取りエラー (${dir}):`, error)
  }
  return files
}

/**
 * ファイル名からスラッグを生成
 */
function getSlugFromFileName(fileName: string): string {
  return path.basename(fileName, '.md')
}

/**
 * 記事のメタデータを取得
 */
export function getArticleMetadata(slug: string): ArticleMetadata | null {
  try {
    const filePaths = getArticleFilePaths()
    const fullPath = filePaths.find(p => getSlugFromFileName(p) === slug)

    if (!fullPath || !fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      id: slug,
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      category: data.category || '',
      publishedAt: data.publishedAt || '',
      readTime: data.readTime || '',
      viewCount: data.viewCount || 0,
      thumbnail: data.thumbnail || '',
      isPremium: data.isPremium || false,
      tags: data.tags || [],
      author: data.author || '',
    }
  } catch (error) {
    console.error(`記事メタデータの読み取りエラー (${slug}):`, error)
    return null
  }
}

/**
 * 記事の詳細情報を取得
 */
export function getArticleBySlug(slug: string): Article | null {
  try {
    const filePaths = getArticleFilePaths()
    const fullPath = filePaths.find(p => getSlugFromFileName(p) === slug)

    if (!fullPath || !fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // MarkdownをHTMLに変換
    const htmlContent = marked(content) as string

    return {
      id: slug,
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: htmlContent,
      category: data.category || '',
      publishedAt: data.publishedAt || '',
      readTime: data.readTime || '',
      viewCount: data.viewCount || 0,
      thumbnail: data.thumbnail || '',
      isPremium: data.isPremium || false,
      tags: data.tags || [],
      author: data.author || '',
    }
  } catch (error) {
    console.error(`記事の読み取りエラー (${slug}):`, error)
    return null
  }
}

/**
 * 全記事のメタデータを取得
 */
export function getAllArticleMetadata(): ArticleMetadata[] {
  const filePaths = getArticleFilePaths()
  const articles: ArticleMetadata[] = []

  filePaths.forEach(fileName => {
    const slug = getSlugFromFileName(fileName)
    const metadata = getArticleMetadata(slug)

    if (metadata) {
      articles.push(metadata)
    }
  })

  // 公開日の降順でソート
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

/**
 * カテゴリー別の記事メタデータを取得
 */
export function getArticlesByCategory(categorySlug: string): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()

  const categorySlugToNameMap: Record<string, string> = {
    fuzoku: '風俗体験談',
    fanza: 'FANZA動画レビュー',
    research: '業界研究',
    fanzavr: 'FANZA_VRレビュー',
  }

  const categoryName = categorySlugToNameMap[categorySlug]

  if (!categoryName) {
    return [] // スラッグが不明な場合は空を返す
  }

  return allArticles.filter(article => article.category === categoryName)
}

/**
 * 記事を検索
 */
export function searchArticles(query: string): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  const searchTerm = query.toLowerCase()

  return allArticles.filter(
    article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

/**
 * 関連記事を取得
 */
export function getRelatedArticles(
  article: ArticleMetadata,
  limit: number = 3
): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()

  // 同じカテゴリーの記事を優先
  const sameCategory = allArticles.filter(
    a => a.id !== article.id && a.category === article.category
  )

  // 同じタグを持つ記事
  const sameTags = allArticles.filter(
    a =>
      a.id !== article.id &&
      a.category !== article.category &&
      a.tags.some(tag => article.tags.includes(tag))
  )

  // 結果をマージして制限数に切り詰め
  const related = [...sameCategory, ...sameTags].slice(0, limit)

  return related
}

/**
 * 記事の統計情報を取得
 */
export function getArticleStats(): {
  totalArticles: number
  articlesByCategory: Record<string, number>
  totalViews: number
} {
  const allArticles = getAllArticleMetadata()

  const articlesByCategory: Record<string, number> = {}
  let totalViews = 0

  allArticles.forEach(article => {
    // カテゴリー別カウント
    articlesByCategory[article.category] =
      (articlesByCategory[article.category] || 0) + 1

    // 総閲覧数
    totalViews += article.viewCount
  })

  return {
    totalArticles: allArticles.length,
    articlesByCategory,
    totalViews,
  }
}

/**
 * 記事の存在確認
 */
export function articleExists(slug: string): boolean {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`)
    return fs.existsSync(fullPath)
  } catch {
    return false
  }
}

/**
 * 最新記事を取得
 */
export function getLatestArticles(limit: number = 5): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  return allArticles.slice(0, limit)
}

/**
 * 人気記事を取得（閲覧数順）
 */
export function getPopularArticles(limit: number = 5): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  return allArticles.sort((a, b) => b.viewCount - a.viewCount).slice(0, limit)
}

/**
 * プレミアム記事を取得
 */
export function getPremiumArticles(): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  return allArticles.filter(article => article.isPremium)
}

/**
 * カテゴリー一覧を取得
 */
export function getCategories(): Array<{
  name: string
  slug: string
  count: number
}> {
  const stats = getArticleStats()

  const categoryMapping: Record<string, string> = {
    風俗体験談: 'fuzoku',
    FANZA動画: 'fanza',
    業界研究: 'research',
    FANZA_VRレビュー: 'fanzavr',
  }

  return Object.entries(stats.articlesByCategory).map(([name, count]) => ({
    name,
    slug: categoryMapping[name] || name.toLowerCase(),
    count,
  }))
}

/**
 * アーカイブデータを取得（年、月ごとの記事数と記事メタデータ）
 */
export function getArchivedArticlesData(): Record<
  string,
  Record<string, ArticleMetadata[]>
> {
  const allArticles = getAllArticleMetadata()
  const archives: Record<string, Record<string, ArticleMetadata[]>> = {}

  allArticles.forEach(article => {
    const publishedDate = new Date(article.publishedAt)
    const year = publishedDate.getFullYear().toString()
    const month = (publishedDate.getMonth() + 1).toString().padStart(2, '0')

    if (!archives[year]) {
      archives[year] = {}
    }
    if (!archives[year][month]) {
      archives[year][month] = []
    }
    archives[year][month].push(article)
  })

  // 年と月を降順でソート
  const sortedYears = Object.keys(archives).sort(
    (a, b) => parseInt(b) - parseInt(a)
  )
  const sortedArchives: Record<string, Record<string, ArticleMetadata[]>> = {}

  sortedYears.forEach(year => {
    const sortedMonths = Object.keys(archives[year]).sort(
      (a, b) => parseInt(b) - parseInt(a)
    )
    sortedArchives[year] = {}
    sortedMonths.forEach(month => {
      sortedArchives[year][month] = archives[year][month].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    })
  })

  return sortedArchives
}

/**
 * 特定の年月の記事を取得
 */
export function getArticlesByYearAndMonth(
  year: string,
  month: string
): ArticleMetadata[] {
  const archives = getArchivedArticlesData()
  return archives[year]?.[month] || []
}

/**
 * すべてのタグとその出現回数を取得
 */
export function getAllTagsWithCounts(): Array<{
  name: string
  slug: string
  count: number
}> {
  const allArticles = getAllArticleMetadata()
  const tagCounts: Record<string, number> = {}

  allArticles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, slug: encodeURIComponent(name), count }))
    .sort((a, b) => b.count - a.count) // カウントが多い順
}

/**
 * 特定のタグに紐づく記事を取得
 */
export function getArticlesByTag(tagSlug: string): ArticleMetadata[] {
  const allArticles = getAllArticleMetadata()
  const decodedTag = decodeURIComponent(tagSlug)
  return allArticles.filter(article => article.tags.includes(decodedTag))
}

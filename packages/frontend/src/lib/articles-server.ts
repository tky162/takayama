import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'
import type { Article, ArticleMetadata } from './articles'
import { renderMarkdown } from './markdown'

// Markdownコンテンツのディレクトリパス
const articlesDirectory = path.join(process.cwd(), 'content/articles')

/**
 * 記事ファイルのパスを再帰的に取得
 */
function collectArticleFilePaths(dir: string = articlesDirectory): string[] {
  let files: string[] = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files = files.concat(collectArticleFilePaths(fullPath))
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`記事ディレクトリの読み取りエラー (${dir}):`, error)
  }
  return files
}

let articleFilePathCache: string[] | null = null

function getArticleFilePaths(): string[] {
  if (process.env.NODE_ENV !== 'production') {
    return collectArticleFilePaths()
  }

  if (!articleFilePathCache) {
    articleFilePathCache = collectArticleFilePaths()
  }

  return [...articleFilePathCache]
}

const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1, 'title is required'),
  excerpt: z.unknown().optional(),
  category: z.unknown().optional(),
  publishedAt: z.union([z.string(), z.date()]).optional(),
  readTime: z.unknown().optional(),
  viewCount: z.union([z.number(), z.string()]).optional(),
  thumbnail: z.unknown().optional(),
  isPremium: z.union([z.boolean(), z.string()]).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  author: z.unknown().optional(),
})

type RawFrontmatter = z.infer<typeof ArticleFrontmatterSchema>

interface NormalizedFrontmatter {
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  viewCount: number
  thumbnail: string
  isPremium: boolean
  tags: string[]
  author: string
}

function normalizeFrontmatter(slug: string, data: unknown): NormalizedFrontmatter {
  const parsed = ArticleFrontmatterSchema.safeParse(data)

  if (!parsed.success) {
    throw new Error(
      `[articles] Frontmatter validation failed for "${slug}": ${parsed.error.message}`
    )
  }

  const frontmatter = parsed.data as RawFrontmatter

  const toStringValue = (value: unknown, fallback = ''): string => {
    if (value === undefined || value === null) {
      return fallback
    }
    return String(value).trim()
  }

  const title = toStringValue(frontmatter.title)

  if (!title) {
    throw new Error(`[articles] Title is required for "${slug}"`)
  }

  const toPublishedAt = (value: RawFrontmatter['publishedAt']): string => {
    if (!value) {
      return ''
    }

    const source = value instanceof Date ? value : new Date(String(value))

    if (Number.isNaN(source.getTime())) {
      throw new Error(
        `[articles] Invalid publishedAt value for "${slug}": ${String(value)}`
      )
    }

    return source.toISOString()
  }

  const toViewCount = (value: RawFrontmatter['viewCount']): number => {
    if (value === undefined || value === null || value === '') {
      return 0
    }

    const numeric =
      typeof value === 'number' ? value : Number.parseInt(String(value), 10)

    if (!Number.isFinite(numeric) || numeric < 0) {
      throw new Error(
        `[articles] Invalid viewCount value for "${slug}": ${String(value)}`
      )
    }

    return numeric
  }

  const toBoolean = (value: RawFrontmatter['isPremium']): boolean => {
    if (value === undefined || value === null) {
      return false
    }

    if (typeof value === 'boolean') {
      return value
    }

    const normalized = String(value).trim().toLowerCase()
    return ['true', '1', 'yes', 'on'].includes(normalized)
  }

  const toTags = (value: RawFrontmatter['tags']): string[] => {
    if (!value) {
      return []
    }

    if (Array.isArray(value)) {
      return value.map(tag => String(tag).trim()).filter(Boolean)
    }

    return String(value)
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
  }

  return {
    title,
    excerpt: toStringValue(frontmatter.excerpt),
    category: toStringValue(frontmatter.category),
    publishedAt: toPublishedAt(frontmatter.publishedAt),
    readTime: toStringValue(frontmatter.readTime),
    viewCount: toViewCount(frontmatter.viewCount),
    thumbnail: toStringValue(frontmatter.thumbnail),
    isPremium: toBoolean(frontmatter.isPremium),
    tags: toTags(frontmatter.tags),
    author: toStringValue(frontmatter.author),
  }
}

interface ParsedArticleFile {
  slug: string
  frontmatter: NormalizedFrontmatter
  content: string
}

function parseArticleFile(
  filePath: string,
  slug = getSlugFromFileName(filePath)
): ParsedArticleFile | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const frontmatter = normalizeFrontmatter(slug, data)

    return {
      slug,
      frontmatter,
      content,
    }
  } catch (error) {
    console.error(`記事の解析に失敗しました (${slug}):`, error)
    return null
  }
}

function buildMetadata(
  slug: string,
  frontmatter: NormalizedFrontmatter
): ArticleMetadata {
  return {
    id: slug,
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    category: frontmatter.category,
    publishedAt: frontmatter.publishedAt,
    readTime: frontmatter.readTime,
    viewCount: frontmatter.viewCount,
    thumbnail: frontmatter.thumbnail,
    isPremium: frontmatter.isPremium,
    tags: frontmatter.tags,
    author: frontmatter.author,
  }
}

function findArticleBySlug(slug: string): ParsedArticleFile | null {
  const filePath = getArticleFilePaths().find(
    candidate => getSlugFromFileName(candidate) === slug
  )

  if (!filePath || !fs.existsSync(filePath)) {
    return null
  }

  return parseArticleFile(filePath, slug)
}

function getPublishedTimestamp(value: string): number {
  if (!value) {
    return 0
  }

  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
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
    const article = findArticleBySlug(slug)

    if (!article) {
      return null
    }

    return buildMetadata(article.slug, article.frontmatter)
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
    const article = findArticleBySlug(slug)

    if (!article) {
      return null
    }

    const metadata = buildMetadata(article.slug, article.frontmatter)
    const { html, headings } = renderMarkdown(article.content)

    return {
      ...metadata,
      content: html,
      headings,
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

  filePaths.forEach(filePath => {
    const parsed = parseArticleFile(filePath)

    if (parsed) {
      articles.push(buildMetadata(parsed.slug, parsed.frontmatter))
    }
  })

  return articles.sort(
    (a, b) => getPublishedTimestamp(b.publishedAt) - getPublishedTimestamp(a.publishedAt)
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

import { notFound } from 'next/navigation'
import CategoryPageClient from '@/components/pages/CategoryPageClient'
import { getArticlesByCategory } from '@/lib/articles-server'

interface CategoryInfo {
  slug: string
  name: string
  description: string
  color: string
  icon: string
}

const categories: Record<string, CategoryInfo> = {
  fuzoku: {
    slug: 'fuzoku',
    name: '風俗体験談',
    description:
      '実際の風俗店舗利用体験に基づく詳細なレポートをお届けします。店舗選びの参考にしてください。',
    color: 'red',
    icon: '💋',
  },
  fanza: {
    slug: 'fanza',
    name: 'FANZA動画レビュー',
    description:
      'FANZA動画の詳細レビューと評価。新作から人気作品まで幅広く分析します。',
    color: 'purple',
    icon: '🎬',
  },
  research: {
    slug: 'research',
    name: '業界研究',
    description:
      '風俗業界の最新動向、市場分析、技術革新について研究しています。',
    color: 'blue',
    icon: '📊',
  },
  fanzavr: {
    slug: 'fanzavr',
    name: 'FANZA_VRレビュー',
    description:
      'FANZAのVR作品の詳細レビューと評価。没入感のある体験を分析します。',
    color: 'orange',
    icon: '👓',
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug,
  }))
}

export default async function CategoryPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const category = categories[slug]

  if (!category) {
    notFound()
  }

  try {
    const articles = await getArticlesByCategory(category.slug)
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="container mx-auto px-4 py-8">
          <CategoryPageClient category={category} initialArticles={articles} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('記事データ読み込みエラー:', error)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600">データ読み込み中です...</p>
        </div>
      </div>
    )
  }
}

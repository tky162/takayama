import { notFound } from 'next/navigation'
import CategoryPageClient from '@/components/pages/CategoryPageClient'
import { Suspense } from 'react'

export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/categories`);
    const categories = await res.json();
    return categories.map((category: { slug: string }) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

interface CategoryInfo {
  slug: string
  name: string
  description: string
  color: string
  icon: string
}

// This metadata can be moved to the database later
const categoryMetadata: Record<string, Omit<CategoryInfo, 'slug' | 'name'>> = {
  fuzoku: {
    description:
      '実際の風俗店舗利用体験に基づく詳細なレポートをお届けします。店舗選びの参考にしてください。',
    color: 'red',
    icon: '💋',
  },
  fanza: {
    description:
      'FANZA動画の詳細レビューと評価。新作から人気作品まで幅広く分析します。',
    color: 'purple',
    icon: '🎬',
  },
  research: {
    description:
      '風俗業界の最新動向、市場分析、技術革新について研究しています。',
    color: 'blue',
    icon: '📊',
  },
  fanzavr: {
    description:
      'FANZAのVR作品の詳細レビューと評価。没入感のある体験を分析します。',
    color: 'orange',
    icon: '👓',
  },
}

async function getArticles(slug: string, searchParams: { [key: string]: string | string[] | undefined }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  const params = new URLSearchParams(searchParams as Record<string, string>);
  params.set('category', slug);

  try {
    const res = await fetch(`${apiUrl}/api/articles?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) {
      return { articles: [], totalPages: 0 };
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching articles for category:', error);
    return { articles: [], totalPages: 0 };
  }
}

async function getCategory(slug: string): Promise<CategoryInfo | null> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
    try {
        const res = await fetch(`${apiUrl}/api/categories`);
        const categories = await res.json();
        const category = categories.find((cat: any) => cat.slug === slug);
        if (!category) return null;

        const metadata = categoryMetadata[slug] || { description: '', color: 'gray', icon: '' };
        return { ...category, ...metadata };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const { slug } = params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const articlesData = await getArticles(slug, searchParams)

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryPageClient 
            category={category} 
            initialArticles={articlesData.articles} 
            totalPages={articlesData.totalPages}
          />
        </Suspense>
      </div>
    </div>
  )
}

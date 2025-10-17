import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import TagPageClient from '@/components/pages/TagPageClient'

export const dynamic = 'force-dynamic';

async function getTag(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/tags`);
    const tags = await res.json();
    return tags.find((tag: any) => tag.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

async function getArticles(slug: string, searchParams: { [key: string]: string | string[] | undefined }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  const params = new URLSearchParams(searchParams as Record<string, string>);
  params.set('tag', slug);

  try {
    const res = await fetch(`${apiUrl}/api/articles?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) {
      return { articles: [], totalPages: 0 };
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching articles for tag:', error);
    return { articles: [], totalPages: 0 };
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { tag: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { tag: slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  const tag = await getTag(decodedSlug);

  if (!tag) {
    notFound();
  }

  const articlesData = await getArticles(decodedSlug, searchParams);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagPageClient
        tag={tag}
        initialArticles={articlesData.articles}
        totalPages={articlesData.totalPages}
      />
    </Suspense>
  );
}

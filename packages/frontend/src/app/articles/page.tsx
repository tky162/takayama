import ArticlesPageClient from '@/components/pages/ArticlesPageClient'
import { Suspense } from 'react'

// Fetch articles from the API based on search parameters
async function getArticles(searchParams: { [key: string]: string | string[] | undefined }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  const query = new URLSearchParams(searchParams as Record<string, string>);
  
  try {
    const res = await fetch(`${apiUrl}/api/articles?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch articles:', res.status, res.statusText);
      return { articles: [], totalPages: 0, currentPage: 1 };
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], totalPages: 0, currentPage: 1 };
  }
}

// Fetch all categories for the filter UI
async function getCategories() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/categories`, { next: { revalidate: 3600 } }); // Revalidate once per hour
    if (!res.ok) {
      console.error('Failed to fetch categories:', res.status, res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function ArticlesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const articlesData = await getArticles(searchParams);
  const categories = await getCategories();

  // Add an 'all' category to the beginning
  const allArticlesCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  const categoriesWithAll = [
    { id: 'all', slug: 'all', name: 'すべて', count: allArticlesCount },
    ...categories,
  ];

  return (
    <Suspense fallback={<div>Loading articles...</div>}>
      <ArticlesPageClient
        initialArticles={articlesData.articles}
        totalPages={articlesData.totalPages}
        categories={categoriesWithAll}
      />
    </Suspense>
  )
}

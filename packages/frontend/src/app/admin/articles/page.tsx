import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ArticlesListClient from '@/components/pages/ArticlesListClient';

export const dynamic = 'force-dynamic';

// Fetch articles from the API
async function getArticles() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/articles?pageSize=999`, { cache: 'no-store' }); // Fetch all for admin
    if (!res.ok) {
      console.error('Failed to fetch articles:', res.status, res.statusText);
      return { articles: [] };
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { articles: [] };
  }
}

export default async function AdminArticlesPage() {
  const { articles } = await getArticles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">Create New Article</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article List</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticlesListClient initialArticles={articles} />
        </CardContent>
      </Card>
    </div>
  );
}

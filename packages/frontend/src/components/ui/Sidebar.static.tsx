import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import SidebarTagList from './SidebarTagList'
import SidebarSearch from './SidebarSearch'

interface SidebarProps {
  className?: string
}

async function getRecentArticles() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/articles?pageSize=5`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching recent articles:', error);
    return [];
  }
}

async function getTags() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/tags`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

async function getAllArticles() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/articles?pageSize=999`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}

async function getCategories() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function SidebarStatic({
  className = '',
}: SidebarProps): Promise<React.JSX.Element> {
  const recentPosts = await getRecentArticles()
  const allTags = await getTags()
  const allArticles = await getAllArticles()
  const categories = await getCategories()

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ブランドバナー */}
      <Link
        href="/"
        className="block"
        aria-label="高山まさあきの夜遊び研究所トップへ"
      >
        <div
          className="content-card overflow-hidden p-0"
          style={{ border: '1px solid var(--border-light)' }}
        >
          <Image
            src="https://pub-64fb0bfdf1794163b59576eb362601e9.r2.dev/ogp.jpg"
            alt="高山まさあきの夜遊び研究所"
            width={800}
            height={420}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </Link>

      {/* 検索ボックス */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          サイト内を検索
        </h3>
        <SidebarSearch allArticles={allArticles} />
      </div>

      {/* 最新の研究報告 */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          最新の研究報告
        </h3>
        <div className="space-y-4">
          {recentPosts.map(post => (
            <Link
              key={post.id}
              href={`/article/${post.slug}`}
              className="block p-3 rounded-lg hover:opacity-80 transition-colors"
              style={{ background: 'var(--surface)' }}
            >
              <h4
                className="text-sm font-medium mb-2 line-clamp-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {post.title}
              </h4>
              <div
                className="flex items-center justify-between text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                  }}
                >
                  {post.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* カテゴリ */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          研究分野
        </h3>
        <div className="space-y-3">
          {categories.map(category => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex justify-between items-center p-2 rounded-lg hover:opacity-80 transition-colors"
              style={{ background: 'var(--surface)' }}
            >
              <span
                className="text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {category.name}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                }}
              >
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* タグ一覧 */}
      <SidebarTagList allTags={allTags} />

      {/* 研究所からのお知らせ */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          研究所からのお知らせ
        </h3>
        <div className="space-y-3">
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            <div className="flex items-center mb-2">
              <span
                className="text-xs font-medium"
                style={{ color: '#22c55e' }}
              >
                NEW
              </span>
              <span
                className="text-xs ml-2"
                style={{ color: 'var(--text-muted)' }}
              >
                2025.07.15
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              新カテゴリ「VR体験」の研究を開始しました
            </p>
          </div>

          <div
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className="flex items-center mb-2">
              <TagIcon className="h-3 w-3" style={{ color: '#3b82f6' }} />
              <span
                className="text-xs ml-1"
                style={{ color: 'var(--text-muted)' }}
              >
                2025.07.10
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              サイトリニューアルが完了しました
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

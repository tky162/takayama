'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  className?: string
}

export default function Sidebar({
  className = '',
}: SidebarProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')

  const recentPosts = [
    {
      id: 1,
      title: 'マン○派、初撮。2178 みゆ 23歳 デパレル店員',
      date: '2025-07-17',
      category: 'FANZA動画',
    },
    {
      id: 2,
      title: 'SNSでナンパした美人人妻が、旦那以外の身体に興奮してドエロい本性',
      date: '2025-07-18',
      category: '風俗体験談',
    },
    {
      id: 3,
      title: '最新の風俗業界トレンド分析 - 2025年上半期',
      date: '2025-07-15',
      category: '業界研究',
    },
  ]

  const categories = [
    { name: '風俗体験談', count: 45, slug: 'fuzoku' },
    { name: 'FANZA動画', count: 32, slug: 'fanza' },
    { name: '業界研究', count: 18, slug: 'research' },
  ]

  const archives = [
    { month: '2025年7月', count: 12 },
    { month: '2025年6月', count: 18 },
    { month: '2025年5月', count: 15 },
    { month: '2025年4月', count: 20 },
    { month: '2025年3月', count: 16 },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <aside
      className={`space-y-6 ${className}`}
      style={{ position: 'sticky', top: '100px' }}
    >
      {/* 検索ウィジェット */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          サイト内検索
        </h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-lg border transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* カテゴリウィジェット */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: 'var(--text-primary)' }}
        >
          <TagIcon className="h-5 w-5 mr-2" />
          カテゴリ
        </h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li
              key={category.slug}
              className="flex justify-between items-center"
            >
              <Link
                href={`/category/${category.slug}`}
                className="hover:opacity-80 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {category.name}
              </Link>
              <span
                className="text-sm px-2 py-1 rounded-full"
                style={{
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-muted)',
                }}
              >
                {category.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 最新記事ウィジェット */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          最新記事
        </h3>
        <ul className="space-y-4">
          {recentPosts.map(post => (
            <li
              key={post.id}
              className="pb-3 border-b last:border-b-0"
              style={{ borderColor: 'var(--border)' }}
            >
              <Link
                href={`/article/${post.id}`}
                className="block hover:opacity-80 transition-colors"
              >
                <h4
                  className="text-sm font-medium mb-2 line-clamp-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {post.title}
                </h4>
                <div
                  className="flex items-center text-xs space-x-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span>{post.date}</span>
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {post.category}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* アーカイブウィジェット */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: 'var(--text-primary)' }}
        >
          <CalendarIcon className="h-5 w-5 mr-2" />
          月別アーカイブ
        </h3>
        <ul className="space-y-2">
          {archives.map((archive, index) => (
            <li key={index} className="flex justify-between items-center">
              <Link
                href={`/archive/${archive.month}`}
                className="hover:opacity-80 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {archive.month}
              </Link>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                ({archive.count})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* お知らせウィジェット */}
      <div className="content-card">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          お知らせ
        </h3>
        <div className="space-y-3">
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              新しいコンテンツカテゴリ「業界研究」を追加しました
            </p>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              2025.07.15
            </span>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              18歳未満の方の閲覧は固く禁止されています
            </p>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              重要
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

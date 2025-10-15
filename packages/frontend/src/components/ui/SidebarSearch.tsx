'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { ArticleMetadata } from '@/lib/articles'

interface SidebarSearchProps {
  allArticles: ArticleMetadata[]
}

export default function SidebarSearch({ allArticles }: SidebarSearchProps): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ArticleMetadata[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = allArticles.filter(article => {
      return (
        article.title.toLowerCase().includes(searchQuery) ||
        article.excerpt.toLowerCase().includes(searchQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        article.category.toLowerCase().includes(searchQuery)
      )
    })

    setResults(filtered.slice(0, 5)) // 最大5件表示
    setIsOpen(filtered.length > 0)
  }, [query, allArticles])

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const handleResultClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="記事を検索..."
          className="w-full px-4 py-2 pr-10 rounded-lg border transition-colors focus:outline-none focus:ring-2"
          style={{
            background: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
        {!query && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>

      {/* 検索結果ドロップダウン */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          {results.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              onClick={handleResultClick}
              className="block p-3 hover:opacity-80 transition-colors border-b last:border-b-0"
              style={{ borderColor: 'var(--border)' }}
            >
              <h4
                className="text-sm font-medium mb-1 line-clamp-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {article.title}
              </h4>
              <p
                className="text-xs line-clamp-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                  }}
                >
                  {article.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

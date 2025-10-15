'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TagIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface Tag {
  name: string
  slug: string
  count: number
}

interface SidebarTagListProps {
  allTags: Tag[]
}

export default function SidebarTagList({ allTags }: SidebarTagListProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="content-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
      >
        <h3
          className="text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          タグ一覧
        </h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
        ) : (
          <ChevronDownIcon className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Link
              key={tag.name}
              href={`/tags/${tag.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

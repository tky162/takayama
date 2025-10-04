'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { ArticleMetadata } from '@/lib/articles'

interface ArchiveYearItemProps {
  year: string
  monthsData: Record<string, ArticleMetadata[]>
}

export default function ArchiveYearItem({
  year,
  monthsData,
}: ArchiveYearItemProps): React.JSX.Element {
  const [isYearOpen, setIsYearOpen] = useState(false)
  const totalYearArticles = Object.values(monthsData).reduce(
    (sum, articles) => sum + articles.length,
    0
  )

  return (
    <li>
      <button
        onClick={() => setIsYearOpen(!isYearOpen)}
        className="flex items-center justify-between w-full p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ color: 'var(--text-primary)', background: 'var(--surface)' }}
      >
        <span className="font-semibold text-lg">
          {year}年 ({totalYearArticles}件)
        </span>
        {isYearOpen ? (
          <ChevronDownIcon className="h-5 w-5" />
        ) : (
          <ChevronRightIcon className="h-5 w-5" />
        )}
      </button>
      {isYearOpen && (
        <ul className="ml-6 mt-2 space-y-2">
          {Object.keys(monthsData).map(month => {
            const totalMonthArticles = monthsData[month].length
            return (
              <li key={month}>
                <Link
                  href={`/archive/${year}/${month}`}
                  className="flex items-center justify-between w-full p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'var(--surface)',
                  }}
                >
                  <span>
                    {parseInt(month)}月 ({totalMonthArticles}件)
                  </span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

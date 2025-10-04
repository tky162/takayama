'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { ArticleMetadata } from '@/lib/articles'

interface SidebarArchiveListProps {
  archivedData: Record<string, Record<string, ArticleMetadata[]>>
}

export default function SidebarArchiveList({
  archivedData,
}: SidebarArchiveListProps): React.JSX.Element {
  const years = Object.keys(archivedData).sort(
    (a, b) => parseInt(b) - parseInt(a)
  )

  return (
    <ul className="space-y-2">
      {years.map(year => (
        <SidebarArchiveYearItem
          key={year}
          year={year}
          monthsData={archivedData[year]}
        />
      ))}
    </ul>
  )
}

interface SidebarArchiveYearItemProps {
  year: string
  monthsData: Record<string, ArticleMetadata[]>
}

function SidebarArchiveYearItem({
  year,
  monthsData,
}: SidebarArchiveYearItemProps): React.JSX.Element {
  const [isYearOpen, setIsYearOpen] = useState(false)
  const totalYearArticles = Object.values(monthsData).reduce(
    (sum, articles) => sum + articles.length,
    0
  )

  return (
    <li>
      <button
        onClick={() => setIsYearOpen(!isYearOpen)}
        className="flex items-center justify-between w-full p-2 rounded-lg hover:opacity-80 transition-colors"
        style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
      >
        <span className="font-semibold text-sm">
          {year}年 ({totalYearArticles}件)
        </span>
        {isYearOpen ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </button>
      {isYearOpen && (
        <ul className="ml-4 mt-1 space-y-1">
          {Object.keys(monthsData)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map(month => {
              const totalMonthArticles = monthsData[month].length
              return (
                <li key={month}>
                  <Link
                    href={`/archive/${year}/${month}`}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:opacity-80 transition-colors"
                    style={{
                      background: 'var(--surface)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>
                      {parseInt(month)}月 ({totalMonthArticles}件)
                    </span>
                  </Link>
                </li>
              )
            })}
        </ul>
      )}
    </li>
  )
}

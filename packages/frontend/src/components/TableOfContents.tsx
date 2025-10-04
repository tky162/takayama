"use client"

import { useEffect, useMemo, useState } from 'react'
import type { ArticleHeading } from '@/lib/articles'

interface TableOfContentsProps {
  headings: ArticleHeading[]
  className?: string
  title?: string
}

function normalizeHeadings(headings: ArticleHeading[]): ArticleHeading[] {
  return headings
    .filter(heading => heading.level >= 2 && heading.level <= 4)
    .map(heading => ({
      ...heading,
      text: heading.text.trim(),
    }))
    .filter(heading => heading.text.length > 0)
}

const DEFAULT_OFFSET = 140

export default function TableOfContents({
  headings,
  className = '',
  title = 'この記事の目次',
}: TableOfContentsProps) {
  const normalized = useMemo(() => normalizeHeadings(headings), [headings])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (normalized.length === 0) {
      setActiveId(null)
      return
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const selected = normalized.reduce<
        { id: string; distance: number } | null
      >((accumulator, heading) => {
        const element = document.getElementById(heading.id)
        if (!element) {
          return accumulator
        }

        const offsetTop = element.getBoundingClientRect().top + scrollTop
        const distance = scrollTop + DEFAULT_OFFSET - offsetTop

        if (distance >= 0) {
          if (!accumulator || distance < accumulator.distance) {
            return { id: heading.id, distance }
          }
        }

        return accumulator
      }, null)

      if (selected) {
        setActiveId(selected.id)
      } else {
        setActiveId(normalized[0]?.id ?? null)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [normalized])

  if (normalized.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={title}
      className={`toc-container ${className}`.trim()}
    >
      <h2 className="toc-title">{title}</h2>
      <ul className="toc-list">
        {normalized.map(heading => {
          const isActive = heading.id === activeId

          return (
            <li
              key={heading.id}
              className={`toc-item toc-level-${heading.level} ${isActive ? 'toc-item-active' : ''}`.trim()}
            >
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => setActiveId(heading.id)}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

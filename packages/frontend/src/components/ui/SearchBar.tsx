'use client'

import { useState, useEffect, useCallback } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  autoFocus?: boolean
  realtime?: boolean
  debounceMs?: number
}

export default function SearchBar({
  placeholder = '記事を検索...',
  onSearch,
  className = '',
  autoFocus = false,
  realtime = true,
  debounceMs = 300,
}: SearchBarProps): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // リアルタイム検索のデバウンス処理
  useEffect(() => {
    if (!realtime) return

    const timer = setTimeout(() => {
      onSearch(query.trim())
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, realtime, debounceMs, onSearch])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!realtime) {
      onSearch(query.trim())
    }
  }

  const handleClear = (): void => {
    setQuery('')
    onSearch('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`relative flex items-center transition-all duration-200 ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {/* 検索アイコン */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>

        {/* 検索入力フィールド */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        />

        {/* クリアボタン */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="検索をクリア"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* 検索ボタン（モバイル用） */}
      <button
        type="button"
        onClick={handleSubmit}
        className="md:hidden absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
        aria-label="検索"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  )
}

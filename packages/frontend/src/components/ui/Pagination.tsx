'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps): React.JSX.Element {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 常に最初のページを表示
      pages.push(1)

      if (currentPage <= 3) {
        // 現在のページが最初の方にある場合
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // 現在のページが最後の方にある場合
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 現在のページが中間にある場合
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageClick = (page: number): void => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const pages = getPageNumbers()

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* 前のページボタン */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage <= 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
        aria-label="前のページ"
      >
        <ChevronLeftIcon className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">前</span>
      </button>

      {/* ページ番号 */}
      <div className="flex items-center space-x-1">
        {pages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageClick(page as number)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                aria-label={`ページ ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 次のページボタン */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage >= totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
        aria-label="次のページ"
      >
        <span className="hidden sm:inline">次</span>
        <ChevronRightIcon className="h-4 w-4 ml-1" />
      </button>
    </nav>
  )
}

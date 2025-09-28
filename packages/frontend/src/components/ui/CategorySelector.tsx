'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  color: string
  count?: number
}

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
  className = '',
}: CategorySelectorProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCategoryData = categories.find(
    cat => cat.id === selectedCategory
  )

  const getCategoryColorClasses = (color: string): string => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* デスクトップ版：タブスタイル */}
      <div className="hidden md:flex space-x-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
              selectedCategory === category.id
                ? getCategoryColorClasses(category.color)
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category.name}
            {category.count && (
              <span className="ml-2 px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* モバイル版：ドロップダウン */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="flex items-center">
            {selectedCategoryData && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mr-2 ${getCategoryColorClasses(selectedCategoryData.color)}`}
              >
                {selectedCategoryData.name}
              </span>
            )}
            カテゴリーを選択
          </span>
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="py-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                    selectedCategory === category.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mr-2 ${getCategoryColorClasses(category.color)}`}
                    >
                      {category.name}
                    </span>
                  </span>
                  {category.count && (
                    <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

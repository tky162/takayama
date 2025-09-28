'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface MobileSidebarProps {
  children: React.ReactNode
}

export default function MobileSidebar({
  children,
}: MobileSidebarProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="lg:hidden">
      {/* ハンバーガーアイコン */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg transition-colors fixed top-4 right-4 z-50"
        style={{
          background: 'var(--surface-elevated)',
          color: 'var(--text-primary)',
        }}
        aria-label="サイドバーを開く"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* サイドバーオーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* サイドバーコンテンツ */}
      <div
        className={`fixed top-0 right-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto p-4 space-y-8`}
        style={{
          background: 'var(--background)',
          borderLeft: '1px solid var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-primary)' }}
            aria-label="サイドバーを閉じる"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

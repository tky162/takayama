'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AgeVerification() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAgeConfirm = () => {
    setLoading(true)
    // 30日間のCookie設定
    document.cookie = `age_verified=true; max-age=${30 * 24 * 60 * 60}; path=/`
    router.push('/')
  }

  const handleAgeDeny = () => {
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          年齢確認
        </h1>

        <div className="text-center mb-6">
          <p className="text-gray-700 mb-4">
            このサイトはアダルトコンテンツを含みます。
          </p>
          <p className="text-lg font-bold text-red-600">
            あなたは18歳以上ですか？
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleAgeConfirm}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '確認中...' : 'はい（18歳以上）'}
          </button>
          <button
            onClick={handleAgeDeny}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            いいえ（18歳未満）
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>
            このサイトに入ることで、あなたが18歳以上であることを確認し、
            <a href="/terms" className="text-blue-600 hover:underline">
              利用規約
            </a>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  )
}

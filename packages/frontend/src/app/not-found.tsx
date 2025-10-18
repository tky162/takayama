import Link from 'next/link'

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">
          ページが見つかりません
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}

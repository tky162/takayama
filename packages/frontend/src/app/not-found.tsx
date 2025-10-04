import Link from 'next/link'

export default function NotFound(): React.JSX.Element {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--background)' }}
    >
      <div className="text-center">
        <h1
          className="text-6xl font-bold mb-4"
          style={{ color: 'var(--primary)' }}
        >
          404
        </h1>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          ページが見つかりません
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          style={{
            background:
              'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            color: 'white',
          }}
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}

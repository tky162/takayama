import Link from 'next/link'

export const dynamic = 'force-dynamic';

async function getTags() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788';
  try {
    const res = await fetch(`${apiUrl}/api/tags`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export default async function TagsPage(): Promise<React.JSX.Element> {
  const allTags = await getTags()

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol
            className="flex items-center space-x-2 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>
              <Link
                href="/"
                className="hover:opacity-80"
                style={{ color: 'var(--primary)' }}
              >
                ホーム
              </Link>
            </li>
            <li>/</li>
            <li style={{ color: 'var(--text-primary)' }}>タグ一覧</li>
          </ol>
        </nav>

        <div className="space-y-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              タグ一覧
            </h1>
            <p
              className="text-xl mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              全{allTags.length}個のタグから記事を探す
            </p>
          </div>

          {/* タグ一覧グリッド */}
          <div className="content-card">
            <div className="flex flex-wrap gap-3">
              {allTags.map(tag => (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-lg transition-all hover:opacity-80"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {tag.name}
                  </span>
                  <span
                    className="ml-2 text-xs px-2 py-1 rounded-full"
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                    }}
                  >
                    {tag.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 人気タグトップ10 */}
          <div className="content-card">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              人気のタグ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTags.slice(0, 10).map((tag, index) => (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.slug}`}
                  className="flex items-center justify-between p-4 rounded-lg transition-all hover:opacity-80"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-lg font-bold"
                      style={{ color: 'var(--primary)' }}
                    >
                      {index + 1}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {tag.name}
                    </span>
                  </div>
                  <span
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                    }}
                  >
                    {tag.count}件
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

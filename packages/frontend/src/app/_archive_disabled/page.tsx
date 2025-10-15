import { getArchivedArticlesData } from '@/lib/articles-server'
import ArchiveYearItem from '@/components/ui/ArchiveYearItem'

export default async function ArchivePage(): Promise<React.JSX.Element> {
  const archivedData = getArchivedArticlesData()
  const years = Object.keys(archivedData)

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-8">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          記事アーカイブ
        </h1>

        <div className="space-y-8">
          <div className="content-card p-6">
            {years.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>
                アーカイブされた記事がありません。
              </p>
            ) : (
              <ul className="space-y-4">
                {years.map(year => (
                  <ArchiveYearItem
                    key={year}
                    year={year}
                    monthsData={archivedData[year]}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

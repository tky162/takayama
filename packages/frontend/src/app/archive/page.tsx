import { getArchivedArticlesData } from '@/lib/articles-server'
import ArchiveYearItem from '@/components/ui/ArchiveYearItem'
import SidebarStatic from '@/components/ui/Sidebar.static'
import MobileSidebar from '@/components/ui/MobileSidebar'

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

        {/* メイン2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* メインコンテンツエリア（約70%幅） */}
          <div className="lg:col-span-3 space-y-8">
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

          {/* サイドバーエリア（約30%幅） */}
          <div className="lg:col-span-1 hidden lg:block">
            <SidebarStatic />
          </div>
          <div className="lg:hidden">
            <MobileSidebar>
              <SidebarStatic />
            </MobileSidebar>
          </div>
        </div>
      </div>
    </div>
  )
}

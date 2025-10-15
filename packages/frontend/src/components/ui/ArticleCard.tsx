import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline'

interface ArticleCardProps {
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  viewCount: number
  thumbnail?: string
  href: string
  isPremium?: boolean
  priority?: boolean
}

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    // console.error("Invalid URL:", url, e);
    return false
  }
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  category,
  publishedAt,
  readTime,
  viewCount,
  thumbnail,
  href,
  isPremium,
  priority = false,
}) => {
  const getCategoryStyle = (category: string): React.CSSProperties => {
    switch (category) {
      case '風俗体験談':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }
      case 'FANZA動画':
      case 'FANZA動画レビュー':
        return {
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#8b5cf6',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }
      case 'FANZA_VRレビュー':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }
      default:
        return {
          background: 'rgba(115, 115, 115, 0.1)',
          color: '#737373',
          border: '1px solid rgba(115, 115, 115, 0.2)',
        }
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Link
      href={href}
      className="content-card hover:opacity-80 transition-opacity duration-300 overflow-hidden flex flex-col"
    >
      {isValidUrl(thumbnail) && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={thumbnail!}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            priority={priority}
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={getCategoryStyle(category)}
          >
            {category}
          </span>
          {isPremium && (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(251, 191, 36, 0.1)',
                color: '#f59e0b',
                border: '1px solid rgba(251, 191, 36, 0.2)',
              }}
            >
              Premium
            </span>
          )}
        </div>
        <h3
          className="text-lg font-semibold mb-2 line-clamp-2 flex-grow"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        <p
          className="text-sm mb-3 line-clamp-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {excerpt}
        </p>
        <div
          className="flex items-center text-xs mt-auto pt-3 border-t"
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
        >
          <CalendarIcon className="h-3 w-3 mr-1" />
          <span>{formatDate(publishedAt)}</span>
          <span className="mx-2">•</span>
          <ClockIcon className="h-3 w-3 mr-1" />
          <span>{readTime}</span>
          <span className="mx-2">•</span>
          <EyeIcon className="h-3 w-3 mr-1" />
          <span>{viewCount.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}

export default ArticleCard

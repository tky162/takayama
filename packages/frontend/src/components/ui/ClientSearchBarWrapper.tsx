'use client'

import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'

interface ClientSearchBarWrapperProps {
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export default function ClientSearchBarWrapper({
  placeholder,
  className,
  autoFocus,
}: ClientSearchBarWrapperProps): React.JSX.Element {
  const router = useRouter()

  const handleSearch = (query: string): void => {
    if (query) {
      router.push(`/articles?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <SearchBar
      placeholder={placeholder}
      onSearch={handleSearch}
      className={className}
      autoFocus={autoFocus}
    />
  )
}

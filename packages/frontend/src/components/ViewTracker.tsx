'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
  apiUrl: string
}

export default function ViewTracker({ slug, apiUrl }: ViewTrackerProps): null {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`${apiUrl}/api/views?slug=${encodeURIComponent(slug)}`, {
          method: 'POST',
        })
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }

    trackView()
  }, [slug, apiUrl])

  return null
}

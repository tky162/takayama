"use client"

import { useEffect, useState } from "react"
import { ArrowUpIcon } from "@heroicons/react/24/solid"

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 lg:hidden">
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="p-2 rounded-full text-white shadow-lg transition-opacity hover:opacity-80"
          aria-label="Go to top"
          style={{ background: 'var(--primary)' }}
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

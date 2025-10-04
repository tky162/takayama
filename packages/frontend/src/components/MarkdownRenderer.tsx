interface MarkdownRendererProps {
  html: string
}

export default function MarkdownRenderer({ html }: MarkdownRendererProps) {
  if (!html) {
    return null
  }

  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}


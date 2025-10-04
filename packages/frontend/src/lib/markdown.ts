import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import type { Schema } from 'hast-util-sanitize'
import { visit } from 'unist-util-visit'
import { toString as hastToString } from 'hast-util-to-string'
import type { Root, Element } from 'hast'

export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

const schema: Schema = structuredClone(defaultSchema)

schema.tagNames = [...(schema.tagNames ?? []), 'figure', 'figcaption']

schema.attributes = {
  ...(schema.attributes ?? {}),
  '*': [...new Set([...(schema.attributes?.['*'] ?? []), 'className'])],
  a: [
    ...(schema.attributes?.a ?? []),
    'target',
    'rel',
    'title',
  ],
  code: [
    ...(schema.attributes?.code ?? []),
    ['className', 'language-*'],
  ],
  pre: [...(schema.attributes?.pre ?? []), 'className'],
  img: [
    ...(schema.attributes?.img ?? []),
    'loading',
    'decoding',
  ],
}

function ensureHtmlString(value: unknown): string {
  return typeof value === 'string' ? value : String(value ?? '')
}

function rehypeCollectHeadings() {
  return (tree: Root, file: { data: Record<string, unknown> }) => {
    const headings: MarkdownHeading[] = []

    visit(tree, 'element', (node: Element) => {
      if (!node.tagName || !/^h[1-6]$/.test(node.tagName)) {
        return
      }

      const level = Number.parseInt(node.tagName.charAt(1), 10)
      const idValue = node.properties?.id

      if (!idValue) {
        return
      }

      const id = Array.isArray(idValue)
        ? idValue[0]?.toString() ?? ''
        : idValue.toString()

      if (!id) {
        return
      }

      const text = hastToString(node).trim()

      if (!text) {
        return
      }

      headings.push({ id, text, level })
    })

    file.data.headings = headings
  }
}

function extractHeadings(data: Record<string, unknown>): MarkdownHeading[] {
  const headings = data.headings

  if (!Array.isArray(headings)) {
    return []
  }

  return headings.filter((heading): heading is MarkdownHeading => {
    return (
      heading &&
      typeof heading === 'object' &&
      typeof heading.id === 'string' &&
      typeof heading.text === 'string' &&
      typeof heading.level === 'number'
    )
  })
}

export function renderMarkdown(markdown: string): {
  html: string
  headings: MarkdownHeading[]
} {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, schema)
    .use(rehypeSlug)
    .use(rehypeCollectHeadings)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-anchor'],
      },
    })
    .use(rehypeHighlight)
    .use(rehypeStringify, {
      allowDangerousHtml: false,
    })

  const result = processor.processSync(ensureHtmlString(markdown))

  return {
    html: result.toString(),
    headings: extractHeadings(result.data),
  }
}

// Type definitions for articles

export interface ArticleHeading {
  id: string
  text: string
  level: number
}

// The full article type, including content
export interface Article extends ArticleMetadata {
  content?: string
  headings?: ArticleHeading[]
}

// The metadata for an article, used in lists and cards
export interface ArticleMetadata {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: number; // Unix timestamp
  category: string;
  thumbnail?: string;
  tags: string[];
  viewCount: number;
  isPremium: boolean;
  readTime?: string; // Optional, as it's not in the DB yet
}

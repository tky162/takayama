import fs from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type PostMeta = {
  slug: string;
  title: string;
  description?: string;
  date?: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function readMarkdown(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const source = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(source);

  const processed = await remark().use(html).process(content);

  return {
    data,
    content: processed.toString(),
  };
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR);
    return entries
      .filter((entry) => entry.endsWith('.md'))
      .map((entry) => entry.replace(/\.md$/, ''));
  } catch (error) {
    console.warn('[posts] Failed to read content directory', error);
    return [];
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { data } = await readMarkdown(slug);
      return {
        slug,
        title: data.title as string,
        description: data.description as string | undefined,
        date: data.date as string | undefined,
      } satisfies PostMeta;
    }),
  );

  return posts.sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data, content } = await readMarkdown(slug);
    return {
      slug,
      title: data.title as string,
      description: data.description as string | undefined,
      date: data.date as string | undefined,
      contentHtml: content,
    } satisfies Post;
  } catch (error) {
    console.warn(`[posts] Failed to load ${slug}`, error);
    return null;
  }
}

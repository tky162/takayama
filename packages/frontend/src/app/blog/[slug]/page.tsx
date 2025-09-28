import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { fetchComments } from "@/lib/comments";
import { getPost, getPostSlugs } from "@/lib/posts";

import { CommentsSection } from "./comments-section";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Commented out for static export
// export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const post = await getPost(resolved.slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
      description: "指定された記事は存在しません。",
    } satisfies Metadata;
  }

  return {
    title: post.title,
    description: post.description,
  } satisfies Metadata;
}

export default async function BlogPost({ params }: PageProps) {
  const resolved = await params;
  const post = await getPost(resolved.slug);

  if (!post) {
    notFound();
  }

  let initialComments: Awaited<ReturnType<typeof fetchComments>>["comments"] = [];

  // Skip API calls during static generation
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
    try {
      const data = await fetchComments(post.slug);
      initialComments = data.comments;
    } catch (error) {
      console.warn("[comments] 初回取得に失敗しました", error);
    }
  }

  return (
    <main style={{ margin: "0 auto", maxWidth: "720px", padding: "4rem 1.5rem" }}>
      <nav style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ color: "#2563eb" }}>
          ← 記事一覧に戻る
        </Link>
      </nav>
      <article>
        <header style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>{post.date ?? "日付未設定"}</p>
          <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>{post.title}</h1>
          {post.description ? <p style={{ color: "#4b5563" }}>{post.description}</p> : null}
        </header>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      <CommentsSection slug={post.slug} initialComments={initialComments} />
    </main>
  );
}

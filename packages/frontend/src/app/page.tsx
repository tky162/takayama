import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main style={{ margin: "0 auto", maxWidth: "720px", padding: "4rem 1.5rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <p style={{ fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280" }}>
          takayamablog.com
        </p>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: "0.5rem 0" }}>高山まさあきの夜遊び研究所</h1>
        <p style={{ color: "#4b5563" }}>
          Cloudflare Pages と Workers / D1 で再構築中のアダルト向けブログ。Markdown 記事とコメント API
          の土台をこのリポジトリにまとめます。
        </p>
      </header>

      <section>
        {posts.length === 0 ? (
          <p>まだ記事がありません。`content/` ディレクトリに Markdown ファイルを追加してください。</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {posts.map((post) => (
              <li key={post.slug} style={{ borderBottom: "1px solid #e5e7eb", padding: "1.5rem 0" }}>
                <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                  <span>{post.date ?? "日付未設定"}</span>
                  <span aria-hidden style={{ margin: "0 0.5rem" }}>
                    •
                  </span>
                  <span>{post.slug}</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>
                  <Link href={`/blog/${post.slug}`}>{post.title ?? post.slug}</Link>
                </h2>
                {post.description ? <p style={{ color: "#4b5563" }}>{post.description}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

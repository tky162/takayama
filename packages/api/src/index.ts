import { Hono } from "hono";
import { cors } from "hono/cors";

export type Bindings = {
  COMMENTS_DB: D1Database;
  RATE_LIMITER?: KVNamespace;
};

export type Env = Bindings;

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/api/health", (c) => c.json({ status: "ok" }));

// 閲覧数を記録
app.post("/api/views", async (c) => {
  const slug = c.req.query("slug");
  if (!slug) {
    return c.json({ error: "missing slug" }, 400);
  }

  const viewedAt = Math.floor(Date.now() / 1000);
  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const ipHash = await digest(ip, slug, viewedAt);

  await c.env.COMMENTS_DB.prepare(
    `INSERT INTO article_views (post_slug, viewed_at, ip_hash)
     VALUES (?, ?, ?)`
  )
    .bind(slug, viewedAt, ipHash)
    .run();

  return c.json({ ok: true });
});

// 閲覧数を取得
app.get("/api/views", async (c) => {
  const slug = c.req.query("slug");
  if (!slug) {
    return c.json({ error: "missing slug" }, 400);
  }

  const { results } = await c.env.COMMENTS_DB.prepare(
    `SELECT COUNT(*) as count FROM article_views WHERE post_slug = ?`
  )
    .bind(slug)
    .all<{ count: number }>();

  const count = results?.[0]?.count ?? 0;
  return c.json({ slug, viewCount: count });
});

// 全記事の閲覧数を取得
app.get("/api/views/all", async (c) => {
  const { results } = await c.env.COMMENTS_DB.prepare(
    `SELECT post_slug as postSlug, COUNT(*) as count
     FROM article_views
     GROUP BY post_slug`
  )
    .all<{ postSlug: string; count: number }>();

  const views = results?.reduce((acc, row) => {
    acc[row.postSlug] = row.count;
    return acc;
  }, {} as Record<string, number>) ?? {};

  return c.json({ views });
});

app.get("/api/comments", async (c) => {
  const slug = c.req.query("slug");
  if (!slug) {
    return c.json({ error: "missing slug" }, 400);
  }

  const { results } = await c.env.COMMENTS_DB.prepare(
    `SELECT id, post_slug as postSlug, body, created_at as createdAt
     FROM comments WHERE post_slug = ?
     ORDER BY created_at DESC LIMIT 100`
  )
    .bind(slug)
    .all<{ id: string; postSlug: string; body: string; createdAt: number }>();

  const comments = results?.map((row) => ({
    id: row.id,
    slug: row.postSlug,
    body: row.body,
    createdAt: row.createdAt,
  })) ?? [];

  return c.json({ slug, comments });
});

app.post("/api/comments", async (c) => {
  const slug = c.req.query("slug") ?? "";
  if (!slug) {
    return c.json({ error: "missing slug" }, 400);
  }

  const { body } = await c.req
    .json<{ body?: string }>()
    .catch(() => ({ body: "" }));
  const trimmed = body?.trim();
  if (!trimmed) {
    return c.json({ error: "コメント本文を入力してください" }, 400);
  }

  const id = crypto.randomUUID();
  const createdAt = Math.floor(Date.now() / 1000);
  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const ipHash = await digest(ip, slug, createdAt);

  await c.env.COMMENTS_DB.prepare(
    `INSERT INTO comments (id, post_slug, body, created_at, ip_hash)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(id, slug, trimmed, createdAt, ipHash)
    .run();

  return c.json({ ok: true, id, createdAt });
});

async function digest(ip: string, slug: string, timestamp: number): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${ip}:${slug}:${timestamp}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default app;

import { Hono } from "hono";
import { cors } from "hono/cors";

export type Bindings = {
  DB: D1Database;
  RATE_LIMITER?: KVNamespace;
  ADMIN_SECRET: string;
};

export type Env = Bindings;

const app = new Hono<{ Bindings: Bindings }>();

// --- Admin Routes with Auth ---
const admin = new Hono<{ Bindings: Bindings }>();

const authMiddleware = async (c, next) => {
  if (!c.env.ADMIN_SECRET) {
    console.error('ADMIN_SECRET is not configured.');
    return c.json({ error: 'Server configuration error' }, 500);
  }
  const authHeader = c.req.header('Authorization');
  if (!authHeader || authHeader !== `Bearer ${c.env.ADMIN_SECRET}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};

admin.use('*', authMiddleware);

admin.delete('/articles/:slug', async (c) => {
    const slug = c.req.param('slug');
    if (!slug) {
        return c.json({ error: 'Missing slug' }, 400);
    }

    try {
        const { success } = await c.env.DB.prepare(
            `DELETE FROM articles WHERE slug = ?`
        ).bind(slug).run();

        if (success) {
            return c.json({ ok: true });
        } else {
            // This case might not be hit if DB errors throw exceptions
            return c.json({ error: 'Failed to delete article, or article not found' }, 404);
        }
    } catch (e) {
        console.error("Failed to delete article:", e);
        return c.json({ error: 'Database error' }, 500);
    }
});

admin.post('/categories', async (c) => {
    const { name, slug } = await c.req.json();
    if (!name || !slug) {
        return c.json({ error: 'Missing name or slug' }, 400);
    }
    try {
        const { success } = await c.env.DB.prepare(
            `INSERT INTO categories (name, slug) VALUES (?, ?)`
        ).bind(name, slug).run();
        return c.json({ ok: success });
    } catch (e) {
        console.error("Failed to create category:", e);
        return c.json({ error: 'Failed to create category' }, 500);
    }
});

admin.put('/categories/:id', async (c) => {
    const id = c.req.param('id');
    const { name, slug } = await c.req.json();
    if (!name || !slug) {
        return c.json({ error: 'Missing name or slug' }, 400);
    }
    try {
        const { success } = await c.env.DB.prepare(
            `UPDATE categories SET name = ?, slug = ? WHERE id = ?`
        ).bind(name, slug, id).run();
        return c.json({ ok: success });
    } catch (e) {
        console.error("Failed to update category:", e);
        return c.json({ error: 'Failed to update category' }, 500);
    }
});

admin.delete('/categories/:id', async (c) => {
    const id = c.req.param('id');
    const { count } = await c.env.DB.prepare(
        `SELECT COUNT(*) as count FROM articles WHERE category_id = ?`
    ).bind(id).first();

    if (count > 0) {
        return c.json({ error: `Cannot delete category, it is in use by ${count} articles.` }, 400);
    }

    try {
        const { success } = await c.env.DB.prepare(
            `DELETE FROM categories WHERE id = ?`
        ).bind(id).run();
        return c.json({ ok: success });
    } catch (e) {
        console.error("Failed to delete category:", e);
        return c.json({ error: 'Failed to delete category' }, 500);
    }
});

admin.post('/tags', async (c) => {
    const { name, slug } = await c.req.json();
    if (!name || !slug) {
        return c.json({ error: 'Missing name or slug' }, 400);
    }
    try {
        const { success } = await c.env.DB.prepare(
            `INSERT INTO tags (name, slug) VALUES (?, ?)`
        ).bind(name, slug).run();
        return c.json({ ok: success });
    } catch (e) {
        console.error("Failed to create tag:", e);
        return c.json({ error: 'Failed to create tag' }, 500);
    }
});

admin.put('/tags/:id', async (c) => {
    const id = c.req.param('id');
    const { name, slug } = await c.req.json();
    if (!name || !slug) {
        return c.json({ error: 'Missing name or slug' }, 400);
    }
    try {
        const { success } = await c.env.DB.prepare(
            `UPDATE tags SET name = ?, slug = ? WHERE id = ?`
        ).bind(name, slug, id).run();
        return c.json({ ok: success });
    } catch (e) {
        console.error("Failed to update tag:", e);
        return c.json({ error: 'Failed to update tag' }, 500);
    }
});

admin.delete('/tags/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const { success } = await c.env.DB.prepare(
            `DELETE FROM tags WHERE id = ?`
        ).bind(id).run();
        return c.json({ ok: success });
    } catch (e) {
        console.error("Failed to delete tag:", e);
        return c.json({ error: 'Failed to delete tag' }, 500);
    }
});

admin.post('/articles', async (c) => {
    const body = await c.req.json();
    const { title, slug, content, excerpt, thumbnail, published_at, is_premium, author, category_id, tag_ids } = body;

    if (!title || !slug || !content) {
        return c.json({ error: 'Missing required fields: title, slug, content' }, 400);
    }

    try {
        await c.env.DB.prepare(
            `INSERT INTO articles (title, slug, content, excerpt, thumbnail, published_at, is_premium, author, category_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(title, slug, content, excerpt, thumbnail, published_at, is_premium, author, category_id).run();

        const { id: article_id } = await c.env.DB.prepare(
            `SELECT id FROM articles WHERE slug = ?`
        ).bind(slug).first();

        if (tag_ids && tag_ids.length > 0) {
            const stmts = tag_ids.map(tag_id => 
                c.env.DB.prepare(`INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)`).bind(article_id, tag_id)
            );
            await c.env.DB.batch(stmts);
        }

        return c.json({ ok: true, slug });

    } catch (e) {
        console.error("Failed to create article:", e);
        return c.json({ error: 'Failed to create article' }, 500);
    }
});

admin.put('/articles/:slug', async (c) => {
    const currentSlug = c.req.param('slug');
    const body = await c.req.json();
    const { title, slug, content, excerpt, thumbnail, published_at, is_premium, author, category_id, tag_ids } = body;

    if (!title || !slug || !content) {
        return c.json({ error: 'Missing required fields: title, slug, content' }, 400);
    }

    try {
        const data = await c.env.DB.prepare(
            `SELECT id FROM articles WHERE slug = ?`
        ).bind(currentSlug).first();

        if (!data) {
            return c.json({ error: 'Article not found' }, 404);
        }
        const article_id = data.id;

        await c.env.DB.prepare(
            `UPDATE articles SET title = ?, slug = ?, content = ?, excerpt = ?, thumbnail = ?, published_at = ?, is_premium = ?, author = ?, category_id = ?, updated_at = strftime('%s', 'now')
             WHERE id = ?`
        ).bind(title, slug, content, excerpt, thumbnail, published_at, is_premium, author, category_id, article_id).run();

        // Update tags
        await c.env.DB.prepare(`DELETE FROM article_tags WHERE article_id = ?`).bind(article_id).run();
        if (tag_ids && tag_ids.length > 0) {
            const stmts = tag_ids.map(tag_id => 
                c.env.DB.prepare(`INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)`).bind(article_id, tag_id)
            );
            await c.env.DB.batch(stmts);
        }

        return c.json({ ok: true, slug });

    } catch (e) {
        console.error("Failed to update article:", e);
        return c.json({ error: 'Failed to update article' }, 500);
    }
});

app.route('/api', admin);
// --- End Admin Routes ---

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

  await c.env.DB.prepare(
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

  const { results } = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM article_views WHERE post_slug = ?`
  )
    .bind(slug)
    .all<{ count: number }>();

  const count = results?.[0]?.count ?? 0;
  return c.json({ slug, viewCount: count });
});

// 全記事の閲覧数を取得
app.get("/api/views/all", async (c) => {
  const { results } = await c.env.DB.prepare(
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

app.get("/api/articles/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!slug) {
    return c.json({ error: "missing slug" }, 400);
  }

  const article = await c.env.DB.prepare(
    `SELECT
        a.slug, a.title, a.content, a.excerpt, a.thumbnail,
        a.published_at as publishedAt, a.is_premium as isPremium, a.author,
        c.name as category,
        (SELECT COUNT(*) FROM article_views v WHERE v.post_slug = a.slug) as viewCount
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ?`
  ).bind(slug).first();

  if (!article) {
    return c.json({ error: "Article not found" }, 404);
  }

  const { results: tags } = await c.env.DB.prepare(
    `SELECT t.name, t.slug FROM tags t
     INNER JOIN article_tags at ON t.id = at.tag_id
     INNER JOIN articles a ON at.article_id = a.id
     WHERE a.slug = ?`
  ).bind(slug).all();

  return c.json({ ...article, tags: tags || [] });
});

app.get("/api/articles", async (c) => {
  const page = parseInt(c.req.query("page") || "1", 10);
  const pageSize = parseInt(c.req.query("pageSize") || "10", 10);
  const categorySlug = c.req.query("category");
  const tagSlug = c.req.query("tag");
  const searchQuery = c.req.query("q");
  const sortBy = c.req.query("sortBy");
  const offset = (page - 1) * pageSize;

  let orderBySql = "ORDER BY a.published_at DESC";
  if (sortBy === 'popular') {
    // Note: This assumes viewCount is available in the query, which it is.
    orderBySql = "ORDER BY viewCount DESC";
  }

  const whereClauses = [];
  const bindings = [];

  if (categorySlug && categorySlug !== 'all') {
    whereClauses.push("c.slug = ?");
    bindings.push(categorySlug);
  }

  if (tagSlug) {
    whereClauses.push("a.id IN (SELECT at.article_id FROM article_tags at JOIN tags t ON at.tag_id = t.id WHERE t.slug = ?)");
    bindings.push(tagSlug);
  }

  if (searchQuery) {
    whereClauses.push("(a.title LIKE ? OR a.content LIKE ?)");
    bindings.push(`%${searchQuery}%`);
    bindings.push(`%${searchQuery}%`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const articlesQuery = `
      SELECT
        a.slug, a.title, a.excerpt, a.thumbnail, a.author,
        a.published_at as publishedAt, a.is_premium as isPremium,
        c.name as category,
        (SELECT COUNT(*) FROM article_views v WHERE v.post_slug = a.slug) as viewCount,
        (SELECT GROUP_CONCAT(t.name) FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = a.id) as tags
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereSql}
      ${orderBySql}
      LIMIT ? OFFSET ?`;
  
  const countQuery = `
      SELECT COUNT(*) as count
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereSql}`;

  const articlesBindings = [...bindings, pageSize, offset];
  const countBindings = [...bindings];

  const { results } = await c.env.DB.prepare(articlesQuery).bind(...articlesBindings).all();
  
  const articles = results.map(article => ({
    ...article,
    tags: article.tags ? article.tags.split(',') : [],
  }));

  const { count } = await c.env.DB.prepare(countQuery).bind(...countBindings).first();

  return c.json({
    articles: articles || [],
    totalPages: Math.ceil(count / pageSize),
    currentPage: page,
  });
});

app.get("/api/categories", async (c) => {
  const { results: categories } = await c.env.DB.prepare(
    `SELECT
        c.id,
        c.name,
        c.slug,
        COUNT(a.id) as count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.name`
  ).all();

  return c.json(categories || []);
});

app.get("/api/tags", async (c) => {
  const { results: tags } = await c.env.DB.prepare(
    `SELECT
        t.id,
        t.name,
        t.slug,
        COUNT(at.article_id) as count
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      GROUP BY t.id, t.name, t.slug
      ORDER BY count DESC`
  ).all();

  return c.json(tags || []);
});

app.get("/api/stats", async (c) => {
  const { totalArticles } = await c.env.DB.prepare(
    `SELECT COUNT(*) as totalArticles FROM articles`
  ).first();

  const { totalViews } = await c.env.DB.prepare(
    `SELECT COUNT(*) as totalViews FROM article_views`
  ).first();

  const { totalCategories } = await c.env.DB.prepare(
    `SELECT COUNT(*) as totalCategories FROM categories`
  ).first();

  return c.json({
    totalArticles: totalArticles || 0,
    totalViews: totalViews || 0,
    totalCategories: totalCategories || 0,
  });
});

app.get("/api/comments", async (c) => {
  const slug = c.req.query("slug");
  if (!slug) {
    return c.json({ error: "missing slug" }, 400);
  }

  const { results } = await c.env.DB.prepare(
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

  await c.env.DB.prepare(
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

// Root handler
app.get("/", (c) => {
  return c.json({
    name: "Takayama API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      articles: "/api/articles",
      categories: "/api/categories",
      tags: "/api/tags",
      stats: "/api/stats",
    },
  });
});

export default app;

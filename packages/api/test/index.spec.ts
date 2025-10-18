import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import worker from "../src";

const ensureSchema = async () => {
  // Updated to use DB binding instead of COMMENTS_DB
  // Create categories table first (required by articles foreign key)
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT,
      category_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, tag_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `).run();
};

describe("takayama API", () => {
  beforeAll(async () => {
    await ensureSchema();
  });

  beforeEach(async () => {
    // Clean up test data
    await env.DB.prepare("DELETE FROM articles").run();
  });

  it("responds to health check", async () => {
    const request = new Request("http://example.com/api/health");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it.skip("rejects comment requests without slug", async () => {
    // Skipped: Old comment API test - no longer applicable
    const request = new Request("http://example.com/api/comments");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
  });

  it.skip("accepts comment payloads and stores them", async () => {
    // Skipped: Old comment API test - no longer applicable
    const body = JSON.stringify({ body: "テストコメント" });
    const request = new Request("http://example.com/api/comments?slug=hello-world", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    const postResponse = await SELF.fetch(request);

    expect(postResponse.status).toBe(200);
    const { ok, id } = await postResponse.json<{ ok: boolean; id: string }>();
    expect(ok).toBe(true);
    expect(id).toMatch(/[0-9a-f-]{36}/i);

    const getResponse = await SELF.fetch("http://example.com/api/comments?slug=hello-world");
    const data = await getResponse.json();
    expect(getResponse.status).toBe(200);
    expect(data.comments).toHaveLength(1);
    expect(data.comments[0].body).toBe("テストコメント");
  });
});

import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import worker from "../src";

const ensureSchema = async () => {
  await env.COMMENTS_DB.prepare(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_slug TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      ip_hash TEXT
    )
  `).run();
  await env.COMMENTS_DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_comments_post_slug_created_at
      ON comments (post_slug, created_at DESC)
  `).run();
};

describe("takayama comment API", () => {
  beforeAll(async () => {
    await ensureSchema();
  });

  beforeEach(async () => {
    await env.COMMENTS_DB.prepare("DELETE FROM comments").run();
  });

  it("responds to health check", async () => {
    const request = new Request("http://example.com/api/health");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("rejects comment requests without slug", async () => {
    const request = new Request("http://example.com/api/comments");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
  });

  it("accepts comment payloads and stores them", async () => {
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

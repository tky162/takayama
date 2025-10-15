-- Migration: create views table
CREATE TABLE IF NOT EXISTS article_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  viewed_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_article_views_post_slug
  ON article_views (post_slug);

CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at
  ON article_views (viewed_at DESC);

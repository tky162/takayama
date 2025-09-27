-- Migration: create comments table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_slug TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_post_slug_created_at
  ON comments (post_slug, created_at DESC);

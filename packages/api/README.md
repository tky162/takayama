# api

Cloudflare Workers (Hono) でコメント API を提供します。`wrangler.toml` （リポジトリルート）で D1/KV をバインドしています。

## D1 データベース

- 名前: `takayama-db`
- Cloudflare Dashboard で確認できる `database_id` を `wrangler.toml` の `d1_databases[0].database_id` に設定してください。
- 設定後に次のコマンドでリモートへマイグレーションを適用します。

```bash
pnpm --filter api exec wrangler d1 migrations apply takayama-db
```

## 主なエンドポイント

- `GET /api/health` — ヘルスチェック
- `GET /api/comments?slug=...` — コメント一覧（実装予定）
- `POST /api/comments?slug=...` — コメント投稿

## 開発

```bash
pnpm dev
```

Wrangler はリポジトリルートの `wrangler.toml` を参照します。D1/KV バインディングを設定後に実行してください。

## テスト

```bash
pnpm test
```

Vitest + `@cloudflare/vitest-pool-workers` で API の振る舞いを検証します。

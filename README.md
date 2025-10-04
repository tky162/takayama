# takayama

Cloudflare Pages + Workers + D1 を前提に構築する高山ブログのモノレポです。`packages/frontend` に Next.js アプリ、`packages/api` に Cloudflare Workers API、`packages/shared` に共有型定義をまとめています。

## ディレクトリ構成

```
packages/
  frontend/   # Cloudflare Pages で配信する Next.js アプリ (Markdown 記事をSSG)
  api/        # コメントAPIなどを提供する Cloudflare Workers サービス
  shared/     # 型定義やユーティリティの共有パッケージ
scripts/      # 補助スクリプト用 (未実装)
wrangler.toml # Workers / D1 / KV のバインディング設定
```

## セットアップ

```bash
pnpm install
```

- フロントエンド開発: `pnpm dev:frontend` (http://localhost:3000)
- Worker ローカル実行: `pnpm dev:api` (http://localhost:8787)
- 全体ビルド: `pnpm build`
- API テスト: `pnpm test`

## Cloudflare バインディング

`wrangler.toml` には D1/KV をプレースホルダ ID で登録しています。
本番用の ID は Cloudflare ダッシュボードで作成後に更新してください。

```
[[d1_databases]]
  binding = "COMMENTS_DB"
  database_name = "takayama-db"
  database_id = "..."

[[kv_namespaces]]
  binding = "RATE_LIMITER"
  id = "..."
```

## 次のステップ

1. Cloudflare D1 のスキーマを `packages/api/migrations/` で定義し、`wrangler d1 migrations apply` で反映。
2. `packages/frontend` のコメントフォームと API 呼び出しを実装。
3. GitHub Actions（`.github/workflows/`）を追加して CI/CD を構成。

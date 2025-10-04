# frontend

Cloudflare Pages で配信する Next.js (App Router) アプリです。`content/` 配下の Markdown ファイルを SSG し、記事ページを生成します。

## 開発

```bash
pnpm dev
```

- トップページ: `src/app/page.tsx` が記事一覧を表示します。
- 個別記事: `src/app/blog/[slug]/page.tsx` が Markdown を HTML に変換して表示します。
- 記事データ: `content/*.md` に front-matter 付きで追加します。

コメント機能を有効にするには `.env.local` 等で API のエンドポイントを指定します。

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

## ビルド

```bash
pnpm build
```

Cloudflare Pages では `pnpm install && pnpm --filter frontend build` を想定しています。

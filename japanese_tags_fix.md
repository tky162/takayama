# 日本語タグの404エラー修正について

## 原因

日本語のようなマルチバイト文字を含むタグがURLで正しく扱われていなかったため、404エラーが発生していました。

具体的には、`美少女` というタグが `https://takayamalog.com/tags/美少女` というURLになり、ブラウザによって `https://takayamalog.com/tags/%E7%BE%8E%E5%B0%91%E5%A5%B3` のようにエンコードされます。しかし、Next.jsのサーバーサイドでのルーティングが、このエンコードされたURLを静的に生成されたページと正しく結びつけられていませんでした。

## 対策

以下の3段階の修正を行いました。

### 1. タグのスラッグをURLエンコード

タグからページパス（スラッグ）を生成する際に、`encodeURIComponent` を使ってURLセーフな文字列に変換するようにしました。また、大文字小文字を区別しないように、スラッグを小文字に統一しました。

**修正ファイル:** `packages/frontend/src/lib/articles-server.ts`
**修正関数:** `getAllTagsWithCounts`

```typescript
// 修正前
.map(([name, count]) => ({ name, slug: name, count }))

// 修正後
.map(([name, count]) => ({
  name,
  slug: encodeURIComponent(name.toLowerCase()),
  count,
}))
```

### 2. 記事取得時にスラッグをデコード

タグのページでは、URLエンコードされたスラッグが渡されるため、`decodeURIComponent` を使って元のタグ名に戻してから、記事を検索するように修正しました。

**修正ファイル:** `packages/frontend/src/lib/articles-server.ts`
**修正関数:** `getArticlesByTag`

```typescript
// 修正前
return allArticles.filter(article => article.tags.includes(tagSlug))

// 修正後
try {
  const tagName = decodeURIComponent(tagSlug)
  return allArticles.filter(article =>
    article.tags.some(tag => tag.toLowerCase() === tagName)
  )
} catch (e) {
  console.error(`Invalid tag slug: ${tagSlug}`, e)
  return []
}
```

### 3. 表示コンポーネントでのデコード

タグページで、エンコードされたタグ名がそのまま表示されるのを防ぐため、表示する直前にデコード処理を追加しました。

**修正ファイル:** `packages/frontend/src/app/tags/[tag]/page.tsx`

```typescript
// 修正前
// ... {tag} ...

// 修正後
const decodedTag = decodeURIComponent(tag)
// ... {decodedTag} ...
```

これらの修正により、日本語タグのページが正しく表示されるようになります。

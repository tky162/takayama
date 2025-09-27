export type Comment = {
  id: string;
  body: string;
  createdAt: number;
};

export type CommentResponse = {
  slug: string;
  comments: Comment[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

function ensureBaseUrl(): string {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  return API_BASE;
}

function endpoint(path: string) {
  const base = ensureBaseUrl();
  return `${base}${path}`;
}

export async function fetchComments(slug: string): Promise<CommentResponse> {
  const res = await fetch(endpoint(`/api/comments?slug=${encodeURIComponent(slug)}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch comments (${res.status})`);
  }

  return res.json();
}

export async function postComment(slug: string, body: string): Promise<void> {
  const res = await fetch(endpoint(`/api/comments?slug=${encodeURIComponent(slug)}`), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "投稿に失敗しました" }));
    throw new Error(error ?? "Failed to post comment");
  }
}

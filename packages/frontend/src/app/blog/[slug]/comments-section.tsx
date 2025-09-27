'use client';

import { useEffect, useMemo, useState, useTransition } from "react";

import type { Comment } from "@/lib/comments";
import { fetchComments, postComment } from "@/lib/comments";

type CommentsSectionProps = {
  slug: string;
  initialComments: Comment[];
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function CommentsSection({ slug, initialComments }: CommentsSectionProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiConfigured = Boolean(apiBase);

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [isRefreshing, startRefresh] = useTransition();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const hasComments = comments.length > 0;

  const refresh = () => {
    if (!apiConfigured) {
      setError("APIの接続先が設定されていません");
      return;
    }

    startRefresh(async () => {
      try {
        const data = await fetchComments(slug);
        setComments(data.comments);
        setError(null);
      } catch (error) {
        console.error("[comments] refresh failed", error);
        setError("コメントの取得に失敗しました");
      }
    });
  };

  const handleSubmit = async (body: string) => {
    if (!apiConfigured) {
      setError("APIの接続先が設定されていません");
      throw new Error("APIの接続先が設定されていません");
    }

    setStatus("submitting");
    setError(null);

    try {
      await postComment(slug, body);
      setStatus("success");
      await fetchComments(slug).then((data) => setComments(data.comments));
    } catch (err) {
      console.error("[comments] post failed", err);
      const message = err instanceof Error ? err.message : "投稿に失敗しました";
      setError(message);
      setStatus("error");
      throw err;
    }
  };

  const hintMessage = useMemo(() => {
    if (status === "success") {
      return "投稿が完了しました。反映まで数秒かかる場合があります。";
    }

    if (status === "error" && error) {
      return error;
    }

    return undefined;
  }, [status, error]);

  return (
    <section style={{ marginTop: "4rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>コメント</h2>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          認証なしで投稿できます。公序良俗に反する内容は削除対象となります。
        </p>
        {!apiConfigured ? (
          <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>
            コメントAPIの接続先が設定されていません。`NEXT_PUBLIC_API_BASE_URL` を指定してください。
          </p>
        ) : null}
      </header>

      <CommentForm
        onSubmit={handleSubmit}
        isSubmitting={status === "submitting"}
        disabled={!apiConfigured}
        hint={hintMessage}
      />

      <div style={{ marginTop: "2rem" }}>
        {isRefreshing ? <p>再読込中...</p> : null}
        {hasComments ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1.5rem" }}>
            {comments.map((comment) => (
              <li
                key={comment.id}
                style={{ border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.25rem" }}
              >
                <p style={{ marginBottom: "0.75rem", color: "#111827" }}>{comment.body}</p>
                <time
                  dateTime={new Date(comment.createdAt * 1000).toISOString()}
                  style={{ display: "block", fontSize: "0.85rem", color: "#6b7280" }}
                >
                  {new Date(comment.createdAt * 1000).toLocaleString("ja-JP")}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#6b7280" }}>まだコメントはありません。最初の感想をシェアしましょう。</p>
        )}
      </div>

      <button
        type="button"
        onClick={refresh}
        disabled={!apiConfigured}
        style={{
          marginTop: "1.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          cursor: !apiConfigured ? "not-allowed" : "pointer",
          opacity: !apiConfigured ? 0.6 : 1,
        }}
      >
        最新のコメントを取得
      </button>
    </section>
  );
}

type CommentFormProps = {
  onSubmit: (body: string) => Promise<void>;
  isSubmitting: boolean;
  disabled?: boolean;
  hint?: string;
};

function CommentForm({ onSubmit, isSubmitting, disabled = false, hint }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = body.trim();

    if (trimmed.length < 5) {
      setLocalError("5文字以上で入力してください");
      return;
    }

    setLocalError(null);

    try {
      await onSubmit(trimmed);
      setBody("");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "投稿に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
      <label htmlFor="comment-body" style={{ fontWeight: 500 }}>
        コメント本文
      </label>
      <textarea
        id="comment-body"
        name="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        style={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: "0.75rem",
          padding: "0.75rem",
          fontSize: "1rem",
          resize: "vertical",
        }}
        placeholder="投稿への感想や質問などを記入してください"
        disabled={isSubmitting || disabled}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          type="submit"
          disabled={isSubmitting || disabled}
          style={{
            backgroundColor: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "0.75rem",
            padding: "0.6rem 1.2rem",
            cursor: isSubmitting || disabled ? "not-allowed" : "pointer",
            opacity: isSubmitting || disabled ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "送信中..." : "コメントを投稿"}
        </button>
        {hint ? <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>{hint}</p> : null}
      </div>
      {localError ? <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{localError}</p> : null}
    </form>
  );
}

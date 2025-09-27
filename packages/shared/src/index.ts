export type CommentPayload = {
  slug: string;
  body: string;
};

export type CommentRecord = CommentPayload & {
  id: string;
  createdAt: string;
};

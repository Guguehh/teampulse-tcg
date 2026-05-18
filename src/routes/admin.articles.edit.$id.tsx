import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticle, upsertArticle } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/articles/edit/$id")({
  loader: ({ params }) => {
    const article = getArticle(params.id);
    return { article };
  },
  component: EditArticle,
  head: () => ({ meta: [{ title: "Edit Article — Admin" }] }),
});

function EditArticle() {
  const navigate = useNavigate();
  const { article } = Route.useLoaderData();

  if (!article) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="font-display text-xl font-bold">Article not found</div>
      </div>
    );
  }

  return (
    <ArticleForm
      mode="edit"
      initial={article}
      onCancel={() => navigate({ to: "/admin/articles" })}
      onSave={(next) => {
        upsertArticle(next);
        navigate({ to: "/admin/articles" });
      }}
    />
  );
}

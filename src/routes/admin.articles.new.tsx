import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { upsertArticle } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/articles/new")({
  component: NewArticle,
  head: () => ({ meta: [{ title: "New Article — Admin" }] }),
});

function NewArticle() {
  const navigate = useNavigate();
  return (
    <ArticleForm
      mode="new"
      onCancel={() => navigate({ to: "/admin/articles" })}
      onSave={(next) => {
        upsertArticle(next);
        navigate({ to: "/admin/articles" });
      }}
    />
  );
}

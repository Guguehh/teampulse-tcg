import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { deleteArticle, listArticles } from "@/lib/admin/db";
import { ShareMenu } from "@/components/admin/ShareMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/articles")({
  component: AdminArticles,
  head: () => ({ meta: [{ title: "Admin Articles — TeamPulse" }] }),
});

function AdminArticles() {
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "scheduled" | "published">("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("admin-db-changed", onChange);
    return () => window.removeEventListener("admin-db-changed", onChange);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [q, status]);

  const { total, items } = useMemo(() => {
    void tick;
    const all = listArticles()
      .filter((a) => (q ? a.title.toLowerCase().includes(q.toLowerCase()) : true))
      .filter((a) => (status === "all" ? true : a.status === status))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const start = (page - 1) * pageSize;
    return { total: all.length, items: all.slice(start, start + pageSize) };
  }, [tick, q, status, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-2xl font-bold">Articles & News</div>
          <div className="text-sm text-muted-foreground">{total} items</div>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/articles/new">
            <Plus className="h-4 w-4" /> Create Article
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="pl-9"
            />
          </div>
          <label className="grid gap-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as never)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
            >
              <option value="all">All</option>
              <option value="draft">draft</option>
              <option value="scheduled">scheduled</option>
              <option value="published">published</option>
            </select>
          </label>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end sm:gap-3">
            <div className="text-xs text-muted-foreground">
              Page {page} / {totalPages}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
              <div className="h-24 w-full overflow-hidden rounded-lg border border-border bg-surface sm:h-16 sm:w-28">
                {a.bannerUrl ? (
                  <img src={a.bannerUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{a.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{a.category}</Badge>
                  <Badge
                    variant={
                      a.status === "published"
                        ? "default"
                        : a.status === "draft"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {a.status}
                  </Badge>
                  <span className="truncate">/{a.slug}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button asChild size="sm" variant="secondary">
                  <Link to="/admin/articles/edit/$id" params={{ id: a.id }}>
                    Edit
                  </Link>
                </Button>
                <ShareMenu url={`${origin}/noticias#${a.slug}`} text={a.title} />
                <Button asChild size="sm" variant="secondary">
                  <a href={`/noticias#${a.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <DeleteArticleButton id={a.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteArticleButton({ id }: { id: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete article?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteArticle(id)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

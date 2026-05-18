import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpenText,
  Images,
  Layers,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { listArticles, listMedia, listProducts } from "@/lib/admin/db";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin Dashboard — TeamPulse" }] }),
});

function AdminDashboard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("admin-db-changed", onChange);
    return () => window.removeEventListener("admin-db-changed", onChange);
  }, []);

  const { stats, latestProducts, latestArticles } = useMemo(() => {
    void tick;
    const products = listProducts();
    const articles = listArticles();
    const media = listMedia();
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3);
    return {
      stats: {
        totalProducts: products.length,
        totalArticles: articles.length,
        lowStockCount: lowStock.length,
        totalMedia: media.length,
      },
      latestProducts: products.slice(0, 5),
      latestArticles: articles.slice(0, 5),
    };
  }, [tick]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overview
          </div>
          <div className="font-display text-2xl font-bold">Dashboard</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="gap-2">
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <Link to="/admin/articles/new">
              <Plus className="h-4 w-4" /> Create Article
            </Link>
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <Link to="/admin/media">
              <Images className="h-4 w-4" /> Upload Media
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={String(stats.totalProducts)}
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          label="Latest Articles"
          value={String(stats.totalArticles)}
          icon={<BookOpenText className="h-5 w-5" />}
        />
        <StatCard
          label="Low Stock"
          value={String(stats.lowStockCount)}
          icon={<ShieldAlert className="h-5 w-5" />}
        />
        <StatCard
          label="Media Items"
          value={String(stats.totalMedia)}
          icon={<Images className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-display font-bold">Recently Added Products</div>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Open <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {latestProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.category} • Stock {p.stock} • {p.status}
                  </div>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/admin/products/edit/$id" params={{ id: p.id }}>
                    Edit
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-display font-bold">Latest Articles</div>
            <Link
              to="/admin/articles"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Open <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {latestArticles.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.category} • {a.status}
                  </div>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/admin/articles/edit/$id" params={{ id: a.id }}>
                    Edit
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

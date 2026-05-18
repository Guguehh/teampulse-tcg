import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { deleteProduct, listProducts } from "@/lib/admin/db";
import { formatPrice, type Category, EXPANSIONS, LANGUAGES, RARITIES } from "@/data/products";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
  head: () => ({ meta: [{ title: "Admin Products — TeamPulse" }] }),
});

type StockFilter = "all" | "in" | "out" | "low";

function AdminProducts() {
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [rarity, setRarity] = useState<string>("all");
  const [lang, setLang] = useState<string>("all");
  const [exp, setExp] = useState<string>("all");
  const [stock, setStock] = useState<StockFilter>("all");
  const [sort, setSort] = useState<"newest" | "name" | "price" | "stock">("newest");
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
  }, [q, category, rarity, lang, exp, stock, sort]);

  const { total, items } = useMemo(() => {
    void tick;
    const all = listProducts();
    const filtered = all
      .filter((p) => (q ? p.name.toLowerCase().includes(q.toLowerCase()) : true))
      .filter((p) => (category === "all" ? true : p.category === category))
      .filter((p) => (rarity === "all" ? true : p.single?.rarity === rarity))
      .filter((p) => (lang === "all" ? true : p.single?.language === lang))
      .filter((p) => (exp === "all" ? true : p.single?.expansion === exp))
      .filter((p) => {
        if (stock === "all") return true;
        if (stock === "out") return p.stock === 0;
        if (stock === "low") return p.stock > 0 && p.stock <= 3;
        return p.stock > 0;
      })
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "price") return b.price - a.price;
        if (sort === "stock") return b.stock - a.stock;
        return b.updatedAt.localeCompare(a.updatedAt);
      });

    const start = (page - 1) * pageSize;
    return { total: filtered.length, items: filtered.slice(start, start + pageSize) };
  }, [tick, q, category, rarity, lang, exp, stock, sort, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-2xl font-bold">Products</div>
          <div className="text-sm text-muted-foreground">{total} items</div>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_repeat(5,minmax(0,1fr))]">
          <div className="relative md:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="pl-9"
            />
          </div>
          <Select
            value={category}
            onChange={(v) => setCategory(v as Category | "all")}
            label="Category"
            options={[
              "all",
              "singles",
              "cores",
              "playmats",
              "sleeves",
              "deckboxes",
              "mystery-boxes",
            ]}
          />
          <Select
            value={rarity}
            onChange={setRarity}
            label="Rarity"
            options={["all", ...RARITIES]}
          />
          <Select
            value={lang}
            onChange={setLang}
            label="Language"
            options={["all", ...LANGUAGES]}
          />
          <Select value={exp} onChange={setExp} label="Set" options={["all", ...EXPANSIONS]} />
          <Select
            value={stock}
            onChange={(v) => setStock(v as StockFilter)}
            label="Stock"
            options={["all", "in", "low", "out"]}
          />
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Page {page} / {totalPages}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={sort}
              onChange={(v) => setSort(v as typeof sort)}
              label="Sort"
              options={["newest", "name", "price", "stock"]}
            />
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

      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[72px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="h-12 w-12 overflow-hidden rounded-md border border-border bg-surface">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <StatusBadge status={p.status} />
                      {p.featured ? <Badge variant="secondary">Featured</Badge> : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{p.category}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {[p.single?.expansion, p.single?.rarity, p.single?.language]
                    .filter(Boolean)
                    .join(" • ")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm font-semibold">{p.stock}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.stock === 0 ? "Out" : p.stock <= 3 ? "Low" : "In"}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm font-semibold">
                  {formatPrice(p.price)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button asChild size="sm" variant="secondary">
                      <Link to="/admin/products/edit/$id" params={{ id: p.id }}>
                        Edit
                      </Link>
                    </Button>
                    <ShareMenu url={`${origin}/producto/${p.slug}`} text={p.name} />
                    <Button asChild size="sm" variant="secondary">
                      <a href={`/producto/${p.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <DeleteProductButton id={p.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex gap-3 p-3">
              <div className="h-16 w-16 overflow-hidden rounded-lg border border-border bg-surface">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.category} •{" "}
                  {[p.single?.expansion, p.single?.rarity, p.single?.language]
                    .filter(Boolean)
                    .join(" • ")}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <StatusBadge status={p.status} />
                  {p.featured ? <Badge variant="secondary">Featured</Badge> : null}
                  <Badge variant={p.stock === 0 ? "destructive" : "outline"}>
                    Stock: {p.stock}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border px-3 py-2">
              <div className="text-sm font-bold">{formatPrice(p.price)}</div>
              <div className="flex gap-1.5">
                <Button asChild size="sm" variant="secondary">
                  <Link to="/admin/products/edit/$id" params={{ id: p.id }}>
                    Edit
                  </Link>
                </Button>
                <ShareMenu url={`${origin}/producto/${p.slug}`} text={p.name} />
                <DeleteProductButton id={p.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "active" ? "default" : status === "draft" ? "secondary" : "outline";
  return <Badge variant={variant as never}>{status}</Badge>;
}

function DeleteProductButton({ id }: { id: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteProduct(id);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
      >
        {options.map((o) => (
          <option key={`${label}-${o}`} value={o}>
            {o === "all" ? "All" : o}
          </option>
        ))}
      </select>
    </label>
  );
}

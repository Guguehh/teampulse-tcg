import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Package, TriangleAlert } from "lucide-react";
import { listProducts, upsertProduct } from "@/lib/admin/db";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryPage,
  head: () => ({ meta: [{ title: "Inventory — Admin" }] }),
});

function InventoryPage() {
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("admin-db-changed", onChange);
    return () => window.removeEventListener("admin-db-changed", onChange);
  }, []);

  const items = useMemo(() => {
    void tick;
    return listProducts()
      .filter((p) => (q ? p.name.toLowerCase().includes(q.toLowerCase()) : true))
      .sort((a, b) => a.stock - b.stock);
  }, [tick, q]);

  const low = items.filter((p) => p.stock === 0 || p.stock <= 3);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-2xl font-bold">Inventory</div>
          <div className="text-sm text-muted-foreground">{low.length} low/out of stock</div>
        </div>
        <div className="w-full sm:w-80">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search inventory…" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-display font-bold">
            <TriangleAlert className="h-4 w-4 text-gold" /> Low Stock
          </div>
          <Button asChild variant="secondary" size="sm" className="gap-2">
            <Link to="/admin/products">
              <Package className="h-4 w-4" /> Manage Products
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {low.map((p) => (
                <InventoryRow key={p.id} id={p.id} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-4 py-3 font-display font-bold">All Products</div>
        <div className="divide-y divide-border">
          {items.slice(0, 20).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category}</div>
              </div>
              <div className="text-sm font-semibold">{formatPrice(p.price)}</div>
              <Badge
                variant={p.stock === 0 ? "destructive" : p.stock <= 3 ? "secondary" : "outline"}
              >
                Stock {p.stock}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InventoryRow({ id }: { id: string }) {
  const [tick, setTick] = useState(0);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    const p = listProducts().find((x) => x.id === id);
    setStock(p?.stock ?? 0);
  }, [id, tick]);

  const p = useMemo(() => {
    void tick;
    return listProducts().find((x) => x.id === id);
  }, [id, tick]);
  if (!p) return null;

  return (
    <TableRow>
      <TableCell>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{p.name}</div>
          <div className="text-xs text-muted-foreground">{p.category}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            p.status === "active" ? "default" : p.status === "draft" ? "secondary" : "outline"
          }
        >
          {p.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right text-sm font-semibold">{formatPrice(p.price)}</TableCell>
      <TableCell className="text-right">
        <Input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="h-9 w-24 text-right"
        />
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          onClick={() => {
            upsertProduct({ ...p, stock });
            setTick((t) => t + 1);
          }}
        >
          Save
        </Button>
      </TableCell>
    </TableRow>
  );
}

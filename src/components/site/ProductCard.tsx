import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { formatPrice, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <div className="group h-full overflow-hidden rounded-sm border border-border bg-card shadow-card transition hover:border-accent/40 hover:shadow-card-hover">
      <div className="flex h-full gap-3 p-3">
        <Link to="/producto/$slug" params={{ slug: product.slug }} className="shrink-0 self-start">
          <div className="w-24 sm:w-28">
            <div className="overflow-hidden rounded-sm border border-border bg-surface">
              <div className="aspect-3/4">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </Link>

        <div className="min-w-0 flex flex-1 flex-col justify-between">
          <div className="min-w-0">
            <Link
              to="/producto/$slug"
              params={{ slug: product.slug }}
              className="block min-h-9 line-clamp-2 text-sm font-bold leading-snug text-foreground hover:underline"
            >
              {product.name}
            </Link>

            <div className="mt-1 min-h-4 text-xs leading-4 text-info">
              {product.expansion ?? ""}
            </div>

            <div className="mt-1 min-h-4 text-[11px] font-semibold leading-4 text-info">
              {[product.rarity, product.cardCode].filter(Boolean).join(" • ") || ""}
            </div>

            <div className="mt-1 min-h-4 text-[11px] leading-4 text-info">
              {[product.language, product.condition].filter(Boolean).join(" • ") || ""}
            </div>

            <div
              className={`mt-1 min-h-4 text-[11px] font-semibold leading-4 ${
                product.stock === 0 ? "text-destructive" : "text-info"
              }`}
            >
              {product.stock === 0
                ? "Sin stock"
                : product.stock <= 3
                  ? `Últimas ${product.stock}`
                  : `${product.stock} en stock`}
            </div>
          </div>

          <div className="mt-3 border-t border-border pt-2">
            <div className="grid gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Precio
                </div>
                <div className="text-xl font-bold leading-none text-foreground whitespace-nowrap">
                  {formatPrice(product.price)}
                </div>
              </div>

              <div className="flex justify-end pr-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    add(product);
                    toast.success("Agregado al carrito", { description: product.name });
                  }}
                  disabled={product.stock === 0}
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-sm bg-gold px-3 text-xs font-semibold text-gold-foreground transition hover:opacity-95 disabled:opacity-50"
                  aria-label="Agregar al carrito"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Maximize2, ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import { PageWithAds } from "@/components/site/AdSlot";
import { ProductCard } from "@/components/site/ProductCard";
import { formatPrice, getProduct, PRODUCTS } from "@/data/products";
import { useCart, whatsappProductUrl } from "@/lib/cart";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/producto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Producto no encontrado</h1>
      <Link to="/catalog" className="mt-4 inline-block text-accent hover:underline">
        Volver al catálogo
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  return (
    <PageWithAds>
      <Link
        to="/catalog"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <Dialog>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <DialogTrigger asChild>
              <button className="group relative block w-full text-left">
                <div className="aspect-square overflow-hidden bg-surface">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                  <Maximize2 className="h-4 w-4" />
                  Zoom
                </div>
              </button>
            </DialogTrigger>
          </div>
          <DialogContent className="w-[calc(100vw-2rem)] overflow-hidden rounded-3xl p-0 sm:max-w-5xl">
            <div className="relative bg-black">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[85vh] w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent">
            {product.expansion || product.tier || product.category}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {product.rarity && <Badge>⭐ {product.rarity}</Badge>}
            {product.language && <Badge>🌐 {product.language}</Badge>}
            {product.condition && <Badge>✨ {product.condition}</Badge>}
            {product.tier && <Badge gold>🏆 Tier {product.tier}</Badge>}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-success">
                <Check className="h-4 w-4" /> {product.stock} en stock
              </span>
            ) : (
              <span className="text-sm font-semibold text-destructive">Sin stock</span>
            )}
          </div>

          {product.description && (
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-6 grid gap-2 rounded-2xl border border-border bg-surface/60 p-4 text-sm">
            <SpecRow label="Categoría" value={product.category.replace("-", " ")} />
            {product.expansion && <SpecRow label="Expansión" value={product.expansion} />}
            {product.rarity && <SpecRow label="Rareza" value={product.rarity} />}
            {product.language && <SpecRow label="Idioma" value={product.language} />}
            {product.condition && <SpecRow label="Condición" value={product.condition} />}
            <SpecRow
              label="Stock"
              value={product.stock > 0 ? `${product.stock} unidades` : "Sin stock"}
            />
          </div>

          {product.includedCards && (
            <div className="mt-5 rounded-xl border border-border bg-surface p-4">
              <h3 className="font-display font-bold">Cartas incluidas</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {product.includedCards.map((c: string) => (
                  <li key={c} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.guaranteedValue && (
            <div className="mt-5 rounded-xl border border-gold/30 bg-gold/10 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gold-foreground">
                Valor garantizado
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-primary">
                {formatPrice(product.guaranteedValue)}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full items-center rounded-sm border border-input bg-card sm:w-auto">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center text-lg font-bold"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                className="grid h-11 w-11 place-items-center text-lg font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                add(product, qty);
                toast.success(`${qty}× ${product.name} agregado`);
              }}
              disabled={product.stock === 0}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 font-semibold text-gold-foreground shadow-card transition hover:opacity-95 disabled:opacity-50 sm:flex-1"
            >
              <ShoppingCart className="h-5 w-5" /> Agregar al carrito
            </button>
          </div>
          <a
            href={whatsappProductUrl(product)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-sm border-2 border-success bg-success/5 px-6 py-3 font-semibold text-success transition hover:bg-success hover:text-success-foreground"
          >
            <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
          </a>

          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-4 w-4" /> Envíos a todo el NOA · Coordinás pago y entrega por
            WhatsApp
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">También te puede interesar</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </PageWithAds>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.11 17.53c-.24-.12-1.39-.69-1.61-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.4-1.33-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.48-.4-.41-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.39-.57 1.59-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z" />
      <path d="M26.67 15.91c0 5.89-4.79 10.68-10.68 10.68-1.88 0-3.72-.49-5.34-1.42l-4.16 1.09 1.11-4.06a10.63 10.63 0 0 1-1.6-5.68c0-5.89 4.79-10.68 10.68-10.68 5.89 0 10.68 4.79 10.68 10.68zm-10.68-8.83c-4.87 0-8.83 3.96-8.83 8.83 0 1.86.58 3.65 1.68 5.15l.15.21-.66 2.43 2.49-.65.2.12c1.45.86 3.12 1.31 4.98 1.31 4.87 0 8.83-3.96 8.83-8.83 0-4.87-3.96-8.83-8.83-8.83z" />
    </svg>
  );
}

function Badge({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span
      className={`rounded-sm px-2.5 py-1 text-xs font-semibold ${gold ? "bg-gold/20 text-gold-foreground" : "bg-secondary text-secondary-foreground"}`}
    >
      {children}
    </span>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

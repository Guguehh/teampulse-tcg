import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PageWithAds } from "@/components/site/AdSlot";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/carrito")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Carrito — TeamPulse" }] }),
});

function CartPage() {
  const { items, total, count, setQty, remove, whatsappUrl, clear } = useCart();

  if (items.length === 0) {
    return (
      <PageWithAds>
        <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface/50 p-16 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explorá el catálogo y armá tu pedido.
          </p>
          <Link
            to="/catalog"
            className="mt-5 inline-flex rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-accent"
          >
            Ir al catálogo
          </Link>
        </div>
      </PageWithAds>
    );
  }

  return (
    <PageWithAds>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Tu carrito</h1>
          <p className="text-sm text-muted-foreground">
            {count} {count === 1 ? "producto" : "productos"}
          </p>
        </div>
        <button onClick={clear} className="text-sm font-semibold text-destructive hover:underline">
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex gap-4 rounded-xl border border-border bg-card p-3 shadow-card"
            >
              <Link
                to="/producto/$slug"
                params={{ slug: i.slug }}
                className="block h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface"
              >
                <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link
                  to="/producto/$slug"
                  params={{ slug: i.slug }}
                  className="font-semibold hover:text-accent"
                >
                  {i.name}
                </Link>
                <div className="text-sm text-muted-foreground">{formatPrice(i.price)} c/u</div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-input">
                    <button
                      onClick={() => setQty(i.id, i.qty - 1)}
                      className="grid h-8 w-8 place-items-center"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <button
                      onClick={() => setQty(i.id, i.qty + 1)}
                      className="grid h-8 w-8 place-items-center"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="font-display font-bold text-primary">
                    {formatPrice(i.price * i.qty)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => remove(i.id)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-lg font-bold">Resumen</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(total)} />
              <Row label="Envío" value="A coordinar" muted />
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-display font-bold">Total</span>
              <span className="font-display text-2xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-success px-6 py-3 font-semibold text-success-foreground shadow-glow transition hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" /> Finalizar por WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Coordinás pago y entrega por chat. No procesamos pagos online.
            </p>
          </div>
        </aside>
      </div>
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

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-semibold"}>{value}</span>
    </div>
  );
}

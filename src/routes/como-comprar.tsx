import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { PageWithAds } from "@/components/site/AdSlot";
import { WHATSAPP_NUMBER } from "@/lib/cart";

export const Route = createFileRoute("/como-comprar")({
  component: HowToBuyPage,
  head: () => ({ meta: [{ title: "Cómo comprar — TeamPulse" }] }),
});

function HowToBuyPage() {
  return (
    <PageWithAds>
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-accent">Guía rápida</div>
        <h1 className="font-display text-3xl font-bold">Cómo comprar</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Comprás por WhatsApp: armás tu carrito, confirmás el pedido y coordinamos pago y entrega.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StepCard
          n="1"
          title="Explorá el catálogo"
          desc="Filtrá por categoría, rareza, idioma y set. Abrí las cartas para ver detalles."
        />
        <StepCard
          n="2"
          title="Agregá al carrito"
          desc="Sumá los productos que querés. Si algo dice “Sin stock”, consultanos por reposición."
        />
        <StepCard
          n="3"
          title="Finalizá por WhatsApp"
          desc="Se genera un mensaje con tu pedido. Lo enviás y coordinamos todo por chat."
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-sm border border-border bg-card p-5 shadow-card">
          <div className="font-display text-lg font-bold">Qué pasa después</div>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <Row text="Confirmamos stock y condición del producto." />
            <Row text="Coordinamos el medio de pago." />
            <Row text="Coordinamos entrega/envío según tu zona." />
            <Row text="Si necesitás una carta específica, te la buscamos." />
          </div>
        </div>

        <div className="rounded-sm border border-border bg-card p-5 shadow-card">
          <div className="font-display text-lg font-bold">Acciones rápidas</div>
          <div className="mt-4 grid gap-2">
            <Link
              to="/catalog"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            >
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/carrito"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Ir al carrito <ShoppingCart className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground transition hover:opacity-95"
            >
              <WhatsAppIcon className="h-5 w-5" /> Abrir WhatsApp
            </a>
          </div>
        </div>
      </div>
    </PageWithAds>
  );
}

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-sm border border-border bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-secondary text-sm font-bold text-secondary-foreground">
          {n}
        </div>
        <div className="min-w-0">
          <div className="font-display text-base font-bold leading-tight">{title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-sm bg-secondary text-secondary-foreground">
        <Check className="h-3.5 w-3.5" />
      </span>
      <div>{text}</div>
    </div>
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

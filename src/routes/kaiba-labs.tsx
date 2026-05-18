import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Dices, FlaskConical, Shuffle } from "lucide-react";
import { PageWithAds } from "@/components/site/AdSlot";

export const Route = createFileRoute("/kaiba-labs")({
  component: KaibaLabsPage,
  head: () => ({ meta: [{ title: "Kaiba Labs — TeamPulse" }] }),
});

const TOOLS = [
  {
    title: "Calculadora de probabilidad",
    desc: "Hypergeometrico para ratios, outs y manos iniciales.",
    icon: <Dices className="h-6 w-6" />,
    status: "Próximamente",
  },
  {
    title: "Simulador de opening hand",
    desc: "Simulá manos con tu lista y medí consistencia por turnos.",
    icon: <Shuffle className="h-6 w-6" />,
    status: "Próximamente",
  },
  {
    title: "Estadísticas del deck",
    desc: "Curva, densidad de starters/extenders, y ratios recomendados.",
    icon: <BarChart3 className="h-6 w-6" />,
    status: "Próximamente",
  },
];

function KaibaLabsPage() {
  return (
    <PageWithAds>
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,oklch(0.55_0.22_275/0.22),transparent_55%),radial-gradient(circle_at_80%_20%,oklch(0.32_0.16_268/0.28),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_10px,oklch(0.55_0.22_275/0.10)_10px,oklch(0.55_0.22_275/0.10)_11px),linear-gradient(to_bottom,transparent_0,transparent_10px,oklch(0.55_0.22_275/0.10)_10px,oklch(0.55_0.22_275/0.10)_11px)] opacity-60 bg-size-[44px_44px]" />
          <div className="relative p-8 md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-glow">
              <FlaskConical className="h-3.5 w-3.5" />
              KaibaCorp Systems
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">Kaiba Labs</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Herramientas de probabilidad y estadística para duelistas. Diseñado con estética
              futurista y foco en velocidad.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-accent">
              Próximos módulos <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <div
            key={t.title}
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-primary opacity-10" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  {t.icon}
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                  {t.status}
                </span>
              </div>
              <div className="mt-4 font-display text-xl font-bold">{t.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t.desc}</div>
              <button
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-foreground"
                disabled
              >
                Abrir módulo <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageWithAds>
  );
}

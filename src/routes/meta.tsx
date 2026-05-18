import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Layers, LineChart, Trophy } from "lucide-react";
import { PageWithAds } from "@/components/site/AdSlot";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/meta")({
  component: MetaPage,
  head: () => ({ meta: [{ title: "Meta — TeamPulse" }] }),
});

const META_ITEMS = [
  {
    title: "Meta Decks",
    desc: "Arquetipos principales, variantes y ratios sugeridos para el formato.",
    icon: <Layers className="h-6 w-6" />,
    to: "/catalog",
    search: { cat: "cores" },
    img: hero1,
  },
  {
    title: "Competitive Analysis",
    desc: "Lecturas del entorno local: tech choices, matchups y side patterns.",
    icon: <LineChart className="h-6 w-6" />,
    to: "/noticias",
    img: hero2,
  },
  {
    title: "Tournament Trends",
    desc: "Qué se está jugando en el NOA: tops, staples y ajustes semana a semana.",
    icon: <Trophy className="h-6 w-6" />,
    to: "/noticias",
    img: hero1,
  },
];

function MetaPage() {
  return (
    <PageWithAds>
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-accent">Competitivo</div>
        <h1 className="font-display text-3xl font-bold">Meta</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Un portal editorial para el juego competitivo del NOA. Lecturas rápidas, guías y
          tendencias.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {META_ITEMS.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            search={("search" in c ? (c.search as never) : undefined) as never}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <img
              src={c.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/25 to-transparent" />
            <div className="relative p-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <span className="text-gold">{c.icon}</span>
                Sección
              </div>
              <div className="mt-4 font-display text-xl font-bold">{c.title}</div>
              <div className="mt-1 text-sm text-white/85">{c.desc}</div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition group-hover:opacity-95">
                Abrir <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl font-bold">¿Querés que analicemos tu lista?</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Mandanos la decklist por WhatsApp y te sugerimos ajustes de consistencia.
            </div>
          </div>
          <a
            href="https://wa.me/5493813521194"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-accent"
          >
            Pedir análisis <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </PageWithAds>
  );
}

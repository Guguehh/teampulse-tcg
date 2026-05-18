import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar, ScrollText } from "lucide-react";
import { PageWithAds } from "@/components/site/AdSlot";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/noticias")({
  component: NewsPage,
  head: () => ({ meta: [{ title: "Noticias & Artículos — TeamPulse" }] }),
});

type Article = {
  title: string;
  desc: string;
  date: string;
  category: string;
  img: string;
};

const ARTICLES: Article[] = [
  {
    title: "Guía rápida: Side deck para el meta del NOA",
    desc: "Qué cartas están marcando la diferencia en eventos locales y cómo adaptarte.",
    date: "16 May 2026",
    category: "Meta",
    img: hero2,
  },
  {
    title: "Tops del fin de semana: staples y sorpresas",
    desc: "Resumen editorial con lo más jugado y los cambios que se vienen.",
    date: "12 May 2026",
    category: "Torneos",
    img: hero1,
  },
  {
    title: "Análisis: ratios y outs para Snake‑Eyes",
    desc: "Cómo ajustar consistencia y qué hands priorizar según tu build.",
    date: "09 May 2026",
    category: "Análisis",
    img: hero3,
  },
  {
    title: "Coleccionismo premium: cuidado de cartas y fundas",
    desc: "Consejos rápidos para mantener tus singles en condición top.",
    date: "03 May 2026",
    category: "Comunidad",
    img: hero2,
  },
  {
    title: "Cómo preparar tu deck para torneo local",
    desc: "Checklist simple: sleeves, decklist, side y mentalidad para competir.",
    date: "29 Apr 2026",
    category: "Guías",
    img: hero1,
  },
  {
    title: "Kaiba Labs: lectura rápida del formato",
    desc: "Micro-notas sobre ratios, outs y consistencia para decisiones rápidas.",
    date: "21 Apr 2026",
    category: "Kaiba Labs",
    img: hero3,
  },
];

function NewsPage() {
  return (
    <PageWithAds>
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-accent">Editorial</div>
        <h1 className="font-display text-3xl font-bold">Noticias & Artículos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Coberturas, guías y análisis para la comunidad Yu‑Gi‑Oh del NOA.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Featured article={ARTICLES[0]} />
        <div className="grid gap-4">
          {ARTICLES.slice(1, 4).map((a) => (
            <Row key={a.title} article={a} />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.slice(4).map((a) => (
          <Card key={a.title} article={a} />
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl font-bold">¿Querés que cubramos tu evento?</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Enviá afiches, resultados y fotos. Lo destacamos en el portal.
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-accent"
          >
            Volver al inicio <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageWithAds>
  );
}

function Featured({ article }: { article: Article }) {
  return (
    <a
      href="#"
      className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <img src={article.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
      <div className="relative flex min-h-[320px] flex-col justify-end p-6 text-white">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
            <ScrollText className="h-3.5 w-3.5" />
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1 text-white/80">
            <Calendar className="h-3.5 w-3.5" />
            {article.date}
          </span>
        </div>
        <div className="mt-3 font-display text-2xl font-bold leading-tight">{article.title}</div>
        <div className="mt-2 max-w-xl text-sm text-white/85">{article.desc}</div>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
          Leer artículo <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </a>
  );
}

function Row({ article }: { article: Article }) {
  return (
    <a
      href="#"
      className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface">
        <img
          src={article.img}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
            {article.category}
          </span>
          <span>{article.date}</span>
        </div>
        <div className="mt-1 line-clamp-2 font-display text-sm font-bold leading-snug">
          {article.title}
        </div>
        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.desc}</div>
      </div>
    </a>
  );
}

function Card({ article }: { article: Article }) {
  return (
    <a
      href="#"
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-video overflow-hidden bg-surface">
        <img
          src={article.img}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
            {article.category}
          </span>
          <span>{article.date}</span>
        </div>
        <div className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug">
          {article.title}
        </div>
        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.desc}</div>
      </div>
    </a>
  );
}

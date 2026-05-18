import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PageWithAds } from "@/components/site/AdSlot";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS } from "@/data/products";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  component: Home,
});

const SLIDES = [
  {
    img: hero1,
    eyebrow: "Nuevos ingresos",
    title: "Dragones legendarios al NOA",
    desc: "Singles de Blue-Eyes, Red-Eyes y más. Stock limitado.",
    cta: "Ver singles",
    to: "/catalog",
    search: { cat: "singles" },
  },
  {
    img: hero2,
    eyebrow: "Accesorios premium",
    title: "Playmats que elevan tu duelo",
    desc: "Tapetes, sleeves y deckboxes con estilo egipcio dorado.",
    cta: "Ver accesorios",
    to: "/catalog",
    search: { cat: "playmats" },
  },
  {
    img: hero3,
    eyebrow: "Tier Oro · Plata · Bronce",
    title: "Mystery Boxes con valor garantizado",
    desc: "Cada caja tiene cartas premium y sorpresas selladas.",
    cta: "Abrir misterio",
    to: "/catalog",
    search: { cat: "mystery-boxes" },
  },
];

const FEATURE_BANNERS = [
  {
    title: "Meta",
    eyebrow: "Competitivo",
    desc: "Decks, torneos y tendencias del NOA.",
    to: "/meta",
    img: hero2,
    cta: "Ver Meta",
  },
  {
    title: "Kaiba Labs",
    eyebrow: "Herramientas",
    desc: "Probabilidad, opening hand y stats. Coming soon.",
    to: "/kaiba-labs",
    img: hero3,
    cta: "Entrar a Labs",
  },
];

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
    title: "Kaiba Labs: por qué tus ratios importan",
    desc: "Una intro simple a la probabilidad aplicada a TCG.",
    date: "28 Apr 2026",
    category: "Kaiba Labs",
    img: hero3,
  },
];

function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIdx(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const t = window.setInterval(() => api.scrollNext(), 6500);
    return () => window.clearInterval(t);
  }, [api]);

  const featured = useMemo(() => PRODUCTS.filter((p) => p.featured), []);

  return (
    <PageWithAds>
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent>
            {SLIDES.map((slide, i) => (
              <CarouselItem key={i}>
                <div className="relative h-[440px] overflow-hidden rounded-3xl md:h-[520px]">
                  <img
                    src={slide.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-hero-overlay" />
                  <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end p-8 md:p-12">
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-foreground shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      {slide.eyebrow}
                    </div>
                    <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-white drop-shadow md:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-3 max-w-md text-base text-white/85">{slide.desc}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to={slide.to}
                        search={slide.search as never}
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-sm transition hover:opacity-95"
                      >
                        {slide.cta} <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                      >
                        Ver todo el catálogo <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute bottom-4 right-4 z-20 flex gap-1.5 rounded-full bg-black/25 p-2 backdrop-blur">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-1.5 bg-white/50 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {FEATURE_BANNERS.map((b) => (
          <Link
            key={b.title}
            to={b.to}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <img
              src={b.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-transparent" />
            <div className="relative p-5 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                {b.eyebrow}
              </div>
              <div className="mt-3 font-display text-xl font-bold leading-tight">{b.title}</div>
              <div className="mt-1 text-sm text-white/85">{b.desc}</div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                {b.cta}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-accent">
              Curado por la casa
            </div>
            <h2 className="font-display text-2xl font-bold">Productos destacados</h2>
          </div>
          <Link
            to="/catalog"
            className="hidden text-sm font-semibold text-accent hover:underline md:inline"
          >
            Ver todo →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-accent">Editorial</div>
            <h2 className="font-display text-2xl font-bold">Noticias & Artículos</h2>
          </div>
          <Link
            to="/noticias"
            className="hidden text-sm font-semibold text-accent hover:underline md:inline"
          >
            Ver todo →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <ArticleFeatured article={ARTICLES[0]} />
          <div className="grid gap-4">
            <ArticleRow article={ARTICLES[1]} />
            <ArticleRow article={ARTICLES[2]} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.slice(3).map((a) => (
            <ArticleCard key={a.title} article={a} />
          ))}
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-card md:p-12">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
              <WhatsAppIcon className="h-3 w-3" /> Atención directa
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold">¿Buscás una carta específica?</h2>
            <p className="mt-2 max-w-xl text-primary-foreground/80">
              Escribinos por WhatsApp y te ayudamos a encontrar lo que necesitás para tu deck.
            </p>
          </div>
          <a
            href="https://wa.me/5493813521194"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-gold-foreground transition hover:scale-105 md:w-auto"
          >
            <WhatsAppIcon className="h-5 w-5" /> Chatear ahora
          </a>
        </div>
      </section>
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

function ArticleFeatured({ article }: { article: Article }) {
  return (
    <Link
      to="/noticias"
      className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <img src={article.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative flex h-full min-h-[300px] flex-col justify-end p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
            {article.category}
          </span>
          <span className="text-white/75">{article.date}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{article.title}</h3>
        <p className="mt-2 max-w-xl text-sm text-white/85">{article.desc}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
          Leer artículo <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      to="/noticias"
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
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {article.date}
          </span>
        </div>
        <div className="mt-1 line-clamp-2 font-display text-sm font-bold leading-snug">
          {article.title}
        </div>
        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.desc}</div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/noticias"
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
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {article.date}
          </span>
        </div>
        <div className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug">
          {article.title}
        </div>
        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.desc}</div>
      </div>
    </Link>
  );
}

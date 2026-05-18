import { PRODUCTS } from "@/data/products";
import { readJson, writeJson } from "@/lib/admin/storage";
import {
  type AdminArticle,
  type AdminMediaItem,
  type AdminProduct,
  publicProductToAdmin,
} from "@/lib/admin/types";

const PRODUCTS_KEY = "products";
const ARTICLES_KEY = "articles";
const MEDIA_KEY = "media";

function nowIso() {
  return new Date().toISOString();
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("admin-db-changed"));
}

function ensureSeeded() {
  const products = readJson<AdminProduct[] | null>(PRODUCTS_KEY, null);
  if (!products || products.length === 0) {
    writeJson<AdminProduct[]>(PRODUCTS_KEY, PRODUCTS.map(publicProductToAdmin));
  }

  const articles = readJson<AdminArticle[] | null>(ARTICLES_KEY, null);
  if (!articles || articles.length === 0) {
    writeJson<AdminArticle[]>(ARTICLES_KEY, [
      {
        id: "a-1",
        title: "Guía rápida: Side deck para el meta del NOA",
        slug: "guia-rapida-side-deck-meta-noa",
        subtitle: "Checklist simple para adaptarte semana a semana.",
        category: "Meta",
        tags: ["meta", "side deck"],
        author: "TeamPulse",
        status: "published",
        publishDate: nowIso(),
        featured: true,
        bannerUrl: PRODUCTS[0]?.image,
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "Resumen rápido del meta local y cartas clave de side.",
          },
          { id: "b2", type: "heading", text: "Qué priorizar", level: 2 },
          {
            id: "b3",
            type: "list",
            items: ["Respuestas a board", "Outs a floodgates", "Cartas flexibles"],
          },
        ],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
      {
        id: "a-2",
        title: "Kaiba Labs: por qué tus ratios importan",
        slug: "kaiba-labs-por-que-tus-ratios-importan",
        subtitle: "Probabilidad aplicada a decisiones de deckbuilding.",
        category: "Kaiba Labs",
        tags: ["probabilidad", "ratios"],
        author: "TeamPulse",
        status: "draft",
        publishDate: undefined,
        featured: false,
        bannerUrl: PRODUCTS[1]?.image,
        blocks: [
          {
            id: "b4",
            type: "paragraph",
            text: "Una intro práctica a consistencia y densidad de outs.",
          },
        ],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ]);
  }

  const media = readJson<AdminMediaItem[] | null>(MEDIA_KEY, null);
  if (!media) writeJson<AdminMediaItem[]>(MEDIA_KEY, []);
}

export function listProducts(): AdminProduct[] {
  ensureSeeded();
  return readJson<AdminProduct[]>(PRODUCTS_KEY, []);
}

export function getProduct(id: string): AdminProduct | undefined {
  return listProducts().find((p) => p.id === id);
}

export function upsertProduct(input: AdminProduct): AdminProduct {
  ensureSeeded();
  const products = readJson<AdminProduct[]>(PRODUCTS_KEY, []);
  const existingIndex = products.findIndex((p) => p.id === input.id);
  const next = { ...input, updatedAt: nowIso() };
  if (existingIndex === -1) {
    products.unshift({ ...next, createdAt: nowIso() });
  } else {
    products[existingIndex] = next;
  }
  writeJson(PRODUCTS_KEY, products);
  emitChange();
  return next;
}

export function deleteProduct(id: string) {
  ensureSeeded();
  const products = readJson<AdminProduct[]>(PRODUCTS_KEY, []);
  writeJson(
    PRODUCTS_KEY,
    products.filter((p) => p.id !== id),
  );
  emitChange();
}

export function listArticles(): AdminArticle[] {
  ensureSeeded();
  return readJson<AdminArticle[]>(ARTICLES_KEY, []);
}

export function getArticle(id: string): AdminArticle | undefined {
  return listArticles().find((a) => a.id === id);
}

export function upsertArticle(input: AdminArticle): AdminArticle {
  ensureSeeded();
  const articles = readJson<AdminArticle[]>(ARTICLES_KEY, []);
  const existingIndex = articles.findIndex((a) => a.id === input.id);
  const next = { ...input, updatedAt: nowIso() };
  if (existingIndex === -1) {
    articles.unshift({ ...next, createdAt: nowIso() });
  } else {
    articles[existingIndex] = next;
  }
  writeJson(ARTICLES_KEY, articles);
  emitChange();
  return next;
}

export function deleteArticle(id: string) {
  ensureSeeded();
  const articles = readJson<AdminArticle[]>(ARTICLES_KEY, []);
  writeJson(
    ARTICLES_KEY,
    articles.filter((a) => a.id !== id),
  );
  emitChange();
}

export function listMedia(): AdminMediaItem[] {
  ensureSeeded();
  return readJson<AdminMediaItem[]>(MEDIA_KEY, []);
}

export function upsertMedia(item: AdminMediaItem) {
  ensureSeeded();
  const media = readJson<AdminMediaItem[]>(MEDIA_KEY, []);
  const idx = media.findIndex((m) => m.id === item.id);
  if (idx === -1) media.unshift(item);
  else media[idx] = item;
  writeJson(MEDIA_KEY, media);
  emitChange();
}

export function deleteMedia(id: string) {
  ensureSeeded();
  const media = readJson<AdminMediaItem[]>(MEDIA_KEY, []);
  writeJson(
    MEDIA_KEY,
    media.filter((m) => m.id !== id),
  );
  emitChange();
}

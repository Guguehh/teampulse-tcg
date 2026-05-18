import type { Category, Language, Rarity, Product as PublicProduct } from "@/data/products";

export type AdminProductStatus = "active" | "draft" | "archived";

export type AdminArticleStatus = "draft" | "scheduled" | "published";

export type AdminMediaKind = "image";

export type AdminMediaItem = {
  id: string;
  kind: AdminMediaKind;
  name: string;
  url: string;
  alt?: string;
  tags?: string[];
  createdAt: string;
  sizeBytes?: number;
};

export type AdminProductBase = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description?: string;
  price: number;
  stock: number;
  status: AdminProductStatus;
  featured: boolean;
  imageUrl?: string;
  galleryUrls?: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminSingleFields = {
  rarity?: Rarity;
  expansion?: string;
  language?: Language;
  condition?: "Mint" | "Near Mint" | "Lightly Played" | "Played";
  cardCode?: string;
  edition?: "1st Edition" | "Unlimited";
  attribute?: string;
  cardType?: string;
};

export type AdminCoreFields = {
  archetype?: string;
  includedCards?: string[];
  decklist?: string;
  notes?: string;
};

export type AdminMysteryBoxFields = {
  guaranteedValue?: number;
  rarityGuarantees?: string[];
  tier?: "Bronce" | "Plata" | "Oro" | "Diamante";
  includedPossibilities?: string[];
};

export type AdminProduct = AdminProductBase & {
  single?: AdminSingleFields;
  core?: AdminCoreFields;
  mystery?: AdminMysteryBoxFields;
};

export type AdminArticleBlock =
  | { id: string; type: "heading"; text: string; level: 2 | 3 }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "quote"; text: string }
  | { id: string; type: "list"; items: string[] }
  | { id: string; type: "divider" }
  | { id: string; type: "image"; url: string; alt?: string; caption?: string }
  | { id: string; type: "link"; label: string; url: string }
  | { id: string; type: "cta"; label: string; url: string; variant: "primary" | "secondary" };

export type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  category: string;
  tags: string[];
  author?: string;
  status: AdminArticleStatus;
  publishDate?: string;
  featured: boolean;
  bannerUrl?: string;
  blocks: AdminArticleBlock[];
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboardStats = {
  totalProducts: number;
  totalArticles: number;
  lowStockCount: number;
};

export function publicProductToAdmin(p: PublicProduct): AdminProduct {
  const now = new Date().toISOString();
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description,
    price: p.price,
    stock: p.stock,
    status: "active",
    featured: Boolean(p.featured),
    imageUrl: p.image,
    galleryUrls: [],
    createdAt: now,
    updatedAt: now,
    single:
      p.category === "singles"
        ? {
            rarity: p.rarity,
            expansion: p.expansion,
            language: p.language,
            condition: p.condition,
            cardCode: p.cardCode,
          }
        : undefined,
    core:
      p.category === "cores"
        ? {
            includedCards: p.includedCards,
            notes: p.description,
          }
        : undefined,
    mystery:
      p.category === "mystery-boxes"
        ? {
            guaranteedValue: p.guaranteedValue,
            tier: p.tier,
          }
        : undefined,
  };
}

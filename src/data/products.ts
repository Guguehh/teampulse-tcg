import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export type Category = "singles" | "cores" | "playmats" | "sleeves" | "deckboxes" | "mystery-boxes";

export const CATEGORIES: { id: Category; label: string; description: string; icon: string }[] = [
  { id: "singles", label: "Singles", description: "Cartas sueltas individuales", icon: "" },
  { id: "cores", label: "Cores", description: "Decks armados listos para jugar", icon: "" },
  { id: "playmats", label: "Playmats", description: "Tapetes para duelos", icon: "" },
  { id: "sleeves", label: "Sleeves", description: "Protectores de cartas", icon: "" },
  { id: "deckboxes", label: "Deckboxes", description: "Cajas para tu deck", icon: "" },
  { id: "mystery-boxes", label: "Mystery Boxes", description: "Cajas misteriosas", icon: "🎁" },
];

export type Rarity = "Común" | "Rara" | "Super Rara" | "Ultra Rara" | "Secreta" | "Ghost";
export type Language = "Español" | "Inglés" | "Japonés";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  stock: number;
  featured?: boolean;
  rarity?: Rarity;
  language?: Language;
  expansion?: string;
  cardCode?: string;
  condition?: "Mint" | "Near Mint" | "Lightly Played" | "Played";
  includedCards?: string[];
  description?: string;
  guaranteedValue?: number;
  tier?: "Bronce" | "Plata" | "Oro" | "Diamante";
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "blue-eyes-white-dragon",
    name: "Blue-Eyes White Dragon",
    category: "singles",
    price: 45000,
    stock: 3,
    featured: true,
    image: hero1,
    rarity: "Ultra Rara",
    language: "Inglés",
    expansion: "LOB",
    cardCode: "LOB-001",
    condition: "Near Mint",
    description: "Dragón legendario. Carta icónica de Kaiba en condición Near Mint.",
  },
  {
    id: "2",
    slug: "dark-magician",
    name: "Dark Magician",
    category: "singles",
    price: 28000,
    stock: 5,
    featured: true,
    image: hero2,
    rarity: "Super Rara",
    language: "Español",
    expansion: "SDY",
    cardCode: "SDY-006",
    condition: "Mint",
    description: "El mago oscuro favorito de Yugi. Primera edición.",
  },
  {
    id: "3",
    slug: "exodia-set",
    name: "Exodia el Prohibido (Set Completo)",
    category: "singles",
    price: 120000,
    stock: 1,
    featured: true,
    image: hero3,
    rarity: "Secreta",
    language: "Inglés",
    expansion: "LOB",
    cardCode: "LOB-124/125/126/127/128",
    condition: "Lightly Played",
    description: "Las 5 piezas de Exodia. Pieza de colección.",
  },
  {
    id: "4",
    slug: "core-dragones-azules",
    name: "Core Dragones Azules",
    category: "cores",
    price: 35000,
    stock: 4,
    featured: true,
    image: hero1,
    description: "Deck competitivo listo para jugar. Estrategia ofensiva.",
    includedCards: [
      "3x Blue-Eyes White Dragon",
      "2x Maiden with Eyes of Blue",
      "3x Sage with Eyes of Blue",
      "1x Blue-Eyes Alternative Dragon",
    ],
  },
  {
    id: "5",
    slug: "playmat-millenium",
    name: "Playmat Millenium Gold",
    category: "playmats",
    price: 18000,
    stock: 12,
    featured: true,
    image: hero2,
    description: "Tapete antideslizante 60x35cm con detalles dorados.",
  },
  {
    id: "6",
    slug: "sleeves-mate-negros",
    name: "Sleeves Mate Negros x100",
    category: "sleeves",
    price: 4500,
    stock: 50,
    image: hero3,
    description: "Protectores premium estándar, acabado mate.",
  },
  {
    id: "7",
    slug: "deckbox-pharaoh",
    name: "Deckbox Pharaoh's Tomb",
    category: "deckboxes",
    price: 9800,
    stock: 8,
    image: hero2,
    description: "Caja resistente para 80+ cartas con divisor incluido.",
  },
  {
    id: "8",
    slug: "mystery-oro",
    name: "Mystery Box Tier Oro",
    category: "mystery-boxes",
    price: 25000,
    stock: 6,
    featured: true,
    image: hero3,
    description: "Cartas, sleeves y sorpresas premium.",
    guaranteedValue: 35000,
    tier: "Oro",
  },
  {
    id: "9",
    slug: "mystery-bronce",
    name: "Mystery Box Tier Bronce",
    category: "mystery-boxes",
    price: 7500,
    stock: 20,
    image: hero2,
    description: "Ideal para empezar a coleccionar.",
    guaranteedValue: 10000,
    tier: "Bronce",
  },
  {
    id: "10",
    slug: "red-eyes-black-dragon",
    name: "Red-Eyes Black Dragon",
    category: "singles",
    price: 22000,
    stock: 4,
    image: hero1,
    rarity: "Ultra Rara",
    language: "Japonés",
    expansion: "PSV",
    cardCode: "PSV-001",
    condition: "Near Mint",
    description: "El dragón de Joey en su versión japonesa original.",
  },
  {
    id: "11",
    slug: "sleeves-dragon",
    name: "Sleeves Dragon Art x60",
    category: "sleeves",
    price: 6800,
    stock: 30,
    image: hero3,
    description: "Sleeves con arte de dragón. Tamaño Yu-Gi-Oh.",
  },
  {
    id: "12",
    slug: "core-spellcasters",
    name: "Core Spellcasters",
    category: "cores",
    price: 32000,
    stock: 3,
    image: hero1,
    description: "Deck temático de magos. Control y combos.",
    includedCards: [
      "3x Dark Magician",
      "3x Dark Magician Girl",
      "2x Magician's Rod",
      "3x Magicians' Souls",
    ],
  },
];

export const RARITIES: Rarity[] = ["Común", "Rara", "Super Rara", "Ultra Rara", "Secreta", "Ghost"];
export const LANGUAGES: Language[] = ["Español", "Inglés", "Japonés"];
export const EXPANSIONS = ["LOB", "SDY", "PSV", "MRD", "SRL"];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

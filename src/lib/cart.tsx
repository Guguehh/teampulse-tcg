import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

export const WHATSAPP_NUMBER = "5493813521194";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  whatsappUrl: () => string;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "duelist-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return {
      items,
      count,
      total,
      add: (p, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.id === p.id);
          if (existing) {
            return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
          }
          return [
            ...prev,
            { id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image, qty },
          ];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
      whatsappUrl: () => {
        const lines = [
          "¡Hola! Quiero realizar el siguiente pedido:",
          "",
          ...items.map((i) => `• ${i.qty}× ${i.name} — ${formatPrice(i.price * i.qty)}`),
          "",
          `*Total: ${formatPrice(total)}*`,
          "",
          "¿Coordinamos pago y entrega?",
        ];
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
      },
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function whatsappProductUrl(product: Product) {
  const msg = `¡Hola! Me interesa este producto: *${product.name}* (${formatPrice(product.price)}). ¿Está disponible?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

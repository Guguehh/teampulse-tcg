import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Search,
  ShoppingCart,
  Menu,
  LayoutGrid,
  Newspaper,
  FlaskConical,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { CATEGORIES } from "@/data/products";
import teamPulseLogo from "@/assets/TeamPulse.png";

export function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/catalog",
      search: {
        q: q || undefined,
        cat: undefined,
        rarity: undefined,
        lang: undefined,
        exp: undefined,
        min: undefined,
        max: undefined,
      } as never,
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src={teamPulseLogo}
            alt="TeamPulse"
            className="h-9 w-auto select-none"
            draggable={false}
          />
        </Link>

        <form onSubmit={submit} className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar Blue-Eyes, sleeves, deckboxes…"
            className="w-full rounded-sm border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none ring-ring/30 transition focus:border-accent focus:ring-2"
          />
        </form>

        <nav className="hidden items-center gap-4 lg:flex">
          <NavLink to="/" active={path === "/"}>Inicio</NavLink>
          <NavLink
            to="/catalog"
            active={path.startsWith("/catalog") || path.startsWith("/catalogo")}
            icon={<LayoutGrid className="h-4 w-4" />}
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/noticias"
            active={path.startsWith("/noticias")}
            icon={<Newspaper className="h-4 w-4" />}
          >
            Noticias & Artículos
          </NavLink>
          <NavLink to="/meta" active={path.startsWith("/meta")}>Meta</NavLink>
          <KaibaLink active={path.startsWith("/kaiba-labs")} />
          <NavLink
            to="/carrito"
            active={path.startsWith("/carrito")}
            icon={<ShoppingCart className="h-4 w-4" />}
          >
            Carrito
          </NavLink>
        </nav>

        <Link
          to="/carrito"
          className="relative grid h-10 w-10 place-items-center rounded-sm bg-surface text-foreground transition hover:bg-secondary"
          aria-label="Carrito"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
              {count}
            </span>
          )}
        </Link>

        <button
          className="grid h-10 w-10 place-items-center rounded-sm bg-surface lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="border-t border-border bg-surface/70">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/catalog"
                search={{ cat: c.id } as never}
                className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-xs font-semibold leading-none transition hover:bg-secondary"
              >
                {c.icon ? (
                  <span className={`text-[13px] leading-none ${c.id === "mystery-boxes" ? "animate-gift" : ""}`}>
                    {c.icon}
                  </span>
                ) : null}
                <span className="leading-none">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <form onSubmit={submit} className="relative p-3">
            <Search className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar…"
              className="w-full rounded-sm border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none ring-ring/30 transition focus:border-accent focus:ring-2"
            />
          </form>
          <div className="grid gap-1 px-3 pb-3">
            <MobileLink to="/" onClick={() => setOpen(false)} active={path === "/"}>
              Inicio
            </MobileLink>
            <MobileLink
              to="/catalog"
              onClick={() => setOpen(false)}
              active={path.startsWith("/catalog") || path.startsWith("/catalogo")}
            >
              Catálogo
            </MobileLink>
            <MobileLink
              to="/noticias"
              onClick={() => setOpen(false)}
              active={path.startsWith("/noticias")}
            >
              Noticias & Artículos
            </MobileLink>
            <MobileLink to="/meta" onClick={() => setOpen(false)} active={path.startsWith("/meta")}>
              Meta
            </MobileLink>
            <MobileLink
              to="/kaiba-labs"
              onClick={() => setOpen(false)}
              active={path.startsWith("/kaiba-labs")}
            >
              Kaiba Labs
            </MobileLink>
            <MobileLink
              to="/carrito"
              onClick={() => setOpen(false)}
              active={path.startsWith("/carrito")}
            >
              Carrito
            </MobileLink>
          </div>
          <div className="border-t border-border px-3 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Tag className="h-4 w-4" /> Categorías
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  to="/catalog"
                  search={{ cat: c.id } as never}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-9 items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-xs font-semibold leading-none hover:bg-secondary"
                >
                  {c.icon ? (
                    <span className={`text-[13px] leading-none ${c.id === "mystery-boxes" ? "animate-gift" : ""}`}>
                      {c.icon}
                    </span>
                  ) : null}
                  <span className="leading-none">{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  to,
  active,
  icon,
  children,
}: {
  to: string;
  active: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 px-1.5 py-1 text-sm font-semibold transition ${
        active ? "text-accent" : "text-foreground hover:text-accent"
      }`}
    >
      {icon}
      <span className={`border-b-2 ${active ? "border-accent" : "border-transparent"} pb-0.5`}>
        {children}
      </span>
    </Link>
  );
}

function KaibaLink({ active }: { active: boolean }) {
  return (
    <Link
      to="/kaiba-labs"
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-background hover:bg-secondary"
      }`}
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-full ${
          active
            ? "bg-accent text-accent-foreground"
            : "bg-gradient-primary text-primary-foreground"
        }`}
      >
        <FlaskConical className="h-4 w-4" />
      </span>
      <span className="font-display tracking-tight">Kaiba Labs</span>
    </Link>
  );
}

function MobileLink({
  to,
  active,
  onClick,
  children,
}: {
  to: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
        active ? "bg-primary text-primary-foreground" : "bg-surface hover:bg-secondary"
      }`}
    >
      {children}
    </Link>
  );
}

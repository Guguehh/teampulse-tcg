import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PageWithAds } from "@/components/site/AdSlot";
import { ProductCard } from "@/components/site/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, EXPANSIONS, LANGUAGES, PRODUCTS, RARITIES } from "@/data/products";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  cat: fallback(z.string().optional(), undefined),
  rarity: fallback(z.string().optional(), undefined),
  lang: fallback(z.string().optional(), undefined),
  exp: fallback(z.string().optional(), undefined),
  min: fallback(z.number().optional(), undefined),
  max: fallback(z.number().optional(), undefined),
});

export const Route = createFileRoute("/catalog")({
  validateSearch: zodValidator(searchSchema),
  component: Catalog,
  head: () => ({ meta: [{ title: "Catálogo — TeamPulse" }] }),
});

function Catalog() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });

  const setParam = (key: string, value: string | number | undefined) =>
    navigate({
      search: (p: Record<string, unknown>) =>
        ({ ...p, [key]: value === "" ? undefined : value }) as never,
    });

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (search.q && !p.name.toLowerCase().includes(search.q.toLowerCase())) return false;
      if (search.cat && p.category !== search.cat) return false;
      if (search.rarity && p.rarity !== search.rarity) return false;
      if (search.lang && p.language !== search.lang) return false;
      if (search.exp && p.expansion !== search.exp) return false;
      if (search.min !== undefined && p.price < search.min) return false;
      if (search.max !== undefined && p.price > search.max) return false;
      return true;
    });
  }, [search]);

  const activeCount = [
    search.cat,
    search.rarity,
    search.lang,
    search.exp,
    search.min,
    search.max,
    search.q,
  ].filter(Boolean).length;

  return (
    <PageWithAds>
      <div className="mb-3">
        <h1 className="font-display text-3xl font-bold">Catálogo</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
          {search.q ? ` para “${search.q}”` : ""}
        </p>
      </div>

      <div className="rounded-sm border border-border bg-card p-3 shadow-card">
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              Filtros
              {activeCount > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-sm bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                  {activeCount}
                </span>
              ) : null}
            </span>
          </div>

          <FilterSelect
            label="Categoría"
            value={search.cat ?? ""}
            onChange={(v) => setParam("cat", v || undefined)}
            options={[
              { value: "", label: "Todas" },
              ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
            ]}
          />
          <FilterSelect
            label="Rareza"
            value={search.rarity ?? ""}
            onChange={(v) => setParam("rarity", v || undefined)}
            options={[
              { value: "", label: "Todas" },
              ...RARITIES.map((r) => ({ value: r, label: r })),
            ]}
          />
          <FilterSelect
            label="Idioma"
            value={search.lang ?? ""}
            onChange={(v) => setParam("lang", v || undefined)}
            options={[
              { value: "", label: "Todos" },
              ...LANGUAGES.map((l) => ({ value: l, label: l })),
            ]}
          />
          <FilterSelect
            label="Set"
            value={search.exp ?? ""}
            onChange={(v) => setParam("exp", v || undefined)}
            options={[
              { value: "", label: "Todos" },
              ...EXPANSIONS.map((e) => ({ value: e, label: e })),
            ]}
          />

          <div className="shrink-0">
            <div className="flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2">
              <span className="text-sm font-semibold text-muted-foreground">Precio</span>
              <input
                type="number"
                placeholder="Min"
                value={search.min ?? ""}
                onChange={(e) =>
                  setParam("min", e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-20 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-24"
              />
              <span className="text-muted-foreground">—</span>
              <input
                type="number"
                placeholder="Max"
                value={search.max ?? ""}
                onChange={(e) =>
                  setParam("max", e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-20 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-24"
              />
            </div>
          </div>

          {activeCount > 0 ? (
            <button
              onClick={() =>
                navigate({
                  search: {
                    q: "",
                    cat: undefined,
                    rarity: undefined,
                    lang: undefined,
                    exp: undefined,
                    min: undefined,
                    max: undefined,
                  } as never,
                })
              }
              className="shrink-0 text-sm font-semibold text-accent hover:underline"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-md border border-dashed border-border bg-surface/50 p-12 text-center">
            <div>
              <div className="text-4xl">🔍</div>
              <h3 className="mt-3 font-display text-xl font-bold">Sin resultados</h3>
              <p className="text-sm text-muted-foreground">Probá ajustar los filtros.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </PageWithAds>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const currentValue = value || "__all__";
  return (
    <div className="shrink-0">
      <Select
        value={currentValue}
        onValueChange={(v) => {
          onChange(v === "__all__" ? "" : v);
        }}
      >
        <SelectTrigger className="h-10 gap-2 rounded-sm border-border bg-background text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{label}:</span>
            <SelectValue placeholder="Todas" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-sm">
          {options.map((o) => {
            const itemValue = o.value || "__all__";
            return (
              <SelectItem key={`${label}-${itemValue}`} value={itemValue} className="rounded-sm">
                {o.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

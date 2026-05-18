import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect } from "react";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  cat: fallback(z.string().optional(), undefined),
  rarity: fallback(z.string().optional(), undefined),
  lang: fallback(z.string().optional(), undefined),
  exp: fallback(z.string().optional(), undefined),
  min: fallback(z.number().optional(), undefined),
  max: fallback(z.number().optional(), undefined),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: zodValidator(searchSchema),
  component: CatalogRedirect,
});

function CatalogRedirect() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogo" });

  useEffect(() => {
    navigate({ to: "/catalog", search: search as never, replace: true });
  }, [navigate, search]);

  return null;
}

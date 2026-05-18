import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  GripVertical,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { CATEGORIES, EXPANSIONS, LANGUAGES, RARITIES, type Category } from "@/data/products";
import type { AdminProduct } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/slug";
import { listMedia } from "@/lib/admin/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.custom<Category>(),
  description: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().min(0),
  status: z.enum(["active", "draft", "archived"]),
  featured: z.boolean(),
  imageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()),
  single: z
    .object({
      rarity: z.string().optional(),
      expansion: z.string().optional(),
      language: z.string().optional(),
      condition: z.string().optional(),
      cardCode: z.string().optional(),
      edition: z.string().optional(),
      attribute: z.string().optional(),
      cardType: z.string().optional(),
    })
    .optional(),
  core: z
    .object({
      archetype: z.string().optional(),
      includedCards: z.string().optional(),
      decklist: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  mystery: z
    .object({
      guaranteedValue: z.number().optional(),
      rarityGuarantees: z.string().optional(),
      tier: z.string().optional(),
      includedPossibilities: z.string().optional(),
    })
    .optional(),
});

export type ProductFormValues = z.infer<typeof schema>;

function toValues(p?: AdminProduct): ProductFormValues {
  if (!p) {
    return {
      name: "",
      slug: "",
      category: "singles",
      description: "",
      price: 0,
      stock: 0,
      status: "draft",
      featured: false,
      imageUrl: "",
      galleryUrls: [],
      single: {
        rarity: "",
        expansion: "",
        language: "",
        condition: "",
        cardCode: "",
        edition: "",
        attribute: "",
        cardType: "",
      },
      core: { archetype: "", includedCards: "", decklist: "", notes: "" },
      mystery: {
        guaranteedValue: undefined,
        rarityGuarantees: "",
        tier: "",
        includedPossibilities: "",
      },
    };
  }

  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description ?? "",
    price: p.price,
    stock: p.stock,
    status: p.status,
    featured: p.featured,
    imageUrl: p.imageUrl ?? "",
    galleryUrls: p.galleryUrls ?? [],
    single: {
      rarity: p.single?.rarity ?? "",
      expansion: p.single?.expansion ?? "",
      language: p.single?.language ?? "",
      condition: p.single?.condition ?? "",
      cardCode: p.single?.cardCode ?? "",
      edition: p.single?.edition ?? "",
      attribute: p.single?.attribute ?? "",
      cardType: p.single?.cardType ?? "",
    },
    core: {
      archetype: p.core?.archetype ?? "",
      includedCards: (p.core?.includedCards ?? []).join("\n"),
      decklist: p.core?.decklist ?? "",
      notes: p.core?.notes ?? "",
    },
    mystery: {
      guaranteedValue: p.mystery?.guaranteedValue,
      rarityGuarantees: (p.mystery?.rarityGuarantees ?? []).join(", "),
      tier: p.mystery?.tier ?? "",
      includedPossibilities: (p.mystery?.includedPossibilities ?? []).join("\n"),
    },
  };
}

function toProduct(id: string, prev: AdminProduct | undefined, v: ProductFormValues): AdminProduct {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
    name: v.name,
    slug: v.slug,
    category: v.category,
    description: v.description || undefined,
    price: v.price,
    stock: v.stock,
    status: v.status,
    featured: v.featured,
    imageUrl: v.imageUrl || undefined,
    galleryUrls: v.galleryUrls ?? [],
    single:
      v.category === "singles"
        ? {
            rarity: (v.single?.rarity as never) || undefined,
            expansion: v.single?.expansion || undefined,
            language: (v.single?.language as never) || undefined,
            condition: (v.single?.condition as never) || undefined,
            cardCode: v.single?.cardCode || undefined,
            edition: (v.single?.edition as never) || undefined,
            attribute: v.single?.attribute || undefined,
            cardType: v.single?.cardType || undefined,
          }
        : undefined,
    core:
      v.category === "cores"
        ? {
            archetype: v.core?.archetype || undefined,
            includedCards: (v.core?.includedCards || "")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            decklist: v.core?.decklist || undefined,
            notes: v.core?.notes || undefined,
          }
        : undefined,
    mystery:
      v.category === "mystery-boxes"
        ? {
            guaranteedValue: v.mystery?.guaranteedValue,
            rarityGuarantees: (v.mystery?.rarityGuarantees || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            tier: (v.mystery?.tier as never) || undefined,
            includedPossibilities: (v.mystery?.includedPossibilities || "")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : undefined,
  };
}

export function ProductForm({
  mode,
  initial,
  onCancel,
  onSave,
}: {
  mode: "new" | "edit";
  initial?: AdminProduct;
  onCancel: () => void;
  onSave: (next: AdminProduct) => void;
}) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toValues(initial),
    mode: "onChange",
  });

  const values = form.watch();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!initial) return;
    form.reset(toValues(initial));
  }, [initial, form]);

  const category = values.category;

  const media = useMemo(() => listMedia(), []);

  const setGallery = (urls: string[]) => form.setValue("galleryUrls", urls, { shouldDirty: true });

  const addGalleryFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next = [...(values.galleryUrls ?? [])];
    const reads = Array.from(files).map(readAsDataUrl);
    const urls = await Promise.all(reads);
    next.push(...urls);
    setGallery(next);
  };

  const setMainFromFile = async (file: File | null) => {
    if (!file) return;
    const url = await readAsDataUrl(file);
    form.setValue("imageUrl", url, { shouldDirty: true });
  };

  const save = () => {
    const ok = form.formState.isValid;
    if (!ok) return;
    const id = initial?.id ?? crypto.randomUUID();
    const next = toProduct(id, initial, form.getValues());
    onSave(next);
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="icon" onClick={onCancel} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="font-display text-2xl font-bold">
              {mode === "new" ? "New Product" : "Edit Product"}
            </div>
            <div className="text-sm text-muted-foreground">
              Marketplace-ready form with structured fields
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!form.formState.isValid}>
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Section title="General">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Product name" error={form.formState.errors.name?.message}>
                <Input
                  value={values.name}
                  onChange={(e) => {
                    form.setValue("name", e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    if (!form.getValues("slug")) {
                      form.setValue("slug", slugify(e.target.value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                  placeholder="Blue-Eyes White Dragon"
                />
              </Field>
              <Field label="Slug" error={form.formState.errors.slug?.message}>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={values.slug}
                    onChange={(e) =>
                      form.setValue("slug", slugify(e.target.value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    placeholder="blue-eyes-white-dragon"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full shrink-0 gap-2 sm:w-auto"
                    onClick={() =>
                      form.setValue("slug", slugify(form.getValues("name")), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Sparkles className="h-4 w-4" /> Auto
                  </Button>
                </div>
              </Field>
              <Field label="Category">
                <select
                  value={values.category}
                  onChange={(e) =>
                    form.setValue("category", e.target.value as Category, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={values.status}
                  onChange={(e) =>
                    form.setValue("status", e.target.value as never, { shouldDirty: true })
                  }
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                >
                  <option value="active">active</option>
                  <option value="draft">draft</option>
                  <option value="archived">archived</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Price (ARS)">
                <Input
                  type="number"
                  value={values.price}
                  onChange={(e) =>
                    form.setValue("price", Number(e.target.value), { shouldDirty: true })
                  }
                />
              </Field>
              <Field label="Stock">
                <Input
                  type="number"
                  value={values.stock}
                  onChange={(e) =>
                    form.setValue("stock", Number(e.target.value), { shouldDirty: true })
                  }
                />
              </Field>
              <div className="flex items-end justify-between rounded-md border border-border bg-surface px-3 py-2">
                <div>
                  <div className="text-sm font-semibold">Featured</div>
                  <div className="text-xs text-muted-foreground">Highlights product on home</div>
                </div>
                <Switch
                  checked={values.featured}
                  onCheckedChange={(v) => form.setValue("featured", v, { shouldDirty: true })}
                />
              </div>
            </div>

            <Field label="Description">
              <Textarea
                value={values.description ?? ""}
                onChange={(e) =>
                  form.setValue("description", e.target.value, { shouldDirty: true })
                }
                rows={5}
              />
            </Field>
          </Section>

          {category === "singles" ? (
            <Section title="Single Card Fields">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Rarity">
                  <select
                    value={values.single?.rarity ?? ""}
                    onChange={(e) =>
                      form.setValue("single.rarity", e.target.value, { shouldDirty: true })
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                  >
                    <option value="">—</option>
                    {RARITIES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Expansion / Set">
                  <select
                    value={values.single?.expansion ?? ""}
                    onChange={(e) =>
                      form.setValue("single.expansion", e.target.value, { shouldDirty: true })
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                  >
                    <option value="">—</option>
                    {EXPANSIONS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Language">
                  <select
                    value={values.single?.language ?? ""}
                    onChange={(e) =>
                      form.setValue("single.language", e.target.value, { shouldDirty: true })
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                  >
                    <option value="">—</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Condition">
                  <select
                    value={values.single?.condition ?? ""}
                    onChange={(e) =>
                      form.setValue("single.condition", e.target.value, { shouldDirty: true })
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                  >
                    <option value="">—</option>
                    <option value="Mint">Mint</option>
                    <option value="Near Mint">Near Mint</option>
                    <option value="Lightly Played">Lightly Played</option>
                    <option value="Played">Played</option>
                  </select>
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Card code">
                  <Input
                    value={values.single?.cardCode ?? ""}
                    onChange={(e) =>
                      form.setValue("single.cardCode", e.target.value, { shouldDirty: true })
                    }
                    placeholder="LOB-001"
                  />
                </Field>
                <Field label="Edition">
                  <select
                    value={values.single?.edition ?? ""}
                    onChange={(e) =>
                      form.setValue("single.edition", e.target.value, { shouldDirty: true })
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                  >
                    <option value="">—</option>
                    <option value="1st Edition">1st Edition</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </Field>
                <Field label="Attribute">
                  <Input
                    value={values.single?.attribute ?? ""}
                    onChange={(e) =>
                      form.setValue("single.attribute", e.target.value, { shouldDirty: true })
                    }
                    placeholder="LIGHT"
                  />
                </Field>
                <Field label="Card type">
                  <Input
                    value={values.single?.cardType ?? ""}
                    onChange={(e) =>
                      form.setValue("single.cardType", e.target.value, { shouldDirty: true })
                    }
                    placeholder="Dragon / Normal"
                  />
                </Field>
              </div>
            </Section>
          ) : null}

          {category === "cores" ? (
            <Section title="Core Fields">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Deck archetype">
                  <Input
                    value={values.core?.archetype ?? ""}
                    onChange={(e) =>
                      form.setValue("core.archetype", e.target.value, { shouldDirty: true })
                    }
                    placeholder="Snake-Eyes"
                  />
                </Field>
              </div>
              <Field label="Included cards (one per line)">
                <Textarea
                  value={values.core?.includedCards ?? ""}
                  onChange={(e) =>
                    form.setValue("core.includedCards", e.target.value, { shouldDirty: true })
                  }
                  rows={6}
                />
              </Field>
              <Field label="Decklist (optional)">
                <Textarea
                  value={values.core?.decklist ?? ""}
                  onChange={(e) =>
                    form.setValue("core.decklist", e.target.value, { shouldDirty: true })
                  }
                  rows={6}
                />
              </Field>
              <Field label="Notes">
                <Textarea
                  value={values.core?.notes ?? ""}
                  onChange={(e) =>
                    form.setValue("core.notes", e.target.value, { shouldDirty: true })
                  }
                  rows={4}
                />
              </Field>
            </Section>
          ) : null}

          {category === "mystery-boxes" ? (
            <Section title="Mystery Box Fields">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Guaranteed value (ARS)">
                  <Input
                    type="number"
                    value={values.mystery?.guaranteedValue ?? ""}
                    onChange={(e) =>
                      form.setValue(
                        "mystery.guaranteedValue",
                        e.target.value ? Number(e.target.value) : undefined,
                        {
                          shouldDirty: true,
                        },
                      )
                    }
                  />
                </Field>
                <Field label="Tier">
                  <select
                    value={values.mystery?.tier ?? ""}
                    onChange={(e) =>
                      form.setValue("mystery.tier", e.target.value, { shouldDirty: true })
                    }
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                  >
                    <option value="">—</option>
                    <option value="Bronce">Bronce</option>
                    <option value="Plata">Plata</option>
                    <option value="Oro">Oro</option>
                    <option value="Diamante">Diamante</option>
                  </select>
                </Field>
              </div>
              <Field label="Rarity guarantees (comma-separated)">
                <Input
                  value={values.mystery?.rarityGuarantees ?? ""}
                  onChange={(e) =>
                    form.setValue("mystery.rarityGuarantees", e.target.value, { shouldDirty: true })
                  }
                  placeholder="Ultra Rara, Secreta"
                />
              </Field>
              <Field label="Included possibilities (one per line)">
                <Textarea
                  value={values.mystery?.includedPossibilities ?? ""}
                  onChange={(e) =>
                    form.setValue("mystery.includedPossibilities", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                  rows={6}
                />
              </Field>
            </Section>
          ) : null}
        </div>

        <div className="space-y-4">
          <Section title="Images">
            <div className="grid gap-3">
              <div className="rounded-lg border border-dashed border-border bg-surface/50 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">Main image</div>
                    <div className="text-xs text-muted-foreground">
                      Upload or pick from Media Library
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                      <Upload className="h-4 w-4" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setMainFromFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    <MediaPicker
                      items={media}
                      onPick={(url) => form.setValue("imageUrl", url, { shouldDirty: true })}
                      label="Pick"
                    />
                  </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
                  <div className="aspect-3/4 w-full">
                    {values.imageUrl ? (
                      <img src={values.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          No image
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold">Gallery</div>
                    <div className="text-xs text-muted-foreground">
                      Drag to reorder, supports multiple images
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground">
                      <Upload className="h-4 w-4" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => addGalleryFromFiles(e.target.files)}
                      />
                    </label>
                    <MediaPicker
                      items={media}
                      onPick={(url) => setGallery([...(values.galleryUrls ?? []), url])}
                      label="Add"
                    />
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  {(values.galleryUrls ?? []).length === 0 ? (
                    <div className="text-sm text-muted-foreground">No gallery images</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {(values.galleryUrls ?? []).map((url, idx) => (
                        <div
                          key={`${url}-${idx}`}
                          draggable
                          onDragStart={() => setDragIndex(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (dragIndex === null || dragIndex === idx) return;
                            const next = [...(values.galleryUrls ?? [])];
                            const [moved] = next.splice(dragIndex, 1);
                            next.splice(idx, 0, moved);
                            setDragIndex(null);
                            setGallery(next);
                          }}
                          className="group relative overflow-hidden rounded-lg border border-border bg-surface"
                        >
                          <div className="aspect-square">
                            <img src={url} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1">
                            <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-1.5 py-1 text-[10px] font-bold text-white">
                              <GripVertical className="h-3 w-3" /> {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setGallery((values.galleryUrls ?? []).filter((_, i) => i !== idx))
                              }
                              className="rounded-md bg-black/40 p-1 text-white opacity-0 transition group-hover:opacity-100"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Preview">
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{values.category}</Badge>
                <Badge
                  variant={
                    values.status === "active"
                      ? "default"
                      : values.status === "draft"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {values.status}
                </Badge>
                {values.featured ? <Badge variant="secondary">Featured</Badge> : null}
              </div>
              <div className="mt-3 text-sm font-semibold">{values.name || "Untitled product"}</div>
              <div className="mt-1 text-xs text-muted-foreground">/{values.slug || "slug"}</div>
              <div className="mt-3 text-sm font-bold">
                {values.price ? `$ ${values.price.toLocaleString("es-AR")}` : "$ 0"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Stock: {values.stock}</div>
            </div>
          </Section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="text-xs text-muted-foreground">
            {form.formState.isDirty ? "Unsaved changes" : "All changes saved"}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!form.formState.isValid}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 font-display text-sm font-bold">{title}</div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error ? <span className="text-sm font-semibold text-destructive">{error}</span> : null}
    </label>
  );
}

function MediaPicker({
  items,
  onPick,
  label,
}: {
  items: { id: string; name: string; url: string }[];
  onPick: (url: string) => void;
  label: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" className="gap-2">
          <ImageIcon className="h-4 w-4" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface/50 p-10 text-center text-sm text-muted-foreground">
            No images yet. Upload from Media Library first.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onPick(m.url)}
                className="group overflow-hidden rounded-lg border border-border bg-background text-left shadow-card transition hover:shadow-card-hover"
              >
                <div className="aspect-square bg-surface">
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-2">
                  <div className="truncate text-xs font-semibold">{m.name}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

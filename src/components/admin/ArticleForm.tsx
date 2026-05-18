import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import type { AdminArticle, AdminArticleBlock } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/slug";
import { listMedia } from "@/lib/admin/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  subtitle: z.string().optional(),
  category: z.string().min(2),
  tags: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published"]),
  publishDate: z.string().optional(),
  featured: z.boolean(),
  bannerUrl: z.string().optional(),
});

type Values = z.infer<typeof schema>;

function toValues(a?: AdminArticle): Values {
  return {
    title: a?.title ?? "",
    slug: a?.slug ?? "",
    subtitle: a?.subtitle ?? "",
    category: a?.category ?? "Meta",
    tags: a?.tags?.join(", ") ?? "",
    author: a?.author ?? "",
    status: a?.status ?? "draft",
    publishDate: a?.publishDate ?? "",
    featured: Boolean(a?.featured),
    bannerUrl: a?.bannerUrl ?? "",
  };
}

function toArticle(
  id: string,
  prev: AdminArticle | undefined,
  v: Values,
  blocks: AdminArticleBlock[],
): AdminArticle {
  const now = new Date().toISOString();
  return {
    id,
    title: v.title,
    slug: v.slug,
    subtitle: v.subtitle || undefined,
    category: v.category,
    tags: (v.tags || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    author: v.author || undefined,
    status: v.status,
    publishDate: v.publishDate || undefined,
    featured: v.featured,
    bannerUrl: v.bannerUrl || undefined,
    blocks,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
}

export function ArticleForm({
  mode,
  initial,
  onCancel,
  onSave,
}: {
  mode: "new" | "edit";
  initial?: AdminArticle;
  onCancel: () => void;
  onSave: (next: AdminArticle) => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: toValues(initial),
    mode: "onChange",
  });

  const values = form.watch();
  const [blocks, setBlocks] = useState<AdminArticleBlock[]>(() => initial?.blocks ?? []);
  const [tab, setTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (!initial) return;
    form.reset(toValues(initial));
    setBlocks(initial.blocks ?? []);
  }, [initial, form]);

  const media = useMemo(() => listMedia(), []);

  const addBlock = (type: AdminArticleBlock["type"]) => {
    const id = crypto.randomUUID();
    const next: AdminArticleBlock =
      type === "heading"
        ? { id, type, text: "", level: 2 }
        : type === "paragraph"
          ? { id, type, text: "" }
          : type === "quote"
            ? { id, type, text: "" }
            : type === "list"
              ? { id, type, items: [""] }
              : type === "divider"
                ? { id, type }
                : type === "image"
                  ? { id, type, url: "", alt: "", caption: "" }
                  : type === "link"
                    ? { id, type, label: "", url: "" }
                    : { id, type, label: "", url: "", variant: "primary" };
    setBlocks((b) => [...b, next]);
  };

  const updateBlock = (id: string, next: AdminArticleBlock) => {
    setBlocks((b) => b.map((blk) => (blk.id === id ? next : blk)));
  };

  const removeBlock = (id: string) => setBlocks((b) => b.filter((blk) => blk.id !== id));

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((b) => {
      const idx = b.findIndex((x) => x.id === id);
      if (idx === -1) return b;
      const next = [...b];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return next;
      const [moved] = next.splice(idx, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const setBannerFromFile = async (file: File | null) => {
    if (!file) return;
    const url = await readAsDataUrl(file);
    form.setValue("bannerUrl", url, { shouldDirty: true });
  };

  const save = () => {
    if (!form.formState.isValid) return;
    const id = initial?.id ?? crypto.randomUUID();
    const next = toArticle(id, initial, form.getValues(), blocks);
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
              {mode === "new" ? "New Article" : "Edit Article"}
            </div>
            <div className="text-sm text-muted-foreground">
              Editorial workflow with live preview
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

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 font-display text-sm font-bold">General</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title" error={form.formState.errors.title?.message}>
                <Input
                  value={values.title}
                  onChange={(e) => {
                    form.setValue("title", e.target.value, {
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
                  placeholder="Tournament Trends: NOA"
                />
              </Field>
              <Field label="Slug" error={form.formState.errors.slug?.message}>
                <Input
                  value={values.slug}
                  onChange={(e) =>
                    form.setValue("slug", slugify(e.target.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="tournament-trends-noa"
                />
              </Field>
              <Field label="Category">
                <Input
                  value={values.category}
                  onChange={(e) =>
                    form.setValue("category", e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="Meta"
                />
              </Field>
              <Field label="Status">
                <select
                  value={values.status}
                  onChange={(e) =>
                    form.setValue("status", e.target.value as never, {
                      shouldDirty: true,
                    })
                  }
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
                >
                  <option value="draft">draft</option>
                  <option value="scheduled">scheduled</option>
                  <option value="published">published</option>
                </select>
              </Field>
            </div>

            <Field label="Subtitle">
              <Textarea
                value={values.subtitle ?? ""}
                onChange={(e) => form.setValue("subtitle", e.target.value, { shouldDirty: true })}
                rows={2}
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tags (comma-separated)">
                <Input
                  value={values.tags ?? ""}
                  onChange={(e) => form.setValue("tags", e.target.value, { shouldDirty: true })}
                  placeholder="meta, analysis"
                />
              </Field>
              <Field label="Author">
                <Input
                  value={values.author ?? ""}
                  onChange={(e) => form.setValue("author", e.target.value, { shouldDirty: true })}
                  placeholder="TeamPulse"
                />
              </Field>
              <Field label="Publish date (ISO or text)">
                <Input
                  value={values.publishDate ?? ""}
                  onChange={(e) =>
                    form.setValue("publishDate", e.target.value, { shouldDirty: true })
                  }
                  placeholder={new Date().toISOString()}
                />
              </Field>
              <div className="flex items-end justify-between rounded-md border border-border bg-surface px-3 py-2">
                <div>
                  <div className="text-sm font-semibold">Featured</div>
                  <div className="text-xs text-muted-foreground">Highlights on home/news hub</div>
                </div>
                <Switch
                  checked={values.featured}
                  onCheckedChange={(v) => form.setValue("featured", v, { shouldDirty: true })}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display text-sm font-bold">Content</div>
                <div className="text-xs text-muted-foreground">
                  Blocks with clean editorial hierarchy
                </div>
              </div>
              <Tabs value={tab} onValueChange={(v) => setTab(v as never)}>
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-4 w-4" /> Preview
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as never)}>
              <TabsContent value="write" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  <AddBlockButton onClick={() => addBlock("heading")}>Heading</AddBlockButton>
                  <AddBlockButton onClick={() => addBlock("paragraph")}>Paragraph</AddBlockButton>
                  <AddBlockButton onClick={() => addBlock("quote")}>Quote</AddBlockButton>
                  <AddBlockButton onClick={() => addBlock("list")}>List</AddBlockButton>
                  <AddBlockButton onClick={() => addBlock("divider")}>Divider</AddBlockButton>
                  <AddBlockButton onClick={() => addBlock("image")}>Image</AddBlockButton>
                  <AddBlockButton onClick={() => addBlock("link")}>Link</AddBlockButton>
                  <AddBlockButton onClick={() => addBlock("cta")}>CTA</AddBlockButton>
                </div>

                <div className="mt-4 grid gap-3">
                  {blocks.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-surface/50 p-10 text-center text-sm text-muted-foreground">
                      Add blocks to start writing.
                    </div>
                  ) : (
                    blocks.map((b, idx) => (
                      <div
                        key={b.id}
                        className="rounded-lg border border-border bg-background p-3 shadow-card"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{b.type}</Badge>
                            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={idx === 0}
                              onClick={() => moveBlock(b.id, -1)}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={idx === blocks.length - 1}
                              onClick={() => moveBlock(b.id, 1)}
                            >
                              ↓
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeBlock(b.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <BlockEditor
                          block={b}
                          media={media}
                          onChange={(next) => updateBlock(b.id, next)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <ArticlePreview values={values} blocks={blocks} />
              </TabsContent>
            </Tabs>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 font-display text-sm font-bold">Banner</div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">Upload or pick from Media Library</div>
              <div className="flex flex-wrap justify-end gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                  <Upload className="h-4 w-4" /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setBannerFromFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <MediaPicker
                  items={media}
                  onPick={(url) => form.setValue("bannerUrl", url, { shouldDirty: true })}
                  label="Pick"
                />
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface">
              <div className="aspect-video">
                {values.bannerUrl ? (
                  <img src={values.bannerUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> No banner
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 font-display text-sm font-bold">Quick Preview</div>
            <ArticlePreview values={values} blocks={blocks} compact />
          </section>
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

function AddBlockButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Button type="button" variant="secondary" size="sm" onClick={onClick} className="gap-2">
      <Plus className="h-4 w-4" /> {children}
    </Button>
  );
}

function BlockEditor({
  block,
  media,
  onChange,
}: {
  block: AdminArticleBlock;
  media: { id: string; name: string; url: string }[];
  onChange: (next: AdminArticleBlock) => void;
}) {
  if (block.type === "divider") return <div className="text-sm text-muted-foreground">Divider</div>;

  if (block.type === "heading") {
    return (
      <div className="grid gap-2">
        <div className="grid gap-1">
          <span className="text-xs font-semibold text-muted-foreground">Level</span>
          <select
            value={block.level}
            onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 })}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
          >
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        </div>
        <Textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          rows={2}
        />
      </div>
    );
  }

  if (block.type === "paragraph" || block.type === "quote") {
    return (
      <Textarea
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        rows={4}
      />
    );
  }

  if (block.type === "list") {
    return (
      <Textarea
        value={block.items.join("\n")}
        onChange={(e) =>
          onChange({
            ...block,
            items: e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        rows={5}
      />
    );
  }

  if (block.type === "image") {
    return (
      <div className="grid gap-2">
        <div className="grid gap-1">
          <span className="text-xs font-semibold text-muted-foreground">Image URL</span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://..."
            />
            <MediaPicker items={media} onPick={(url) => onChange({ ...block, url })} label="Pick" />
          </div>
        </div>
        <Input
          value={block.alt ?? ""}
          onChange={(e) => onChange({ ...block, alt: e.target.value })}
          placeholder="Alt text"
        />
        <Input
          value={block.caption ?? ""}
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          placeholder="Caption"
        />
      </div>
    );
  }

  if (block.type === "link") {
    return (
      <div className="grid gap-2">
        <Input
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          placeholder="Link label"
        />
        <Input
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="https://..."
        />
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <span className="text-xs font-semibold text-muted-foreground">Variant</span>
        <select
          value={block.variant}
          onChange={(e) =>
            onChange({ ...block, variant: e.target.value as "primary" | "secondary" })
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none transition focus:border-accent"
        >
          <option value="primary">primary</option>
          <option value="secondary">secondary</option>
        </select>
      </div>
      <Input
        value={block.label}
        onChange={(e) => onChange({ ...block, label: e.target.value })}
        placeholder="CTA label"
      />
      <Input
        value={block.url}
        onChange={(e) => onChange({ ...block, url: e.target.value })}
        placeholder="https://..."
      />
    </div>
  );
}

function ArticlePreview({
  values,
  blocks,
  compact,
}: {
  values: Values;
  blocks: AdminArticleBlock[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "rounded-xl border border-border bg-background p-5"}>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{values.category}</Badge>
        <Badge
          variant={
            values.status === "published"
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
      <div className="mt-3 font-display text-xl font-bold leading-tight">
        {values.title || "Untitled"}
      </div>
      {values.subtitle ? (
        <div className="mt-1 text-sm text-muted-foreground">{values.subtitle}</div>
      ) : null}
      <div className="mt-1 text-xs text-muted-foreground">/{values.slug || "slug"}</div>
      {values.bannerUrl ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-surface">
          <div className="aspect-video">
            <img src={values.bannerUrl} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        {blocks.length === 0 ? (
          <div className="text-sm text-muted-foreground">No content yet.</div>
        ) : (
          blocks.map((b) => <RenderedBlock key={b.id} block={b} />)
        )}
      </div>
    </div>
  );
}

function RenderedBlock({ block }: { block: AdminArticleBlock }) {
  if (block.type === "divider") return <div className="h-px w-full bg-border" />;
  if (block.type === "heading") {
    const cls = block.level === 2 ? "text-lg font-bold" : "text-base font-bold";
    return <div className={`font-display ${cls}`}>{block.text || "Heading"}</div>;
  }
  if (block.type === "paragraph")
    return <div className="text-sm text-foreground">{block.text}</div>;
  if (block.type === "quote")
    return (
      <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm italic">
        {block.text}
      </div>
    );
  if (block.type === "list") {
    return (
      <ul className="list-disc pl-5 text-sm">
        {block.items.map((it, i) => (
          <li key={`${it}-${i}`}>{it}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "image") {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="aspect-video bg-surface">
          {block.url ? (
            <img src={block.url} alt={block.alt ?? ""} className="h-full w-full object-cover" />
          ) : null}
        </div>
        {block.caption ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">{block.caption}</div>
        ) : null}
      </div>
    );
  }
  if (block.type === "link") {
    return (
      <a
        href={block.url}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold text-accent hover:underline"
      >
        {block.label || block.url}
      </a>
    );
  }
  return (
    <a
      href={block.url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex w-fit items-center rounded-md px-4 py-2 text-sm font-semibold ${
        block.variant === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {block.label || "CTA"}
    </a>
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

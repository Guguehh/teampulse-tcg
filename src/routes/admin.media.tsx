import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Copy, Search, Trash2, Upload } from "lucide-react";
import { deleteMedia, listMedia, upsertMedia } from "@/lib/admin/db";
import type { AdminMediaItem } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { shareLink } from "@/lib/admin/share";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
  head: () => ({ meta: [{ title: "Media Library — Admin" }] }),
});

function AdminMedia() {
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("admin-db-changed", onChange);
    return () => window.removeEventListener("admin-db-changed", onChange);
  }, []);

  const items = useMemo(() => {
    void tick;
    return listMedia()
      .filter((m) => (q ? m.name.toLowerCase().includes(q.toLowerCase()) : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [tick, q]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const reads = Array.from(files).map(async (file) => {
      const url = await readAsDataUrl(file);
      const item: AdminMediaItem = {
        id: crypto.randomUUID(),
        kind: "image",
        name: file.name,
        url,
        createdAt: new Date().toISOString(),
        sizeBytes: file.size,
      };
      upsertMedia(item);
    });
    await Promise.all(reads);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-2xl font-bold">Media Library</div>
          <div className="text-sm text-muted-foreground">{items.length} assets</div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
          <Upload className="h-4 w-4" /> Upload
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => upload(e.target.files)}
          />
        </label>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search media…"
            className="pl-9"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-muted-foreground">
          Upload images to build your reusable media library.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <div
              key={m.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <button className="block w-full text-left">
                    <div className="aspect-square bg-surface">
                      <img src={m.url} alt={m.alt ?? ""} className="h-full w-full object-cover" />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[calc(100vw-2rem)] overflow-hidden p-0 sm:max-w-4xl">
                  <DialogHeader className="p-4">
                    <DialogTitle className="truncate">{m.name}</DialogTitle>
                  </DialogHeader>
                  <div className="bg-black">
                    <img
                      src={m.url}
                      alt={m.alt ?? ""}
                      className="max-h-[75vh] w-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <div className="p-2">
                <div className="truncate text-xs font-semibold">{m.name}</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => shareLink("copy", m.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <DeleteMediaButton id={m.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteMediaButton({ id }: { id: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete media?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMedia(id)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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

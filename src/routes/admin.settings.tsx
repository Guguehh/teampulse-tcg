import { createFileRoute } from "@tanstack/react-router";
import { Database, KeyRound, RotateCcw } from "lucide-react";
import { getAdminPassword, signOut } from "@/lib/admin/auth";
import { clearAdminStorage } from "@/lib/admin/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
});

function AdminSettings() {
  const usingDefault = getAdminPassword() === "admin";

  return (
    <div className="space-y-4">
      <div>
        <div className="font-display text-2xl font-bold">Settings</div>
        <div className="text-sm text-muted-foreground">Admin configuration & utilities</div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 font-display font-bold">
            <KeyRound className="h-4 w-4 text-accent" /> Admin password
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            This build uses a simple password gate. Set VITE_ADMIN_PASSWORD for a custom value.
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={usingDefault ? "destructive" : "secondary"}>
              {usingDefault ? "Using default password" : "Custom password set"}
            </Badge>
            <Button variant="secondary" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 font-display font-bold">
            <Database className="h-4 w-4 text-accent" /> Local data
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Products, articles and media are stored in localStorage. Ready for future Supabase
            integration.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="destructive" className="gap-2" onClick={() => clearAdminStorage()}>
              <RotateCcw className="h-4 w-4" />
              Reset demo data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

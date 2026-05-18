import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminPassword, isAuthed, signIn } from "@/lib/admin/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — TeamPulse" }] }),
});

function AdminLayout() {
  const router = useRouter();
  const [authed, setAuthed] = useState(() => isAuthed());
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onChange = () => setAuthed(isAuthed());
    window.addEventListener("admin-auth-changed", onChange);
    return () => window.removeEventListener("admin-auth-changed", onChange);
  }, []);

  const hint = useMemo(() => {
    const required = getAdminPassword();
    return required === "admin" ? "Default: admin" : null;
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md px-4 py-10">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-bold">Admin Panel</div>
                <div className="text-sm text-muted-foreground">Acceso privado</div>
              </div>
            </div>

            <form
              className="mt-6 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const ok = signIn(password);
                if (!ok) {
                  setError("Clave incorrecta.");
                  return;
                }
                setError(null);
                setPassword("");
                router.invalidate();
              }}
            >
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresá la clave del admin"
                />
                {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
                {error && <div className="text-sm font-semibold text-destructive">{error}</div>}
              </div>

              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <AdminShell />;
}

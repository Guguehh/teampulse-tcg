import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground">{label}</div>
          <div className="mt-1 font-display text-2xl font-bold">{value}</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-foreground shadow-card">
          {icon}
        </div>
      </div>
    </div>
  );
}

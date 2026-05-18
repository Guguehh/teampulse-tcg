interface AdSlotProps {
  label?: string;
  height?: number;
}

export function AdSlot({ label = "Espacio publicitario", height = 600 }: AdSlotProps) {
  return (
    <div
      className="flex items-center justify-center rounded-xl border border-dashed border-border bg-surface/60 text-xs text-muted-foreground"
      style={{ minHeight: height }}
      aria-label={label}
    >
      <div className="text-center">
        <div className="mb-1 font-display text-sm font-semibold text-foreground/60">AD</div>
        <div>{label}</div>
        <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
          160×600
        </div>
      </div>
    </div>
  );
}

export function PageWithAds({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 py-6 xl:grid-cols-[160px_minmax(0,1fr)_160px]">
      <aside className="hidden xl:block">
        <div className="sticky top-32">
          <AdSlot label="Sponsor izquierdo" />
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
      <aside className="hidden xl:block">
        <div className="sticky top-32">
          <AdSlot label="Sponsor derecho" />
        </div>
      </aside>
    </div>
  );
}

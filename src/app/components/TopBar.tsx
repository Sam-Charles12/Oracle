import { Search, Bell, Radio } from "lucide-react";

export function TopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-border">
      <div className="min-w-0">
        <h1 className="truncate" style={{ fontSize: 22, fontWeight: 700 }}>{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <div
          className="hidden lg:flex items-center gap-2 rounded-full px-3.5 py-2"
          style={{ backgroundColor: "var(--risk-green-soft)", color: "var(--risk-green)" }}
        >
          <Radio size={15} className="animate-pulse" />
          <span className="text-xs" style={{ fontWeight: 600 }}>Live feed · synced</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-card rounded-full border border-border px-3.5 py-2 w-56">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            placeholder="Search assets…"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>
        <button className="relative grid place-items-center rounded-full bg-card border border-border size-10 hover:bg-muted transition-colors">
          <Bell size={17} />
          <span
            className="absolute top-2 right-2 rounded-full"
            style={{ width: 7, height: 7, backgroundColor: "var(--risk-red)" }}
          />
        </button>
      </div>
    </header>
  );
}

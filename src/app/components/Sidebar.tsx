import {
  LayoutGrid,
  AlertTriangle,
  Building2,
  Activity,
  Settings,
  LifeBuoy,
} from "lucide-react";

export type View = "overview" | "escalation" | "plants";

const nav: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Fleet Overview", icon: LayoutGrid },
  { id: "escalation", label: "Escalations", icon: AlertTriangle },
  { id: "plants", label: "Multi-Plant", icon: Building2 },
];

export function Sidebar({
  view,
  onNavigate,
  redCount,
  amberCount,
}: {
  view: View;
  onNavigate: (v: View) => void;
  redCount: number;
  amberCount: number;
}) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border px-4 py-6">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div
          className="grid place-items-center rounded-xl"
          style={{ width: 38, height: 38, backgroundColor: "var(--primary)" }}
        >
          <Activity size={20} className="text-primary-foreground" />
        </div>
        <div>
          <div
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, lineHeight: 1 }}
          >
            Oracle
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Predictive Maintenance</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = view === item.id;
          const Icon = item.icon;
          const badge =
            item.id === "escalation" ? redCount + amberCount : 0;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors text-left ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              <span className="text-sm" style={{ fontWeight: active ? 600 : 500 }}>
                {item.label}
              </span>
              {badge > 0 && (
                <span
                  className="ml-auto text-xs tabular-nums rounded-full px-1.5 py-0.5"
                  style={{
                    backgroundColor: redCount > 0 ? "var(--risk-red-soft)" : "var(--risk-amber-soft)",
                    color: redCount > 0 ? "var(--risk-red)" : "var(--risk-amber)",
                    fontWeight: 600,
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-colors">
          <LifeBuoy size={19} />
          <span className="text-sm" style={{ fontWeight: 500 }}>Support</span>
        </button>
        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-colors">
          <Settings size={19} />
          <span className="text-sm" style={{ fontWeight: 500 }}>Settings</span>
        </button>

        <div className="flex items-center gap-3 rounded-xl px-2 py-2 mt-3 border-t border-sidebar-border pt-4">
          <div
            className="grid place-items-center rounded-full text-primary-foreground shrink-0"
            style={{ width: 36, height: 36, backgroundColor: "var(--chart-1)", fontWeight: 600, fontSize: 14 }}
          >
            AO
          </div>
          <div className="min-w-0">
            <div className="text-sm truncate" style={{ fontWeight: 600 }}>Adaeze Okafor</div>
            <div className="text-xs text-muted-foreground truncate">Plant Manager · Obajana</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

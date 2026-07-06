import { useMemo, useState } from "react";
import { Search, Bell, Radio, Menu } from "lucide-react";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { cn } from "./ui/utils";
import { type View } from "./Sidebar";

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  tone: "critical" | "warning";
  timestamp: string;
};

export function TopBar({
  title,
  subtitle,
  view,
  onNavigate,
  onOpenSupport,
  onOpenSettings,
  searchValue,
  onSearchChange,
  notifications,
  liveFeedEnabled,
  showNotificationTimestamps,
}: {
  title: string;
  subtitle: string;
  view: View;
  onNavigate: (v: View) => void;
  onOpenSupport: () => void;
  onOpenSettings: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  notifications: NotificationItem[];
  liveFeedEnabled: boolean;
  showNotificationTimestamps: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.length;
  const navigationItems: { id: View; label: string }[] = [
    { id: "overview", label: "Fleet Overview" },
    { id: "escalation", label: "Escalations" },
    { id: "plants", label: "Multi-Plant" },
  ];

  const formattedNotifications = useMemo(
    () =>
      notifications.map((notification) => ({
        ...notification,
        timestampLabel: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(notification.timestamp)),
      })),
    [notifications],
  );

  return (
    <header className="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-border">
      <div className="min-w-0">
        <h1 className="truncate" style={{ fontSize: 22, fontWeight: 700 }}>
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">
          {subtitle}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <button
            type="button"
            className="md:hidden relative grid place-items-center rounded-full bg-card border border-border size-10 hover:bg-muted transition-colors cursor-pointer"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={18} />
          </button>
          <SheetContent side="left" className="w-[min(88vw,20rem)]">
            <SheetHeader>
              <SheetTitle>Oracle</SheetTitle>
              <SheetDescription>
                Navigate the fleet dashboard and access support tools.
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 pt-2 space-y-4">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input
                  placeholder="Search assets…"
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const active = view === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    onOpenSupport();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center rounded-xl px-3 py-2.5 text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium">Support</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenSettings();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center rounded-xl px-3 py-2.5 text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div
          className="hidden lg:flex items-center gap-2 rounded-full px-3.5 py-2"
          style={{
            backgroundColor: "var(--risk-green-soft)",
            color: "var(--risk-green)",
          }}
        >
          <Radio size={15} className="animate-pulse" />
          <span className="text-xs" style={{ fontWeight: 600 }}>
            {liveFeedEnabled ? "Live feed · synced" : "Live feed · paused"}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-card rounded-full border border-border px-3.5 py-2 w-56">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            placeholder="Search assets…"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="relative grid place-items-center rounded-full bg-card border border-border size-10 hover:bg-muted transition-colors cursor-pointer"
              aria-label="Open notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-2 right-2 rounded-full"
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: "var(--risk-red)",
                  }}
                />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0 overflow-hidden" align="end">
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    Notifications
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {unreadCount > 0
                      ? `${unreadCount} active escalation${unreadCount === 1 ? "" : "s"}`
                      : "No active notifications"}
                  </p>
                </div>
                <Badge variant="secondary">Live</Badge>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {formattedNotifications.length === 0 ? (
                <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Nothing needs attention right now.
                </div>
              ) : (
                formattedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-xl border border-border bg-card px-3 py-3 mb-2 last:mb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {notification.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification.detail}
                        </div>
                      </div>
                      <Badge
                        variant={
                          notification.tone === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {notification.tone === "critical" ? "Red" : "Amber"}
                      </Badge>
                    </div>
                    {showNotificationTimestamps && (
                      <div className="text-[11px] text-muted-foreground mt-2">
                        Updated {notification.timestampLabel}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

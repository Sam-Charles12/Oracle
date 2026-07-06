import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export function AppPanels({
  settingsOpen,
  supportOpen,
  onSettingsOpenChange,
  onSupportOpenChange,
  liveFeedEnabled,
  onLiveFeedEnabledChange,
  showNotificationTimestamps,
  onShowNotificationTimestampsChange,
  theme,
  onThemeChange,
}: {
  settingsOpen: boolean;
  supportOpen: boolean;
  onSettingsOpenChange: (open: boolean) => void;
  onSupportOpenChange: (open: boolean) => void;
  liveFeedEnabled: boolean;
  onLiveFeedEnabledChange: (value: boolean) => void;
  showNotificationTimestamps: boolean;
  onShowNotificationTimestampsChange: (value: boolean) => void;
  theme: "light" | "dark";
  onThemeChange: (value: "light" | "dark") => void;
}) {
  const copySupportText = async () => {
    const text = [
      "Plant operations desk: +234 800 000 1122",
      "Maintenance support: maintenance@oracle.local",
    ].join("\n");

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <>
      <Dialog open={settingsOpen} onOpenChange={onSettingsOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Tune the dashboard behavior for live monitoring and notification
              detail.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Appearance</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Switch between light and dark mode.
                  </p>
                </div>
                <div className="flex rounded-full border border-border bg-background p-1">
                  <button
                    type="button"
                    onClick={() => onThemeChange("light")}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                      theme === "light"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange("dark")}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                      theme === "dark"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    Live feed indicators
                  </span>
                  <Badge variant={liveFeedEnabled ? "default" : "secondary"}>
                    {liveFeedEnabled ? "Enabled" : "Paused"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Show the live sync chip in the header.
                </p>
              </div>
              <Switch
                checked={liveFeedEnabled}
                onCheckedChange={onLiveFeedEnabledChange}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    Notification timestamps
                  </span>
                  <Badge
                    variant={
                      showNotificationTimestamps ? "default" : "secondary"
                    }
                  >
                    {showNotificationTimestamps ? "Visible" : "Hidden"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Show when each escalation item was updated.
                </p>
              </div>
              <Switch
                checked={showNotificationTimestamps}
                onCheckedChange={onShowNotificationTimestampsChange}
              />
            </div>
          </div>

          <Separator />

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onLiveFeedEnabledChange(true);
                onShowNotificationTimestampsChange(true);
              }}
            >
              Reset defaults
            </Button>
            <Button type="button" onClick={() => onSettingsOpenChange(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={supportOpen} onOpenChange={onSupportOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Support Center</DialogTitle>
            <DialogDescription>
              Use the plant operations contacts below when you need help with
              alerts, data quality, or routing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    Plant operations desk
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    +234 800 000 1122
                  </p>
                </div>
                <Badge variant="secondary">24/7</Badge>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    Maintenance support
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    maintenance@oracle.local
                  </p>
                </div>
                <Badge variant="outline">Email</Badge>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">
                    Data quality review
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Queue anomalies or missing sensor readings for triage.
                  </p>
                </div>
                <Badge variant="secondary">Ops</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={copySupportText}>
              Copy contacts
            </Button>
            <Button type="button" onClick={() => onSupportOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

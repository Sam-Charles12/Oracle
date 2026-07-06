import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar, type View } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Overview } from "./components/Overview";
import { AssetDetail } from "./components/AssetDetail";
import { Escalation } from "./components/Escalation";
import { MultiPlant } from "./components/MultiPlant";
import { AppPanels } from "./components/AppPanels";
import { useOracleData } from "./components/useOracleData";
import { escalationLabel, type Tier } from "./components/data";

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  tone: "critical" | "warning";
  timestamp: string;
};

export default function App() {
  const { assets } = useOracleData();
  const [view, setView] = useState<View>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [liveFeedEnabled, setLiveFeedEnabled] = useState(true);
  const [showNotificationTimestamps, setShowNotificationTimestamps] =
    useState(true);

  const counts = useMemo<Record<Tier, number>>(
    () => ({
      Green: assets.filter((a) => a.tier === "Green").length,
      Amber: assets.filter((a) => a.tier === "Amber").length,
      Red: assets.filter((a) => a.tier === "Red").length,
    }),
    [assets],
  );

  const visibleAssets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return assets;

    return assets.filter((asset) => {
      const searchable = [
        asset.asset_name,
        asset.plant,
        asset.tier,
        asset.pf_zone_label,
        asset.advisory.recommendation,
        asset.escalation.status,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [assets, searchTerm]);

  const notifications = useMemo<NotificationItem[]>(
    () =>
      assets
        .filter((asset) => asset.tier !== "green")
        .sort((a, b) => b.risk_score - a.risk_score)
        .map((asset) => ({
          id: asset.asset_id,
          title: asset.asset_name,
          detail: `${escalationLabel[asset.escalation.status]} · ${asset.pf_zone_label}`,
          tone: asset.tier === "red" ? "critical" : "warning",
          timestamp: asset.last_updated,
        })),
    [assets],
  );

  const selected = assets.find((a) => a.asset_id === selectedId) ?? null;

  const openAsset = (id: string) => {
    setSelectedId(id);
    setView("overview");
  };
  const backToGrid = () => setSelectedId(null);

  const navigate = (v: View) => {
    setSelectedId(null);
    setView(v);
  };

  const headers: Record<View, { title: string; subtitle: string }> = {
    overview: {
      title: "Fleet Overview",
      subtitle:
        "Condition-based risk & remaining useful life across monitored equipment",
    },
    escalation: {
      title: "Escalation Workflow",
      subtitle: "Live operational state — Green / Amber / Red routed to action",
    },
    plants: {
      title: "Multi-Plant View",
      subtitle: "Aggregate equipment risk across DCP plants",
    },
  };

  const header =
    selected && view === "overview"
      ? {
          title: "Asset Detail",
          subtitle: "Drilling into the driving signals behind the score",
        }
      : headers[view];

  return (
    <div className="size-full flex bg-background text-foreground overflow-hidden">
      <Sidebar
        view={view}
        onNavigate={navigate}
        onOpenSupport={() => setSupportOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        redCount={counts.Red}
        amberCount={counts.Amber}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={header.title}
          subtitle={header.subtitle}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          notifications={notifications}
          liveFeedEnabled={liveFeedEnabled}
          showNotificationTimestamps={showNotificationTimestamps}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === "overview" && !selected && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Overview
                  assets={visibleAssets}
                  totalAssets={assets.length}
                  searchTerm={searchTerm}
                  onClearSearch={() => setSearchTerm("")}
                  onOpen={openAsset}
                  onNavigate={navigate}
                />
              </motion.div>
            )}

            {view === "overview" && selected && (
              <motion.div
                key={`detail-${selected.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AssetDetail asset={selected} onBack={backToGrid} />
              </motion.div>
            )}

            {view === "escalation" && (
              <motion.div
                key="escalation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Escalation assets={assets} onOpen={openAsset} />
              </motion.div>
            )}

            {view === "plants" && (
              <motion.div
                key="plants"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MultiPlant onSelectObajana={() => navigate("overview")} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AppPanels
        settingsOpen={settingsOpen}
        supportOpen={supportOpen}
        onSettingsOpenChange={setSettingsOpen}
        onSupportOpenChange={setSupportOpen}
        liveFeedEnabled={liveFeedEnabled}
        onLiveFeedEnabledChange={setLiveFeedEnabled}
        showNotificationTimestamps={showNotificationTimestamps}
        onShowNotificationTimestampsChange={setShowNotificationTimestamps}
      />
    </div>
  );
}

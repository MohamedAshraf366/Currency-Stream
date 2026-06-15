import { useTranslation } from "react-i18next";
import { Coins, TrendingUp, Activity, Bitcoin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatUSD } from "@/lib/coingecko";
import type { GlobalData } from "@/lib/coingecko";

export function StatsCards({ data }: { data?: GlobalData }) {
  const { t } = useTranslation();
  const items = [
    { label: t("stats.marketCap"), value: data ? formatUSD(data.total_market_cap_usd, true) : "—", icon: Coins, accent: "from-primary to-accent" },
    { label: t("stats.volume"), value: data ? formatUSD(data.total_volume_usd, true) : "—", icon: TrendingUp, accent: "from-accent to-primary" },
    { label: t("stats.btcDom"), value: data ? `${data.btc_dominance.toFixed(2)}%` : "—", icon: Bitcoin, accent: "from-primary to-accent" },
    { label: t("stats.coins"), value: data ? data.active_cryptocurrencies.toLocaleString() : "—", icon: Activity, accent: "from-accent to-primary" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label} className="relative overflow-hidden border-border/60 p-5 shadow-[var(--shadow-card)]">
          <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${it.accent} opacity-15 blur-2xl rtl:right-auto rtl:-left-8`} />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{it.label}</p>
              <p className="mt-2 font-display text-2xl font-bold tracking-tight">{it.value}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <it.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

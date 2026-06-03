import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatsCards } from "@/components/stats-cards";
import { MarketHeroChart } from "@/components/market-hero-chart";
import { CoinTable } from "@/components/coin-table";
import { fetchGlobal, fetchMarkets } from "@/lib/coingecko";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CryptoPulse — Dashboard" },
      { name: "description", content: "Real-time crypto market overview, prices, and trends." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  const globalQ = useQuery({ queryKey: ["global"], queryFn: fetchGlobal, refetchInterval: 60_000 });
  const marketsQ = useQuery({ queryKey: ["markets", 1], queryFn: () => fetchMarkets("usd", 100, 1), refetchInterval: 30_000 });

  const filtered = useMemo(() => {
    const data = marketsQ.data ?? [];
    if (!q.trim()) return data;
    const s = q.toLowerCase();
    return data.filter((c) => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s));
  }, [marketsQ.data, q]);

  const top = marketsQ.data?.[0];

  return (
    <DashboardLayout search={q} onSearch={setQ}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t("dashboard.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        <StatsCards data={globalQ.data} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MarketHeroChart coin={top} />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {marketsQ.data?.slice(1, 5).map((c) => {
              const pos = (c.price_change_percentage_24h_in_currency ?? 0) >= 0;
              return (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="h-8 w-8 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-xs uppercase text-muted-foreground">{c.symbol}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-sm font-bold tabular-nums">${c.current_price.toLocaleString(undefined, { maximumFractionDigits: c.current_price < 1 ? 4 : 2 })}</div>
                    <div className={`text-xs font-medium ${pos ? "text-[color:var(--color-success)]" : "text-destructive"}`}>
                      {pos ? "+" : ""}{(c.price_change_percentage_24h_in_currency ?? 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {marketsQ.isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ms-2 text-sm">{t("common.loading")}</span>
          </div>
        ) : marketsQ.isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {t("common.error")}
          </div>
        ) : (
          <CoinTable coins={filtered} />
        )}
      </div>
    </DashboardLayout>
  );
}

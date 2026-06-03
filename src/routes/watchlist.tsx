import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CoinTable } from "@/components/coin-table";
import { Card } from "@/components/ui/card";
import { fetchMarkets } from "@/lib/coingecko";
import { useWatchlist } from "@/hooks/use-watchlist";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — CryptoPulse" },
      { name: "description", content: "Track your favorite cryptocurrencies in one place." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { t } = useTranslation();
  const { ids } = useWatchlist();
  const [q, setQ] = useState("");
  const { data } = useQuery({ queryKey: ["markets", "all"], queryFn: () => fetchMarkets("usd", 250, 1), refetchInterval: 30_000 });

  const filtered = useMemo(() => {
    const list = (data ?? []).filter((c) => ids.includes(c.id));
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return list.filter((c) => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s));
  }, [data, ids, q]);

  return (
    <DashboardLayout search={q} onSearch={setQ}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("watchlist.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("watchlist.subtitle")}</p>
        </div>
        {ids.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 border-dashed p-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Star className="h-7 w-7" />
            </div>
            <p className="text-sm text-muted-foreground">{t("watchlist.empty")}</p>
            <Link to="/markets" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90">
              {t("nav.markets")}
            </Link>
          </Card>
        ) : (
          <CoinTable coins={filtered} />
        )}
      </div>
    </DashboardLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CoinTable } from "@/components/coin-table";
import { fetchMarkets } from "@/lib/coingecko";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — CryptoPulse" },
      { name: "description", content: "Browse and filter the top cryptocurrencies by market cap." },
    ],
  }),
  component: MarketsPage,
});

function MarketsPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["markets", "all"],
    queryFn: () => fetchMarkets("usd", 250, 1),
    refetchInterval: 30_000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!q.trim()) return data;
    const s = q.toLowerCase();
    return data.filter((c) => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s));
  }, [data, q]);

  return (
    <DashboardLayout search={q} onSearch={setQ}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("nav.markets")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Top 250 by market capitalization</p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">{t("common.error")}</div>
        ) : (
          <CoinTable coins={filtered} />
        )}
      </div>
    </DashboardLayout>
  );
}

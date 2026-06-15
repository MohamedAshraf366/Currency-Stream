import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkline } from "./sparkline";
import { useWatchlist } from "@/hooks/use-watchlist";
import { formatUSD, formatPct, type CoinMarket } from "@/lib/coingecko";
import { cn } from "@/lib/utils";

function PctCell({ v }: { v: number | null }) {
  const pos = (v ?? 0) >= 0;
  return (
    <span className={cn("font-medium tabular-nums", v == null ? "text-muted-foreground" : pos ? "text-[color:var(--color-success)]" : "text-destructive")}>
      {formatPct(v)}
    </span>
  );
}

export function CoinTable({ coins }: { coins: CoinMarket[] }) {
  const { t } = useTranslation();
  const { has, toggle } = useWatchlist();

  return (
    <Card className="overflow-hidden border-border/60 shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12">{t("table.rank")}</TableHead>
              <TableHead>{t("table.coin")}</TableHead>
              <TableHead className="text-end">{t("table.price")}</TableHead>
              <TableHead className="text-end">{t("table.change1h")}</TableHead>
              <TableHead className="text-end">{t("table.change24h")}</TableHead>
              <TableHead className="text-end">{t("table.change7d")}</TableHead>
              <TableHead className="hidden text-end md:table-cell">{t("table.marketCap")}</TableHead>
              <TableHead className="hidden text-end lg:table-cell">{t("table.volume")}</TableHead>
              <TableHead className="hidden text-end sm:table-cell">{t("table.sparkline")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins.map((c) => {
              const fav = has(c.id);
              const pos7 = (c.price_change_percentage_7d_in_currency ?? 0) >= 0;
              return (
                <TableRow key={c.id} className="border-border/60 transition-colors hover:bg-muted/30">
                  <TableCell>
                    <button
                      onClick={() => toggle(c.id)}
                      aria-label="toggle watchlist"
                      className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <Star className={cn("h-4 w-4", fav && "fill-[color:var(--color-accent)] text-[color:var(--color-accent)]")} />
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{c.market_cap_rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="h-7 w-7 rounded-full" loading="lazy" />
                      <div className="leading-tight">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs uppercase text-muted-foreground">{c.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-end font-medium tabular-nums">{formatUSD(c.current_price)}</TableCell>
                  <TableCell className="text-end"><PctCell v={c.price_change_percentage_1h_in_currency} /></TableCell>
                  <TableCell className="text-end"><PctCell v={c.price_change_percentage_24h_in_currency} /></TableCell>
                  <TableCell className="text-end"><PctCell v={c.price_change_percentage_7d_in_currency} /></TableCell>
                  <TableCell className="hidden text-end tabular-nums text-muted-foreground md:table-cell">{formatUSD(c.market_cap, true)}</TableCell>
                  <TableCell className="hidden text-end tabular-nums text-muted-foreground lg:table-cell">{formatUSD(c.total_volume, true)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex justify-end">
                      {c.sparkline_in_7d?.price && <Sparkline data={c.sparkline_in_7d.price} positive={pos7} />}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {coins.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">No results</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

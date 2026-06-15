import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { formatUSD, type CoinMarket } from "@/lib/coingecko";

export function MarketHeroChart({ coin }: { coin?: CoinMarket }) {
  if (!coin?.sparkline_in_7d?.price) return null;
  const data = coin.sparkline_in_7d.price.map((p, i) => ({ i, p }));
  const pos = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;
  const color = pos ? "var(--color-success)" : "var(--color-destructive)";

  return (
    <Card className="relative overflow-hidden border-border/60 p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="h-10 w-10 rounded-full" />
          <div>
            <h3 className="font-display text-lg font-bold">{coin.name}</h3>
            <p className="text-xs uppercase text-muted-foreground">{coin.symbol} · 7d trend</p>
          </div>
        </div>
        <div className="text-end">
          <div className="font-display text-2xl font-bold tabular-nums">{formatUSD(coin.current_price)}</div>
          <div className={`text-sm font-medium ${pos ? "text-[color:var(--color-success)]" : "text-destructive"}`}>
            {pos ? "+" : ""}{(coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}% · 7d
          </div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 6, bottom: 0 }}>
            <defs>
              <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip
              contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              labelFormatter={() => ""}
              formatter={(v) => [formatUSD(Number(v)), coin.symbol.toUpperCase()]}
            />
            <Area type="monotone" dataKey="p" stroke={color} strokeWidth={2} fill="url(#gradArea)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

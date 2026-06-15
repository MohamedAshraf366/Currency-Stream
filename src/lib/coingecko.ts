export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d: { price: number[] } | null;
}

export interface GlobalData {
  total_market_cap_usd: number;
  total_volume_usd: number;
  btc_dominance: number;
  active_cryptocurrencies: number;
}

const BASE = "https://api.coingecko.com/api/v3";

export async function fetchMarkets(vs = "usd", perPage = 100, page = 1): Promise<CoinMarket[]> {
  const url = `${BASE}/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch markets");
  return res.json();
}

export async function fetchGlobal(): Promise<GlobalData> {
  const res = await fetch(`${BASE}/global`);
  if (!res.ok) throw new Error("Failed to fetch global data");
  const json = await res.json();
  return {
    total_market_cap_usd: json.data.total_market_cap.usd,
    total_volume_usd: json.data.total_volume.usd,
    btc_dominance: json.data.market_cap_percentage.btc,
    active_cryptocurrencies: json.data.active_cryptocurrencies,
  };
}

export function formatUSD(n: number, compact = false): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);
}

export function formatPct(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

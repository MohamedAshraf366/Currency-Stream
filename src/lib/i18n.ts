import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: { name: "CryptoPulse", tagline: "Live crypto markets, unified." },
      nav: { dashboard: "Dashboard", markets: "Markets", watchlist: "Watchlist", portfolio: "Portfolio" },
      search: { placeholder: "Search coin or symbol..." },
      stats: { marketCap: "Total Market Cap", volume: "24h Volume", btcDom: "BTC Dominance", coins: "Active Coins" },
      table: { rank: "#", coin: "Coin", price: "Price", change1h: "1h", change24h: "24h", change7d: "7d", marketCap: "Market Cap", volume: "Volume (24h)", sparkline: "Last 7 days", actions: "" },
      watchlist: { title: "Your Watchlist", empty: "No coins yet. Tap the star to add.", subtitle: "Coins you're tracking" },
      dashboard: { title: "Markets Overview", subtitle: "Real-time prices from CoinGecko" },
      theme: { light: "Light", dark: "Dark" },
      lang: { switch: "العربية" },
      common: { loading: "Loading...", error: "Failed to load data", retry: "Retry" },
    },
  },
  ar: {
    translation: {
      app: { name: "كريبتو بولس", tagline: "أسواق العملات الرقمية مباشرة، في مكان واحد." },
      nav: { dashboard: "لوحة التحكم", markets: "الأسواق", watchlist: "المفضلة", portfolio: "المحفظة" },
      search: { placeholder: "ابحث عن عملة أو رمز..." },
      stats: { marketCap: "القيمة السوقية الإجمالية", volume: "حجم 24 ساعة", btcDom: "هيمنة البيتكوين", coins: "العملات النشطة" },
      table: { rank: "#", coin: "العملة", price: "السعر", change1h: "1س", change24h: "24س", change7d: "7ي", marketCap: "القيمة السوقية", volume: "الحجم (24س)", sparkline: "آخر 7 أيام", actions: "" },
      watchlist: { title: "قائمتك المفضلة", empty: "لا توجد عملات بعد. اضغط النجمة للإضافة.", subtitle: "العملات التي تتابعها" },
      dashboard: { title: "نظرة عامة على السوق", subtitle: "أسعار لحظية من CoinGecko" },
      theme: { light: "فاتح", dark: "داكن" },
      lang: { switch: "English" },
      common: { loading: "جارٍ التحميل...", error: "فشل تحميل البيانات", retry: "إعادة المحاولة" },
    },
  },
};

// Detect stored or browser language (client only)
function detectLang(): string {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem("i18nextLng");
    if (stored && ["en", "ar"].includes(stored)) return stored;
  } catch {}
  return navigator.language?.startsWith("ar") ? "ar" : "en";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: detectLang(),
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    interpolation: { escapeValue: false },
  });
}

export default i18n;
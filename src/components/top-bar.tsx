import { Moon, Sun, Languages, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";

export function TopBar({ search, onSearch }: { search?: string; onSearch?: (v: string) => void }) {
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();

  const switchLang = () => {
    const next = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
    try { window.localStorage.setItem("i18nextLng", next); } catch {}
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger />
      {onSearch && (
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input
            value={search ?? ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("search.placeholder")}
            className="h-10 pl-9 rtl:pl-3 rtl:pr-9"
          />
        </div>
      )}
      <div className="ms-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={switchLang} className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{t("lang.switch")}</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}

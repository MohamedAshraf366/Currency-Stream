import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";

export function DashboardLayout({
  children,
  search,
  onSearch,
}: {
  children: ReactNode;
  search?: string;
  onSearch?: (v: string) => void;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background bg-grid">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar search={search} onSearch={onSearch} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

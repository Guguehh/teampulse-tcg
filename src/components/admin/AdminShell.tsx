import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Gauge,
  Layers,
  BookOpenText,
  Archive,
  Images,
  SlidersHorizontal,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/admin/auth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: <Gauge className="h-4 w-4" /> },
  { to: "/admin/products", label: "Products", icon: <Layers className="h-4 w-4" /> },
  { to: "/admin/articles", label: "Articles & News", icon: <BookOpenText className="h-4 w-4" /> },
  { to: "/admin/inventory", label: "Inventory", icon: <Archive className="h-4 w-4" /> },
  { to: "/admin/media", label: "Media Library", icon: <Images className="h-4 w-4" /> },
  { to: "/admin/settings", label: "Settings", icon: <SlidersHorizontal className="h-4 w-4" /> },
];

function titleForPath(pathname: string) {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/articles")) return "Articles & News";
  if (pathname.startsWith("/admin/inventory")) return "Inventory";
  if (pathname.startsWith("/admin/media")) return "Media Library";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}

export function AdminShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = titleForPath(pathname);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="font-display text-sm font-bold">TP</span>
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm font-bold leading-tight">Admin Panel</div>
              <div className="text-xs text-muted-foreground">TeamPulse</div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarMenu>
            {NAV.map((item) => {
              const active =
                item.to === "/admin"
                  ? pathname === "/admin" || pathname === "/admin/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                    <Link to={item.to}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-1 pb-1">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <SidebarTrigger />
            <div className="min-w-0">
              <div className="font-display text-lg font-bold leading-tight">{title}</div>
              <div className="text-xs text-muted-foreground">
                Panel interno de gestión de TeamPulse
              </div>
            </div>
          </div>
        </div>

        <main className="px-4 py-4 md:px-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

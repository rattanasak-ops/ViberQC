"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Menu,
  LayoutDashboard,
  FolderKanban,
  ScanLine,
  FileText,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/scan", label: "New Scan", icon: ScanLine },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = status === "authenticated" ? session?.user : null;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header — shows only below lg */}
        <header className="flex h-14 items-center justify-between border-b border-border/40 bg-card px-4 lg:hidden">
          <Link href="/dashboard">
            <Logo size={24} animated={false} />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile sidebar trigger */}
            <Sheet>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                )}
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex h-full flex-col">
                  {/* User info */}
                  {user && (
                    <div className="flex items-center gap-3 border-b border-border/40 p-4">
                      <Avatar size="default">
                        {user.image && (
                          <AvatarImage
                            src={user.image}
                            alt={user.name || "User"}
                          />
                        )}
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium">
                          {user.name || "User"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Nav links */}
                  <nav className="flex-1 space-y-1 px-3 py-4">
                    {sidebarLinks.map((link) => {
                      const isActive =
                        pathname === link.href ||
                        pathname.startsWith(link.href + "/");
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Bottom */}
                  <div className="border-t border-border/40 p-4">
                    <div className="rounded-lg bg-primary/5 p-3 mb-3">
                      <p className="text-xs font-medium text-primary">
                        Free Plan
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        3/3 scans used
                      </p>
                      <Link
                        href="/pricing"
                        className="mt-2 block text-xs font-medium text-primary hover:underline"
                      >
                        Upgrade to Pro
                      </Link>
                    </div>
                    {user && (
                      <button
                        onClick={() => logout()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

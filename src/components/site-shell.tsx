import { ArrowRightIcon, MenuIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavKey = "try-on" | "collections" | "how-it-works" | "faq" | "privacy";

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "try-on", label: "Try on", href: "/#studio" },
  { key: "collections", label: "Collections", href: "/try-on-glasses" },
  { key: "how-it-works", label: "How it works", href: "/virtual-glasses-try-on" },
  { key: "faq", label: "FAQ", href: "/faq" },
];

export function SiteShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: NavKey;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader active={active} />
      {children}
      <SiteFooter />
    </main>
  );
}

export function SiteHeader({ active }: { active?: NavKey }) {
  return (
    <header className="sticky top-0 z-30 border-b border-foreground/15 bg-background/92 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1480px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="brand-wordmark text-2xl font-semibold tracking-normal">
          <span className="brand-dot" aria-hidden />
          TryEyeglasses
        </Link>
        <nav className="hidden items-center gap-9 font-mono text-[13px] uppercase tracking-[0.78px] text-muted-foreground lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              className={cn(
                "pb-1 transition-colors hover:text-foreground",
                active === item.key && "border-b border-foreground text-foreground",
              )}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/privacy"
            className={cn(
              "hidden items-center gap-2 font-mono text-[12px] uppercase tracking-[0.72px] text-muted-foreground md:inline-flex",
              active === "privacy" && "text-foreground",
            )}
          >
            <ShieldCheckIcon className="size-4" aria-hidden />
            Privacy
          </Link>
          <ThemeToggle />
          <Link
            href="/#studio"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "paper-button hidden bg-card md:inline-flex",
            )}
          >
            Start free
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
          <Link
            href="/#studio"
            className="paper-button flex size-10 items-center justify-center bg-card lg:hidden"
            aria-label="Start free try-on"
          >
            <MenuIcon className="size-4" aria-hidden />
          </Link>
        </div>
        <nav className="flex w-full gap-2 overflow-x-auto border-t border-foreground/10 pt-3 font-mono text-[12px] uppercase tracking-[0.72px] text-muted-foreground lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "shrink-0 rounded-md border border-foreground/12 bg-card px-3 py-2",
                active === item.key && "border-foreground/40 text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/15 bg-foreground text-background">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.72px]">
          TryEyeglasses / AI eyeglasses preview
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/#studio">Try on</Link>
          <Link href="/try-on-glasses">Collections</Link>
          <Link href="/virtual-glasses-try-on">How it works</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

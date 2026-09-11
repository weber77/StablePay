"use client";

import Link from "next/link";

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 glass-panel">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight transition-colors hover:text-[hsl(var(--fintech))]"
        >
          <span className="gradient-text">WAKAPAY</span>
          <span className="text-muted-foreground"> · Demo store</span>
        </Link>
        <Link
          href="/cart"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-[hsl(var(--fintech))]"
        >
          Full cart page
        </Link>
      </div>
    </header>
  );
}

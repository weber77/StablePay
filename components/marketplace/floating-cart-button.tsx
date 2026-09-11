"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FloatingCartButtonProps = {
  count: number;
  onClick: () => void;
};

export function FloatingCartButton({
  count,
  onClick,
}: FloatingCartButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      size="icon-lg"
      aria-label={`Open cart${count ? `, ${count} items` : ""}`}
      className={cn(
        "fixed right-4 bottom-6 z-40 size-14 rounded-full border-0 shadow-lg",
        "bg-gradient-to-r from-[hsl(var(--fintech))] to-[hsl(var(--tech))] text-white",
        "hover:opacity-90 transition-opacity",
      )}
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 min-w-5 items-center justify-center rounded-full bg-background px-1 text-xs font-semibold text-[hsl(var(--fintech))] ring-2 ring-[hsl(var(--fintech))]/30">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}

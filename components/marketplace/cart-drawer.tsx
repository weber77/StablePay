"use client";

import { useMutation } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProductThumbnail } from "@/components/marketplace/product-thumbnail";
import { postCheckout } from "@/lib/checkout-client";
import { useCart, type CartLine } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const PLATFORM_FEE_RATE = 0;

function lineTotal(line: CartLine) {
  return line.product.price * line.quantity;
}

function buildCheckoutItems(lines: CartLine[]) {
  return lines.map((l) => ({
    name: l.product.name,
    quantity: l.quantity,
    unit_price: l.product.price,
    product_id: l.product.id,
  }));
}

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { lines, setQty, remove, clear } = useCart();

  const subtotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);
  const fees = subtotal * PLATFORM_FEE_RATE;
  const total = subtotal + fees;

  const checkoutMutation = useMutation({
    mutationFn: async () => postCheckout(buildCheckoutItems(lines)),
    onMutate: () => {
      toast.loading("Creating checkout session…", { id: "checkout" });
    },
    onSuccess: (url) => {
      toast.success("Redirecting to secure checkout…", { id: "checkout" });
      window.location.href = url;
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Checkout failed", {
        id: "checkout",
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "glass-panel flex w-full flex-col border-border/50 sm:max-w-md",
        )}
      >
        <SheetHeader className="border-b border-border/50">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[hsl(var(--fintech))]/10 text-[hsl(var(--fintech))]">
              <ShoppingBag className="size-4" />
            </span>
            Your cart
          </SheetTitle>
          <SheetDescription>
            {lines.length === 0
              ? "Add items from the marketplace to checkout with WAKAPAY."
              : `${lines.length} product${lines.length === 1 ? "" : "s"} in cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-y-auto px-4">
          {lines.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {lines.map((line) => (
                <li key={line.product.id} className="flex gap-3 py-4">
                  <ProductThumbnail
                    product={line.product}
                    className="size-14 shrink-0 rounded-lg"
                    imageClassName="rounded-lg"
                    sizes="56px"
                    fallbackEmojiClassName="text-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {line.product.currency}{" "}
                      {line.product.price.toFixed(2)} each
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-md border border-border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="rounded-r-none"
                          onClick={() =>
                            setQty(
                              line.product.id,
                              Math.max(1, line.quantity - 1),
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="min-w-8 px-2 text-center text-sm font-medium tabular-nums">
                          {line.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="rounded-l-none"
                          onClick={() =>
                            setQty(line.product.id, line.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold tabular-nums">
                        {line.product.currency}{" "}
                        {lineTotal(line).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(line.product.id)}
                    aria-label={`Remove ${line.product.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <SheetFooter className="border-t border-border/50">
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums text-foreground">
                  USD {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Fees</span>
                <span className="tabular-nums text-foreground">
                  USD {fees.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="tabular-nums">USD {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="button"
              disabled={checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate()}
              className="h-11 w-full rounded-md border-0 bg-gradient-to-r from-[hsl(var(--fintech))] to-[hsl(var(--tech))] text-white hover:opacity-90"
            >
              {checkoutMutation.isPending
                ? "Starting checkout…"
                : "Pay with WAKAPAY"}
            </Button>

            <button
              type="button"
              onClick={() => {
                clear();
                toast.info("Cart cleared");
              }}
              className="text-center text-sm text-muted-foreground transition-colors hover:text-[hsl(var(--fintech))]"
            >
              Clear cart
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

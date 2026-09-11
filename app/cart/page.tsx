"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ProductThumbnail } from "@/components/marketplace/product-thumbnail";
import { Button } from "@/components/ui/button";
import { postCheckout } from "@/lib/checkout-client";
import { useCart } from "@/lib/cart-context";

function buildItems(lines: ReturnType<typeof useCart>["lines"]) {
  return lines.map((l) => ({
    name: l.product.name,
    quantity: l.quantity,
    unit_price: l.product.price,
    product_id: l.product.id,
  }));
}

export default function CartPage() {
  const { lines, setQty, remove, clear } = useCart();

  const checkoutMutation = useMutation({
    mutationFn: async () => postCheckout(buildItems(lines)),
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
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-2xl font-semibold text-foreground">Cart</h1>
      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Your cart is empty.{" "}
          <Link
            href="/"
            className="font-medium text-[hsl(var(--fintech))] hover:underline"
          >
            Browse products
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-border">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <ProductThumbnail
                    product={line.product}
                    className="size-14 shrink-0 rounded-lg"
                    imageClassName="rounded-lg"
                    sizes="56px"
                    fallbackEmojiClassName="text-xl"
                  />
                  <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {line.product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {line.product.currency} {line.product.price.toFixed(2)}{" "}
                    each
                  </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    Qty
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-md border border-input bg-background px-2 py-1"
                      value={line.quantity}
                      onChange={(e) =>
                        setQty(line.product.id, Number(e.target.value) || 1)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(line.product.id)}
                    className="text-xs text-destructive underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              type="button"
              disabled={checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate()}
              className="border-0 bg-gradient-to-r from-[hsl(var(--fintech))] to-[hsl(var(--tech))] text-white"
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
              className="text-sm text-muted-foreground underline hover:text-[hsl(var(--fintech))]"
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

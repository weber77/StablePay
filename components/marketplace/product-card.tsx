"use client";

import { Check } from "lucide-react";

import { ProductThumbnail } from "@/components/marketplace/product-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  inCart: boolean;
  onAdd: () => void;
};

function formatPrice(product: Product) {
  return `${product.currency} ${product.price.toFixed(2)}`;
}

export function ProductCard({ product, inCart, onAdd }: ProductCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden rounded-2xl border-border/50 bg-card/40 py-0 ring-0 transition-colors hover:border-[hsl(var(--fintech))]/30 hover:shadow-md",
      )}
    >
      <div className="relative aspect-square">
        <ProductThumbnail
          product={product}
          className="size-full rounded-t-2xl"
          imageClassName="rounded-t-2xl"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 z-10 border-[hsl(var(--fintech))]/20 bg-[hsl(var(--fintech))]/10 text-[hsl(var(--fintech))]"
        >
          {product.category}
        </Badge>
        <span
          className={cn(
            "absolute top-3 right-3 z-10 rounded-full px-2 py-0.5 text-xs font-medium",
            product.inStock
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <p className="mt-auto text-lg font-bold text-foreground">
          {product.priceFrom && (
            <span className="mr-1 text-sm font-medium text-muted-foreground">
              from
            </span>
          )}
          {formatPrice(product)}
        </p>
      </CardContent>

      <CardFooter className="border-0 bg-transparent p-5 pt-0">
        {inCart ? (
          <Button
            type="button"
            disabled
            className="h-10 w-full rounded-md border-0 bg-gradient-to-r from-[hsl(var(--fintech))] to-[hsl(var(--tech))] text-white opacity-100"
          >
            <Check className="size-4" />
            Added ✓
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={!product.inStock}
            onClick={onAdd}
            className="h-10 w-full rounded-md hover:border-[hsl(var(--fintech))]/30 hover:text-[hsl(var(--fintech))]"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

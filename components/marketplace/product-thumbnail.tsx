"use client";

import Image from "next/image";
import { useState } from "react";

import { getProductEmoji, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductThumbnailProps = {
  product: Product;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Emoji size when image is missing or fails to load */
  fallbackEmojiClassName?: string;
};

export function ProductThumbnail({
  product,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 25vw",
  priority = false,
  fallbackEmojiClassName = "text-5xl",
}: ProductThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const emoji = getProductEmoji(product.id);
  const showImage = product.image && !failed;

  if (!showImage) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/50",
          fallbackEmojiClassName,
          className,
        )}
        aria-hidden
      >
        {emoji}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted/50", className)}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProduct, type Product } from "@/lib/products";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "marchant_store_cart_v1";

type PersistLine = { productId: string; quantity: number };

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersistLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => {
        const product = getProduct(row.productId);
        if (!product || row.quantity < 1) return null;
        return { product, quantity: row.quantity };
      })
      .filter(Boolean) as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(loadLines());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const persist: PersistLine[] = lines.map((line) => ({
      productId: line.product.id,
      quantity: line.quantity,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
  }, [lines]);

  const add = useCallback((productId: string, qty = 1) => {
    const product = getProduct(productId);
    if (!product) return;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === productId);
      if (i === -1) return [...prev, { product, quantity: qty }];
      const next = [...prev];
      next[i] = {
        ...next[i],
        quantity: next[i].quantity + qty,
      };
      return next;
    });
  }, []);

  const setQty = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setLines((prev) => prev.filter((l) => l.product.id !== productId));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.product.id === productId ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear }),
    [lines, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

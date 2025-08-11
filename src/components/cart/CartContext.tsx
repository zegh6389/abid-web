'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  productId: string;
  title: string;
  price: number; // in major units, e.g., 19.99
  quantity: number;
  image?: string;
  variantId?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'mkidz_cart_v1';

function loadInitial(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadInitial());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    save(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const qty = Math.max(1, Math.floor(item.quantity ?? 1));
      const index = prev.findIndex(
        (it) => it.productId === item.productId && (it.variantId ?? null) === (item.variantId ?? null)
      );
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], quantity: next[index].quantity + qty, price: item.price };
        return next;
      }
      return [...prev, { ...item, quantity: qty } as CartItem];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    setItems((prev) => prev.filter((it) => !(it.productId === productId && (it.variantId ?? null) === (variantId ?? null))));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string | null) => {
    setItems((prev) => {
      const next = prev.map((it) =>
        it.productId === productId && (it.variantId ?? null) === (variantId ?? null)
          ? { ...it, quantity: Math.max(1, Math.floor(quantity)) }
          : it
      );
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, count, subtotal, isOpen, addItem, removeItem, updateQuantity, clear, openCart, closeCart }),
    [items, count, subtotal, isOpen, addItem, removeItem, updateQuantity, clear, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}



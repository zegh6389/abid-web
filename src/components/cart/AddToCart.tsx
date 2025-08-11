'use client';

import { useCart } from '@/components/cart/CartContext';

export function AddToCart({ productId, title = 'Item', price = 0, image }: { productId: string; title?: string; price?: number; image?: string }) {
  const { addItem } = useCart();
  const add = () => {
    addItem({ productId, title, price, image, variantId: null });
  };
  return (
    <button onClick={add} className="px-4 py-2 rounded-full text-white gradient-cta">Add to cart</button>
  );
}

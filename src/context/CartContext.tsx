"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  listingId: string;
  title: string;
  image: string;
  location: string;
  price: number;
  date: string;
  groupSize: number;
  totalPrice: number;
  tourDuration?: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("tourify_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tourify_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if item already exists (same tour, same date?) 
      // User says "multiple request", so maybe same tour multiple times is okay?
      // But typically cart implies one entry per product. 
      // Let's allow unique entries by listingId + date combination to serve as ID, 
      // but for simplicity, let's use a unique generated ID or just assume listingId is unique in cart?
      // Actually, user might want to book same tour on different dates. 
      // Let's add a random ID to the item if needed, but for now let's just push.
      // Wait, simple removal requires a unique ID. 
      // I'll add a 'cartId' to the item.
      const newItem = { ...item, cartId: Date.now().toString() };
      return [...prev, newItem];
    });
    // Toast moved to component to avoid duplicate toasts on restoration
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => (item as any).cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("tourify_cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("markethub_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("markethub_cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product) {
    if (product.stock <= 0) return;

    setItems((current) => {
      const existing = current.find((item) => item._id === product._id);

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id, quantity) {
    setItems((current) =>
      current
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: Math.max(1, Math.min(Number(quantity) || 1, item.stock)),
              }
            : item
        )
    );
  }

  function removeFromCart(id) {
    setItems((current) => current.filter((item) => item._id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, count, total, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

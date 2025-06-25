import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  doseId: string;
  productName: string;
  doseValue?: string;
  price: number;
  quantity: number;
  requiresPrescription?: boolean;
  imageUrl?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItemToCart = (item: CartItem) => {
    console.log('Adding item to cart (placeholder):', item);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.doseId === item.doseId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.doseId === item.doseId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItemFromCart = (doseId: string) => {
    console.log('Removing item from cart (placeholder):', doseId);
    setCartItems((prevItems) => prevItems.filter((item) => item.doseId !== doseId));
  };

  const updateItemQuantity = (doseId: string, quantity: number) => {
    console.log(`Updating item ${doseId} quantity to ${quantity} (placeholder)`);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.doseId === doseId ? { ...item, quantity: quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    console.log('Clearing cart (placeholder)');
    setCartItems([]);
  };

  const getCartTotal = () => {
    console.log('Getting cart total (placeholder)');
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    console.log('Getting cart item count (placeholder)');
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
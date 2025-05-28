// cart.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the Cart context easily
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Ensure quantity is a number upon loading
        const validatedCart = parsedCart.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 1 // Default to 1 if quantity is invalid/missing
        }));
        setCartItems(validatedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem('shoppingCart'); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log("Saving cart to localStorage:", cartItems);
       localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    } else {
       // Clear storage if cart becomes empty after being non-empty
       if (localStorage.getItem('shoppingCart')) {
           localStorage.removeItem('shoppingCart');
       }
    }
  }, [cartItems]);

  // Function to add an item to the cart
  const addToCart = (product, selectedColor) => {
    setCartItems((prevItems) => {
      const cartItemId = selectedColor ? `${product.id}-${selectedColor}` : String(product.id); // Ensure ID is string
      const existingItem = prevItems.find((item) => item.cartItemId === cartItemId);

      if (existingItem) {
        return prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: (item.quantity || 0) + 1 } // Ensure quantity is treated as number
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            ...product,
            cartItemId: cartItemId,
            quantity: 1,
            selectedColor: selectedColor,
            // Ensure price is stored as a number if not already
            price: Number(product.price) || 0
          },
        ];
      }
    });
    console.log(`${product.name} ${selectedColor ? `(${selectedColor}) ` : ''}added to cart.`);
  };

  // Function to remove an item from the cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
    console.log(`Item ${cartItemId} removed from cart.`);
  };

  // Function to update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    const quantity = Number(newQuantity); // Ensure it's a number
    if (quantity <= 0) {
      // Remove item if quantity is zero or less
      removeFromCart(cartItemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  // Calculate total items (sum of quantities)
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Calculate total price
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems, // Export total items count
    cartTotal,  // Export total price
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeoutId, setToastTimeoutId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const showToast = (message) => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setToastMessage(message);
    const id = setTimeout(() => {
      setToastMessage(null);
      setToastTimeoutId(null);
    }, 2000);
    setToastTimeoutId(id);
  };

  // Load cart from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        Promise.resolve().then(() => {
          setCart(parsedCart);
          setIsLoaded(true);
        });
      } catch (error) {
        console.error('Failed to parse cart items:', error);
        Promise.resolve().then(() => {
          setIsLoaded(true);
        });
      }
    } else {
      Promise.resolve().then(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Check if two prescriptions are identical
  const isSamePrescription = (p1, p2) => {
    if (!p1 && !p2) return true;
    if (!p1 || !p2) return false;
    return (
      p1.lensType === p2.lensType &&
      p1.pupilDistance === p2.pupilDistance &&
      p1.leftEye?.sphere === p2.leftEye?.sphere &&
      p1.leftEye?.cylinder === p2.leftEye?.cylinder &&
      p1.leftEye?.axis === p2.leftEye?.axis &&
      p1.leftEye?.add === p2.leftEye?.add &&
      p1.rightEye?.sphere === p2.rightEye?.sphere &&
      p1.rightEye?.cylinder === p2.rightEye?.cylinder &&
      p1.rightEye?.axis === p2.rightEye?.axis &&
      p1.rightEye?.add === p2.rightEye?.add
    );
  };

  const addToCart = (product, quantity = 1, hasPrescription = false, prescription = null) => {
    setCart((prevCart) => {
      // Find if item already exists in cart with matching prescription
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.hasPrescription === hasPrescription &&
          isSamePrescription(item.prescription, prescription)
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }

      // If new, add item
      return [...prevCart, { product, quantity, hasPrescription, prescription }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId, hasPrescription, prescription) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.hasPrescription === hasPrescription &&
            isSamePrescription(item.prescription, prescription)
          )
      )
    );
  };

  const updateQuantity = (productId, hasPrescription, prescription, newQty) => {
    if (newQty < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId &&
        item.hasPrescription === hasPrescription &&
        isSamePrescription(item.prescription, prescription)
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

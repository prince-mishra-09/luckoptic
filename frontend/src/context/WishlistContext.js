'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from local storage on mount or when user changes
  useEffect(() => {
    Promise.resolve().then(() => {
      setIsLoaded(false);
    });
    if (user) {
      const storedWishlist = localStorage.getItem(`wishlist_${user._id}`);
      if (storedWishlist) {
        try {
          const parsed = JSON.parse(storedWishlist);
          Promise.resolve().then(() => {
            setWishlist(parsed);
            setIsLoaded(true);
          });
        } catch (error) {
          console.error('Failed to parse wishlist items:', error);
          Promise.resolve().then(() => {
            setIsLoaded(true);
          });
        }
      } else {
        Promise.resolve().then(() => {
          setWishlist([]);
          setIsLoaded(true);
        });
      }
    } else {
      Promise.resolve().then(() => {
        setWishlist([]);
        setIsLoaded(true);
      });
    }
  }, [user]);

  // Save wishlist to local storage whenever it changes
  useEffect(() => {
    if (user && isLoaded) {
      localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user, isLoaded]);

  const addToWishlist = (product) => {
    if (!user) return;
    setWishlist((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    if (!user) return;
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  const toggleWishlist = (product) => {
    if (!user) return;
    setWishlist((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import ToastNotification from './ToastNotification';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {!isAdminRoute && <Header />}
          <main className={`flex-grow ${!isAdminRoute ? 'pt-16' : ''}`}>
            {children}
          </main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <CartDrawer />}
          {!isAdminRoute && <ToastNotification />}
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

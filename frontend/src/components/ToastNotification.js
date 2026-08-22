'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ToastNotification() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-toast-bounce">
      <div className="bg-luckoptics-dark text-white px-5 py-2.5 rounded-xl shadow-2xl border border-white/10 flex items-center gap-2">
        <CheckCircle size={14} className="text-luckoptics-primary shrink-0" />
        <span className="font-display font-extrabold text-[11px] uppercase tracking-wider whitespace-nowrap">Added to cart</span>
      </div>
    </div>
  );
}

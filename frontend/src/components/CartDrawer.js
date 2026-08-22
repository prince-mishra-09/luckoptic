'use client';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Activity } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const drawerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && isCartOpen) {
        // Only close if it's not a button clicking the drawer open
        const isCartToggle = event.target.closest('button')?.getAttribute('aria-label') === 'cart-toggle' || event.target.closest('.cart-trigger-btn');
        if (!isCartToggle) {
          setIsCartOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const getLensPrice = (type) => {
    if (type === 'Single Vision') return 500;
    if (type === 'Bifocal/Progressive') return 1000;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        ref={drawerRef}
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-luckoptics-dark text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-luckoptics-primary" />
            <span className="font-display font-bold text-base">Your Cart ({cart.length})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-3">
                <ShoppingBag size={48} />
              </div>
              <h3 className="font-display font-bold text-gray-800 text-base mb-1">Your cart is empty</h3>
              <p className="text-xs text-gray-400 max-w-[200px] mb-6">Explore our curated collections of premium eyewear.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                }}
                className="px-6 py-2.5 bg-luckoptics-primary text-white font-bold text-xs rounded-full shadow-md hover:bg-luckoptics-primary/95 transition-all"
              >
                Shop Eyeglasses
              </button>
            </div>
          ) : (
            cart.map((item, index) => {
              const basePrice = item.product.discountPrice || item.product.price;
              const lensPrice = item.hasPrescription ? getLensPrice(item.prescription?.lensType) : 0;
              const singleItemTotal = basePrice + lensPrice;

              return (
                <div key={index} className="flex gap-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain bg-gray-50 border border-gray-100 rounded-lg p-1.5 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5 font-medium">
                      Shape: {item.product.shape} | Size: {item.product.size}
                    </p>

                    {/* Prescription Badge */}
                    {item.hasPrescription && (
                      <div className="bg-luckoptics-primary/10 border border-luckoptics-primary/20 rounded-md p-1.5 mb-2.5">
                        <p className="text-[9px] font-bold text-luckoptics-primary uppercase leading-tight mb-0.5">
                          {item.prescription?.lensType} (+₹{lensPrice})
                        </p>
                        <div className="grid grid-cols-2 gap-x-2 text-[8px] font-semibold text-gray-600">
                          <div>R (OD): {item.prescription?.rightEye?.sphere} SPH | {item.prescription?.rightEye?.cylinder} CYL</div>
                          <div>L (OS): {item.prescription?.leftEye?.sphere} SPH | {item.prescription?.leftEye?.cylinder} CYL</div>
                        </div>
                      </div>
                    )}

                    {/* Qty & Price controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.hasPrescription, item.prescription, item.quantity - 1)}
                          className="p-1 hover:bg-gray-50 text-gray-500 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800 font-sans">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.hasPrescription, item.prescription, item.quantity + 1)}
                          className="p-1 hover:bg-gray-50 text-gray-500 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id, item.hasPrescription, item.prescription)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-luckoptics-dark font-sans">
                      ₹{singleItemTotal * item.quantity}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-[9px] text-gray-400">₹{singleItemTotal} each</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Billing Details */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <div className="space-y-1.5 mb-4 text-sm font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-800 font-sans">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Local Shipping</span>
                <span className="text-green-600 font-sans font-bold uppercase text-xs">FREE</span>
              </div>
              <hr className="border-gray-200 my-2" />
              <div className="flex justify-between text-base font-bold text-luckoptics-dark">
                <span>Total Amount</span>
                <span className="font-sans">₹{cartSubtotal}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-luckoptics-primary text-white font-bold text-sm py-3 rounded-xl shadow-lg hover:bg-luckoptics-primary/95 transition-all text-center"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

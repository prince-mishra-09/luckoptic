'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, Truck, CheckCircle, ShieldCheck, Plus, AlertCircle, ArrowLeft, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user, token, loading, saveAddress } = useAuth();
  const router = useRouter();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Auth & Cart Check Guards
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/checkout');
      } else if (cart.length === 0 && !orderSuccess) {
        router.push('/products');
      }
    }
  }, [user, cart, loading, orderSuccess]);

  if (loading || !user) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
      </div>
    );
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const res = await saveAddress(addressForm);
    if (res.success) {
      setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India' });
      setShowAddressForm(false);
      // Auto select the newly added address (which goes to the end of the array)
      if (user?.addresses) {
        setSelectedAddressIndex(user.addresses.length);
      }
    } else {
      setErrorMsg('Failed to save address: ' + res.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user.addresses || user.addresses.length === 0) {
      setErrorMsg('Please select or add a shipping address');
      return;
    }

    setCheckoutLoading(true);
    setErrorMsg('');

    const targetAddress = user.addresses[selectedAddressIndex];
    const orderItems = cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      hasPrescription: item.hasPrescription,
      prescription: item.prescription
    }));

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            street: targetAddress.street,
            city: targetAddress.city,
            state: targetAddress.state,
            zipCode: targetAddress.zipCode,
            country: targetAddress.country
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setCreatedOrder(data.order);
        setOrderSuccess(true);
        clearCart();
        
        // Trigger canvas-confetti
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (confettiErr) {
          console.log('Confetti failed to trigger', confettiErr);
        }
      } else {
        setErrorMsg(data.message || 'Failed to place order');
      }
    } catch (err) {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getLensPrice = (type) => {
    if (type === 'Single Vision') return 500;
    if (type === 'Bifocal/Progressive') return 1000;
    return 0;
  };

  // Render Order Success Screen
  if (orderSuccess && createdOrder) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-tight">Order Placed Successfully!</h2>
          <p className="text-xs text-gray-500">Thank you for shopping with LuckOptics.</p>
        </div>

        {/* Order Details box */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
            <span className="text-xs font-bold text-gray-400">Order ID:</span>
            <span className="text-xs font-bold text-gray-800 font-mono">#{createdOrder._id}</span>
          </div>
          <div className="text-xs space-y-1 text-gray-600">
            <p className="font-bold text-gray-800">Delivery Address:</p>
            <p>{createdOrder.shippingAddress.street}</p>
            <p>{createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} - {createdOrder.shippingAddress.zipCode}</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-50 font-bold text-luckoptics-dark text-sm">
            <span>Amount to Pay (COD):</span>
            <span className="font-sans">₹{createdOrder.totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/orders')}
            className="w-full bg-luckoptics-primary text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all"
          >
            Track Order History
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-50 text-gray-700 font-bold text-sm py-3 rounded-xl hover:bg-gray-100 transition-all border border-gray-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Checkout Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-luckoptics-dark mb-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ArrowLeft size={16} />
            </button>
            <h2 className="font-display font-black text-xl uppercase tracking-tight">Checkout Details</h2>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200/50 text-red-600 text-xs font-semibold p-4 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Shipping Address Selector */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="font-display font-bold text-base text-luckoptics-dark">1. Shipping Address</h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="flex items-center gap-1 bg-luckoptics-primary/10 text-luckoptics-primary font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-luckoptics-primary/15 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>{showAddressForm ? 'Cancel' : 'Add New'}</span>
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat/House No., Street Name, Area"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Lucknow"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Uttar Pradesh"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Zip Code</label>
                  <input
                    type="text"
                    required
                    placeholder="226001"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="sm:col-span-2 bg-luckoptics-dark text-white font-bold text-xs py-3 rounded-xl hover:bg-luckoptics-dark/95 transition-all shadow-md"
                >
                  Save Shipping Address
                </button>
              </form>
            )}

            {/* Address List cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!user.addresses || user.addresses.length === 0 ? (
                <div className="sm:col-span-2 text-center py-6 text-xs text-gray-400">
                  No addresses found. Please add a shipping address to proceed.
                </div>
              ) : (
                user.addresses.map((addr, idx) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedAddressIndex === idx
                        ? 'border-luckoptics-primary bg-luckoptics-primary/5 ring-1 ring-luckoptics-primary'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2 text-xs">
                      <MapPin size={16} className={selectedAddressIndex === idx ? 'text-luckoptics-primary' : 'text-gray-400'} />
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-800 leading-tight">{addr.street}</p>
                        <p className="text-gray-500">{addr.city}, {addr.state} - {addr.zipCode}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-luckoptics-dark border-b border-gray-50 pb-3">2. Payment Method</h3>
            <div className="border border-luckoptics-primary bg-luckoptics-primary/5 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="p-2.5 bg-luckoptics-primary text-white rounded-xl">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Cash on Delivery (COD)</h4>
                  <p className="text-[10px] text-gray-400">Pay cash upon inspecting your product delivery.</p>
                </div>
              </div>
              <span className="bg-luckoptics-primary text-white p-0.5 rounded-full">
                <CheckCircle size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Billing & Items Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h3 className="font-display font-bold text-base text-luckoptics-dark border-b border-gray-50 pb-3">Order Summary</h3>

            {/* Cart Items list */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => {
                const basePrice = item.product.discountPrice || item.product.price;
                const lensPrice = item.hasPrescription ? getLensPrice(item.prescription?.lensType) : 0;
                const itemTotal = basePrice + lensPrice;

                return (
                  <div key={idx} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-contain bg-gray-50 border border-gray-100 rounded-lg p-1" />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[9px] text-gray-400">Qty: {item.quantity} | {item.hasPrescription ? item.prescription.lensType : 'Frame only'}</p>
                    </div>
                    <div className="text-right flex-shrink-0 font-bold text-xs text-luckoptics-dark font-sans self-center">
                      ₹{itemTotal * item.quantity}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Billing breakdown */}
            <div className="space-y-2 border-t border-gray-50 pt-4 text-xs font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-800 font-sans">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                <span className="text-green-600 font-bold uppercase">FREE</span>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="flex justify-between text-sm font-bold text-luckoptics-dark">
                <span>Grand Total</span>
                <span className="font-sans text-base">₹{cartSubtotal}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-2xl text-[10px] text-gray-500 font-bold">
              <ShieldCheck size={16} className="text-luckoptics-primary flex-shrink-0" />
              <span>COD order verified by shop callback before dispatch.</span>
            </div>

            {/* Place Order Trigger */}
            <button
              onClick={handlePlaceOrder}
              disabled={checkoutLoading || cart.length === 0}
              className="w-full flex items-center justify-center bg-luckoptics-primary hover:bg-luckoptics-primary/95 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              {checkoutLoading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                `Place COD Order (₹${cartSubtotal})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

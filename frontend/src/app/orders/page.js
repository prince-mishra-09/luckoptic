'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Eye, Calendar, MapPin, CheckCircle, Clock, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Orders() {
  const { user, loading, token } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchMyOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }

    if (user && token) {
      Promise.resolve().then(() => {
        fetchMyOrders();
      });
    }
  }, [user, loading, token, router, fetchMyOrders]);

  if (loading || !user) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
      </div>
    );
  }

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200/50';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200/50';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200/50';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200/50';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200/50';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Generate WhatsApp chat for an order enquiry
  const getWhatsAppOrderLink = (order) => {
    const message = `Hi LuckOptics, I have an inquiry regarding my Order ID: *${order._id}*.\nStatus: ${order.orderStatus}\nTotal: ₹${order.totalAmount}\nPlease share the dispatch/delivery details. Thank you!`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-6">
        <div>
          <h2 className="font-display font-black text-2xl text-luckoptics-dark uppercase tracking-tight">Order History</h2>
          <p className="text-xs text-gray-500 font-medium">View, track, and get WhatsApp support for your active orders</p>
        </div>

        {ordersLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 text-center rounded-3xl flex flex-col items-center justify-center">
            <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-3">
              <ShoppingBag size={40} />
            </div>
            <h3 className="font-display font-bold text-gray-800 text-base mb-1">No orders found</h3>
            <p className="text-xs text-gray-400 max-w-[220px] mb-6">You haven&apos;t placed any purchases yet. Start shopping spectacles!</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2.5 bg-luckoptics-primary text-white font-bold text-xs rounded-full shadow-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              return (
                <div
                  key={order._id}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header Summary */}
                  <div
                    onClick={() => toggleExpandOrder(order._id)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
                  >
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-4 gap-y-1">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Order ID</span>
                        <span className="text-xs font-bold text-gray-800 font-mono">#{order._id.substring(12)}...</span>
                      </div>
                      <div className="sm:border-l sm:border-gray-200 sm:pl-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Date Placed</span>
                        <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="sm:border-l sm:border-gray-200 sm:pl-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Paid</span>
                        <span className="text-xs font-bold text-luckoptics-dark font-sans">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-gray-50 pt-3 sm:border-0 sm:pt-0">
                      <span className={`border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items Drawer */}
                  {isExpanded && (
                    <div className="bg-gray-50/50 border-t border-gray-100 p-5 space-y-4">
                      {/* Shipping address details */}
                      <div className="flex items-start gap-2.5 bg-white p-3.5 border border-gray-100 rounded-2xl text-xs max-w-lg">
                        <MapPin size={16} className="text-luckoptics-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-gray-800 mb-0.5">Shipping Address</h4>
                          <p className="text-gray-500">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-2xl p-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                            {/* Product Image */}
                            <img
                              src={item.product?.images[0]}
                              alt={item.product?.name}
                              className="w-16 h-16 object-contain bg-gray-50 rounded-lg border border-gray-100 p-1 flex-shrink-0"
                            />

                            {/* Details */}
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.product?.name || 'Glasses Frame'}</h4>
                              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                                Qty: {item.quantity} | Unit Price: ₹{item.price}
                              </p>

                              {/* Prescription display */}
                              {item.hasPrescription && item.prescription && (
                                <div className="bg-luckoptics-primary/5 border border-luckoptics-primary/15 rounded-lg p-2 mt-1.5 text-[9px] text-gray-600 font-medium space-y-0.5">
                                  <p className="font-bold text-luckoptics-primary uppercase">{item.prescription.lensType}</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>R (OD): {item.prescription.rightEye.sphere} SPH | {item.prescription.rightEye.cylinder} CYL | AX: {item.prescription.rightEye.axis}</div>
                                    <div>L (OS): {item.prescription.leftEye.sphere} SPH | {item.prescription.leftEye.cylinder} CYL | AX: {item.prescription.leftEye.axis}</div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Total per Item */}
                            <div className="text-right flex-shrink-0 font-bold text-xs text-luckoptics-dark font-sans self-center">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* WhatsApp Enquiry button */}
                      <div className="flex justify-end pt-2">
                        <a
                          href={getWhatsAppOrderLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                        >
                          <MessageSquare size={14} />
                          Enquire Order on WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Eye, Calendar, MapPin, MessageSquare, Phone, Mail, ChevronDown, ChevronUp, Save, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Status modify states
  const [statusForm, setStatusForm] = useState({ orderStatus: '', paymentStatus: '' });
  const [updateMsg, setUpdateMsg] = useState({ id: '', text: '', type: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    if (token) {
      Promise.resolve().then(() => {
        loadOrders();
      });
    }
  }, [token, loadOrders]);

  const handleExpandClick = (order) => {
    if (expandedOrderId === order._id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(order._id);
      setStatusForm({
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      });
      setUpdateMsg({ id: '', text: '', type: '' });
    }
  };

  const handleStatusSubmit = async (e, orderId) => {
    e.preventDefault();
    setUpdateMsg({ id: orderId, text: 'Updating...', type: 'info' });

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(statusForm)
      });

      const data = await res.json();
      if (data.success) {
        setUpdateMsg({ id: orderId, text: 'Status saved successfully!', type: 'success' });
        // Update local list state
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: statusForm.orderStatus, paymentStatus: statusForm.paymentStatus } : o));
      } else {
        setUpdateMsg({ id: orderId, text: data.message, type: 'error' });
      }
    } catch (err) {
      setUpdateMsg({ id: orderId, text: 'Update failed', type: 'error' });
    }
  };

  // Generate WhatsApp template for Admin to communicate with customer
  const getAdminWhatsAppLink = (order) => {
    const text = `Hi ${order.user?.name},\nThis is LuckOptics Lucknow store calling regarding your Order ID: *#${order._id}*.\nWe are preparing your custom lens package.\nCan we verify your prescription choice or address? Details: ${order.shippingAddress.street}, ${order.shippingAddress.city}.`;
    return `https://wa.me/91${order.user?.phone || '9876543210'}?text=${encodeURIComponent(text)}`;
  };

  const filteredOrders = orders.filter(order =>
    order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order._id.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-none">Manage Orders</h2>
        <p className="text-xs text-gray-500 mt-1">Review COD checkouts, extract prescription eye details, and update tracking statuses</p>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search by customer name or Order ID..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-hidden"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-3xl h-24 border border-gray-100"></div>)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center rounded-3xl text-xs text-gray-400">
          No orders matching filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            return (
              <div key={order._id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-sm">
                
                {/* Header Summary */}
                <div
                  onClick={() => handleExpandClick(order)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-1">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Customer</span>
                      <span className="text-xs font-bold text-gray-800">{order.user?.name || 'Walk-in Guest'}</span>
                    </div>
                    <div className="sm:border-l sm:border-gray-200 sm:pl-4">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Order ID</span>
                      <span className="text-xs font-bold text-gray-700 font-mono">#{order._id.substring(12)}...</span>
                    </div>
                    <div className="sm:border-l sm:border-gray-200 sm:pl-4">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                      <span className="text-xs font-bold text-luckoptics-dark font-sans">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end border-t border-gray-50 pt-3 sm:border-0 sm:pt-0">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-5 space-y-6">
                    {/* Customer Info row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 text-xs space-y-1.5">
                        <h4 className="font-bold text-gray-800 border-b border-gray-50 pb-1.5">Contact Details</h4>
                        <p className="flex items-center gap-1.5 text-gray-600"><Phone size={12} /> {order.user?.phone || 'No phone'}</p>
                        <p className="flex items-center gap-1.5 text-gray-600"><Mail size={12} /> {order.user?.email || 'No email'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-gray-100 text-xs space-y-1.5 sm:col-span-2">
                        <h4 className="font-bold text-gray-800 border-b border-gray-50 pb-1.5">Shipping Address</h4>
                        <p className="flex items-start gap-1.5 text-gray-600">
                          <MapPin size={14} className="mt-0.5 text-luckoptics-primary flex-shrink-0" />
                          <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</span>
                        </p>
                      </div>
                    </div>

                    {/* Items & Prescription Details */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4">
                      <h4 className="font-display font-bold text-xs text-gray-700 uppercase tracking-wider border-b border-gray-50 pb-2">Purchased Items</h4>
                      <div className="divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                            <img src={item.product?.images[0]} alt={item.product?.name} className="w-14 h-14 object-contain bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0" />
                            <div className="flex-grow min-w-0 text-xs">
                              <h5 className="font-bold text-gray-800 leading-snug">{item.product?.name || 'Glasses Frame'}</h5>
                              <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Qty: {item.quantity} | Unit Cost: ₹{item.price}</p>

                              {/* Prescription details box */}
                              {item.hasPrescription && item.prescription && (
                                <div className="bg-luckoptics-primary/5 border border-luckoptics-primary/10 rounded-xl p-3 mt-2 text-[10px] text-gray-600 space-y-2">
                                  <div className="flex justify-between border-b border-luckoptics-primary/10 pb-1">
                                    <span className="font-bold text-luckoptics-primary uppercase">{item.prescription.lensType}</span>
                                    <span className="font-bold">PD: {item.prescription.pupilDistance}mm</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Right Eye */}
                                    <div className="space-y-0.5">
                                      <p className="font-bold text-gray-800 border-b border-gray-100/50 pb-0.5">Right Eye (OD)</p>
                                      <p>SPH: <span className="font-bold">{item.prescription.rightEye.sphere}</span> | CYL: <span className="font-bold">{item.prescription.rightEye.cylinder}</span> | AX: <span className="font-bold">{item.prescription.rightEye.axis || '0'}</span></p>
                                      {item.prescription.rightEye.add && <p>ADD: <span className="font-bold">{item.prescription.rightEye.add}</span></p>}
                                    </div>
                                    {/* Left Eye */}
                                    <div className="space-y-0.5">
                                      <p className="font-bold text-gray-800 border-b border-gray-100/50 pb-0.5">Left Eye (OS)</p>
                                      <p>SPH: <span className="font-bold">{item.prescription.leftEye.sphere}</span> | CYL: <span className="font-bold">{item.prescription.leftEye.cylinder}</span> | AX: <span className="font-bold">{item.prescription.leftEye.axis || '0'}</span></p>
                                      {item.prescription.leftEye.add && <p>ADD: <span className="font-bold">{item.prescription.leftEye.add}</span></p>}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0 font-bold font-sans text-xs text-luckoptics-dark self-center">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Modify status form */}
                    <div className="flex flex-col sm:flex-row items-end justify-between gap-6 pt-4 border-t border-gray-100">
                      <form onSubmit={(e) => handleStatusSubmit(e, order._id)} className="flex flex-wrap items-end gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Order Delivery Status</label>
                          <select
                            className="bg-white border border-gray-200 rounded-xl p-2.5 font-semibold text-gray-700 focus:outline-hidden"
                            value={statusForm.orderStatus}
                            onChange={(e) => setStatusForm({ ...statusForm, orderStatus: e.target.value })}
                          >
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Payment Status</label>
                          <select
                            className="bg-white border border-gray-200 rounded-xl p-2.5 font-semibold text-gray-700 focus:outline-hidden"
                            value={statusForm.paymentStatus}
                            onChange={(e) => setStatusForm({ ...statusForm, paymentStatus: e.target.value })}
                          >
                            {['Pending', 'Paid'].map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="flex items-center gap-1 bg-luckoptics-dark hover:bg-luckoptics-dark/95 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                        >
                          <Save size={14} />
                          <span>Save Status</span>
                        </button>

                        {updateMsg.id === order._id && (
                          <span className={`text-[10px] font-bold self-center ml-2 ${
                            updateMsg.type === 'success' ? 'text-green-600' : updateMsg.type === 'error' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {updateMsg.text}
                          </span>
                        )}
                      </form>

                      {/* WhatsApp contact helper */}
                      <a
                        href={getAdminWhatsAppLink(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
                      >
                        <MessageSquare size={14} />
                        Contact Customer via WhatsApp
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
  );
}

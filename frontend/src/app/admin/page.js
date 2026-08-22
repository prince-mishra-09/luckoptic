'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, IndianRupee, Glasses, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      // Load all orders
      const ordersRes = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }

      // Load all products
      const productsRes = await fetch(`${API_URL}/products?limit=100`);
      const productsData = await productsRes.json();
      if (productsData.success) {
        setProducts(productsData.products);
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
        loadStats();
      });
    }
  }, [token, loadStats]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-white h-24 rounded-2xl border border-gray-100"></div>)}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-gray-100"></div>
      </div>
    );
  }

  // Calculations
  const totalSales = orders
    .filter(order => order.orderStatus === 'Delivered' || order.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrders = orders.filter(order => order.orderStatus === 'Pending');
  const lowStockProducts = products.filter(product => product.stock <= 5);
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    { title: 'Total Revenue', value: `₹${totalSales}`, icon: <IndianRupee size={22} />, color: 'bg-green-500/10 text-green-600' },
    { title: 'Total Orders', value: orders.length, icon: <ShoppingCart size={22} />, color: 'bg-blue-500/10 text-blue-600' },
    { title: 'Active Frames', value: products.length, icon: <Glasses size={22} />, color: 'bg-purple-500/10 text-purple-600' },
    { title: 'Pending Reviews', value: pendingOrders.length, icon: <Clock size={22} />, color: 'bg-amber-500/10 text-amber-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div>
        <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-none">Dashboard Overview</h2>
        <p className="text-xs text-gray-500 mt-1">Real-time metrics for LuckOptics operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{card.title}</span>
              <span className="text-xl font-black text-gray-800 font-sans">{card.value}</span>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Grid: Alerts + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Low Stock Warnings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="font-display font-bold text-sm text-luckoptics-dark uppercase">Inventory Alerts</h3>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="flex gap-2.5 items-center p-3.5 bg-green-50 text-green-700 rounded-xl text-xs font-semibold">
                <CheckCircle2 size={16} />
                <span>All frames fully stocked!</span>
              </div>
            ) : (
              lowStockProducts.map((prod) => (
                <div key={prod._id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100/50">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">{prod.shape} | {prod.color}</p>
                  </div>
                  <span className="text-xs font-black text-red-600 bg-red-100 px-2.5 py-1 rounded-md self-center">
                    {prod.stock === 0 ? 'OUT' : `${prod.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <h3 className="font-display font-bold text-sm text-luckoptics-dark uppercase">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-luckoptics-primary hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Order Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-800">{order.user?.name || 'Customer'}</td>
                    <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-gray-700 font-sans">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-luckoptics-primary hover:text-luckoptics-dark font-bold text-xs inline-flex items-center gap-0.5"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

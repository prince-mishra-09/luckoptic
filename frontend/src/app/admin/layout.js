'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Glasses, FolderHeart, ShoppingBag, Eye, LogOut, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (user.role !== 'admin') {
        // Not an admin
        Promise.resolve().then(() => {
          setAuthorized(false);
        });
      } else {
        Promise.resolve().then(() => {
          setAuthorized(true);
        });
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
      </div>
    );
  }

  if (!authorized && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-sm w-full text-center space-y-4">
          <div className="p-3.5 bg-red-50 text-red-500 rounded-2xl mx-auto w-fit">
            <ShieldAlert size={36} />
          </div>
          <h3 className="font-display font-black text-xl text-luckoptics-dark leading-tight">Access Denied</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            You do not have permission to view the store admin control panel. Only store operators may access this dashboard.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/"
              className="w-full bg-luckoptics-primary text-white font-bold text-xs py-3 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all"
            >
              Back to Home Page
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-full bg-gray-50 text-gray-700 font-bold text-xs py-3 rounded-xl border border-gray-200"
            >
              Login with Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard Stats', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Manage Products', href: '/admin/products', icon: <Glasses size={18} /> },
    { name: 'Manage Categories', href: '/admin/categories', icon: <FolderHeart size={18} /> },
    { name: 'Manage Orders', href: '/admin/orders', icon: <ShoppingBag size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-luckoptics-dark text-white flex-shrink-0 hidden md:flex flex-col justify-between p-6 border-r border-gray-800">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <span className="p-1.5 bg-white/10 rounded-lg text-white">
              <Glasses size={20} className="text-luckoptics-primary" />
            </span>
            <div>
              <h3 className="font-display font-bold text-sm leading-none">LuckOptics</h3>
              <span className="text-[9px] text-luckoptics-gold font-bold uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-luckoptics-primary text-white shadow-lg shadow-luckoptics-primary/10'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-white/10 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white px-4 py-2 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Go to Shop Website</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header (Mobile menu trigger & User detail) */}
        <header className="bg-white border-b border-gray-100 py-3.5 px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile Title */}
            <h1 className="font-display font-black text-base text-luckoptics-dark md:hidden">Luck Admin</h1>
            <span className="hidden md:inline text-xs font-bold text-gray-400 uppercase tracking-wider">
              Control Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Display Admin Name */}
            <div className="text-right">
              <p className="text-xs font-bold text-gray-800 leading-none">{user.name}</p>
              <span className="text-[9px] font-semibold text-gray-400">Store Operator</span>
            </div>
            <div className="w-8 h-8 bg-luckoptics-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-luckoptics-primary font-display">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Page Content */}
        <main className="p-6 md:p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}

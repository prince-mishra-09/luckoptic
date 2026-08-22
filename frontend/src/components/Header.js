'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Phone, LogOut, ChevronDown, Glasses, Menu, X, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounce = setTimeout(async () => {
        try {
          const res = await fetch(`${API_URL}/products?search=${searchQuery}&limit=5`);
          const data = await res.json();
          if (data.success) {
            setSuggestions(data.products);
          }
        } catch (err) {
          console.error(err);
        }
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      Promise.resolve().then(() => {
        setSuggestions([]);
      });
    }
  }, [searchQuery, API_URL]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    router.push(`/products/${productId}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-100 shadow-xs">
      
      {/* Top Banner (White minimal bar with marquee scrolling) */}
      <div className="bg-white text-gray-500 border-b border-gray-100 text-[10px] py-2 px-6 flex justify-between items-center hidden lg:flex font-medium">
        <div className="flex-1 mr-[2px] overflow-hidden">
          <marquee className="text-luckoptics-primary font-semibold text-[11px]" scrollamount="6">
            ✨ Welcome to LuckOptics – Your Premium Eye-Care Partner! | 👓 High-Quality Eyeglasses, Sunglasses, Screen Glasses & Kids Glasses | 🚚 Free Shipping & 14-Day Easy Returns | 🏠 Book a Free Try-At-Home session today! | 📞 Call us for support: 99998 99998 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✨ Welcome to LuckOptics – Your Premium Eye-Care Partner! | 👓 High-Quality Eyeglasses, Sunglasses, Screen Glasses & Kids Glasses | 🚚 Free Shipping & 14-Day Easy Returns | 🏠 Book a Free Try-At-Home session today! | 📞 Call us for support: 99998 99998 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✨ Welcome to LuckOptics – Your Premium Eye-Care Partner! | 👓 High-Quality Eyeglasses, Sunglasses, Screen Glasses & Kids Glasses | 🚚 Free Shipping & 14-Day Easy Returns | 🏠 Book a Free Try-At-Home session today! | 📞 Call us for support: 99998 99998
          </marquee>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="flex items-center gap-1 text-gray-600 font-semibold">
            <Phone size={12} className="text-luckoptics-primary" />
            99998 99998
          </span>
          {user?.role === 'admin' && (
            <>
              <span>|</span>
              <Link href="/admin" className="text-luckoptics-primary font-bold hover:underline">Admin Control Desk</Link>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar (Luxury Gold & Obsidian theme style) */}
      <div className="bg-white text-luckoptics-dark border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {pathname !== '/' && (
              <button
                onClick={() => router.back()}
                className="p-1 hover:bg-gray-100 rounded-lg lg:hidden text-luckoptics-dark cursor-pointer mr-0.5"
                title="Go Back"
                suppressHydrationWarning
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img 
                src="https://ik.imagekit.io/bzdikkis8/luckoptic-logo.png" 
                alt="LuckOptics Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links (Middle section matching screenshot categories) */}
          <nav className="hidden lg:flex items-center gap-6 font-display font-extrabold text-[11px] uppercase tracking-wider text-luckoptics-dark">
            <Link href="/products?category=Eyeglasses" className="hover:text-luckoptics-primary transition-colors">Eyeglasses</Link>
            <Link href="/products?category=Sunglasses" className="hover:text-luckoptics-primary transition-colors">Sunglasses</Link>
            <Link href="/products?category=Screen Glasses" className="hover:text-luckoptics-primary transition-colors">Screen Glasses</Link>
            <Link href="/products?category=Kids Glasses" className="hover:text-luckoptics-primary transition-colors">Kids Glasses</Link>
            <Link href="/products?shape=Round" className="hover:text-luckoptics-primary transition-colors text-gray-500 font-bold">Round Frames</Link>
            <Link href="/about" className="hover:text-luckoptics-primary transition-colors text-gray-500 font-bold">Try @ Home</Link>
          </nav>

          {/* Search Bar & Action Buttons (Right side matching screenshot layout) */}
          <div className="flex items-center gap-4 flex-grow max-w-sm ml-auto justify-end">
            {/* Search Input Box */}
            <div ref={searchRef} className="flex-grow relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder='Search "unbreakable glasses for kids"'
                  className="w-full bg-gray-50 text-gray-800 text-xs pl-3 pr-8 py-2 rounded-md border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-luckoptics-primary focus:bg-white transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-luckoptics-primary transition-colors">
                  <Search size={14} />
                </button>
              </form>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-1.5 rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-50 text-gray-800">
                  <div className="p-2 bg-gray-50 border-b border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Recommended Eyewear
                  </div>
                  <ul>
                    {suggestions.map((product) => (
                      <li
                        key={product._id}
                        onClick={() => handleSuggestionClick(product._id)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-8 h-8 object-contain bg-gray-50 rounded"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-semibold text-gray-700 truncate">{product.name}</h4>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">{product.shape} | ₹{product.discountPrice || product.price}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Icons */}
            <div className="flex items-center gap-3.5 flex-shrink-0 text-luckoptics-dark">
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="bg-luckoptics-primary text-white font-bold text-[10px] px-3.5 py-2 rounded-full shadow-xs hover:bg-luckoptics-primary/90 transition-all uppercase tracking-wider flex items-center gap-1 cursor-pointer font-display leading-none"
                  suppressHydrationWarning
                >
                  Dashboard
                </Link>
              )}
              
              {/* Wishlist Link placeholder */}
              <Link href={user ? "/wishlist" : "/login?redirect=/wishlist"} className="hover:text-luckoptics-primary transition-colors block">
                <Heart size={18} />
              </Link>

              {/* Cart badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                suppressHydrationWarning
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luckoptics-primary text-white font-sans font-bold text-[8px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown controls */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center gap-0.5 text-xs font-bold hover:text-luckoptics-primary cursor-pointer"
                      suppressHydrationWarning
                    >
                      <User size={18} />
                      <ChevronDown size={12} />
                    </button>

                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-2xl border border-gray-100 py-1 z-50 text-gray-800">
                        <div className="px-3.5 py-2 border-b border-gray-50 bg-gray-50/50">
                          <p className="text-[9px] text-gray-400 font-bold uppercase leading-none">Welcome</p>
                          <p className="text-xs font-bold text-gray-800 truncate mt-0.5">{user.name.split(' ')[0]}</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="block px-3.5 py-2 text-xs hover:bg-gray-50 hover:text-luckoptics-primary transition-colors font-medium"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setShowUserDropdown(false)}
                          className="block px-3.5 py-2 text-xs hover:bg-gray-50 hover:text-luckoptics-primary transition-colors font-medium"
                        >
                          Order History
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setShowUserDropdown(false)}
                          className="block px-3.5 py-2 text-xs hover:bg-gray-50 hover:text-luckoptics-primary transition-colors font-medium"
                        >
                          My Wishlist
                        </Link>
                        <hr className="border-gray-100 my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left flex items-center gap-1.5 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-bold cursor-pointer"
                        >
                          <LogOut size={14} />
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="hover:text-luckoptics-primary transition-colors block">
                    <User size={18} />
                  </Link>
                )}
              </div>

              {/* Hamburger Mobile Menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 hover:bg-gray-100 rounded-lg lg:hidden cursor-pointer"
                suppressHydrationWarning
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white text-luckoptics-dark py-4 px-4 shadow-2xl border-t border-gray-100 z-30 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder='Search "unbreakable glasses for kids"'
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 text-xs pl-3 pr-8 py-2 rounded-md focus:outline-hidden"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={14} />
            </button>
          </form>

          <div className="flex flex-col gap-2.5 font-display font-bold text-xs uppercase tracking-wider pb-2">
            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)} 
                className="px-2.5 py-2.5 bg-luckoptics-primary/10 text-luckoptics-primary hover:bg-luckoptics-primary/15 rounded-lg font-extrabold flex items-center justify-between border border-luckoptics-primary/20"
                suppressHydrationWarning
              >
                <span>Admin Dashboard</span>
                <span className="w-1.5 h-1.5 rounded-full bg-luckoptics-primary animate-ping"></span>
              </Link>
            )}
            <Link href="/products?category=Eyeglasses" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 hover:bg-gray-50 hover:text-luckoptics-primary rounded-lg text-gray-600">Eyeglasses</Link>
            <Link href="/products?category=Sunglasses" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 hover:bg-gray-50 hover:text-luckoptics-primary rounded-lg text-gray-600">Sunglasses</Link>
            <Link href="/products?category=Screen Glasses" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 hover:bg-gray-50 hover:text-luckoptics-primary rounded-lg text-gray-600">Screen Glasses</Link>
            <Link href="/products?category=Kids Glasses" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 hover:bg-gray-50 hover:text-luckoptics-primary rounded-lg text-gray-600">Kids Glasses</Link>
            <Link href={user ? "/wishlist" : "/login?redirect=/wishlist"} onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 hover:bg-gray-50 hover:text-luckoptics-primary rounded-lg text-gray-500 font-medium">My Wishlist</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 hover:bg-gray-50 hover:text-luckoptics-primary rounded-lg text-gray-500 font-medium">About Us</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2 hover:bg-gray-50 hover:text-luckoptics-primary rounded-lg text-gray-500 font-medium">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}

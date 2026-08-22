'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Glasses, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { wishlist } = useWishlist();

  // Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/wishlist');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Title block */}
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="p-2 bg-red-50 text-red-500 rounded-xl">
          <Heart size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-luckoptics-dark leading-none">My Wishlist</h1>
          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-md mx-auto px-6">
          <div className="inline-flex p-4 bg-gray-50 text-gray-400 rounded-2xl mx-auto mb-4">
            <Glasses size={48} />
          </div>
          <h3 className="font-display font-bold text-gray-800 text-lg mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 mb-6">Explore our curated collections of premium eyewear and save your favorite frames here.</p>
          <button
            onClick={() => router.push('/products')}
            className="w-full flex items-center justify-center gap-2 bg-luckoptics-primary text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

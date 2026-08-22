'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { _id, name, price, discountPrice, images, shape, frameType, ratings, stock, size } = product;
  const router = useRouter();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isWishlisted = isInWishlist(_id);

  // Calculate discount percentage
  const discountPercent = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const activePrice = discountPrice || price;
  const ratingValue = ratings || 4.5;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-[22px] overflow-hidden hover:shadow-xl hover:border-gray-200/60 transition-all duration-300 flex flex-col h-full p-3.5">
      
      {/* Top action row: Rating & Wishlist */}
      <div className="flex items-center justify-between z-10 mb-2">
        {/* Rating Badge */}
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 text-[10px] font-bold text-gray-700">
          <Star size={11} className="text-amber-500" fill="currentColor" />
          <span>{ratingValue.toFixed(2)}</span>
        </div>
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              const currentPath = window.location.pathname + window.location.search;
              router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
              return;
            }
            toggleWishlist(product);
          }}
          className="p-1.5 bg-white rounded-full shadow-xs border border-gray-100 hover:scale-110 transition-transform cursor-pointer text-gray-400 hover:text-red-500"
          suppressHydrationWarning
        >
          <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
        </button>
      </div>

      {/* Product Image Section */}
      <Link href={`/products/${_id}`} className="block relative w-full h-40 flex items-center justify-center overflow-hidden mb-3">
        {stock === 0 && (
          <span className="absolute top-0 right-0 bg-gray-800 text-white font-sans font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider z-10 shadow-xs">
            Out of Stock
          </span>
        )}

        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>



      {/* Product Details Section */}
      <div className="flex flex-col flex-grow">
        
        {/* Product Title */}
        <Link href={`/products/${_id}`} className="hover:text-luckoptics-primary transition-colors flex-grow">
          <h3 className="font-display font-bold text-gray-800 text-sm leading-snug line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Size Badge */}
        <div className="flex items-center text-[8px] font-black uppercase tracking-wider mt-1.5 w-fit">
          <span className="bg-luckoptics-dark text-white px-1.5 py-0.5 rounded-l border border-luckoptics-dark">
            {size || 'M'}
          </span>
          <span className="bg-white text-gray-500 px-1.5 py-0.5 rounded-r border border-l-0 border-gray-200">
            Size
          </span>
        </div>

        {/* Pricing & Actions Row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-luckoptics-dark font-sans leading-none">
                ₹{activePrice}
              </span>
              {discountPrice && (
                <span className="text-[10px] text-gray-400 line-through font-sans leading-none">
                  ₹{price}
                </span>
              )}
            </div>
            {discountPrice && (
              <span className="block text-[9px] font-bold text-blue-600 mt-1 leading-none">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, 1);
              }}
              className="p-1.5 bg-luckoptics-primary/10 text-luckoptics-primary hover:bg-luckoptics-primary hover:text-white rounded-full transition-all cursor-pointer shadow-2xs"
              title="Add to Cart"
              suppressHydrationWarning
            >
              <ShoppingCart size={13} />
            </button>
            <Link
              href={`/products/${_id}`}
              className="p-1.5 bg-luckoptics-dark text-white hover:bg-luckoptics-primary transition-all rounded-full shadow-2xs flex items-center justify-center"
              title="View Details"
            >
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>



      </div>
    </div>
  );
}

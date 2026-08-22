'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, ShoppingCart, MessageSquare, Shield, CheckCircle, 
  Truck, Heart, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import PrescriptionModal from '@/components/PrescriptionModal';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setActiveImage(data.product.images[0]);
          
          // Fetch similar products in the same category
          let categoryId = data.product.category;
          if (data.product.category && typeof data.product.category === 'object') {
            categoryId = data.product.category._id;
          }
          
          if (categoryId) {
            const simRes = await fetch(`${API_URL}/products?category=${categoryId}&limit=5`);
            const simData = await simRes.json();
            if (simData.success) {
              const filtered = simData.products.filter(p => p._id !== data.product._id);
              setSimilarProducts(filtered.slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-100 h-96 rounded-3xl"></div>
        <div className="space-y-6">
          <div className="bg-gray-100 h-8 w-3/4 rounded"></div>
          <div className="bg-gray-100 h-4 w-1/4 rounded"></div>
          <div className="bg-gray-100 h-24 w-full rounded"></div>
          <div className="bg-gray-100 h-12 w-1/2 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h3 className="font-display font-black text-2xl text-luckoptics-dark mb-2">Eyewear Not Found</h3>
        <p className="text-sm text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-2.5 bg-luckoptics-primary text-white font-bold text-xs rounded-full"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const {
    name, description, price, discountPrice, stock, shape, material, frameType, gender, color, size, ratings,
    frameWidth, templeLength, noseBridge, weight
  } = product;
  const activePrice = discountPrice || price;
  const isOutOfStock = stock === 0;

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleFrameOnlyAddToCart = () => {
    addToCart(product, 1, false, null);
  };

  const handlePrescriptionSubmit = (prescriptionData) => {
    addToCart(product, 1, true, prescriptionData);
  };

  // Generate WhatsApp inquiry link
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsAppMessage = `Hi LuckOptics, I am interested in purchasing this product: *${name}*.\nColor: ${color} | Frame Type: ${frameType}\nLink: ${currentUrl}\nIs it currently available in stock?`;
  const encodedMessage = encodeURIComponent(whatsAppMessage);
  const whatsAppLink = `https://wa.me/919876543210?text=${encodedMessage}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-center overflow-hidden shadow-xs relative">
            <img 
              key={activeImage}
              src={activeImage} 
              alt={name} 
              className="w-full h-full object-contain animate-slide-in" 
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 p-2 bg-white border rounded-xl overflow-hidden flex items-center justify-center cursor-pointer transition-all ${
                    activeImage === img ? 'border-luckoptics-primary ring-1 ring-luckoptics-primary' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${name} preview ${i}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & CTA */}
        <div className="space-y-6">
          {/* Ratings & Tags */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-bold text-luckoptics-primary uppercase tracking-wider bg-luckoptics-primary/10 px-3 py-1 rounded-md">
              {gender}&apos;s Collection
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-md">
              {shape} • {frameType}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
              <Star size={16} fill="currentColor" />
              <span>{ratings.toFixed(1)} / 5</span>
            </div>
          </div>

          {/* Product Name & Wishlist Heart */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-luckoptics-dark leading-tight">
              {name}
            </h2>
            <button
              onClick={() => {
                if (!user) {
                  const currentPath = window.location.pathname + window.location.search;
                  router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                  return;
                }
                if (isWishlisted) {
                  removeFromWishlist(product._id);
                } else {
                  addToWishlist(product);
                }
              }}
              className="p-3 bg-white rounded-full shadow-md border border-gray-100 hover:scale-110 active:scale-95 transition-all cursor-pointer text-gray-400 hover:text-red-500 shrink-0"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart 
                size={20} 
                fill={isWishlisted ? "currentColor" : "none"} 
                className={isWishlisted ? "text-red-500 font-bold" : ""} 
              />
            </button>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 border-b border-gray-100 pb-5">
            <span className="text-3xl font-black text-luckoptics-dark font-sans">
              ₹{activePrice}
            </span>
            {discountPrice && (
              <>
                <span className="text-base text-gray-400 line-through font-sans">
                  ₹{price}
                </span>
                <span className="text-sm font-bold text-red-500 uppercase">
                  {Math.round(((price - discountPrice) / price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</h4>
            <p className={`text-sm text-gray-600 leading-relaxed ${showFullDesc ? '' : 'line-clamp-3'}`}>{description}</p>
            {description && description.length > 150 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-xs font-bold text-luckoptics-primary hover:underline mt-1 cursor-pointer"
              >
                {showFullDesc ? 'See Less' : 'See More'}
              </button>
            )}
          </div>

          {/* Collapsible Specifications Drawer */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
            <button
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors font-display font-bold text-xs text-gray-700 uppercase tracking-wider cursor-pointer"
            >
              <span>Product Specifications</span>
              <span className="text-luckoptics-primary flex items-center gap-1 font-bold">
                {showMoreDetails ? 'See Less' : 'See More'}
                {showMoreDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </button>
            
            <div className={`p-4 bg-white border-t border-gray-100 text-xs transition-all duration-300 ${showMoreDetails ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Frame Shape</span>
                  <span className="font-bold text-gray-800">{shape}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Frame Type</span>
                  <span className="font-bold text-gray-800">{frameType}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Material</span>
                  <span className="font-bold text-gray-800">{material}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Color</span>
                  <span className="font-bold text-gray-800">{color}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Size</span>
                  <span className="font-bold text-gray-800">{size}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Gender</span>
                  <span className="font-bold text-gray-800">{gender}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Frame Width</span>
                  <span className="font-bold text-gray-800">{frameWidth || '138 mm'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Temple Length</span>
                  <span className="font-bold text-gray-800">{templeLength || '140 mm'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Nose Bridge</span>
                  <span className="font-bold text-gray-800">{noseBridge || '18 mm'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-semibold">Weight</span>
                  <span className="font-bold text-gray-800">{weight || '18.5g (Ultra-Light)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
            >
              Sold Out
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-luckoptics-primary text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-luckoptics-primary/10 hover:bg-luckoptics-primary/95 transition-all cursor-pointer"
              >
                <ShoppingCart size={18} />
                Select Lenses & Buy
              </button>
              <button
                onClick={handleFrameOnlyAddToCart}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-luckoptics-dark text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:bg-luckoptics-dark/95 transition-all cursor-pointer"
              >
                Buy Frame Only
              </button>
            </div>
          )}

          {/* WhatsApp Quick Enquiry Link */}
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all"
          >
            <MessageSquare size={18} />
            Quick Enquiry on WhatsApp
          </a>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 text-center text-[10px] text-gray-500 font-bold">
            <div className="flex flex-col items-center">
              <Truck size={16} className="text-luckoptics-primary mb-1" />
              <span>Free Local Shipping</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield size={16} className="text-luckoptics-primary mb-1" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle size={16} className="text-luckoptics-primary mb-1" />
              <span>100% Fit Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Recommendation Grid */}
      {similarProducts.length > 0 && (
        <div className="border-t border-gray-100 mt-16 pt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h3 className="font-display font-black text-xl text-luckoptics-dark">
              Similar Eyewear You May Like
            </h3>
            <p className="text-xs text-gray-400 font-medium">Curated matching frames based on your selection</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((simProd) => (
              <ProductCard key={simProd._id} product={simProd} />
            ))}
          </div>
        </div>
      )}

      {/* Prescription Entry Modal overlay */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSubmit={handlePrescriptionSubmit}
        product={product}
      />
    </div>
  );
}
